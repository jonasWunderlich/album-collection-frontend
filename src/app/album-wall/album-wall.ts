import { Component, inject, OnInit, DestroyRef, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumTile } from "../album-tile/album-tile";
import { Album, AlbumControllerService, PageAlbum } from '../../../api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-album-wall',
  imports: [AlbumTile],
  templateUrl: './album-wall.html',
  styleUrl: './album-wall.scss',
})
export class AlbumWall implements OnInit {
  private route = inject(ActivatedRoute);
  private albumService = inject(AlbumControllerService);
  private destroyRef = inject(DestroyRef);

  albums = signal<Album[]>([]);
  page = 0;
  size = 40;

  ngOnInit() {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const yearParam = params.get('year');
        const decadeParam = params.get('decade');

        const releaseYear = yearParam ? parseInt(yearParam, 10) : undefined;
        const decade = decadeParam ? parseInt(decadeParam, 10) : undefined;

        this.fetchAlbums(releaseYear, decade);
      });
  }

  fetchAlbums(releaseYear?: number, decade?: number) {
    this.albumService.getAlbums(
      undefined, // artist
      undefined, // genre
      releaseYear,
      undefined, // title
      this.page,
      this.size,
      'addedDate', // sortBy
      'asc' // direction
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (pageAlbum: PageAlbum) => {
          this.albums.set(pageAlbum.content || []);
        },
        error: (err) => {
          console.error('Error fetching albums:', err);
        }
      });
  }
}
