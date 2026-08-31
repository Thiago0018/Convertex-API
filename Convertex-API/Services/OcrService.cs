using System.Text;
using System.Text.Json;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using MeuProjetoVision.Integrations;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using OpenXmlDocument = DocumentFormat.OpenXml.Wordprocessing.Document;

namespace MeuProjetoVision.Services;

public interface IOcrService
{
    Task<(byte[] FileBytes, string ContentType, string FileName)> ProcessAndExportAsync(IFormFile file, string format);
    Task<(byte[] FileBytes, string ContentType, string FileName)> ProcessAndExportIllustrationAsync(IFormFile file, string format);
}

public class OcrService : IOcrService
{
    private readonly IGoogleVisionClient _visionClient;

    static OcrService()
    {
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public OcrService(IGoogleVisionClient visionClient)
    {
        _visionClient = visionClient;
    }

    public async Task<(byte[] FileBytes, string ContentType, string FileName)> ProcessAndExportAsync(IFormFile file, string format)
    {
        string rawText = await _visionClient.DetectTextAsync(file);

        return BuildExportResult(rawText, format, "resultado-ocr");
    }

    public async Task<(byte[] FileBytes, string ContentType, string FileName)> ProcessAndExportIllustrationAsync(IFormFile file, string format)
    {
        string rawText = await _visionClient.DetectDocumentTextAsync(file);
        string normalizedText = NormalizeIllustrationText(rawText);

        return BuildExportResult(normalizedText, format, "resultado-ocr-ilustracao");
    }

    private static (byte[] FileBytes, string ContentType, string FileName) BuildExportResult(string rawText, string format, string baseName)
    {
        return format.ToLower() switch
        {
            "json" => (
                Encoding.UTF8.GetBytes(JsonSerializer.Serialize(new { extractedText = rawText }, new JsonSerializerOptions { WriteIndented = true })),
                "application/json",
                $"{baseName}.json"
            ),
            "csv" => (
                Encoding.UTF8.GetBytes($"\"Texto Extraído\"\n\"{rawText.Replace("\"", "\"\"")}\""),
                "text/csv",
                $"{baseName}.csv"
            ),
            "word" or "docx" => (
                CreateWordDocument(rawText),
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                $"{baseName}.docx"
            ),
            "pdf" => (
                CreatePdfDocument(rawText),
                "application/pdf",
                $"{baseName}.pdf"
            ),
            _ => (
                Encoding.UTF8.GetBytes(rawText),
                "text/plain",
                $"{baseName}.txt"
            )
        };
    }

    private static string NormalizeIllustrationText(string rawText)
    {
        if (string.IsNullOrWhiteSpace(rawText))
            return string.Empty;

        string normalized = rawText
            .Replace("\r\n", "\n")
            .Replace('\r', '\n')
            .Replace("\u00A0", " ")
            .Trim();

        normalized = string.Join("\n", normalized.Split('\n').Select(line => line.Trim()));

        return normalized;
    }

    private static byte[] CreateWordDocument(string text)
    {
        string cleanText = RemoveInvalidXmlCharacters(text ?? string.Empty);
        using MemoryStream stream = new();
        using (WordprocessingDocument document = WordprocessingDocument.Create(
            stream,
            WordprocessingDocumentType.Document,
            true))
        {
            MainDocumentPart mainPart = document.AddMainDocumentPart();
            StyleDefinitionsPart stylesPart = mainPart.AddNewPart<StyleDefinitionsPart>();
            stylesPart.Styles = new Styles(
                new DocDefaults(
                    new RunPropertiesDefault(
                        new RunPropertiesBaseStyle(
                            new RunFonts { Ascii = "Arial", HighAnsi = "Arial", ComplexScript = "Arial" }))));
            stylesPart.Styles.Save();

            Body body = new();
            string[] lines = cleanText.Replace("\r\n", "\n").Replace('\r', '\n').Split('\n');

            foreach (string line in lines)
            {
                body.AppendChild(new Paragraph(
                    new Run(
                        new RunProperties(
                            new RunFonts { Ascii = "Arial", HighAnsi = "Arial", ComplexScript = "Arial" }),
                        new Text(line) { Space = SpaceProcessingModeValues.Preserve })));
            }

            mainPart.Document = new OpenXmlDocument(body);
            mainPart.Document.Save();
        }

        return stream.ToArray();
    }

    private static byte[] CreatePdfDocument(string text)
    {
        string[] lines = (text ?? string.Empty)
            .Replace("\r\n", "\n")
            .Replace('\r', '\n')
            .Split('\n');

        return QuestPDF.Fluent.Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Margin(40);
                page.Content().Column(column =>
                {
                    foreach (string line in lines)
                        column.Item().Text(line).FontFamily("Arial").FontSize(12);
                });
            });
        }).GeneratePdf();
    }

    private static string RemoveInvalidXmlCharacters(string text)
    {
        StringBuilder result = new(text.Length);

        foreach (char character in text)
        {
            if (character is '\t' or '\n' or '\r' ||
                character is >= '\u0020' and <= '\uD7FF' ||
                character is >= '\uE000' and <= '\uFFFD')
            {
                result.Append(character);
            }
        }

        return result.ToString();
    }
}