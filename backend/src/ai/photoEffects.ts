import OpenAI, { toFile } from 'openai';
import { GoogleGenAI, Modality } from '@google/genai';
import type { FastifyBaseLogger } from 'fastify';
import { config } from '../config';
import effectPrompts from './prompts.json';

export type AiEffect = 'remove_people' | 'superhero' | 'military' | 'artistic' | 'fantasy';

export const AI_EFFECTS: AiEffect[] = ['remove_people', 'superhero', 'military', 'artistic', 'fantasy'];

// Prompts fixos por efeito, mantidos em prompts.json (não neste arquivo) para poderem
// ser editados sem mexer em TypeScript — pedem explicitamente para preservar o que não
// é alvo do efeito (cenário, rosto), já que tanto o gpt-image-1 quanto o Gemini tendem a
// "reimaginar" demais a foto inteira se o prompt não for restritivo.
const EFFECT_PROMPTS: Record<AiEffect, string> = effectPrompts;

export class AiNotConfiguredError extends Error {
  constructor(provider: string) {
    super(`Provedor de IA "${provider}" não está configurado (chave de API ausente).`);
    this.name = 'AiNotConfiguredError';
  }
}

export interface GeneratedImage {
  mimeType: string;
  base64: string;
}

async function generateWithOpenAi(
  imageBuffer: Buffer,
  mimeType: string,
  effect: AiEffect,
  logger: FastifyBaseLogger
): Promise<GeneratedImage> {
  if (!config.openaiApiKey) throw new AiNotConfiguredError('openai');

  const client = new OpenAI({ apiKey: config.openaiApiKey });
  const file = await toFile(imageBuffer, 'photo.jpg', { type: mimeType });

  logger.info({ effect, provider: 'openai' }, 'ai: requesting image edit from OpenAI');
  const response = await client.images.edit({
    model: 'gpt-image-2',
    image: file,
    prompt: EFFECT_PROMPTS[effect],
  });

  const b64 = response.data?.[0]?.b64_json;
  if (!b64) throw new Error('OpenAI não retornou uma imagem gerada.');

  return { mimeType: 'image/png', base64: b64 };
}

async function generateWithGemini(
  imageBuffer: Buffer,
  mimeType: string,
  effect: AiEffect,
  logger: FastifyBaseLogger
): Promise<GeneratedImage> {
  if (!config.geminiApiKey) throw new AiNotConfiguredError('gemini');

  const client = new GoogleGenAI({ apiKey: config.geminiApiKey });

  logger.info({ effect, provider: 'gemini' }, 'ai: requesting image edit from Gemini');
  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: [
      {
        role: 'user',
        parts: [{ inlineData: { mimeType, data: imageBuffer.toString('base64') } }, { text: EFFECT_PROMPTS[effect] }],
      },
    ],
    config: { responseModalities: [Modality.IMAGE] },
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((part) => part.inlineData?.data);
  if (!imagePart?.inlineData?.data) throw new Error('Gemini não retornou uma imagem gerada.');

  return { mimeType: imagePart.inlineData.mimeType ?? 'image/png', base64: imagePart.inlineData.data };
}

export async function generatePhotoEffect(
  imageBuffer: Buffer,
  mimeType: string,
  effect: AiEffect,
  logger: FastifyBaseLogger
): Promise<GeneratedImage> {
  return config.aiProvider === 'gemini'
    ? generateWithGemini(imageBuffer, mimeType, effect, logger)
    : generateWithOpenAi(imageBuffer, mimeType, effect, logger);
}
