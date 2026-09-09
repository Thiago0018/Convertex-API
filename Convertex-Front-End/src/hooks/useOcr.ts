import { useState } from 'react';
import { imageService } from '../service/imageService';
import { ocrHistoryService, type OcrHistoryItem } from '../service/ocrHistoryService';
import type { FileFormat } from '../components/ui/FormatOption';

export function useOcr() {
    const [file, setFile] = useState<File | null>(null);
    const [format, setFormat] = useState<FileFormat>('txt');
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    // Estados do Modal / Caixa Flutuante
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [extractedText, setExtractedText] = useState<string>('');
    const [downloadBlob, setDownloadBlob] = useState<Blob | null>(null);
    const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);

    // Estado do Histórico de Arquivos Recentes
    const [recentFiles, setRecentFiles] = useState<OcrHistoryItem[]>(() =>
        ocrHistoryService.getRecentFiles()
    );

    const executeOcr = async () => {
        if (!file) {
            setMessage('Selecione uma imagem.');
            return;
        }

        try {
            setLoading(true);
            setMessage('Processando...');

            const result = await imageService.uploadToApi(file, format);

            setExtractedText(result.text);
            setDownloadBlob(result.blobData);

            // Cria uma URL temporária a partir do Blob retornado pela API para o modal exibir
            if (result.blobData) {
                const objectUrl = URL.createObjectURL(result.blobData);
                setFileUrl(objectUrl);
            }

            setIsModalOpen(true);
            setMessage('Conversão concluída!');
        } catch (error: any) {
            setMessage(error.message || 'Erro ao processar imagem.');
        } finally {
            setLoading(false);
        }
    };

    const downloadFile = () => {
        if (downloadBlob) {
            imageService.triggerDownload(downloadBlob, format || 'txt');

            const updatedList = ocrHistoryService.addRecentFile({
                fileName: file?.name || `ocr-resultado.${format || 'txt'}`,
                format: format || 'txt',
                textPreview: extractedText.substring(0, 80),
                fullText: extractedText,
                fileUrl: fileUrl,
            });

            setRecentFiles(updatedList);
        }
    };

    const openHistoryItem = (item: OcrHistoryItem) => {
        const textBlob = new Blob([item.fullText], { type: 'text/plain;charset=utf-8' });

        setExtractedText(item.fullText);
        setDownloadBlob(textBlob);
        setFormat(item.format as FileFormat);

        // Se o item do histórico já possuir URL ou Blob recuperado
        setFileUrl(item.fileUrl || URL.createObjectURL(textBlob));
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    return {
        // Estados
        file,
        setFile,
        format,
        setFormat,
        loading,
        message,
        isModalOpen,
        extractedText,
        fileUrl,
        recentFiles,
        executeOcr,
        downloadFile,
        openHistoryItem,
        closeModal,
    };
}
