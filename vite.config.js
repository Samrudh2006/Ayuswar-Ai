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

          // 3. Gnani Evon Sovereign Indic Reasoner Status Endpoint
          let evonLastSuccessTime = null;
          server.middlewares.use('/api/evon/status', async (req, res) => {
            if (req.method !== 'GET') {
              res.statusCode = 405;
              return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
            }

            const evonBaseUrl = env.EVON_BASE_URL || process.env.EVON_BASE_URL;
            const evonApiKey = env.EVON_API_KEY || process.env.EVON_API_KEY;
            const modelName = env.EVON_MODEL_NAME || process.env.EVON_MODEL_NAME || 'gnani/gnani-evon-v3.3-30B-A3B';

            res.setHeader('Content-Type', 'application/json');

            if (!evonBaseUrl || !evonApiKey || evonApiKey.includes('placeholder')) {
              res.statusCode = 200;
              return res.end(JSON.stringify({
                status: 'UNAVAILABLE',
                available: false,
                model: modelName,
                latencyMs: null,
                lastSuccessTime: evonLastSuccessTime,
                reason: 'EVON_BASE_URL or EVON_API_KEY unset on server'
              }));
            }

            const startTime = Date.now();
            try {
              const cleanBaseUrl = evonBaseUrl.replace(/\/+$/, '');
              const endpoint = `${cleanBaseUrl}/chat/completions`;

              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 8000);

              const upstreamRes = await fetch(endpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${evonApiKey}`
                },
                body: JSON.stringify({
                  model: modelName,
                  messages: [{ role: 'user', content: 'ping' }],
                  max_tokens: 1,
                  temperature: 0.1
                }),
                signal: controller.signal
              });

              clearTimeout(timeoutId);
              const latencyMs = Date.now() - startTime;

              if (upstreamRes.ok) {
                evonLastSuccessTime = new Date().toISOString();
                res.statusCode = 200;
                return res.end(JSON.stringify({
                  status: 'LIVE',
                  available: true,
                  model: modelName,
                  latencyMs,
                  lastSuccessTime: evonLastSuccessTime
                }));
              } else {
                const errorText = await upstreamRes.text().catch(() => '');
                res.statusCode = 200;
                return res.end(JSON.stringify({
                  status: 'UNAVAILABLE',
                  available: false,
                  model: modelName,
                  latencyMs,
                  lastSuccessTime: evonLastSuccessTime,
                  reason: `Upstream Evon returned HTTP ${upstreamRes.status}: ${errorText.slice(0, 150)}`
                }));
              }
            } catch (err) {
              const latencyMs = Date.now() - startTime;
              res.statusCode = 200;
              return res.end(JSON.stringify({
                status: 'UNAVAILABLE',
                available: false,
                model: modelName,
                latencyMs,
                lastSuccessTime: evonLastSuccessTime,
                reason: err.name === 'AbortError' ? 'Evon status check timed out (>8s)' : `Evon probe error: ${err.message}`
              }));
            }
          });

          // 4. Gnani Evon Sovereign Indic Reasoner Chat Completions Proxy
          server.middlewares.use('/api/evon/chat', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
            }

            const evonBaseUrl = env.EVON_BASE_URL || process.env.EVON_BASE_URL;
            const evonApiKey = env.EVON_API_KEY || process.env.EVON_API_KEY;
            const modelName = env.EVON_MODEL_NAME || process.env.EVON_MODEL_NAME || 'gnani/gnani-evon-v3.3-30B-A3B';

            res.setHeader('Content-Type', 'application/json');

            if (!evonBaseUrl || !evonApiKey || evonApiKey.includes('placeholder')) {
              res.statusCode = 503;
              return res.end(JSON.stringify({
                error: 'Evon unavailable: EVON_BASE_URL and EVON_API_KEY are not configured on the server.',
                available: false,
                fallbackRequired: true,
                model: modelName
              }));
            }

            let bodyStr = '';
            req.on('data', chunk => { bodyStr += chunk; });
            req.on('end', async () => {
              try {
                const body = JSON.parse(bodyStr || '{}');
                let chatMessages = [];
                if (Array.isArray(body.messages) && body.messages.length > 0) {
                  chatMessages = body.messages;
                } else {
                  if (body.systemInstruction) {
                    chatMessages.push({ role: 'system', content: body.systemInstruction });
                  }
                  chatMessages.push({ role: 'user', content: body.prompt || '' });
                }

                const cleanBaseUrl = evonBaseUrl.replace(/\/+$/, '');
                const endpoint = `${cleanBaseUrl}/chat/completions`;

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 20000);

                const upstreamRes = await fetch(endpoint, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${evonApiKey}`
                  },
                  body: JSON.stringify({
                    model: modelName,
                    messages: chatMessages,
                    max_tokens: body.maxTokens || 450,
                    temperature: body.temperature || 0.2
                  }),
                  signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!upstreamRes.ok) {
                  const errorText = await upstreamRes.text().catch(() => '');
                  res.statusCode = upstreamRes.status;
                  return res.end(JSON.stringify({
                    error: `Evon upstream call failed with HTTP ${upstreamRes.status}`,
                    details: errorText.slice(0, 300),
                    available: false,
                    fallbackRequired: true
                  }));
                }

                const data = await upstreamRes.json();
                let replyText = '';
                if (data?.choices?.[0]?.message?.content) {
                  replyText = data.choices[0].message.content;
                } else if (typeof data === 'string') {
                  replyText = data;
                } else {
                  replyText = JSON.stringify(data);
                }

                evonLastSuccessTime = new Date().toISOString();
                res.statusCode = 200;
                return res.end(JSON.stringify({
                  success: true,
                  text: replyText,
                  model: modelName,
                  usage: data.usage || null
                }));
              } catch (err) {
                res.statusCode = 502;
                return res.end(JSON.stringify({
                  error: `Evon proxy dispatch error: ${err.message}`,
                  available: false,
                  fallbackRequired: true
                }));
              }
            });
          });
        }
      }
    ]
  };
});
