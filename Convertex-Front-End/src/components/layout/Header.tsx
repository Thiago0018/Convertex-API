import { ClickableText } from '../ui/ClickableText';
import { Avatar } from '../ui/Avatar';
import { DynamicLinkText } from '../ui/DynamicLinkText';
import { useState } from 'react';

export function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="Header shrink-0">
            <div className="flex min-h-20 w-full flex-col items-stretch justify-between bg-[#242d3e] sm:flex-row">

                {/* Linha do Logo + Botão Hambúrguer */}
                <div className="bg-[#242d3e] flex w-full justify-between items-center p-5 text-white sm:ml-5 sm:p-7" >
                    <DynamicLinkText to="/" variant="secondary" as="h1">
                        CONVERTEX
                    </DynamicLinkText>

                    {/* BOTÃO HAMBÚRGUER: block (mostra no celular) | sm:hidden (some no computador) */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="block sm:hidden p-2 text-white hover:text-gray-300 focus:outline-none"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* LINKS DO MENU */}
                {/* Mudança principal: condicional `${isOpen ? 'flex' : 'hidden'}` para o celular, e `sm:flex` para o computador */}
                <div className={`${isOpen ? 'flex' : 'hidden'} sm:flex w-full flex-col sm:flex-row items-end sm:items-center justify-start gap-3 bg-[#242d3e] p-4 text-white sm:w-auto sm:justify-end sm:gap-5 sm:p-5 whitespace-nowrap`} >
                    <ClickableText href="/" variant="default">feedback</ClickableText>
                    <ClickableText href="/" variant="default">info Projeto</ClickableText>
                    <ClickableText href="/" variant="default">tutorial</ClickableText>
                </div>

            </div>
        </header >
    );
}
