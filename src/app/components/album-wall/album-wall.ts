import {
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Album, AlbumControllerService } from '../../../../api';
import { Nav } from '../../nav/nav';
import { RouteStateService } from '../../services/route-state-service';
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
  readonly routeState = inject(RouteStateService);

  readonly releaseYearInput = input<string>();
  readonly decadeInput = input<string>();

  // Endless Scrolling & Data
  private readonly albumService = inject(AlbumControllerService);
  private readonly destroyRef = inject(DestroyRef);
  private observer?: IntersectionObserver;

  readonly scrollAnchor = viewChild<ElementRef<HTMLDivElement>>('scrollAnchor');
  readonly albums = signal<Album[]>([]);
  readonly page = signal<number>(0);
  readonly isLoading = signal<boolean>(false);
  readonly isLastPage = signal<boolean>(false);
  readonly size = 30;

  // QueryParams als REAKTIVES Signal umwandeln
  private readonly queryParams = toSignal(this.route.queryParams, {
    initialValue: this.route.snapshot.queryParams,
  });

  // FilterSettings werden deklarativ aus den QueryParams der URL abgeleitet
  readonly filterSettings = computed<FilterSettings>(() => {
    const params = this.queryParams(); // Bzw. reaktiv über queryParamMap / RouteStateService
    const filterByRaw = params['filterBy'];
    const currentYear = this.routeState.releaseYear();

    const defaultSort = currentYear === 2026 ? SortOptions.addedDate : SortOptions.rating;

    return {
      search: params['search'] ?? '',
      sortBy: (params['sortBy'] as SortOptions) ?? defaultSort,
      direction: (params['direction'] as 'asc' | 'desc') ?? 'desc',
      filterBy: filterByRaw
        ? Array.isArray(filterByRaw)
          ? filterByRaw
          : [filterByRaw]
        : [],
    };
  });

  constructor() {
    // 2. Reagiert auf URL-Parameter-Änderungen (sowohl Route State als auch QueryParams)
    effect(() => {
      // Signale lesen, auf die der Effect reagieren soll:
      this.routeState.releaseYear();
      this.routeState.decade();
      this.routeState.owned();
      this.routeState.favorite();
      this.filterSettings(); // Reagiert sofort, wenn sich Filter in der URL ändern

      untracked(() => {
        this.resetAndFetch();
      });
    });

    /* IntersectionObserver für Infinite Scroll */
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

    // Aktuellen Filter-Zustand aus der URL lesen
    const currentFilter = this.filterSettings();

    this.albumService
      .getAlbums({
        page: this.page(),
        size: this.size,
        sortBy: currentFilter.sortBy,
        direction: currentFilter.direction,
        filterSettings: {
          search: currentFilter.search,
          releaseYear: this.routeState.releaseYear(),
          decade: this.routeState.decade(),
          albumArtist: undefined,
          genre: undefined,
          style: undefined,
          favorite: this.routeState.favorite() || this.isFiltered(FilterOptions.favorite),
          owned: this.routeState.owned() || this.isFiltered(FilterOptions.owned),
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

  private isFiltered(filter: FilterOptions): true | undefined {
    return this.filterSettings().filterBy.includes(filter) || undefined;
  }
}
