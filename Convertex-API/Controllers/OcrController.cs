using Microsoft.AspNetCore.Mvc;
using MeuProjetoVision.Services;

namespace MeuProjetoVision.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OcrController : ControllerBase
{
    private const long MaxFileSize = 10 * 1024 * 1024;
    private static readonly HashSet<string> AllowedExtensions = [".jpg", ".jpeg", ".png", ".pdf"];
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
            return BadRequest("Envie uma imagem JPG/PNG ou um PDF de até 10 MB.");

        if (!await _dailyRequestCounter.TryConsumeAsync())
            return StatusCode(StatusCodes.Status429TooManyRequests, "Limite diário de OCR atingido. Tente novamente amanhã.");

        var (fileBytes, contentType, fileName) = await _ocrService.ProcessAndExportAsync(file, format);

        // Retorna o arquivo diretamente na resposta HTTP
        return File(fileBytes, contentType, fileName);
    }
}