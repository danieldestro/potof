export interface Photo {
  id: string;
  productUrl: string;
  thumbs: {
    p: string;
    m: string;
    g: string;
  };
}

export interface EventSummary {
  id: string;
  name: string;
  city: string;
  state: string;
  location: string;
  date: string | null;
  dateEnd: string | null;
  categoryId: string;
  photosCount: number;
  hasEventPhoto: boolean;
  coverUrl: string;
}

// Data shown in the event page's header card. A full EventSummary (from the
// Home/Eventos listing) satisfies this; the autocomplete suggestion and the
// direct-URL scrape fallback only ever fill part of it.
export interface EventHeaderInfo {
  id: string;
  name: string | null;
  city: string | null;
  state: string | null;
  location: string | null;
  date: string | null;
  photosCount: number | null;
  categoryId: string | null;
}

export interface EventNameSuggestion {
  id: string;
  name: string;
  date: string | null;
  location: string;
  slug: string;
  status: string;
}
