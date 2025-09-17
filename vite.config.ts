import { defineConfig, loadEnv } from 'vite';
import path from 'path';

export default defineConfig(({ mode }: { mode: string }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 5373,
        host: true
      },
      define: {
        'process.env.VITE_CLERK_PUBLISHABLE_KEY': JSON.stringify(env.VITE_CLERK_PUBLISHABLE_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      // Ensure proper handling of environment variables in production
      envPrefix: ['VITE_', 'GEMINI_API_KEY']
    };
});
