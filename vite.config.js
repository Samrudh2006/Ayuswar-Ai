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
          // 0. Gnani Speech Services Status Endpoint
          server.middlewares.use('/api/gnani/status', async (req, res) => {
            if (req.method !== 'GET') {
              res.statusCode = 405;
              return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
            }

            const apiKey = env.GNANI_TTS_KEY || env.GNANI_STT_KEY || env.GNANI_API_KEY || process.env.GNANI_TTS_KEY || process.env.GNANI_STT_KEY || process.env.GNANI_API_KEY;
            res.setHeader('Content-Type', 'application/json');

            if (!apiKey || apiKey.includes('placeholder')) {
              res.statusCode = 200;
              return res.end(JSON.stringify({
                available: false,
                status: 'UNCONFIGURED',
                provider: 'browser_fallback',
                models: {
                  stt: 'Browser Web SpeechRecognition (Client Fallback)',
                  tts: 'Browser Web SpeechSynthesis (Client Fallback)'
                },
                reason: 'GNANI_API_KEY unset on server. Using safe browser speech fallback.'
              }));
            }

            res.statusCode = 200;
            res.end(JSON.stringify({
              available: true,
              status: 'LIVE',
              provider: 'gnani',
              models: {
                stt: 'Gnani Prisma v3 STT',
                tts: 'Gnani Timbre v2.5 / v3.0'
              }
            }));
          });

          // 1. Gnani Timbre TTS Proxy Endpoint
          server.middlewares.use('/api/gnani/tts', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              return res.end('Method Not Allowed');
            }

            const apiKey = env.GNANI_TTS_KEY || env.GNANI_API_KEY || process.env.GNANI_TTS_KEY || process.env.GNANI_API_KEY;
            if (!apiKey || apiKey.includes('placeholder')) {
              res.statusCode = 503;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ 
                error: 'Gnani API key not configured on server', 
                status: 'fallback_to_browser_speech',
                available: false,
                fallbackRequired: true
              }));
            }

            let bodyStr = '';
            req.on('data', chunk => { bodyStr += chunk; });
            req.on('end', async () => {
              try {
                const body = JSON.parse(bodyStr || '{}');
                const ttsEndpoint = env.GNANI_TTS_ENDPOINT || 'https://api.vachana.ai/api/v1/tts/inference';

                const gnaniRes = await fetch(ttsEndpoint, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key-ID': apiKey,
                    'x-api-key': apiKey,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Origin': 'https://vachana.ai',
                    'Referer': 'https://vachana.ai/'
                  },
                  body: JSON.stringify({
                    text: (body.text || '').trim(),
                    voice: body.voice || 'Nalini',
                    model: body.model || 'timbre-v2.5',
                    language: body.language || 'te-IN'
                  })
                });

                if (gnaniRes.ok) {
                  const audioBuffer = await gnaniRes.arrayBuffer();
                  let outBuf = Buffer.from(audioBuffer);
                  if (outBuf.length < 4 || outBuf.toString('ascii', 0, 4) !== 'RIFF') {
                    const sampleRate = 24000;
                    const numChannels = 1;
                    const bitDepth = 16;
                    const byteRate = sampleRate * numChannels * (bitDepth / 8);
                    const blockAlign = numChannels * (bitDepth / 8);
                    const header = Buffer.alloc(44);
                    header.write('RIFF', 0);
                    header.writeUInt32LE(36 + outBuf.length, 4);
                    header.write('WAVE', 8);
                    header.write('fmt ', 12);
                    header.writeUInt32LE(16, 16);
                    header.writeUInt16LE(1, 20);
                    header.writeUInt16LE(numChannels, 22);
                    header.writeUInt32LE(sampleRate, 24);
                    header.writeUInt32LE(byteRate, 28);
                    header.writeUInt16LE(blockAlign, 32);
                    header.writeUInt16LE(bitDepth, 34);
                    header.write('data', 36);
                    header.writeUInt32LE(outBuf.length, 40);
                    outBuf = Buffer.concat([header, outBuf]);
                  }
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'audio/wav');
                  return res.end(outBuf);
                } else {
                  res.statusCode = gnaniRes.status;
                  return res.end(await gnaniRes.text());
                }
              } catch (err) {
                res.statusCode = 502;
                return res.end(JSON.stringify({ error: err.message, fallbackRequired: true }));
              }
            });
          });

          // 2. Gnani Prisma STT Proxy Endpoints
          const handleSttProxy = async (req, res) => {
            const apiKey = env.GNANI_STT_KEY || env.GNANI_API_KEY || process.env.GNANI_STT_KEY || process.env.GNANI_API_KEY;
            if (!apiKey || apiKey.includes('placeholder')) {
              res.statusCode = 503;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ 
                error: 'Gnani API key not configured on server', 
                status: 'fallback_to_browser_speech',
                available: false,
                fallbackRequired: true
              }));
            }

            if (req.method === 'POST') {
              let bodyChunks = [];
              req.on('data', chunk => { bodyChunks.push(chunk); });
              req.on('end', async () => {
                try {
                  const sttEndpoint = env.GNANI_STT_ENDPOINT || env.GNANI_ASR_ENDPOINT || 'https://api.vachana.ai/stt/v3';
                  const buffer = Buffer.concat(bodyChunks);
                  let audioBuffer = buffer;
                  let lang = req.headers['x-language-code'] || 'te-IN';

                  // Handle JSON body if client sent JSON base64
                  if (req.headers['content-type']?.includes('application/json')) {
                    try {
                      const parsed = JSON.parse(buffer.toString('utf8'));
                      if (parsed.audioBase64) {
                        audioBuffer = Buffer.from(parsed.audioBase64, 'base64');
                      }
                      if (parsed.language_code) lang = parsed.language_code;
                    } catch {}
                  }

                  // Ensure valid RIFF WAV container for Gnani STT backend ffmpeg decoder
                  let validWavBuffer = audioBuffer;
                  if (audioBuffer.length < 4 || audioBuffer.toString('ascii', 0, 4) !== 'RIFF') {
                    const header = Buffer.alloc(44);
                    header.write('RIFF', 0);
                    header.writeUInt32LE(36 + audioBuffer.length, 4);
                    header.write('WAVE', 8);
                    header.write('fmt ', 12);
                    header.writeUInt32LE(16, 16);
                    header.writeUInt16LE(1, 20); // PCM
                    header.writeUInt16LE(1, 22); // mono
                    header.writeUInt32LE(16000, 24); // 16kHz
                    header.writeUInt32LE(32000, 28); // byte rate (16000 * 2)
                    header.writeUInt16LE(2, 32); // block align
                    header.writeUInt16LE(16, 34); // 16 bits
                    header.write('data', 36);
                    header.writeUInt32LE(audioBuffer.length, 40);
                    validWavBuffer = Buffer.concat([header, audioBuffer]);
                  }

                  const formData = new FormData();
                  formData.append('audio_file', new Blob([validWavBuffer], { type: 'audio/wav' }), 'audio.wav');
                  formData.append('language_code', lang);

                  const upstream = await fetch(sttEndpoint, {
                    method: 'POST',
                    headers: {
                      'X-API-Key-ID': apiKey,
                      'x-api-key': apiKey,
                      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                      'Origin': 'https://vachana.ai',
                      'Referer': 'https://vachana.ai/'
                    },
                    body: formData
                  });

                  if (upstream.ok) {
                    const data = await upstream.json();
                    const transcript = data.transcript || data.text || data.transcription || (data.result && data.result[0]?.transcript) || '';
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.end(JSON.stringify({
                      transcript: transcript.trim(),
                      provider: 'gnani_stt',
                      raw: data
                    }));
                  } else {
                    res.statusCode = upstream.status;
                    return res.end(await upstream.text());
                  }
                } catch (err) {
                  res.statusCode = 502;
                  return res.end(JSON.stringify({ error: err.message, fallbackRequired: true }));
                }
              });
              return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ status: 'gnani_stt_proxy_active', model: 'Gnani Prisma v3' }));
          };

          server.middlewares.use('/api/gnani/asr', handleSttProxy);
          server.middlewares.use('/api/gnani/stt', handleSttProxy);

          // 3. Gnani Evon Sovereign Indic Reasoner Status Endpoint
          let evonLastSuccessTime = null;
          server.middlewares.use('/api/evon/status', async (req, res) => {
            if (req.method !== 'GET') {
              res.statusCode = 405;
              return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
            }

            // Server environment variables ONLY (headers strictly forbidden)
            const evonBaseUrl = env.EVON_BASE_URL || process.env.EVON_BASE_URL || 'https://router.huggingface.co/v1';
            const evonApiKey = env.EVON_API_KEY || process.env.EVON_API_KEY;
            const modelName = env.EVON_MODEL_NAME || process.env.EVON_MODEL_NAME || 'gnani/gnani-evon-v3.3-30B-A3B';

            res.setHeader('Content-Type', 'application/json');

            if (!evonBaseUrl || !evonApiKey || evonApiKey.includes('placeholder')) {
              res.statusCode = 200;
              return res.end(JSON.stringify({
                status: 'UNCONFIGURED',
                available: false,
                model: modelName,
                latencyMs: null,
                lastSuccessTime: evonLastSuccessTime,
                reason: 'EVON_BASE_URL or EVON_API_KEY unset on server. Using safe rule-based fallback.'
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

            // Server environment variables ONLY (headers strictly forbidden)
            const evonBaseUrl = env.EVON_BASE_URL || process.env.EVON_BASE_URL || 'https://router.huggingface.co/v1';
            const evonApiKey = env.EVON_API_KEY || process.env.EVON_API_KEY;
            const modelName = env.EVON_MODEL_NAME || process.env.EVON_MODEL_NAME || 'gnani/gnani-evon-v3.3-30B-A3B';

            res.setHeader('Content-Type', 'application/json');

            if (!evonBaseUrl || !evonApiKey || evonApiKey.includes('placeholder')) {
              res.statusCode = 200;
              return res.end(JSON.stringify({
                status: 'UNCONFIGURED',
                error: 'Evon unavailable: EVON_BASE_URL and EVON_API_KEY are not configured on the server.',
                available: false,
                fallbackRequired: true,
                isFallback: true,
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

          // 5. Server Triage Boundary Middleware
          server.middlewares.use('/api/triage', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
            }

            let bodyStr = '';
            req.on('data', chunk => { bodyStr += chunk; });
            req.on('end', async () => {
              try {
                const body = JSON.parse(bodyStr || '{}');
                const text = String(body.transcript || '').slice(0, 2000).trim();
                const panic = Math.min(Math.max(0, parseInt(body.acousticPanicIndex, 10) || 70), 100);

                if (!text) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ error: 'Missing transcript' }));
                }

                const hasChestPain = /chest\s*pain|chest\s*discomfort|heart\s*pain|angina|pressure\s*in\s*chest|chhati\s*noppi|gundello\s*noppi|ఛాతీ\s*నొప్పి|గుండెల్లో\s*నొప్పి|ఛాతీలో\s*నొప్పి|గుండె\s*నొప్పి|గుండెలో\s*నొప్పి|ఛాతీ|గుండె|seena|chhati|heart/i.test(text);
                const hasSweating = /sweat|sweating|perspir|cold\s*sweat|diaphoresis|paseena|చెమట|చమట|చెమటలు|చమటలు|చల్లని\s*చెమటలు/i.test(text);
                const hasBreathless = /breath|breathless|breathlessness|shortness\s*of\s*breath|dyspnea|gasping|cant\s*breathe|can't\s*breathe|saans|oopiri|ఆయాసం|శ్వాస|ఊపిరి|దమ్ము|ఊపిరి\s*ఆడటం\s*లేదు/i.test(text);
                const isCardiac = (hasChestPain && (hasSweating || hasBreathless)) || /chhati|chest|seena|heart|gir pade|behosh|unconscious|dhadkan|palpitations|stemi|gundello|గుండె|ఛాతీ/i.test(text);
                const isPediatric = /babu|bachha|child|baby|oopiri|saans|wheez|stridor|chhati lopalki|retraction|pasli chalna|blue lips|neela|ఆయాసం|శ్వాస|పిల్ల/i.test(text);
                const isTrauma = /accident|crash|lorry|car|bike|vandi|blood|khoon|raktham|fracture|haddi|trapped|sir phat|రక్తం|గాయం/i.test(text);

                let level = 'GREEN';
                let severity = 'Routine Outpatient Consultation';
                let suspected = 'Routine Primary Care Query';
                let icd = 'Z00.0';

                if (isCardiac || isPediatric || isTrauma || panic > 75) {
                  level = 'RED';
                  severity = 'Immediate Life Threat (Category 1)';
                  suspected = isCardiac ? 'Acute Coronary Syndrome / Suspected STEMI' : (isPediatric ? 'Pediatric Airway Emergency / Stridor' : 'Emergency Polytrauma / High Distress');
                  icd = isCardiac ? 'I21.9' : (isPediatric ? 'J45.901' : 'T07');
                } else if (/fever|temperature|pain|vomit|headache|weakness|dizzy|nausea|bukhar|dard|बुखार|दर्द|उल्टी|चक्कर|कमजोरी|सिरदर्द|बदन|జ్వరం|నొప్పి/i.test(text) || panic > 45) {
                  level = 'YELLOW';
                  severity = 'Moderate Priority Urgent Care';
                  suspected = 'Acute Medical Condition / Needs Prompt Evaluation';
                  icd = 'R68.89';
                }

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({
                  triageLevel: level,
                  severity,
                  ruleBaselineLevel: level,
                  modelEscalationApplied: false,
                  suspectedCondition: suspected,
                  icd10: icd,
                  executionSource: 'RULES_ONLY',
                  timestamp: new Date().toISOString(),
                  prototypeDisclaimer: 'Prototype safety rules. Not a certified medical device. In emergencies dial 112 / 108.'
                }));
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ error: 'Server triage processing error' }));
              }
            });
          });
        }
      }
    ]
  };
});
