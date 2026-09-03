import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home.jsx';

export function AppRoutes() {
    return (
        <Routes>
            {/* Rota Principal (Landing Page) */}
            <Route path="/" element={<Home />} />

            {/* Rotas Secundárias */}
            {/* Rotas secundárias ainda não implementadas */}

        </Routes>
    );
}

export default AppRoutes;