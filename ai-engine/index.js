import fs from 'node:fs';
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as Sentry from '@sentry/node';

// Initialize Sentry
const sentryDsn = process.env.SENTRY_DSN;
if (sentryDsn && process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: sentryDsn,
    environment: process.env.NODE_ENV || 'production',
    tracesSampleRate: 0.1,
  });
}

const app = express();
app.use(express.json({ limit: '2mb' }));

const readSecret = (name) => {
  const fileVar = process.env[`${name}_FILE`];
  if (fileVar && fs.existsSync(fileVar)) {
    const content = fs.readFileSync(fileVar, 'utf8').trim();
    return content.length > 0 ? content : undefined;
  }
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
};

const apiKey = readSecret('AI_ENGINE_API_KEY');
const geminiKey = readSecret('GEMINI_API_KEY') || readSecret('OPENAI_API_KEY'); // fallback to openai key file

console.log('API Key status:', apiKey ? `Set (${apiKey.length} chars)` : 'Not set - Auth disabled');

let genAI = null;
let model = null;
if (geminiKey) {
  genAI = new GoogleGenerativeAI(geminiKey);
  model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash'
  });
  console.info(`GEMINI_API_KEY loaded (${geminiKey.length} chars)`);
} else {
  console.warn('GEMINI_API_KEY is not set. The engine will return stubbed responses.');
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', engine: 'ai-engine' });
});

app.post('/analyze', async (req, res) => {
  // Authentication required - enforce if API key is set
  if (apiKey && apiKey.length > 0) {
    const headerKey = req.get('x-api-key');
    if (!headerKey || headerKey !== apiKey) {
      console.warn('Unauthorized AI Engine access attempt');
      return res.status(401).json({ error: 'Unauthorized - Invalid or missing API key' });
    }
  } else {
    console.warn('AI Engine running without authentication - NOT RECOMMENDED FOR PRODUCTION');
  }

  const payload = req.body ?? {};
  const runId = `run_${Date.now()}`;

  // If no Gemini, return stub
  if (!model) {
    return res.json({
      id: runId,
      status: 'completed',
      model: 'stub',
      input: payload,
      summary: 'AI engine stub response. Gemini API key not configured.',
    });
  }

  try {
    // Build prompt based on payload type
    let prompt = payload.prompt || 'Analyze this content';
    if (payload.metadata) {
      prompt += `\n\nMetadata: ${JSON.stringify(payload.metadata, null, 2)}`;
    }

    // Add system instruction
    const fullPrompt = `You are an expert business and creative content analyzer. Provide concise, actionable insights.

${prompt}`;

    // Call Gemini
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const analysis = response.text();

    return res.json({
      id: runId,
      status: 'completed',
      model: 'gemini-2.5-flash',
      input: payload,
      summary: analysis,
      usage: {
        prompt_tokens: result.response.usageMetadata?.promptTokenCount || 0,
        completion_tokens: result.response.usageMetadata?.candidatesTokenCount || 0,
        total_tokens: result.response.usageMetadata?.totalTokenCount || 0,
      },
    });
  } catch (error) {
    console.error('Gemini error:', error.message);
    
    // Report to Sentry
    if (sentryDsn) {
      Sentry.captureException(error, {
        contexts: {
          analysis: {
            runId,
            payload: JSON.stringify(payload),
          },
        },
      });
    }
    
    return res.status(500).json({
      id: runId,
      status: 'error',
      error: error.message,
    });
  }
});

const port = Number(process.env.PORT || 8080);
app.listen(port, () => {
  console.info(`AI engine listening on :${port} (mode: ${model ? 'LIVE' : 'STUB'})`);
});
