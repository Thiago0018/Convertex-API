using MeuProjetoVision.Integrations;
using MeuProjetoVision.Middleware;
using MeuProjetoVision.Services;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Adiciona suporte a Controllers
builder.Services.AddControllers();
builder.Services.AddProblemDetails();

// Injeção de Dependências (Camadas)
builder.Services.AddSingleton<IGoogleVisionClient, GoogleVisionClient>();
string? redisUrl = builder.Configuration["REDIS_URL"];
if (!string.IsNullOrWhiteSpace(redisUrl))
{
    builder.Services.AddSingleton<IConnectionMultiplexer>(_ => ConnectionMultiplexer.Connect(redisUrl));
    builder.Services.AddSingleton<IDailyRequestCounter, RedisDailyRequestCounter>();
}
else
{
    builder.Services.AddSingleton<IDailyRequestCounter, DailyRequestCounter>();
}
builder.Services.AddScoped<IOcrService, OcrService>();

// Configuração do CORS para comunicação com o React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        string[] allowedOrigins = builder.Configuration["CORS_ALLOWED_ORIGINS"]?
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            ?? (builder.Environment.IsDevelopment()
                ? ["http://localhost:3000", "http://localhost:5173"]
                : []);

        if (allowedOrigins.Length > 0)
            policy.WithOrigins(allowedOrigins);

        policy.AllowAnyMethod()
              .AllowAnyHeader()
              .WithExposedHeaders("Content-Disposition"); // Permite que o React leia o nome do arquivo baixado
    });
});

var app = builder.Build();

app.UseExceptionHandler();
app.UseCors("AllowReactApp");
app.UseMiddleware<ApiKeyMiddleware>();
app.UseAuthorization();
app.MapControllers();

app.Run();