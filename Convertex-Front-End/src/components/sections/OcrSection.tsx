import { useOcr } from '../../hooks/useOcr';
import { FormatOption } from '../ui/FormatOption';
import { ImageSelectorButton } from '../ui/ImageSelectorButton';
import { OcrResultModal } from '../ui/OcrResultModal';

export function OcrSection() {
    const {
        setFile,
        format,
        setFormat,
        loading,
        message,
        isModalOpen,
        extractedText,
        executeOcr,
        downloadFile,
        closeModal,
    } = useOcr();

    return (
        <main className="w-full flex-1 flex flex-col justify-center items-center md:flex-row p-4 gap-4 overflow-y-auto">
            {/* Seção Esquerda */}
            <div className="bg-[#414853] min-h-60 w-52 flex flex-col items-start gap-3 p-5 rounded-2xl shadow whitespace-nowrap md:mb-20">
                <h2 className="mb-2 text-xl font-bold text-white">Formatos de saída</h2>

                {/* CORREÇÃO AQUI: Passar o selectedFormat={format} */}
                <FormatOption
                    selectedFormat={format}
                    onFormatChange={setFormat}
                />
            </div>

            {/* Seção Central */}
            <div className="bg-[#363e47] h-auto w-auto m-5 flex flex-col items-center justify-center rounded-lg shrink-0 p-4 gap-4">
                <ImageSelectorButton onImageSelect={(res) => setFile(res?.file ?? null)} />

                {message && (
                    <span className="text-xs font-bold text-amber-100 bg-amber-900/90 px-3 py-1 rounded border border-amber-700">
                        {message}
                    </span>
                )}

                <button
                    type="button"
                    onClick={executeOcr}
                    disabled={loading}
                    className={`cursor-pointer px-6 py-2.5 rounded-xl font-bold transition-all duration-200 shadow-lg ${loading
                            ? 'bg-slate-700 cursor-not-allowed opacity-50'
                            : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95 hover:scale-105'
                        }`}
                >
                    {loading ? 'Convertendo...' : 'Iniciar OCR'}
                </button>
            </div>

            <div className="h-auto md:min-h-60 w-auto md:min-w-50 whitespace-nowrap md:mb-20" />

            {/* Modal */}
            <OcrResultModal
                isOpen={isModalOpen}
                onClose={closeModal}
                extractedText={extractedText}
                onDownload={downloadFile}
                format={format}
            />
        </main>
    );
}