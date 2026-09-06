import { useState } from 'react';
import { imageService } from '../../service/imageService';
import { FormatOption, FileFormat } from '../sections/FormatOption';
import { ImageSelectorButton, ImageSelectedResult } from './ImageSelectorButton';

export function OcrSection() {
    const [file, setFile] = useState<File | null>(null);
    const [format, setFormat] = useState<FileFormat>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

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

            const downloadUrl = window.URL.createObjectURL(blobData);
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
        <main className="w-full flex-1 flex flex-col justify-center items-center md:flex-row p-4 gap-4 overflow-y-auto">
            {/* Seção Esquerda: Seleção de Formato */}
            <div className="bg-[#414853] min-h-60 max-w-52 flex flex-col items-start gap-3 p-5 rounded-2xl shadow whitespace-nowrap">
                <h2 className="mb-5 text-xl font-bold text-white">Formatos de saída</h2>
                {/* setFormat é chamado aqui quando o usuário clica num checkbox */}
                <FormatOption onFormatChange={(f) => setFormat(f)} />
            </div>

            {/* Seção Central: Seletor de Imagem + Ação */}
            <div className="bg-[#363e47] h-auto w-auto m-5 flex flex-col items-center justify-center rounded-lg shrink-0 p-4 gap-4">
                {/* setFile é chamado aqui quando o usuário escolhe a imagem */}
                <ImageSelectorButton onImageSelect={(res: ImageSelectedResult | null) => setFile(res?.file ?? null)} />

                <div className="flex flex-col items-center gap-2 mt-4 z-50 relative">
                    {message && (
                        <span className="text-xs font-bold text-amber-100 bg-amber-900/90 px-3 py-1 rounded border border-amber-700">
                            {message}
                        </span>
                    )}

                    <button
                        type="button"
                        onClick={handleExecuteOcr}
                        disabled={loading}
                        className={`cursor-pointer px-6 py-2.5 rounded-xl font-bold transition-all duration-200 shadow-lg ${loading
                            ? 'bg-slate-700 cursor-not-allowed opacity-50'
                            : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95 hover:scale-105'
                            }`}
                    >
                        {loading ? 'Convertendo...' : 'Iniciar OCR'}
                    </button>
                </div>
            </div>

            {/* Div de harmonia visual */}
            <div className="h-auto md:min-h-60 w-auto md:min-w-50 flex flex-col items-start gap-3 p-5 rounded-2xl shadow whitespace-nowrap">
            </div>
        </main>
    );
}
