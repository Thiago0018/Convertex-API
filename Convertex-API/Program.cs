using MeuProjetoVision.Integrations;
using MeuProjetoVision.Services;
using StackExchange.Redis;
using MeuProjetoVision.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddProblemDetails();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.SetIsOriginAllowed(origin =>
                string.IsNullOrEmpty(origin) ||
                origin.StartsWith("http://localhost") ||
                origin.EndsWith(".vercel.app")
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .WithExposedHeaders("Content-Disposition");
    });
});

builder.Services.AddSingleton<IGoogleVisionClient, GoogleVisionClient>();

string? redisUrl = builder.Configuration["REDIS_URL"];
if (!string.IsNullOrWhiteSpace(redisUrl))
{
    builder.Services.AddSingleton<IConnectionMultiplexer>(_ =>
    {
        ConfigurationOptions redisConfiguration = redisUrl.CreateRedisConfiguration();

        return ConnectionMultiplexer.Connect(redisConfiguration);
    });

    builder.Services.AddSingleton<IDailyRequestCounter, RedisDailyRequestCounter>();
}
else
{
    builder.Services.AddSingleton<IDailyRequestCounter, DailyRequestCounter>();
}

builder.Services.AddScoped<IOcrService, OcrService>();

var app = builder.Build();

app.UseExceptionHandler();

app.UseCors("AllowReactApp");
app.UseRouting();

app.UseAuthorization();

app.MapControllers();

app.Run();