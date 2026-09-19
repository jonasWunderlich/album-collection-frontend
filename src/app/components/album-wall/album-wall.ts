import {
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { AlbumsService } from '../../api/api/albums.service';
import { Album } from '../../api/model/album';
import { AlbumTile } from '../album-tile/album-tile';
import { ControlsRow } from '../controls-row/controls-row';
import { Nav } from '../nav/nav';
import { ScrollTopButton } from '../scroll-top-button/scroll-top-button';
import { AlbumFilterService } from '../../services/album-filter-service';

@Component({
  selector: 'app-album-wall',
  imports: [AlbumTile, ControlsRow, Nav, ScrollTopButton],
  templateUrl: './album-wall.html',
  styleUrl: './album-wall.scss',
})
export class AlbumWall {
  private readonly albumFilterService = inject(AlbumFilterService);
  private readonly albumService = inject(AlbumsService);
  private readonly destroyRef = inject(DestroyRef);
  private observer?: IntersectionObserver;

  readonly scrollAnchor = viewChild<ElementRef<HTMLDivElement>>('scrollAnchor');
  readonly albums = signal<Album[]>([]);
  readonly page = signal<number>(0);
  readonly isLoading = signal<boolean>(false);
  readonly isLastPage = signal<boolean>(false);
  readonly pageSize = 30;

  private readonly filterParams = computed(() => {
    return this.albumFilterService.parsedQueryParams();
  });

  private resetAndFetch() {
    this.page.set(0);
    this.isLastPage.set(false);
    this.albums.set([]);
    this.fetchAlbums();
  }

constructor() {
    effect(() => {
      this.filterParams();

      untracked(() => {
        this.resetAndFetch();
      });
    });

    effect(() => {
      const anchorEl = this.scrollAnchor()?.nativeElement;
      if (anchorEl) {
        this.setupIntersectionObserver(anchorEl);
      }
    });
  }

  fetchAlbums(): void {
    if (this.isLoading() || this.isLastPage()) return;

    this.isLoading.set(true);
    const p = this.filterParams();

    this.albumService
      .albumsGet(
        undefined, // addedDateFrom
        undefined, // addedDateTo
        p.albumArtist, // albumArtist
        undefined, // artist
        p.city, // city
        p.country, // country
        p.decade, // decade
        undefined, // fan
        p.favorite, // favorite
        p.genre, // genre
        undefined, // hasVideo
        undefined, // lastPlayedDateFrom
        undefined, // lastPlayedDateTo
        p.owned, // owned
        this.page(), // page
        p.publisher, // publisher
        undefined, // rating
        undefined, // ratingMax
        undefined, // ratingMin
        undefined, // reissue
        undefined, // releaseDateFrom
        undefined, // releaseDateTo
        p.releaseYear, // releaseYear
        p.search, // search
        this.pageSize, // size
        p.sortBy, // sortBy
        p.sortDir, // sortDir
        p.style, // style
        p.tino, // tino
        undefined, // title
        p.wire, // wire
        p.wishlist, // wishlist
      )
      .subscribe({
        next: pageAlbum => {
          const newContent = pageAlbum.content || [];
          const totalPages = pageAlbum.totalPages ?? 0;
          const currentPage = pageAlbum.page ?? this.page();

          this.albums.update(prev => [...prev, ...newContent]);

          const lastPageReached =
            totalPages > 0
              ? currentPage >= totalPages - 1
              : newContent.length < this.pageSize;

          this.isLastPage.set(lastPageReached);
          this.page.update(page => page + 1);
          this.isLoading.set(false);
        },
        error: err => {
          console.error('Error fetching albums:', err);
          this.isLoading.set(false);
        },
      });
  }

  private setupIntersectionObserver(element: HTMLElement): void {
    this.observer?.disconnect();

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !this.isLoading() && !this.isLastPage()) {
          this.fetchAlbums();
        }
      },
      { rootMargin: '500px 0px' },
    );

    this.observer.observe(element);

    this.destroyRef.onDestroy(() => {
      this.observer?.disconnect();
    });
  }
}
