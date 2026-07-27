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

export interface EventNameSuggestion {
  id: string;
  name: string;
  date: string | null;
  location: string;
  slug: string;
  status: string;
}
