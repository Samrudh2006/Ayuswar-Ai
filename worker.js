/**
 * AyuSwar AI — Cloudflare Worker Gateway with Free Edge Workers AI
 * 
 * Provides:
 * 1. POST /api/cf-ai/chat: 100% free edge reasoning via @cf/meta/llama-3.1-8b-instruct
 * 2. POST /api/cf-ai/transcribe: 100% free edge audio transcription via @cf/openai/whisper
 * 3. Default: Resilient SPA static asset serving via env.ASSETS
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS Preflight for all API endpoints
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    // 1. Edge AI Reasoning: LLaMA-3.1-8B-Instruct (10,000 free neurons/day)
    if (url.pathname === '/api/cf-ai/chat' && request.method === 'POST') {
      if (!env.AI) {
        return new Response(JSON.stringify({ error: 'Workers AI binding not configured' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }

      try {
        const body = await request.json();
        const messages = body.messages || [
          { role: 'system', content: body.system || 'You are AyuSwar Indic Clinical Voice Assistant. Provide concise, grounded clinical guidance.' },
          { role: 'user', content: body.prompt || '' }
        ];

        const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages,
          max_tokens: body.maxTokens || 450,
          temperature: body.temperature || 0.2
        });

        const reply = aiResponse.response || aiResponse;

        return new Response(JSON.stringify({
          success: true,
          provider: 'cloudflare_workers_ai',
          model: '@cf/meta/llama-3.1-8b-instruct',
          response: reply
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store'
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message || 'Workers AI chat error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    // 2. Edge Speech-to-Text: OpenAI Whisper on Cloudflare Edge GPUs
    if (url.pathname === '/api/cf-ai/transcribe' && request.method === 'POST') {
      if (!env.AI) {
        return new Response(JSON.stringify({ error: 'Workers AI binding not configured' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }

      try {
        const audioBuffer = await request.arrayBuffer();
        if (!audioBuffer || audioBuffer.byteLength === 0) {
          return new Response(JSON.stringify({ error: 'Empty audio payload' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }

        const audioBytes = [...new Uint8Array(audioBuffer)];
        const aiResponse = await env.AI.run('@cf/openai/whisper', {
          audio: audioBytes
        });

        return new Response(JSON.stringify({
          success: true,
          provider: 'cloudflare_workers_ai',
          model: '@cf/openai/whisper',
          text: aiResponse.text || ''
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store'
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message || 'Workers AI transcription error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    // Default: Fallback to static SPA assets in ./dist
    return env.ASSETS.fetch(request);
  }
};
