import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LandingPage } from '@/features/landing/LandingPage';
import { LoginPage } from '@/features/auth/LoginPage';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';

export function App() {
    // Transición suave al cambiar de pantalla (el panel anima sus propias páginas).
    const pantalla = useLocation().pathname.split('/')[1];

    return (
        <div key={pantalla} className="animate-aparecer">
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/registro" element={<RegisterPage />} />
                <Route path="/panel/*" element={<DashboardPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}
