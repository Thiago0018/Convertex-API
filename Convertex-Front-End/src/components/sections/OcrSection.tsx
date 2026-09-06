import { useState } from 'react';
import { imageService } from '../../service/imageService';
import { FormatOption, FileFormat } from './FormatOption';
import { ImageSelectorButton } from '../ui/ImageSelectorButton';

export function OcrSection() {
    // Em JS era useState(null). No TS informamos que o estado pode ser um File ou null:
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

            // O TypeScript garante que 'file' não é null aqui devido aos ifs anteriores
            const blobData = await imageService.uploadToApi(file, format);

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
        <main className="w-full flex-1 flex flex-col justify-center items-center md:flex-row p-4 gap-4 overflow-y-auto">
            {/* Seção Esquerda: Formato */}
            <div className="bg-[#414853] min-h-60 max-w-52 flex flex-col items-start gap-3 p-5 rounded shadow md:mb-20 whitespace-nowrap">
                <h2 className='mb-5 text-xl font-bold text-white'>Formatos de saida</h2>
                <FormatOption onFormatChange={setFormat} />
            </div>

            {/* Seção Direita: Seletor + Botão de Ação */}
            <div className="bg-[#363e47] h-auto w-auto m-5 md:w-auto flex flex-col items-center justify-center rounded-lg shrink-0 p-4 gap-4 ">
                <ImageSelectorButton onImageSelect={(res) => setFile(res?.file ?? null)} />

                {message && (
                    <span className="text-xs font-bold text-white bg-amber-900/80 px-3 py-1 rounded">
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

            <div className="h-auto md:min-h-60 w-auto md:min-w-50 flex flex-col items-start gap-3 p-5 rounded-2xl  md:mb-20 whitespace-nowrap">
                {/* div de armonia de conteúdo*/}
            </div>
        </main>
    );
}