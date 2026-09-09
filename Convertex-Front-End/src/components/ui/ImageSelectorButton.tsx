import { useRef, useState, useEffect, type ButtonHTMLAttributes, type ChangeEvent, type DragEvent } from 'react';

export interface ImageSelectedResult {
    file: File;
    previewUrl: string;
}

type ImageSelectorSize = 'md' | 'lg' | 'xl';
type ImageSelectorVariant = 'primary' | 'gradient' | 'accent';

interface ImageSelectorButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
    onImageSelect: (result: ImageSelectedResult | null) => void;
    label?: string;
    preview?: boolean;
    size?: ImageSelectorSize;
    variant?: ImageSelectorVariant;
    loading?: boolean; // <--- ADICIONADO AQUI
}

const SIZES: Record<ImageSelectorSize, string> = {
    md: 'w-48 h-48 text-sm',
    lg: 'w-64 h-64 text-base',
    xl: 'w-80 h-80 text-lg',
};

const ICON_SIZES: Record<ImageSelectorSize, string> = {
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
};

const VARIANTS: Record<ImageSelectorVariant, string> = {
    primary: 'bg-slate-900/80 border-2 border-dashed border-slate-700 text-slate-300 hover:border-blue-500 hover:text-blue-400 hover:shadow-xl hover:shadow-blue-500/20 hover:bg-slate-900',
    gradient: 'bg-slate-900/80 border-2 border-dashed border-blue-500/50 text-slate-200 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/25 hover:bg-slate-900',
    accent: 'bg-slate-900/80 border-2 border-dashed border-cyan-500/50 text-cyan-400 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-500/20',
};

export function ImageSelectorButton({
    onImageSelect,
    label = 'Selecionar Imagem',
    preview = true,
    size = 'lg',
    variant = 'primary',
    loading = false, // <--- ADICIONADO AQUI (Valor padrão false)
    className = '',
    ...props
}: ImageSelectorButtonProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            if (selectedImage) {
                URL.revokeObjectURL(selectedImage);
            }
        };
    }, [selectedImage]);

    const handleProcessFile = (file: File | undefined) => {
        if (!file) {
            setSelectedImage(null);
            onImageSelect(null);
            return;
        }

        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            alert('Por favor, selecione apenas arquivos PNG ou JPG.');
            return;
        }

        if (selectedImage) {
            URL.revokeObjectURL(selectedImage);
        }

        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);
        onImageSelect({ file, previewUrl: imageUrl });
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        handleProcessFile(file);
    };

    const handleDragOver = (event: DragEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (!isDragging) setIsDragging(true);
    };

    const handleDragLeave = (event: DragEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);

        const droppedFile = event.dataTransfer.files?.[0];
        handleProcessFile(droppedFile);
    };

    const handleButtonClick = () => {
        if (loading) return;
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
            fileInputRef.current.click();
        }
    };

    return (
        <div className={`flex flex-col items-center justify-center select-none ${className}`}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png"
                className="hidden"
            />

            <button
                type="button"
                onClick={handleButtonClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                disabled={loading}
                className={`relative rounded-2xl flex flex-col items-center justify-center gap-3 p-4 cursor-pointer transition-all duration-200 ease-out overflow-hidden hover:scale-105 active:scale-95 group ${SIZES[size]
                    } ${VARIANTS[variant]} ${isDragging
                        ? 'border-blue-400! bg-blue-950/40! scale-105! ring-4 ring-blue-500/30'
                        : ''
                    }`}
                {...props}
            >
                {selectedImage && preview ? (
                    <>
                        <img src={selectedImage} alt="Preview" className="w-full h-full object-cover rounded-xl" />

                        {/* EFEEITO DE SCANNER LUMINOSO (RENDERIZADO SE LOADING FOR TRUE) */}
                        {loading ? (
                            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] rounded-xl overflow-hidden flex flex-col items-center justify-center">
                                {/* Linha Laser de Varredura */}
                                <div className="absolute left-0 right-0 h-1 bg-linear-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scan z-10" />

                                {/* Badge Central indicando o escaneamento */}
                                <span className="bg-slate-900/90 text-cyan-300 text-xs font-mono font-bold px-3 py-1.5 rounded-full border border-cyan-500/40 shadow-lg z-20 flex items-center gap-2 animate-pulse">
                                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                                    LENDO IMAGEM...
                                </span>
                            </div>
                        ) : (
                            /* Overlay Normal de Troca de Imagem no Hover */
                            <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white p-2 text-center">
                                <svg className="w-8 h-8 mb-1 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                <span className="text-xs font-semibold">Trocar Imagem</span>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className={`p-3 rounded-full transition-colors ${isDragging ? 'bg-blue-500 text-white' : 'bg-slate-800/80 group-hover:bg-blue-600/20 group-hover:text-blue-400'
                            }`}>
                            <svg className={`${ICON_SIZES[size]} transition-transform duration-200 ${isDragging ? 'scale-125' : 'group-hover:scale-110'}`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="font-semibold text-center leading-tight">
                            {isDragging ? 'Solte a imagem aqui' : label}
                        </span>
                        <span className="text-xs text-slate-500 font-normal group-hover:text-slate-400">
                            {isDragging ? 'PNG ou JPG' : 'Clique ou arraste aqui (PNG ou JPG)'}
                        </span>
                    </>
                )}
            </button>
        </div>
    );
}
