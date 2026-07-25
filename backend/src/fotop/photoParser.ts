import * as cheerio from 'cheerio';

export interface Photo {
  id: string;
  productUrl: string;
  thumbs: {
    p: string;
    m: string;
    g: string;
  };
}

// Photo URLs follow {arquivo}_{fotoId}_{eventoId}_g.jpg, with _m/_p siblings for smaller sizes.
function deriveSizeVariants(url: string): Photo['thumbs'] {
  return {
    g: url,
    m: url.replace(/_g(\.[a-zA-Z0-9]+)$/, '_m$1'),
    p: url.replace(/_g(\.[a-zA-Z0-9]+)$/, '_p$1'),
  };
}

export function parsePhotoGrid(html: string): Photo[] {
  const $ = cheerio.load(html);
  const photos: Photo[] = [];

  $('.foto-item[data-id]').each((_, el) => {
    const id = $(el).attr('data-id');
    if (!id) return;

    const anchor = $(el).find('a.fotoCorredor').first();
    const src = anchor.find('img').first().attr('src');
    if (!src) return;

    photos.push({
      id,
      productUrl: anchor.attr('href') ?? '',
      thumbs: deriveSizeVariants(src),
    });
  });

  return photos;
}
