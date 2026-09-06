import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Album } from '../../api/model/album';

@Component({
  selector: 'app-album-tile',
  imports: [RouterLink],
  templateUrl: './album-tile.html',
  styleUrl: './album-tile.scss',
})
export class AlbumTile {
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
}
