using Microsoft.AspNetCore.Mvc;
using MeuProjetoVision.Services;

namespace MeuProjetoVision.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OcrController : ControllerBase
{
    private const long MaxFileSize = 10 * 1024 * 1024;
    private static readonly HashSet<string> AllowedExtensions = [".jpg", ".jpeg", ".png"];
    private readonly IOcrService _ocrService;
    private readonly IDailyRequestCounter _dailyRequestCounter;

    public OcrController(IOcrService ocrService, IDailyRequestCounter dailyRequestCounter)
    {
        _ocrService = ocrService;
        _dailyRequestCounter = dailyRequestCounter;
    }

    [HttpPost("extract")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(MaxFileSize)]
    public async Task<IActionResult> ExtractText([FromForm] IFormFile file, [FromQuery] string format = "txt")
    {
        if (file == null || file.Length == 0)
            return BadRequest("Nenhum arquivo enviado.");

        string extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (file.Length > MaxFileSize || !AllowedExtensions.Contains(extension))
            return BadRequest("Envie uma imagem JPG ou PNG de até 10 MB. Arquivos PDF ainda não são suportados.");

        if (!await _dailyRequestCounter.TryConsumeAsync())
            return StatusCode(StatusCodes.Status429TooManyRequests, "Limite diário de OCR atingido. Tente novamente amanhã.");

        var (fileBytes, contentType, fileName) = await _ocrService.ProcessAndExportAsync(file, format);

        return File(fileBytes, contentType, fileName);
    }
}