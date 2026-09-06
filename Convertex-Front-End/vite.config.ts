import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tailwindcssVite from '@tailwindcss/vite';

export default defineConfig({
    plugins: [react(), tailwindcssVite()],
});