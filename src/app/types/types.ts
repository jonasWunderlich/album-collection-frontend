
export type Direction = 'asc' | 'desc';
export type SearchBy = 'title' | 'artist' | 'genre' | 'country' | 'city' | 'publisher' | 'releaseYear' | 'rating' | 'addedDate' | 'dateAdded';

export type FilterSettings = {
    search: string;
    sortBy: SearchBy;
    filterBy: string[];
    direction: Direction;
}

export enum SortBy {
    addedDate = 'addedDate',
    title = 'title',
    artist = 'artist',
    genre = 'genre',
    country = 'country',
    city = 'city',
    publisher = 'publisher',
    rating = 'rating',
    releaseYear = 'releaseYear'
}

export enum FilterBy {
    tino = 'tino',
    wire = 'wire',
    fan = 'fan',
    wishlist = 'wishlist',
    favorite = 'favorite',
    owned = 'owned'
}