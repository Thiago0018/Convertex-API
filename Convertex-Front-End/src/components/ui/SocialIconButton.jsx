// src/components/ui/SocialIconButton.jsx
import React from 'react';

export function SocialIconButton({
    icon,         // 'github' | 'linkedin' | 'gmail'
    customSrc,    // URL para imagem/ícone customizado (se não usar os ícones padrão)
    href,         // Link para redirecionar (ex: "https://github.com/SeuUsuario")
    onClick,      // Função JS customizada
    alt = 'Social Link',
    size = 'md',  // 'sm' | 'md' | 'lg'
    variant = 'primary',
    className = '',
    ...props
}) {

    // 1. Mapeamento de Tamanhos
    const sizes = {
        sm: "w-9 h-9 text-xs",
        md: "w-11 h-11 text-sm",
        lg: "w-14 h-14 text-base"
    };

    const iconSizes = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6"
    };

    // 2. Variações de Cores e Glows no Hover
    const variants = {
        primary: "bg-slate-900 text-slate-300 border border-slate-800 hover:border-blue-500 hover:text-blue-400 hover:shadow-lg hover:shadow-blue-500/25",
        github: "bg-slate-900 text-slate-200 border border-slate-800 hover:border-purple-500 hover:text-white hover:shadow-lg hover:shadow-purple-500/25",
        linkedin: "bg-slate-900 text-slate-300 border border-slate-800 hover:border-sky-500 hover:text-sky-400 hover:shadow-lg hover:shadow-sky-500/25",
        gmail: "bg-slate-900 text-slate-300 border border-slate-800 hover:border-rose-500 hover:text-rose-400 hover:shadow-lg hover:shadow-rose-500/25",
    };

    // 3. Ícones SVG Nativos (GitHub, LinkedIn, Gmail)
    const renderIcon = () => {
        // Opção A: Imagem Customizada enviada via 'customSrc'
        if (customSrc) {
            return (
                <img
                    src={customSrc}
                    alt={alt}
                    className={`${iconSizes[size]} object-contain rounded-full`}
                />
            );
        }

        // Opção B: Ícones padrão predefinidos
        switch (icon?.toLowerCase()) {
            case 'github':
                return (
                    <svg className={iconSizes[size]} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                );
            case 'linkedin':
                return (
                    <svg className={iconSizes[size]} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                );
            case 'gmail':
                return (
                    <svg className={iconSizes[size]} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.272H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.49l8.073-5.997C21.69 2.28 24 3.434 24 5.457z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    // Se a prop 'variant' não for passada, tenta associar automaticamente ao nome do ícone
    const currentVariant = variants[variant] || variants[icon?.toLowerCase()] || variants.primary;

    const combinedClasses = `
    rounded-full flex items-center justify-center select-none
    cursor-pointer transition-all duration-200 ease-out
    hover:scale-105 active:scale-95
    ${sizes[size]} 
    ${currentVariant}
    ${className}
  `;

    // Se 'href' for informado, renderiza como link <a>. Senão, como <button>
    if (href) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={combinedClasses}
                aria-label={alt || icon}
                onClick={onClick}
                {...props}
            >
                {renderIcon()}
            </a>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className={combinedClasses}
            aria-label={alt || icon}
            {...props}
        >
            {renderIcon()}
        </button>
    );
}