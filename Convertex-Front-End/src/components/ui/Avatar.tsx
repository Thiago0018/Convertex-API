import { useState, ComponentPropsWithoutRef } from 'react';

// 1. Tipos de Union para validação estrita
export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';
export type AvatarVariant = 'primary' | 'gradient' | 'secondary' | 'accent';

export interface AvatarProps extends ComponentPropsWithoutRef<'div'> {
    src?: string;
    alt?: string;
    name?: string;
    size?: AvatarSize;
    status?: AvatarStatus;
    variant?: AvatarVariant;
    className?: string;
}

// 2. Dicionários estáticos movidos para FORA do componente (alocação única de memória)
const SIZES: Record<AvatarSize, string> = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
    xl: "w-20 h-20 text-xl"
};

const STATUS_SIZES: Record<AvatarSize, string> = {
    sm: "w-2.5 h-2.5 border",
    md: "w-3 h-3 border-2",
    lg: "w-4 h-4 border-2",
    xl: "w-5 h-5 border-2"
};

const VARIANTS: Record<AvatarVariant, string> = {
    primary: "bg-slate-800 text-blue-400 border-2 border-blue-500/30",
    gradient: "bg-slate-900 text-white p-[2px] bg-gradient-to-tr from-blue-600 to-cyan-400",
    secondary: "bg-slate-800 text-slate-200 border border-slate-700",
    accent: "bg-slate-800 text-cyan-400 border-2 border-cyan-500/40"
};

const STATUS_COLORS: Record<AvatarStatus, string> = {
    online: "bg-emerald-500 border-slate-950",
    offline: "bg-slate-500 border-slate-950",
    busy: "bg-rose-500 border-slate-950",
    away: "bg-amber-500 border-slate-950"
};

// Função utilitária estática
const getInitials = (fullName: string): string => {
    if (!fullName) return '?';
    const names = fullName.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

export function Avatar({
    src,
    alt = 'Avatar',
    name,
    size = 'md',
    status,
    variant = 'primary',
    className = '',
    onClick,
    ...props
}: AvatarProps) {
    const [imageError, setImageError] = useState(false);

    const isInteractive = Boolean(onClick);

    return (
        <div className={`relative inline-block select-none ${className}`}>
            <div
                onClick={onClick}
                role={isInteractive ? 'button' : undefined}
                tabIndex={isInteractive ? 0 : undefined}
                aria-label={name ? `Avatar de ${name}` : alt}
                className={`
                    relative rounded-full flex items-center justify-center font-bold overflow-hidden
                    transition-all duration-200 ease-out
                    ${SIZES[size]} 
                    ${VARIANTS[variant]}
                    ${isInteractive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}
                `}
                {...props}
            >
                {/* Caso 1: Foto passada por URL (e sem erro de carregamento) */}
                {src && !imageError ? (
                    <img
                        src={src}
                        alt={alt || name}
                        onError={() => setImageError(true)}
                        className="w-full h-full object-cover rounded-full"
                    />
                ) : name ? (
                    /* Caso 2: Iniciais do Nome (Fallback se der erro na imagem ou se não houver foto) */
                    <span>{getInitials(name)}</span>
                ) : (
                    /* Caso 3: Ícone SVG Padrão */
                    <svg className="w-1/2 h-1/2 opacity-70" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                )}
            </div>

            {/* Indicador de Status */}
            {status && (
                <span
                    aria-label={`Status: ${status}`}
                    className={`
                        absolute bottom-0 right-0 rounded-full
                        ${STATUS_SIZES[size]} 
                        ${STATUS_COLORS[status]}
                    `}
                />
            )}
        </div>
    );
}