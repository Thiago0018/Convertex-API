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
        <main className="w-full flex-1 flex flex-col justify-center items-center md:flex-row p-4 md:p-8 gap-6 overflow-y-auto relative z-10">

            {/*  SEÇÃO ESQUERDA: Formatos de Saída  */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 min-h-60 w-full md:w-56 flex flex-col items-start gap-4 p-6 rounded-2xl shadow-2xl transition-all duration-300 hover:border-slate-600/60 md:mb-12">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <h2 className="text-lg font-bold text-slate-100 tracking-wide">Formatos</h2>
                </div>

                <FormatOption
                    selectedFormat={format}
                    onFormatChange={setFormat}
                />
            </div>

            {/* SEÇÃO CENTRAL: Upload & Ação Principal */}
            <div className="relative group my-2">
                {/* Efeito Glow (Brilho neon atrás do card central ao passar o mouse) */}
                <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-cyan-500 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition duration-500 pointer-events-none" />

                <div className="relative bg-slate-900/70 backdrop-blur-2xl border border-slate-700/60 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center gap-6 shadow-2xl">

                    <ImageSelectorButton
                        loading={loading}
                        onImageSelect={(res) => setFile(res?.file ?? null)}
                    />

                    {/* Botão de Converter com Gradiente e Sombra Neon */}
                    <button
                        type="button"
                        onClick={executeOcr}
                        disabled={loading}
                        className={`w-full max-w-xs cursor-pointer py-3.5 px-8 rounded-xl font-extrabold text-sm tracking-wider uppercase transition-all duration-300 shadow-lg ${loading
                            ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                            : 'bg-linear-to-r from-blue-600 via-cyan-500 to-blue-600 bg-size-[200%_auto] text-white shadow-blue-500/25 hover:shadow-cyan-500/40 hover:bg-position-[right_center] active:scale-95 hover:scale-[1.02]'
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-cyan-300" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Processando...
                            </span>
                        ) : (
                            'Converter Imagem'
                        )}
                    </button>
                </div>
            </div>

            {/* SEÇÃO DIREITA: Arquivos Recentes */}
            <OcrHistorySection
                files={recentFiles}
                onSelectFile={openHistoryItem}
                onClearHistory={clearHistory}
            />

            {/* Modal de Resultado */}
            <OcrResultModal
                isOpen={isModalOpen}
                onClose={closeModal}
                extractedText={extractedText}
                format={format}
            />
        </main>
    );
}