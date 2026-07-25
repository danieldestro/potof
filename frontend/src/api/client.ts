import type { Photo } from '../types';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: 'include',
    ...options,
  });
  if (!res.ok) {
    throw new Error(`Erro na requisição ${path}: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function sendSelfie(eventId: string, file: File): Promise<{ success: boolean }> {
  const formData = new FormData();
  formData.append('selfie', file);
  return request(`/api/eventos/${eventId}/selfie`, {
    method: 'POST',
    body: formData,
  });
}

export function fetchEventPhotos(
  eventId: string
): Promise<{ eventId: string; total: number; photos: Photo[] }> {
  return request(`/api/eventos/${eventId}/fotos`);
}
