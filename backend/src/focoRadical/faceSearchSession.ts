// Caches the image_id returned by POST /competition/upload-selfie (see focoRadicalClient.uploadSelfie)
// keyed by (potofSessionId, competitionId), so the later, separate fetchPhotos call — which the
// ProviderAdapter interface gives no file/image_id to — can retrieve it. Same
// TTL-map-with-sweep shape as fotop/cookieSession.ts. TTL is intentionally shorter: the site's
// own selfie_expired flag (surfaced by searchByFace) implies foco radical doesn't expect an
// image_id to stay valid for long.
interface Entry {
  imageId: string;
  storedAt: number;
}

const TTL_MS = 30 * 60 * 1000;

const store = new Map<string, Entry>();

function key(potofSessionId: string, competitionId: string): string {
  return `${potofSessionId}:${competitionId}`;
}

export function setImageId(potofSessionId: string, competitionId: string, imageId: string): void {
  store.set(key(potofSessionId, competitionId), { imageId, storedAt: Date.now() });
}

export function getImageId(potofSessionId: string, competitionId: string): string | null {
  const k = key(potofSessionId, competitionId);
  const entry = store.get(k);
  if (!entry) return null;

  if (Date.now() - entry.storedAt > TTL_MS) {
    store.delete(k);
    return null;
  }

  return entry.imageId;
}

function sweepExpired(): void {
  const now = Date.now();
  for (const [k, entry] of store) {
    if (now - entry.storedAt > TTL_MS) store.delete(k);
  }
}

setInterval(sweepExpired, TTL_MS).unref();
