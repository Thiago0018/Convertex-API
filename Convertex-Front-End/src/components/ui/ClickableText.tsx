import { ComponentPropsWithoutRef, ReactNode } from 'react';

export type ClickableTextSize = 'sm' | 'md' | 'lg';
export type ClickableTextVariant = 'default' | 'primary' | 'secondary' | 'accent' | 'danger';

interface BaseClickableTextProps {
    children?: ReactNode;
    variant?: ClickableTextVariant;
    size?: ClickableTextSize;
    underline?: boolean;
    className?: string;
}

type ClickableTextAsAnchor = BaseClickableTextProps &
    ComponentPropsWithoutRef<'a'> & {
        href: string;
    };

type ClickableTextAsButton = BaseClickableTextProps &
    ComponentPropsWithoutRef<'button'> & {
        href?: never;
    };

export type ClickableTextProps = ClickableTextAsAnchor | ClickableTextAsButton;

export function ClickableText(props: ClickableTextProps) {
    const {
        children,
        variant = 'primary',
        size = 'md',
        underline = true,
        className = '',
    } = props;

    // Styles base para o texto ser interativo e responsivo
    const baseStyles = `inline-flex items-center gap-1.5 font-medium transition-all duration-200 cursor-pointer select-none active:opacity-70 ${underline ? 'hover:underline underline-offset-4' : ''
        }`;

    // Tamanhos fortemente tipados
    const sizes: Record<ClickableTextSize, string> = {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base"
    };

    // Variações de cores fortemente tipadas
    const variants: Record<ClickableTextVariant, string> = {
        default: "text-[#749099] hover:text-slate-300",
        primary: "text-blue-400 hover:text-blue-300",
        secondary: "text-slate-400 hover:text-slate-200",
        accent: "text-cyan-400 hover:text-cyan-300",
        danger: "text-red-400 hover:text-red-300"
    };

    const combinedClasses = `${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`;

    // 1. Se possuir 'href', o TypeScript entende que é o tipo ClickableTextAsAnchor
    if ('href' in props && props.href) {
        const { href, onClick, ...anchorProps } = props as ClickableTextAsAnchor;
        return (
            <a
                href={href}
                onClick={onClick}
                className={combinedClasses}
                {...anchorProps}
            >
                {children}
            </a>
        );
    }

    // 2. Se não possuir 'href', o TypeScript trata estritamente como ClickableTextAsButton
    const { onClick, type = 'button', ...buttonProps } = props as ClickableTextAsButton;
    return (
        <button
            type={type}
            onClick={onClick}
            className={combinedClasses}
            {...buttonProps}
        >
            {children}
        </button>
    );
}