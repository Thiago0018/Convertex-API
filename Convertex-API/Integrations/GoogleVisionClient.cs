using Google.Apis.Auth.OAuth2;
using Google.Cloud.Vision.V1;

namespace MeuProjetoVision.Integrations;

public interface IGoogleVisionClient
{
    Task<string> DetectTextAsync(IFormFile file);
}

public class GoogleVisionClient : IGoogleVisionClient
{
    private readonly ImageAnnotatorClient _client;

    public GoogleVisionClient(IConfiguration configuration)
    {
        string? jsonFilePath = configuration["GOOGLE_APPLICATION_CREDENTIALS"];

        string? resolvedPath = ResolveCredentialPath(jsonFilePath);

        if (string.IsNullOrEmpty(resolvedPath))
        {
            throw new InvalidOperationException(
                "Nenhum arquivo de credencial do Google Cloud foi encontrado. " +
                "Verifique a variável GOOGLE_APPLICATION_CREDENTIALS ou a presença do arquivo google.credentials.json.");
        }

        GoogleCredential credential = CredentialFactory.FromFile<ServiceAccountCredential>(resolvedPath)
            .ToGoogleCredential();

        _client = new ImageAnnotatorClientBuilder
        {
            Credential = credential
        }.Build();
    }

    private static string? ResolveCredentialPath(string? configuredPath)
    {
        var candidatePaths = new List<string>();

        if (!string.IsNullOrWhiteSpace(configuredPath))
            candidatePaths.Add(configuredPath);

        string currentDirectory = Directory.GetCurrentDirectory();
        string baseDirectory = AppContext.BaseDirectory;

        candidatePaths.Add(Path.Combine(currentDirectory, "google.credentials.json"));
        candidatePaths.Add(Path.Combine(baseDirectory, "google.credentials.json"));

        foreach (var candidate in candidatePaths.Distinct(StringComparer.OrdinalIgnoreCase))
        {
            if (!string.IsNullOrWhiteSpace(candidate) && File.Exists(candidate))
                return candidate;
        }

        return null;
    }

    public async Task<string> DetectTextAsync(IFormFile file)
    {
        using Stream stream = file.OpenReadStream();
        Image image = await Image.FromStreamAsync(stream);

        TextAnnotation response = await _client.DetectDocumentTextAsync(image);
        return response?.Text ?? string.Empty;
    }
}