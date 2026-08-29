using System.Security.Cryptography;
using System.Text;

namespace MeuProjetoVision.Middleware;

public sealed class ApiKeyMiddleware
{
    private const string HeaderName = "X-API-Key";
    private readonly RequestDelegate _next;
    private readonly string? _apiKey;
    private readonly IWebHostEnvironment _environment;

    public ApiKeyMiddleware(RequestDelegate next, IConfiguration configuration, IWebHostEnvironment environment)
    {
        _next = next;
        _apiKey = configuration["API_KEY"] ?? configuration["Security:ApiKey"];
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (HttpMethods.IsOptions(context.Request.Method))
        {
            await _next(context);
            return;
        }

        if (string.IsNullOrWhiteSpace(_apiKey))
        {
            if (!_environment.IsDevelopment())
            {
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                await context.Response.WriteAsync("A API_KEY não foi configurada.");
                return;
            }

            await _next(context);
            return;
        }

        if (!context.Request.Headers.TryGetValue(HeaderName, out var providedKey) ||
            !FixedTimeEquals(providedKey.ToString(), _apiKey))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsync("API key inválida ou ausente.");
            return;
        }

        await _next(context);
    }

    private static bool FixedTimeEquals(string providedKey, string configuredKey)
    {
        byte[] providedBytes = Encoding.UTF8.GetBytes(providedKey);
        byte[] configuredBytes = Encoding.UTF8.GetBytes(configuredKey);

        return providedBytes.Length == configuredBytes.Length &&
               CryptographicOperations.FixedTimeEquals(providedBytes, configuredBytes);
    }
}
