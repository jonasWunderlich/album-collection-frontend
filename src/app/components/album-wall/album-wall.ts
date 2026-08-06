import {
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
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
  private readonly albumService = inject(AlbumControllerService);
  private readonly destroyRef = inject(DestroyRef);
  readonly routeState = inject(RouteStateService);

  readonly scrollAnchor = viewChild<ElementRef<HTMLDivElement>>('scrollAnchor');

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

  private observer?: IntersectionObserver;

  constructor() {
    // 1. Reagiert AUSSCHLIESSLICH auf URL-Parameter-Änderungen
    effect(() => {
      // Signale lesen, auf die der Effect hören SOLL:
      const currentYear = this.routeState.releaseYear();
      this.routeState.decade();
      this.routeState.owned();
      this.routeState.favorite();

      // untracked() verhindert, dass filterSettings eine Abhängigkeit für den Effect wird
      untracked(() => {
        const defaultSort =
          currentYear === 2026 ? SortOptions.addedDate : SortOptions.rating;

        this.filterSettings.update(prev => ({
          ...prev,
          sortBy: defaultSort,
        }));

        this.resetAndFetch();
      });
    });

    /* IntersectionObserver für Inifinite Scroll */
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

    // FilterSettings lesen (im untracked-Kontext des Effects völlig sicher)
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
          favorite: this.routeState.favorite(),
          owned: this.routeState.owned(),
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
