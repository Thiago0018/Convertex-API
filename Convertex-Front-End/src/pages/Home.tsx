import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { OcrSection } from '../components/sections/OcrSection';

export function Home() {
    return (
        <div className="bg-slate-950 text-slate-100 flex flex-col min-h-screen w-full relative overflow-hidden select-none">

            {/* Esferas de luz no fundo para efeito de iluminação (Glow Effect) */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 -right-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

            <Header />

            {/* Hero Header explicativo */}
            <section className="text-center pt-8 pb-2 px-4 z-10">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-cyan-300 to-indigo-300">
                    Reconhecimento Óptico de Caracteres
                </h1>
                <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
                    Transforme suas imagens em documentos editáveis em segundos de forma simples e rápida.
                </p>
            </section>

            <OcrSection />
            <Footer />
        </div>
    );
}
