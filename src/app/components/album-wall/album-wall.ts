import {
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Album, AlbumControllerService } from '../../../../api';
import { Nav } from '../../nav/nav';
import { AlbumTile } from '../album-tile/album-tile';
import { ControlsRow } from '../controls-row/controls-row';
import { FilterOptions, FilterSettings, SortOptions } from '../types';

@Component({
  selector: 'app-album-wall',
  imports: [AlbumTile, ControlsRow, Nav],
  templateUrl: './album-wall.html',
  styleUrl: './album-wall.scss',
})
export class AlbumWall {
  private readonly route = inject(ActivatedRoute);
  private readonly albumService = inject(AlbumControllerService);
  private readonly destroyRef = inject(DestroyRef);
  readonly scrollAnchor = viewChild<ElementRef<HTMLDivElement>>('scrollAnchor');
  private activeYear?: number;
  private activeDecade?: number;
  private owned?: boolean;
  private favorite?: boolean;
  private observer?: IntersectionObserver;

  readonly filterSettings = signal<FilterSettings>({
    search: '',
    sortBy: SortOptions.rating,
    filterBy: [],
    direction: 'desc',
  });
  readonly albums = signal<Album[]>([]);
  readonly page = signal<number>(0);
  readonly isLoading = signal<boolean>(false);
  readonly isLastPage = signal<boolean>(false);
  readonly size = 30;

  constructor() {
    // Route-Params sauber und sicher abonnieren (Triggert NUR bei ECHTEM URL-Wechsel)
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const yearParam = params.get('releaseYear');
      const decadeParam = params.get('decade');
      this.owned = params.get('owned') === 'true' ? true : undefined;
      this.favorite = params.get('favorite') === 'true' ? true : undefined;
      this.activeYear = yearParam ? parseInt(yearParam, 10) : undefined;
      if (this.activeYear === 2026) {
        this.updateFilter({
          sortBy: SortOptions.addedDate,
        });
      } else {
        this.updateFilter({
          sortBy: SortOptions.rating,
        });
      }
      this.activeDecade = decadeParam ? parseInt(decadeParam, 10) : undefined;
      this.resetAndFetch();
    });

    // IntersectionObserver an das Anker Element binden (Keine Signal-Schleifen!)
    effect(() => {
      const anchorEl = this.scrollAnchor()?.nativeElement;
      if (anchorEl) {
        this.setupIntersectionObserver(anchorEl);
      }
    });
  }

  private resetAndFetch() {
    this.page.set(0);
    this.isLastPage.set(false);
    this.albums.set([]);
    this.fetchAlbums();
  }

  fetchAlbums() {
    if (this.isLoading() || this.isLastPage()) return;

    this.isLoading.set(true);

    const currentFilter = this.filterSettings();

    this.albumService
      .getAlbums({
        page: this.page(),
        size: this.size,
        sortBy: currentFilter.sortBy,
        direction: currentFilter.direction,
        filterSettings: {
          search: currentFilter.search,
          releaseYear: this.activeYear,
          decade: this.activeDecade,
          albumArtist: undefined,
          genre: undefined,
          style: undefined,
          favorite: this.favorite,
          owned: this.owned,
          fan: this.isFiltered(FilterOptions.fan),
          tino: this.isFiltered(FilterOptions.tino),
          wire: this.isFiltered(FilterOptions.wire),
        },
      })
      .subscribe({
        next: pageAlbum => {
          const newContent = pageAlbum.content || [];

          this.albums.update(prev => [...prev, ...newContent]);
          this.isLastPage.set(pageAlbum.last ?? newContent.length < this.size);
          this.page.update(p => p + 1);
          this.isLoading.set(false);
        },
        error: err => {
          console.error('Error fetching albums:', err);
          this.isLoading.set(false);
        },
      });
  }

  private setupIntersectionObserver(element: HTMLElement) {
    this.observer?.disconnect();

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !this.isLoading() && !this.isLastPage()) {
          this.fetchAlbums();
        }
      },
      {
        rootMargin: '500px 0px',
      },
    );

    this.observer.observe(element);

    this.destroyRef.onDestroy(() => {
      this.observer?.disconnect();
    });
  }

  updateFilter(value: Partial<FilterSettings>) {
    this.filterSettings.set({
      ...this.filterSettings(),
      ...value,
    });
    this.resetAndFetch();
  }

  private isFiltered(filter: FilterOptions): true | undefined {
    return this.filterSettings().filterBy.includes(filter) || undefined;
  }
}
