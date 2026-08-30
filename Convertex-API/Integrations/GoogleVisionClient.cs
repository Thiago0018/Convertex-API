using Google.Cloud.Vision.V1;
using Google.Apis.Auth.OAuth2;

namespace MeuProjetoVision.Integrations;

public interface IGoogleVisionClient
{
    Task<string> DetectTextAsync(IFormFile file);
}

public class GoogleVisionClient : IGoogleVisionClient
{
    private readonly ImageAnnotatorClient? _client;

    public GoogleVisionClient(IConfiguration configuration)
    {
        string? base64Credentials = configuration["GOOGLE_CREDENTIALS_BASE64"];
        string? jsonFilePath = configuration["GOOGLE_APPLICATION_CREDENTIALS"];

        GoogleCredential? credential = null;

        if (!string.IsNullOrWhiteSpace(base64Credentials))
        {
            string credentialValue = base64Credentials.Trim();
            string jsonCredentials = File.Exists(credentialValue)
                ? File.ReadAllText(credentialValue).Trim()
                : DecodeCredentials(credentialValue);
            jsonCredentials = DecodeCredentials(jsonCredentials);
            credential = CredentialFactory.FromJson<ServiceAccountCredential>(jsonCredentials).ToGoogleCredential();
        }
        else
        {
            string? resolvedFile = ResolveCredentialPath(jsonFilePath);
            if (!string.IsNullOrWhiteSpace(resolvedFile) && File.Exists(resolvedFile))
            {
                string fileContent = File.ReadAllText(resolvedFile).Trim();
                string jsonCredentials = DecodeCredentials(fileContent);
                credential = CredentialFactory.FromJson<ServiceAccountCredential>(jsonCredentials).ToGoogleCredential();
            }
        }

        if (credential is null)
        {
            throw new InvalidOperationException(
                "Nenhuma credencial do Google Cloud foi configurada. Configure GOOGLE_APPLICATION_CREDENTIALS, GOOGLE_CREDENTIALS_BASE64 ou copie o arquivo google.credentials.json para o container/app.");
        }

        _client = new ImageAnnotatorClientBuilder
        {
            Credential = credential
        }.Build();
    }

    private static string DecodeCredentials(string value)
    {
        string normalizedValue = value.Trim();
        if (normalizedValue.StartsWith("{"))
            return normalizedValue;

        byte[] credentialBytes = Convert.FromBase64String(normalizedValue);
        return System.Text.Encoding.UTF8.GetString(credentialBytes);
    }

    private static string? ResolveCredentialPath(string? configuredPath)
    {
        var candidatePaths = new List<string>();

        if (!string.IsNullOrWhiteSpace(configuredPath))
            candidatePaths.Add(configuredPath);

        string currentDirectory = Directory.GetCurrentDirectory();
        string baseDirectory = AppContext.BaseDirectory;

        candidatePaths.Add("/etc/secrets/credentials_b64.txt");
        candidatePaths.Add(Path.Combine(currentDirectory, "google.credentials.json"));
        candidatePaths.Add(Path.Combine(baseDirectory, "google.credentials.json"));
        candidatePaths.Add(Path.Combine(currentDirectory, "..", "google.credentials.json"));
        candidatePaths.Add(Path.Combine(baseDirectory, "..", "google.credentials.json"));

        foreach (var candidate in candidatePaths.Distinct(StringComparer.OrdinalIgnoreCase))
        {
            if (!string.IsNullOrWhiteSpace(candidate) && File.Exists(candidate))
                return candidate;
        }

        return null;
    }

    public async Task<string> DetectTextAsync(IFormFile file)
    {
        if (_client is null)
            throw new InvalidOperationException("Cliente do Google Vision não foi inicializado porque a credencial não está disponível.");

        using Stream stream = file.OpenReadStream();
        Image image = await Image.FromStreamAsync(stream);

        TextAnnotation response = await _client.DetectDocumentTextAsync(image);
        return response?.Text ?? string.Empty;
    }
}