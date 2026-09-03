// src/components/ui/ImageSelectorButton.jsx
import React, { useRef, useState } from 'react';
import { imageService } from '../../service/imageService';

export function ImageSelectorButton({
    onImageSelect,          // Recebe o callback para enviar o resultado processado pelo service
    label = "Selecionar Imagem",
    preview = true,
    size = 'lg',
    variant = 'primary',
    className = '',
    ...props
}) {
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);

    // Dicionário de tamanhos e ícones
    const sizes = {
        md: "w-48 h-48 text-sm",
        lg: "w-64 h-64 text-base",
        xl: "w-80 h-80 text-lg"
    };

    const iconSizes = {
        md: "w-8 h-8",
        lg: "w-12 h-12",
        xl: "w-16 h-16"
    };

    const variants = {
        primary: "bg-slate-900/80 border-2 border-dashed border-slate-700 text-slate-300 hover:border-blue-500 hover:text-blue-400 hover:shadow-xl hover:shadow-blue-500/20 hover:bg-slate-900",
        gradient: "bg-slate-900/80 border-2 border-dashed border-blue-500/50 text-slate-200 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/25 hover:bg-slate-900",
        accent: "bg-slate-900/80 border-2 border-dashed border-cyan-500/50 text-cyan-400 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-500/20"
    };

    // Ações meramente visuais de acionamento do clique e repasse ao service
    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        // Delega o processamento da imagem para a camada de Service
        const result = imageService.processImageSelection(event);

        if (result) {
            setSelectedImage(result.imageUrl);
            if (onImageSelect) {
                onImageSelect(result);
            }
        }
    };

    return (
        <div className={`flex flex-col items-center justify-center select-none ${className}`}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            <button
                type="button"
                onClick={handleButtonClick}
                className={`
          relative rounded-2xl flex flex-col items-center justify-center gap-3 p-4
          cursor-pointer transition-all duration-200 ease-out overflow-hidden
          hover:scale-105 active:scale-95 group
          ${sizes[size]} 
          ${variants[variant]}
        `}
                {...props}
            >
                {selectedImage && preview ? (
                    <>
                        <img
                            src={selectedImage}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-xl"
                        />
                        <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white p-2 text-center">
                            <svg className="w-8 h-8 mb-1 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span className="text-xs font-semibold">Trocar Imagem</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="p-3 rounded-full bg-slate-800/80 group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
                            <svg
                                className={`${iconSizes[size]} transition-transform duration-200 group-hover:scale-110`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="font-semibold text-center leading-tight">
                            {label}
                        </span>
                        <span className="text-xs text-slate-500 font-normal group-hover:text-slate-400">
                            PNG, JPG ou WEBP
                        </span>
                    </>
                )}
            </button>
        </div>
    );
}