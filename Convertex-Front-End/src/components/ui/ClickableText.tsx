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

const SIZES: Record<ClickableTextSize, string> = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
};

const VARIANTS: Record<ClickableTextVariant, string> = {
    default: "text-[#749099] hover:text-slate-300",
    primary: "text-blue-400 hover:text-blue-300",
    secondary: "text-slate-400 hover:text-slate-200",
    accent: "text-cyan-400 hover:text-cyan-300",
    danger: "text-red-400 hover:text-red-300"
};

export function ClickableText(props: ClickableTextProps) {
    const {
        children,
        variant = 'primary',
        size = 'md',
        underline = true,
        className = '',
    } = props;

    const baseStyles = `inline-flex items-center gap-1.5 font-medium transition-all duration-200 cursor-pointer select-none active:opacity-70 ${underline ? 'hover:underline underline-offset-4' : ''
        }`;

    const combinedClasses = `${baseStyles} ${SIZES[size]} ${VARIANTS[variant]} ${className}`;

    // 1. Rota de Renderização como Link (<a>)
    if ('href' in props && props.href) {
        const {
            href,
            variant: _v,
            size: _s,
            underline: _u,
            className: _c,
            ...anchorProps
        } = props;

        return (
            <a
                href={href}
                className={combinedClasses}
                {...anchorProps}
            >
                {children}
            </a>
        );
    }

    // 2. Rota de Renderização como Botão (<button>)
    const {
        type = 'button',
        variant: _v,
        size: _s,
        underline: _u,
        className: _c,
        ...buttonProps
    } = props as ClickableTextAsButton;

    return (
        <button
            type={type as ComponentPropsWithoutRef<'button'>['type']}
            className={combinedClasses}
            {...buttonProps}
        >
            {children}
        </button>
    );
};