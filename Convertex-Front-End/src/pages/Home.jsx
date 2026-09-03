import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { FormatOption } from "../components/sections/FormatOption";
import { ImageSelectorButton } from "../components/ui/ImageSelectorButton";

export function Home() {
    return (
        // 1. Grid com 3 linhas: Header (auto), Meio (1fr = o que sobrar), Footer (auto)
        <div className="grid h-dvh w-full grid-rows-[auto_1fr_auto] bg-amber-950 overflow-hidden">

            {/* Linha 1: Se adapta dinamicamente sem afetar o resto */}
            <Header />

            {/* Linha 2: O <main> vira um "aquário" com tamanho fixo inviolável.
                Nada aqui dentro consegue esticar o Header ou o Footer. */}
            <main className="w-full h-full flex flex-col md:flex-row p-4 gap-4 overflow-hidden">

                {/* Div Esquerda: Agora você manipula ela com total independência! */}
                <div className="bg-amber-500 h-full w-full md:w-[75%] flex items-center justify-center rounded-lg">
                    <FormatOption />
                </div>

                {/* Div Direita: Largura e altura totalmente fixas e controladas por você */}
                <div className="bg-amber-600 h-full w-[30%] flex items-center justify-center rounded-lg shrink-0">
                    <ImageSelectorButton />
                </div>
                <div className="bg-amber-500 h-full w-full md:w-[75%] flex items-center justify-center rounded-lg">

                </div>

            </main>

            {/* Linha 3: Se adapta dinamicamente na base da tela */}
            <Footer />

        </div>
    );
}
