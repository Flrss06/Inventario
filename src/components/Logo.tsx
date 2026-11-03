import { Link } from 'react-router-dom';

export function Logo({ className = 'text-accent' }: { className?: string }) {
    return (
        <Link to="/" className={`flex items-center gap-2 text-2xl font-extrabold ${className}`}>
            <i className="bi bi-box-seam-fill" /> Ecostock
        </Link>
    );
}
