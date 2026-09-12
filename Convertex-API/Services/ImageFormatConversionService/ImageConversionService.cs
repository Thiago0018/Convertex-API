using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp;

namespace Convertex_API.Services.ImageFormatConversionService;

public interface IImageConversionService
{
    Task<(byte[] fileBytes, string contentType, string fileName)> ConvertAsync(IFormFile file, string format);
}

public class ImageConversionService : IImageConversionService
{

    private IImageFormat GetFormatByExtensionOrMime(string extensionOrMime)
    {
        var cleanFormat = extensionOrMime.TrimStart('.').Trim().ToLower();

        if (cleanFormat == "heic" || cleanFormat == "heif")
        {
            throw new InvalidImageContentException(
              "O formato HEIC é suportado apenas para leitura. Não é possível converter imagens para a extensão HEIC."
            );
        }

        if (Configuration.Default.ImageFormatsManager.TryFindFormatByFileExtension(cleanFormat, out IImageFormat? formatByExt))
            return formatByExt;


        if (Configuration.Default.ImageFormatsManager.TryFindFormatByMimeType(cleanFormat, out IImageFormat? formatByMime))
            return formatByMime;

        throw new InvalidImageContentException($"O formato '{extensionOrMime}' não é suportado para conversão.");
    }

    public async Task<(byte[] fileBytes, string contentType, string fileName)> ConvertAsync(IFormFile file, string format)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("Nenhum arquivo encontrado");

        var formatoAlvo = GetFormatByExtensionOrMime(format);

        using var inputstream = file.OpenReadStream();

        using var image = await Image.LoadAsync(inputstream);

        using var outputStream = new MemoryStream();
        await image.SaveAsync(outputStream, formatoAlvo);
        var fileBytes = outputStream.ToArray();

        var novoNomeArquivo = Path.ChangeExtension(file.FileName, formatoAlvo.FileExtensions.First());
        var novoContentType = formatoAlvo.MimeTypes.First();

        return (fileBytes, novoContentType, novoNomeArquivo);
    }
}
