using Google.Cloud.Vision.V1;
using Google.Apis.Auth.OAuth2;

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
        string? base64Credentials = configuration["GOOGLE_CREDENTIALS_BASE64"];
        string? jsonFilePath = configuration["GOOGLE_APPLICATION_CREDENTIALS"];

        GoogleCredential credential;

        if (!string.IsNullOrEmpty(base64Credentials))
        {
            // Usado no Render: decodifica a string Base64
            byte[] credentialBytes = Convert.FromBase64String(base64Credentials);
            string jsonCredentials = System.Text.Encoding.UTF8.GetString(credentialBytes);
            credential = CredentialFactory.FromJson<ServiceAccountCredential>(jsonCredentials).ToGoogleCredential();
        }
        else if (!string.IsNullOrEmpty(jsonFilePath) && File.Exists(jsonFilePath))
        {
            // Usado localmente no Windows: lê o arquivo JSON diretamente
            credential = CredentialFactory.FromFile<ServiceAccountCredential>(jsonFilePath).ToGoogleCredential();
        }
        else
        {
            throw new InvalidOperationException("Nenhuma credencial do Google Cloud foi configurada no appsettings ou variáveis de ambiente.");
        }

        ImageAnnotatorClientBuilder builder = new()
        {
            Credential = credential
        };

        _client = builder.Build();
    }

    public async Task<string> DetectTextAsync(IFormFile file)
    {
        using Stream stream = file.OpenReadStream();
        Image image = await Image.FromStreamAsync(stream);

        TextAnnotation response = await _client.DetectDocumentTextAsync(image);
        return response?.Text ?? string.Empty;
    }
}