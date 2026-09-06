// src/components/ui/RoundedButton.jsx

import { ComponentPropsWithoutRef, ReactNode } from 'react';

// 1. Tipos de Union para as opções pré-definidas
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'gradient';
export type ButtonSize = 'sm' | 'md' | 'lg';

// 2. Interface de Props estendendo os atributos padrões do botão HTML
export interface RoundedButtonProps extends ComponentPropsWithoutRef<'button'> {
    children?: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
}

export function RoundedButton({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}: RoundedButtonProps) {
    // 1. Classe base do botão
    const baseStyles = "rounded-full font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

    // 2. Dicionário fortemente tipado para os tamanhos
    const sizes: Record<ButtonSize, string> = {
        sm: "px-4 py-1.5 text-xs",
        md: "px-6 py-2.5 text-sm",
        lg: "px-8 py-3.5 text-base"
    };

    // 3. Dicionário fortemente tipado para as variantes visuais
    const variants: Record<ButtonVariant, string> = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40",
        secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700",
        outline: "bg-transparent border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10",
        gradient: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25"
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}