import React, { useState } from 'react';
import { FormatOption } from './FormatOption';
import { ImageSelectorButton } from '../ui/ImageSelectorButton';
import { imageService } from '../../service/imageService';


export function OcrSection() {
    const [file, setFile] = useState(null);
    const [format, setFormat] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleExecuteOcr = async () => {
        if (!file) {
            setMessage('Selecione uma imagem.');
            return;
        }
        if (!format) {
            setMessage('Selecione o formato.');
            return;
        }

        try {
            setLoading(true);
            setMessage('Processando...');

            const blobData = await imageService.uploadToApi(file, format);

            // Download do arquivo retornado pelo .NET
            const downloadUrl = window.URL.createObjectURL(new Blob([blobData]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', `ocr-resultado.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);

            setMessage('Sucesso!');
        } catch (error) {
            console.error(error);
            setMessage('Erro ao converter.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="w-full h-full flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
            {/* Seção Esquerda: Formato */}
            <div className="bg-amber-500 h-full w-full md:w-[50%] flex items-center justify-center rounded-lg">
                <FormatOption onFormatChange={setFormat} />
            </div>

            {/* Seção Direita: Seletor + Botão de Ação */}
            <div className="bg-amber-600 h-full w-full md:w-[50%] flex flex-col items-center justify-center rounded-lg shrink-0 p-4 gap-4">
                <ImageSelectorButton onImageSelect={(res) => setFile(res?.file)} />

                {message && (
                    <span className="text-xs font-bold text-amber-100 bg-amber-900/80 px-3 py-1 rounded">
                        {message}
                    </span>
                )}

                <button
                    type="button"
                    onClick={handleExecuteOcr}
                    disabled={loading}
                    className="px-6 py-2 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
                >
                    {loading ? 'Convertendo...' : 'Iniciar OCR'}
                </button>
            </div>
        </main>
    );
}