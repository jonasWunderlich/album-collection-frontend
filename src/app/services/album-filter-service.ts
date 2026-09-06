import { computed, inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumFilter, SortOptions } from '../components/types';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class AlbumFilterService {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

// 1. queryParams statt paramMap nutzen (inkl. snapshot für initialen Wert)
  private readonly queryParamsSignal = toSignal(this.route.queryParams, {
    initialValue: this.route.snapshot.queryParams,
  });

  // 2. Parsen direkt aus dem QueryParams-Objekt
  public readonly filterParams = computed(() =>
    this.parseParams(this.queryParamsSignal() ?? {})
  );

  removeFilter(key: keyof AlbumFilter): void {
    this.updateFilters({ [key]: undefined });
  }

  resetAllFilters(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });
  }

  updateFilters(newFilters: Partial<AlbumFilter>): void {
    
    const currentFilters = this.filterParams();

    if (newFilters.sortBy) {
      const isSameSort = currentFilters.sortBy === newFilters.sortBy;
      const isAsc = currentFilters.sortDir === 'asc';

      if (isSameSort) {
        newFilters.sortDir = isAsc ? 'desc' : 'asc';
      } else {
        if (newFilters.sortBy === SortOptions.artist) {
          newFilters.sortDir = 'asc';
        } else {
          newFilters.sortDir = 'desc';
        }
      }
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: newFilters,
      queryParamsHandling: 'merge', // Behält bestehende Params bei
      replaceUrl: false, // Setzt Navigation-History-Eintrag (Browser Back button funktioniert)
    });
  }

    replaceFilters(newFilters: Partial<AlbumFilter>): void {
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: newFilters,
      queryParamsHandling: 'replace', // Behält bestehende Params bei
      replaceUrl: false, // Setzt Navigation-History-Eintrag (Browser Back button funktioniert)
    });
  }

  private parseParams(params: Record<string, any>): AlbumFilter {
    return {
      sortBy: params['sortBy'] || 'rating',
      sortDir: params['sortDir'] || undefined,
      search: params['search'] || null,
      releaseYear: params['releaseYear'] ? Number(params['releaseYear']) : undefined,
      decade: params['decade'] ? Number(params['decade']) : undefined,
      albumArtist: params['albumArtist'] || undefined,
      publisher: params['publisher'] || undefined,
      genre: params['genre'] || undefined,
      style: params['style'] || undefined,
      city: params['city'] || undefined,
      country: params['country'] || undefined,
      owned: params['owned'] === 'true',
      favorite: params['favorite'] === 'true',
      tino: params['tino'] === 'true',
      wire: params['wire'] === 'true',
      wishlist: params['wishlist'] === 'true',
      ratingMin: params['minRating'] ? Number(params['minRating']) : undefined,
    };
  }
}
