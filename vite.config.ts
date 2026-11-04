import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { iaPlugin } from './server/ia/plugin';

export default defineConfig(({ mode }) => {
    // La clave de Claude va en .env.local (no se sube a git) y solo la usa el servidor.
    const env = loadEnv(mode, process.cwd(), '');
    if (env.ANTHROPIC_API_KEY) process.env.ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY;

    return {
        plugins: [react(), tailwindcss(), iaPlugin()],
        resolve: {
            alias: { '@': path.resolve(import.meta.dirname, 'src') },
        },
    };
});
