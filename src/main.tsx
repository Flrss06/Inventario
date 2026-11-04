import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import './index.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>,
);

// Deja ver el logo de carga al menos un instante y luego lo desvanece.
const splash = document.getElementById('splash');
if (splash) {
    setTimeout(() => {
        splash.classList.add('oculto');
        setTimeout(() => splash.remove(), 700);
    }, Math.max(0, 900 - performance.now()));
}
