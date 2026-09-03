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

// Configuração do CORS (Nome padronizado para "AllowReactApp")
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
                "https://convertex-mauve.vercel.app", // Seu domínio na Vercel
                "http://localhost:5173",             // Vite local (Dev)
                "http://localhost:3000"
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .WithExposedHeaders("Content-Disposition"); // Necessário para o React ler o nome do arquivo gerado
    });
});

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

var app = builder.Build();

// Pipeline de Middleware (Ordem estrita)
app.UseExceptionHandler();

// O CORS deve rodar obrigatoriamente ANTES do ApiKeyMiddleware e do UseAuthorization
app.UseRouting();
app.UseCors("AllowReactApp");

app.UseMiddleware<ApiKeyMiddleware>();
app.UseAuthorization();

app.MapControllers();

app.Run();