import { Component, inject, Input } from '@angular/core';
import { Album } from '../../api/model/album';
import { AlbumFilterService } from '../../services/album-filter-service';

@Component({
  selector: 'app-album-tile',
  templateUrl: './album-tile.html',
  styleUrl: './album-tile.scss',
})
export class AlbumTile {
  private readonly albumFilterService = inject(AlbumFilterService);
  @Input() album!: Album;
  @Input() lazy = true;

  imageError = false;

  onImageError(): void {
    this.imageError = true;
  }

  hasValidCover(): boolean {
    return (
      !!this.album?.urlCover && this.album.urlCover.trim() !== '' && !this.imageError
    );
  }

  googleImageSearchUrl(value: Album) {
    if (!value) return '#';

    const artists = value.albumArtist?.map(a => a.trim()).join(', ') ?? '';
    const searchQuery = `${artists} - ${value.title}`;

    return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(searchQuery)}`;
  }

  setFilter(filter: string, value?: string | number): void {
    if (value) {
      this.albumFilterService.replaceFilters({
        [filter]: value,
      });
    }
  }
}
