import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

function syncExamPlugin() {
  const sharedExamsMap = new Map<string, any>();

  return {
    name: 'sync-exam-middleware',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url && req.url.startsWith('/api/sync-exam')) {
          const urlObj = new URL(req.url, 'http://localhost:3000');
          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk: any) => { body += chunk; });
            req.on('end', () => {
              try {
                const data = JSON.parse(body);
                if (data && (data.code || data.id)) {
                  if (data.code) sharedExamsMap.set(data.code.toLowerCase().trim(), data);
                  if (data.id) sharedExamsMap.set(data.id.toLowerCase().trim(), data);
                }
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, total: sharedExamsMap.size }));
              } catch (e: any) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: e.message }));
              }
            });
            return;
          }

          if (req.method === 'GET') {
            const code = urlObj.searchParams.get('code') || urlObj.searchParams.get('id');
            res.setHeader('Content-Type', 'application/json');
            if (code) {
              const item = sharedExamsMap.get(code.toLowerCase().trim());
              if (item) {
                res.end(JSON.stringify({ success: true, data: item }));
              } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ success: false, error: 'Exam not found' }));
              }
              return;
            }
            const list = Array.from(sharedExamsMap.values());
            res.end(JSON.stringify({ success: true, data: list }));
            return;
          }
        }
        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), syncExamPlugin()],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
