import { AppRoutes } from './routes/AppRoutes';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <AppRoutes />
            </div>
        </BrowserRouter>
    )
}

export default App


