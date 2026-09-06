export type Direction = 'asc' | 'desc';

export enum SortOptions {
  addedDate = 'addedDate',
  lastPlayedDate = 'lastPlayedDate',
  title = 'title',
  artist = 'artist',
  genre = 'genre',
  style = 'style',
  country = 'country',
  city = 'city',
  publisher = 'publisher',
  rating = 'rating',
  releaseYear = 'releaseYear',
}

export enum FilterOptions {
  tino = 'tino',
  wire = 'wire',
  fan = 'fan',
  wishlist = 'wishlist',
  favorite = 'favorite',
  owned = 'owned',
}

export interface FilterSettings {
  search: string;
  sortBy: SortOptions;
  filterBy: FilterOptions[];
  direction: Direction;
}
