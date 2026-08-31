export type AiProviderId = 'gemini' | 'openrouter'

export type AiProviderConfig = {
  activeProvider: AiProviderId
  geminiApiKey: string
  geminiModel: string
  openrouterApiKey: string
  openrouterModel: string
}

export type AiChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const DEFAULT_GEMINI_MODEL = 'gemini-2.0-flash'
const DEFAULT_OPENROUTER_MODEL = 'google/gemini-2.0-flash-001'

export function getActiveApiKey(config: AiProviderConfig): string {
  return config.activeProvider === 'gemini'
    ? config.geminiApiKey.trim()
    : config.openrouterApiKey.trim()
}

export function getActiveModel(config: AiProviderConfig): string {
  if (config.activeProvider === 'gemini') {
    return config.geminiModel.trim() || DEFAULT_GEMINI_MODEL
  }
  return config.openrouterModel.trim() || DEFAULT_OPENROUTER_MODEL
}

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('AI request timed out. Check your API key/model name and try again.')
    }
    throw error
  } finally {
    window.clearTimeout(timer)
  }
}

function isHighDemandError(message: string): boolean {
  return /high demand|temporarily unavailable|try again later|resource.?exhausted|429|rate.?limit|overloaded|unavailable/i.test(
    message,
  )
}

export async function generateAiText(
  config: AiProviderConfig,
  messages: AiChatMessage[],
): Promise<string> {
  const primaryKey = getActiveApiKey(config)
  if (!primaryKey) {
    throw new Error(
      `Add a ${config.activeProvider === 'gemini' ? 'Gemini' : 'OpenRouter'} API key in Admin → Settings.`,
    )
  }

  const model = getActiveModel(config)
  if (!model) {
    throw new Error('Model name is empty. Set a model in Admin → Settings.')
  }

  try {
    if (config.activeProvider === 'gemini') {
      return await generateWithGemini(primaryKey, model, messages)
    }
    return await generateWithOpenRouter(primaryKey, model, messages)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)

    // Auto-fallback when Gemini is overloaded and OpenRouter is configured
    if (
      config.activeProvider === 'gemini' &&
      isHighDemandError(message) &&
      config.openrouterApiKey.trim()
    ) {
      try {
        return await generateWithOpenRouter(
          config.openrouterApiKey.trim(),
          config.openrouterModel.trim() || 'google/gemini-2.0-flash-001',
          messages,
        )
      } catch (fallbackError) {
        const fallbackMessage =
          fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
        throw new Error(
          `Gemini is busy (high demand). OpenRouter fallback also failed: ${fallbackMessage}`,
        )
      }
    }

    if (isHighDemandError(message)) {
      throw new Error(
        'This AI model is currently overloaded. Wait a minute, switch provider/model in Settings (Gemini ↔ OpenRouter), then try again.',
      )
    }

    throw error instanceof Error ? error : new Error(message)
  }
}

async function generateWithGemini(
  apiKey: string,
  model: string,
  messages: AiChatMessage[],
): Promise<string> {
  const system = messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n\n')
  const contents = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`
  const response = await fetchWithTimeout(
    url,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: system ? { parts: [{ text: system }] } : undefined,
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json',
        },
      }),
    },
    90_000,
  )

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message =
      payload?.error?.message ||
      `Gemini request failed (${response.status})`
    throw new Error(message)
  }

  const text = payload?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text || '')
    .join('')
  if (!text?.trim()) {
    throw new Error('Gemini returned an empty response.')
  }
  return text.trim()
}

async function generateWithOpenRouter(
  apiKey: string,
  model: string,
  messages: AiChatMessage[],
): Promise<string> {
  const response = await fetchWithTimeout(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer':
          typeof window !== 'undefined'
            ? window.location.origin
            : 'https://siddhivinayakoverseas.com',
        'X-Title': 'Siddhivinayak Overseas Blog Writer',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 8192,
        response_format: { type: 'json_object' },
      }),
    },
    90_000,
  )

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message =
      payload?.error?.message ||
      payload?.message ||
      `OpenRouter request failed (${response.status})`
    throw new Error(message)
  }

  const text = payload?.choices?.[0]?.message?.content
  if (!text?.trim()) {
    throw new Error('OpenRouter returned an empty response.')
  }
  return String(text).trim()
}

export const PROVIDER_PRESETS: Record<
  AiProviderId,
  { label: string; models: string[]; docsUrl: string }
> = {
  gemini: {
    label: 'Google Gemini',
    models: ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
    docsUrl: 'https://aistudio.google.com/apikey',
  },
  openrouter: {
    label: 'OpenRouter',
    models: [
      'google/gemini-2.0-flash-001',
      'openai/gpt-4o-mini',
      'anthropic/claude-3.5-sonnet',
      'meta-llama/llama-3.1-70b-instruct',
    ],
    docsUrl: 'https://openrouter.ai/keys',
  },
}
