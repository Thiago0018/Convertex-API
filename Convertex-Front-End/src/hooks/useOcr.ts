import { useState } from 'react';
import toast from 'react-hot-toast';
import { imageService } from '../service/imageService';
import { ocrHistoryService, type OcrHistoryItem } from '../service/ocrHistoryService';
import type { FileFormat } from '../components/ui/FormatOption';

export function useOcr() {
    const [file, setFile] = useState<File | null>(null);
    const [format, setFormat] = useState<FileFormat>('txt');
    const [loading, setLoading] = useState<boolean>(false);

    // Estados do Modal
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [extractedText, setExtractedText] = useState<string>('');

    // Estado do Histórico
    const [recentFiles, setRecentFiles] = useState<OcrHistoryItem[]>(() =>
        ocrHistoryService.getRecentFiles()
    );

    const executeOcr = async () => {
        if (!file) {
            toast.error('Selecione uma imagem antes de converter.');
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
            toast('Este arquivo já foi convertido para este formato no histórico recente.', {
                icon: 'ℹ️',
            });
            return;
        }

        const toastId = toast.loading('Processando imagem com OCR...');

        try {
            setLoading(true);

            const result = await imageService.uploadToApi(file, format);

            setExtractedText(result.text);

            const updatedList = ocrHistoryService.addRecentFile({
                fileName: file.name,
                format: format || 'txt',
                textPreview: result.text.substring(0, 80),
                fullText: result.text,
            });

            setRecentFiles(updatedList);
            setIsModalOpen(true);

            toast.success('Imagem convertida com sucesso!', { id: toastId });
        } catch (error: any) {
            toast.error(error.message || 'Erro ao processar imagem.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const openHistoryItem = (item: OcrHistoryItem) => {
        setExtractedText(item.fullText);
        setFormat(item.format as FileFormat);
        setIsModalOpen(true);
    };

    const clearHistory = () => {
        ocrHistoryService.clearHistory();
        setRecentFiles([]);
        toast.success('Histórico recente limpo!');
    };

    const closeModal = () => setIsModalOpen(false);

    return {
        file,
        setFile,
        format,
        setFormat,
        loading,
        isModalOpen,
        extractedText,
        recentFiles,
        executeOcr,
        openHistoryItem,
        closeModal,
        clearHistory,
    };
}
