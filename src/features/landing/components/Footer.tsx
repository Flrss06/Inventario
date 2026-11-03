export function Footer() {
    return (
        <footer className="mt-12 border-t border-slate-200 bg-white py-8 text-center text-sm text-muted">
            <p>&copy; {new Date().getFullYear()} Ecostock. Todos los derechos reservados.</p>
            <p className="mt-1">
                Diseñado por <strong>Chris Flores</strong>
            </p>
        </footer>
    );
}
