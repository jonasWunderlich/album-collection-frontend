import { Component, inject, OnInit, DestroyRef, signal, ElementRef, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumTile } from "../album-tile/album-tile";
import { Album, AlbumControllerService, PageAlbum } from '../../../api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlsRow } from "../controls-row/controls-row";
import { FilterSettings } from '../types/types';

@Component({
  selector: 'app-album-wall',
  imports: [AlbumTile, ControlsRow],
  templateUrl: './album-wall.html',
  styleUrl: './album-wall.scss',
})
export class AlbumWall implements OnInit {
  private route = inject(ActivatedRoute);
  private albumService = inject(AlbumControllerService);
  private destroyRef = inject(DestroyRef);

  // Wichtig: ViewChild greift auf den Scroll-Trigger am Ende des Templates zu
  scrollAnchor = viewChild<ElementRef<HTMLDivElement>>('scrollAnchor');

  filterSettings: FilterSettings = {
    search: '',
    sortBy: 'addedDate',
    filterBy: [],
    direction: 'asc'
  };

  albums = signal<Album[]>([]);
  page = 0;
  size = 30;

  isLoading = signal<boolean>(false);
  isLastPage = signal<boolean>(false);

  private activeYear?: number;
  private activeDecade?: number;
  private observer?: IntersectionObserver;

  ngOnInit() {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const yearParam = params.get('year');
        const decadeParam = params.get('decade');

        this.activeYear = yearParam ? parseInt(yearParam, 10) : undefined;
        this.activeDecade = decadeParam ? parseInt(decadeParam, 10) : undefined;

        // Reset bei Parameter-Wechsel
        this.resetAndFetch();
      });

    this.setupIntersectionObserver();
  }

  private resetAndFetch() {
    this.page = 0;
    this.isLastPage.set(false);
    this.albums.set([]);
    this.fetchAlbums();
  }

  isFiltered(filter: string): true | undefined {
    return this.filterSettings.filterBy.includes(filter) || undefined;
  }

  fetchAlbums() {
    if (this.isLoading() || this.isLastPage()) return;

    this.isLoading.set(true);

    this.albumService.getAlbumsFiltered(
      {
        search: this.filterSettings.search,
        releaseYear: this.activeYear,
        decade: undefined,
        title: undefined,
        artist: undefined,
        albumArtist: undefined,
        genre: undefined,
        style: undefined,
        fan: this.isFiltered('fan'),
        favorite: this.isFiltered('favorite'),
        owned: this.isFiltered('owned'),
        tino: this.isFiltered('tino'),
        wire: this.isFiltered('wire'),
        page: this.page,
        size: this.size,
        sortBy: this.filterSettings.sortBy,
        direction: this.filterSettings.direction,
      }
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (pageAlbum: PageAlbum) => {
          const newContent = pageAlbum.content || [];
          this.albums.update(prev => [...prev, ...newContent]);
          // Paginierungs-Ende prüfen
          this.isLastPage.set(pageAlbum.last ?? (newContent.length < this.size));
          this.page++;
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching albums:', err);
          this.isLoading.set(false);
        }
      });
  }

  private setupIntersectionObserver() {
    // Der Observer schlägt an, sobald das Anker-Element unten im Viewport sichtbar wird
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !this.isLoading() && !this.isLastPage()) {
        this.fetchAlbums();
      }
    }, { rootMargin: '600px' }); // Lädt 200px vor Erreichen des Bildschirmendes bereits nach

    // Anker beobachten sobald er gerendert ist
    setTimeout(() => {
      const anchorEl = this.scrollAnchor()?.nativeElement;
      if (anchorEl) {
        this.observer?.observe(anchorEl);
      }
    });

    this.destroyRef.onDestroy(() => {
      this.observer?.disconnect();
    });
  }

  updateFilter(filterSettings: FilterSettings) {
    this.filterSettings = filterSettings;
    this.resetAndFetch();
  }
}