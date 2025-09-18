import { defineConfig, loadEnv } from 'vite';
import path from 'path';

export default defineConfig(({ mode }: { mode: string }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 5373,
        host: true,
        headers: {
          'Content-Security-Policy': `
            default-src 'self';
            script-src 'self' 'unsafe-inline' 'unsafe-eval' clerk.medigenius.netlify.app;
            connect-src 'self' clerk.medigenius.netlify.app *.clerk.accounts.dev;
            frame-src 'self' clerk.medigenius.netlify.app;
            worker-src 'self' blob: clerk.medigenius.netlify.app;
            child-src 'self' blob: clerk.medigenius.netlify.app;
            img-src 'self' data: https:;
            style-src 'self' 'unsafe-inline';
            font-src 'self' data:;
          `.replace(/\s+/g, ' ').trim()
        }
      },
      define: {
        'process.env.VITE_CLERK_PUBLISHABLE_KEY': JSON.stringify(env.VITE_CLERK_PUBLISHABLE_KEY),
        'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
        'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
        'process.env.VITE_ADMIN_EMAILS': JSON.stringify(env.VITE_ADMIN_EMAILS)
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
