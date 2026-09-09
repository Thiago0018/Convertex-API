import { useOcr } from '../../hooks/useOcr';
import { FormatOption } from '../ui/FormatOption';
import { ImageSelectorButton } from '../ui/ImageSelectorButton';
import { OcrResultModal } from '../ui/OcrResultModal';
import { OcrHistorySection } from '../sections/OcrHistorySection';

export function OcrSection() {
    const {
        setFile,
        format,
        setFormat,
        loading,
        isModalOpen,
        extractedText,
        executeOcr,
        closeModal,
        recentFiles,
        openHistoryItem,
        clearHistory,
    } = useOcr();

    return (
        <main className="w-full flex-1 flex flex-col justify-center items-center md:flex-row p-4 gap-4 overflow-y-auto">
            {/* Seção Esquerda */}
            <div className="bg-[#414853] min-h-60 w-52 flex flex-col items-start gap-3 p-5 rounded-2xl shadow whitespace-nowrap md:mb-20">
                <h2 className="mb-2 text-xl font-bold text-white">Formatos de saída</h2>
                <FormatOption
                    selectedFormat={format}
                    onFormatChange={setFormat}
                />
            </div>

            {/* Seção Central */}
            <div className="bg-[#363e47] h-auto w-auto m-5 flex flex-col items-center justify-center rounded-lg shrink-0 p-4 gap-4">
                <ImageSelectorButton onImageSelect={(res) => setFile(res?.file ?? null)} />

                <button
                    type="button"
                    onClick={executeOcr}
                    disabled={loading}
                    className={`cursor-pointer px-6 py-2.5 rounded-xl font-bold transition-all duration-200 shadow-lg ${loading
                            ? 'bg-slate-700 cursor-not-allowed opacity-50'
                            : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95 hover:scale-105'
                        }`}
                >
                    {loading ? 'Convertendo...' : 'CONVERTER'}
                </button>
            </div>

            {/* Seção de arquivos recentes */}
            <OcrHistorySection
                files={recentFiles}
                onSelectFile={openHistoryItem}
                onClearHistory={clearHistory}
            />

            {/* Janela flutuante do texto convertido */}
            <OcrResultModal
                isOpen={isModalOpen}
                onClose={closeModal}
                extractedText={extractedText}
                format={format}
            />
        </main>
    );
}