import * as cheerio from 'cheerio';
import type { FastifyBaseLogger } from 'fastify';

export interface Photo {
  id: string;
  productUrl: string;
  thumbs: {
    p: string;
    m: string;
    g: string;
  };
}

// Confirmed against the real CDN: only the exact URL scraped from img[src] (the "_g" file)
// exists — "_m"/"_p" siblings return S3 AccessDenied (they were never a real convention).
// Every thumb size points at the same file until fotop.com.br actually serves smaller ones.
function deriveSizeVariants(url: string): Photo['thumbs'] {
  return { g: url, m: url, p: url };
}

// Real grid markup (confirmed against a populated /busca/evento/{id}/rc/{n} response): each
// card is a `.foto-selecionar[data-id]` — but that same class is also used for video cards
// (marked with data-tipo="video"), which wrap their thumbnail in a bare <img> instead of
// <span class="fotoCorredor"><img class="fotoDarkBlur" .../></span>. The product link isn't
// on the thumbnail — it's the href of the sibling `button.foto-detalhes`.
export function parsePhotoGrid(html: string, logger?: FastifyBaseLogger): Photo[] {
  const $ = cheerio.load(html);
  const photos: Photo[] = [];

  const items = $('.foto-selecionar[data-id]');

  items.each((_, el) => {
    const id = $(el).attr('data-id');
    if (!id) return;

    const src = $(el).find('span.fotoCorredor img').first().attr('src');
    if (!src) return; // video card (or unrecognized markup) — not a photo, skip silently

    const productUrl = $(el).find('button.foto-detalhes[href]').first().attr('href') ?? '';

    photos.push({
      id,
      productUrl,
      thumbs: deriveSizeVariants(src),
    });
  });

  if (items.length === 0) {
    logger?.warn(
      { htmlLength: html.length, htmlPreview: html.slice(0, 500) },
      'photoParser: no .foto-selecionar[data-id] elements found in the page — selector may not match the real markup'
    );
  } else if (photos.length === 0) {
    logger?.info({ itemsFound: items.length }, 'photoParser: all .foto-selecionar cards on this page were videos, no photos');
  }

  return photos;
}

// When fotop.com.br finds no face match it renders #resultado with an .alert_box.error
// message instead of any .foto-item markup — surface that text so the user (and our logs)
// get fotop's own explanation instead of a bare empty list.
export function parseNoResultsMessage(html: string): string | null {
  const $ = cheerio.load(html);
  const text = $('#resultado .alert_box.error').first().text().trim();
  return text || null;
}

// The event's display name lives in h1.nome-evento-interna > a on fotos/eventos?evento={id}
// (e.g. "Fotos Treino USP - 27.06.26 - Vários Fotógrafos"), not in <title> (which is prefixed
// with "Fotop - " and awkward to split reliably). The "Fotos "/"Photos " lead-in is part of
// fotop's own page copy, not the event's actual name, so it's stripped here.
export function parseEventName(html: string): string | null {
  const $ = cheerio.load(html);
  const text = $('h1.nome-evento-interna a').first().text().trim();
  if (!text) return null;
  return text.replace(/^(Fotos|Photos)\s+/i, '').trim();
}

export interface EventLocalData {
  city: string | null;
  state: string | null;
  date: string | null;
  photosCount: number | null;
}

// Same page's .data-local-evento-interna carries weekday/date, "City, ST" and photo/video
// counts as plain text next to icons (e.g. "sexta-feira - 31.07.26", "Recife, PE",
// "26.062 fotos    189 vídeos"). Used as a fallback when a user opens /evento/:id directly
// instead of clicking through from the app's own event listing, which already has this data.
export function parseEventLocalData(html: string): EventLocalData {
  const $ = cheerio.load(html);
  const root = $('.data-local-evento-interna').first();

  const dateText = root.find('.data-evento p').first().text().trim();
  const dateMatch = dateText.match(/(\d{2})\.(\d{2})\.(\d{2})\b/);
  const date = dateMatch ? `20${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}` : null;

  const localText = root.find('.local-evento p').first().text().trim();
  const [cityPart, statePart] = localText.split(',').map((s) => s.trim());

  const itensText = root.find('.itens-evento p').first().text();
  const photosMatch = itensText.match(/([\d.,]+)\s*fotos/i);
  const photosCount = photosMatch ? Number.parseInt(photosMatch[1].replace(/[.,]/g, ''), 10) : null;

  return {
    city: cityPart || null,
    state: statePart || null,
    date,
    photosCount: photosCount !== null && Number.isNaN(photosCount) ? null : photosCount,
  };
}
