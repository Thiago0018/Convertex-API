import { useState } from 'react';
import { imageService } from '../service/imageService';
import type { FileFormat } from '../components/ui/FormatOption';

export function useOcr() {
    const [file, setFile] = useState<File | null>(null);
    const [format, setFormat] = useState<FileFormat>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    // Estados para controle do Modal / Caixa Flutuante
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [extractedText, setExtractedText] = useState<string>('');
    const [downloadBlob, setDownloadBlob] = useState<Blob | null>(null);

    const executeOcr = async () => {
        if (!file) {
            setMessage('Selecione uma imagem.');
            return;
        }
        if (!format) {
            setMessage('Selecione o formato de saída.');
            return;
        }

        try {
            setLoading(true);
            setMessage('Processando...');

            const result = await imageService.uploadToApi(file, format);

            setExtractedText(result.text);
            setDownloadBlob(result.blobData);
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
            imageService.triggerDownload(downloadBlob, format);
        }
    };

    const closeModal = () => setIsModalOpen(false);

    return {
        // Estados consumidos pela UI
        file,
        setFile,
        format,
        setFormat,
        loading,
        message,
        isModalOpen,
        extractedText,

        // Funções de ação
        executeOcr,
        downloadFile,
        closeModal,
    };
}