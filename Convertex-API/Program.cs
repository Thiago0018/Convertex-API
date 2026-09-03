using MeuProjetoVision.Integrations;
using MeuProjetoVision.Middleware;
using MeuProjetoVision.Services;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Configuração explícita de servidor para DEV e PROD
if (builder.Environment.IsDevelopment())
{
    // Força o Kestrel escutar estritamente no localhost da porta 5187 sem depender do HTTP.sys
    builder.WebHost.ConfigureKestrel(options =>
    {
        options.ListenLocalhost(5187);
    });
}
else
{
    var port = Environment.GetEnvironmentVariable("PORT");
    if (!string.IsNullOrWhiteSpace(port) && int.TryParse(port, out var parsedPort))
    {
        builder.WebHost.UseUrls($"http://0.0.0.0:{parsedPort}");
    }
}

// Support a Controllers e ProblemDetails
builder.Services.AddControllers();
builder.Services.AddProblemDetails();

// Injeção de Dependências (Camadas de Integração, Redis e OCR)
builder.Services.AddSingleton<IGoogleVisionClient, GoogleVisionClient>();

string? redisUrl = builder.Configuration["REDIS_URL"];
if (!string.IsNullOrWhiteSpace(redisUrl))
{
    builder.Services.AddSingleton<IConnectionMultiplexer>(_ =>
    {
        ConfigurationOptions redisConfiguration = CreateRedisConfiguration(redisUrl);
        redisConfiguration.AbortOnConnectFail = false;
        return ConnectionMultiplexer.Connect(redisConfiguration);
    });
    builder.Services.AddSingleton<IDailyRequestCounter, RedisDailyRequestCounter>();
}
else
{
    builder.Services.AddSingleton<IDailyRequestCounter, DailyRequestCounter>();
}

builder.Services.AddScoped<IOcrService, OcrService>();

// Helper do Redis
static ConfigurationOptions CreateRedisConfiguration(string connectionString)
{
    if (!Uri.TryCreate(connectionString.Trim(), UriKind.Absolute, out Uri? redisUri) ||
        (redisUri.Scheme != "redis" && redisUri.Scheme != "rediss") ||
        string.IsNullOrWhiteSpace(redisUri.Host))
    {
        return ConfigurationOptions.Parse(connectionString);
    }

    ConfigurationOptions configuration = new()
    {
        Ssl = redisUri.Scheme == "rediss",
        AbortOnConnectFail = false
    };
    configuration.EndPoints.Add(redisUri.Host, redisUri.Port > 0 ? redisUri.Port : 6379);

    if (!string.IsNullOrEmpty(redisUri.UserInfo))
    {
        string[] userInfo = redisUri.UserInfo.Split(':', 2);
        configuration.User = Uri.UnescapeDataString(userInfo[0]);
        if (userInfo.Length == 2)
            configuration.Password = Uri.UnescapeDataString(userInfo[1]);
    }

    return configuration;
}

// Configuração do CORS
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
        {
            policy.WithOrigins(allowedOrigins);
        }
        else
        {
            policy.AllowAnyOrigin();
        }

        policy.AllowAnyMethod()
              .AllowAnyHeader()
              .WithExposedHeaders("Content-Disposition");
    });
});

var app = builder.Build();

// Pipeline de Middleware
app.UseExceptionHandler();
app.UseCors("AllowReactApp");
app.UseMiddleware<ApiKeyMiddleware>();
app.UseAuthorization();
app.MapControllers();

app.Run();