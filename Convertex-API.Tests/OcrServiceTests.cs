using System.Text;
using Microsoft.AspNetCore.Http;
using MeuProjetoVision.Integrations;
using MeuProjetoVision.Services;
using Xunit;

namespace Convertex_API.Tests;

public class OcrServiceTests
{
    [Fact]
    public async Task ProcessAndExportIllustrationAsync_ShouldReturnTextFile_ForIllustrationsWithHandwriting()
    {
        var visionClient = new FakeGoogleVisionClient("Texto da ilustração\nLetra cursiva");
        var service = new OcrService(visionClient);

        byte[] payload = Encoding.UTF8.GetBytes("fake-image-content");
        using var stream = new MemoryStream(payload);
        IFormFile file = new FormFile(stream, 0, payload.Length, "file", "ilustracao.png");

        var result = await service.ProcessAndExportIllustrationAsync(file, "txt");

        Assert.Equal("resultado-ocr-ilustracao.txt", result.FileName);
        Assert.Equal("text/plain", result.ContentType);
        Assert.Contains("Texto da ilustração", Encoding.UTF8.GetString(result.FileBytes));
        Assert.Contains("Letra cursiva", Encoding.UTF8.GetString(result.FileBytes));
    }

    private sealed class FakeGoogleVisionClient : IGoogleVisionClient
    {
        private readonly string _text;

        public FakeGoogleVisionClient(string text)
        {
            _text = text;
        }

        public Task<string> DetectTextAsync(IFormFile file)
            => Task.FromResult(_text);

        public Task<string> DetectDocumentTextAsync(IFormFile file)
            => Task.FromResult(_text);
    }
}
