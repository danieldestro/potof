import type { Photo } from '../types';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: 'include',
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body && typeof body.error === 'string' ? body.error : `Erro na requisição ${path}: ${res.status}`;
    console.error(`[api] ${path} failed with ${res.status}`, body);
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export function fetchEventInfo(eventId: string): Promise<{ eventId: string; name: string | null }> {
  return request(`/api/eventos/${eventId}`);
}

export function sendSelfie(eventId: string, file: File): Promise<{ success: boolean; error?: string }> {
  const formData = new FormData();
  formData.append('selfie', file);
  return request(`/api/eventos/${eventId}/selfie`, {
    method: 'POST',
    body: formData,
  });
}

export function fetchEventPhotos(
  eventId: string
): Promise<{ eventId: string; total: number; photos: Photo[]; message?: string }> {
  return request(`/api/eventos/${eventId}/fotos`);
}
