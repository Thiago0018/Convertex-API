using Microsoft.AspNetCore.Mvc;
using Convertex_API.Dtos;
using Convertex_API.Services.ImageFormatConversionService;
using SixLabors.ImageSharp;

namespace Convertex_API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ImageConverterController : ControllerBase
{
    private readonly IImageConversionService _imageConversionService;

    public ImageConverterController(IImageConversionService imageConversionService)
    {
        _imageConversionService = imageConversionService;
    }


    [HttpPost("Conversion")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ImageConversionResponseDto))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> ConvertImage([FromForm] IFormFile file, [FromForm] string format)
    {
        try
        {
            var (fileBytes, contentType, fileName) = await _imageConversionService.ConvertAsync(file, format);
            var responseDto = new ImageConversionResponseDto(
                fileName,
                contentType,
                Convert.ToBase64String(fileBytes)
            );

            return Ok(responseDto);
        }
        catch (InvalidImageContentException ex)
        {
            return BadRequest(new { status = 400, message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { status = 400, message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { status = 500, message = "Erro interno ao converter a imagem.", details = ex.Message });
        }


    }
}
