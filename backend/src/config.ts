export type AiProvider = 'openai' | 'gemini';

export const config = {
  aiPhotoEditEnabled: process.env.FEATURE_AI_PHOTO_EDIT === 'true',
  aiProvider: (process.env.AI_PROVIDER === 'gemini' ? 'gemini' : 'openai') as AiProvider,
  openaiApiKey: process.env.OPENAI_API_KEY,
  geminiApiKey: process.env.GEMINI_API_KEY,
};
