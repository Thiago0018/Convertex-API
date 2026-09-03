import { AppRoutes } from './routes/AppRoutes';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

function App() {
    return (
        <BrowserRouter>
            <div className="flex min-h-dvh flex-col bg-[#1f232a] text-slate-100">
                <Header />
                <main className="flex min-h-0 flex-1 flex-col">
                    <AppRoutes />
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    )
}

export default App
