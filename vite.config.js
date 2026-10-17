import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'gnani-proxy-middleware',
        configureServer(server) {
          // 1. Gnani TTS Proxy Endpoint
          server.middlewares.use('/api/gnani/tts', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              return res.end('Method Not Allowed');
            }

            const apiKey = env.GNANI_API_KEY || process.env.GNANI_API_KEY;
            const token = env.GNANI_TOKEN || process.env.GNANI_TOKEN;

            if (!apiKey || apiKey.includes('placeholder')) {
              res.statusCode = 503;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ 
                error: 'Gnani API key not configured', 
                status: 'fallback_to_browser_speech' 
              }));
            }

            let bodyStr = '';
            req.on('data', chunk => { bodyStr += chunk; });
            req.on('end', async () => {
              try {
                const body = JSON.parse(bodyStr || '{}');
                const ttsEndpoint = env.GNANI_TTS_ENDPOINT || 'https://api.gnani.ai/v2/tts';

                const gnaniRes = await fetch(ttsEndpoint, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token || apiKey}`,
                    'x-api-key': apiKey
                  },
                  body: JSON.stringify({
                    text: body.text,
                    language: body.language || 'te-IN',
                    voice: body.voice || 'female'
                  })
                });

                if (gnaniRes.ok) {
                  const audioBuffer = await gnaniRes.arrayBuffer();
                  res.statusCode = 200;
                  res.setHeader('Content-Type', gnaniRes.headers.get('content-type') || 'audio/wav');
                  return res.end(Buffer.from(audioBuffer));
                } else {
                  res.statusCode = gnaniRes.status;
                  return res.end(await gnaniRes.text());
                }
              } catch (err) {
                res.statusCode = 502;
                return res.end(JSON.stringify({ error: err.message }));
              }
            });
          });

          // 2. Gnani ASR Proxy Endpoint
          server.middlewares.use('/api/gnani/asr', async (req, res) => {
            const apiKey = env.GNANI_API_KEY || process.env.GNANI_API_KEY;
            if (!apiKey || apiKey.includes('placeholder')) {
              res.statusCode = 503;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ 
                error: 'Gnani API key not configured', 
                status: 'fallback_to_browser_speech' 
              }));
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ status: 'gnani_asr_proxy_active' }));
          });
        }
      }
    ]
  };
});
