import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { OcrSection } from '../components/sections/OcrSection';

export function Home() {
    return (
        /* min-h-screen garante que a página ocupe toda a altura da tela */
        <div className="bg-[#363e47] flex flex-col min-h-screen w-full">
            <Header />
            <OcrSection />
            <Footer />
        </div>
    );
}
