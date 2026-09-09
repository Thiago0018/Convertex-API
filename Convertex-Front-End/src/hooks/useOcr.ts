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

    // Estado do Histórico de Arquivos Recentes
    const [recentFiles, setRecentFiles] = useState<OcrHistoryItem[]>(() =>
        ocrHistoryService.getRecentFiles()
    );

    const executeOcr = async () => {
        if (!file) {
            setMessage('Selecione uma imagem.');
            return;
        }

        const normalizedFileName = file.name.trim().toLowerCase();
        const currentFormat = (format || 'txt').trim().toLowerCase();

        const fileIsInRecentHistory = recentFiles.some(
            (item) =>
                item.fileName.trim().toLowerCase() === normalizedFileName &&
                item.format.trim().toLowerCase() === currentFormat
        );

        if (fileIsInRecentHistory) {
            setMessage(`Este arquivo já foi convertido para .${currentFormat.toUpperCase()} no histórico recente.`);
            return;
        }

        try {
            setLoading(true);
            setMessage('Processando...');

            const result = await imageService.uploadToApi(file, format);

            setExtractedText(result.text);
            setDownloadBlob(result.blobData);

            const updatedList = ocrHistoryService.addRecentFile({
                fileName: file.name,
                format: format || 'txt',
                textPreview: result.text.substring(0, 80),
                fullText: result.text,
            });

            setRecentFiles(updatedList);

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
        }
    };

    const openHistoryItem = (item: OcrHistoryItem) => {
        const textBlob = new Blob([item.fullText], { type: 'text/plain;charset=utf-8' });

        setExtractedText(item.fullText);
        setDownloadBlob(textBlob);
        setFormat(item.format as FileFormat);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    return {
        file,
        setFile,
        format,
        setFormat,
        loading,
        message,
        isModalOpen,
        extractedText,
        recentFiles,
        executeOcr,
        downloadFile,
        openHistoryItem,
        closeModal,
    };
}
