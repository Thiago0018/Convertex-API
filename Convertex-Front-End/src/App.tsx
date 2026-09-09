import { AppRoutes } from './routes/AppRoutes';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                {/* Configuração global das notificações toast */}
                <Toaster
                    position="bottom-center"
                    toastOptions={{
                        duration: 3500,
                        style: {
                            background: '#1e293b',
                            color: '#f8fafc',
                            border: '1px solid #334155',
                            borderRadius: '0.75rem',
                            fontSize: '0.875rem',
                        },
                        success: {
                            iconTheme: {
                                primary: '#10b981',
                                secondary: '#1e293b',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#f43f5e',
                                secondary: '#1e293b',
                            },
                        },
                    }}
                />
                <AppRoutes />
            </div>
        </BrowserRouter>
    );
}

export default App;


