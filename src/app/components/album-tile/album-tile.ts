import { Component, Input, signal } from '@angular/core';
import { Album } from '../../api/model/album';
import { AlbumTileCover } from '../album-tile-cover/album-tile-cover';
import { AlbumTileOverlay } from '../album-tile-overlay/album-tile-overlay';

@Component({
  selector: 'app-album-tile',
  templateUrl: './album-tile.html',
  styleUrl: './album-tile.scss',
  imports: [AlbumTileCover, AlbumTileOverlay],
})
export class AlbumTile {
  @Input() album!: Album;
  @Input() lazy = true;
  @Input() showInfos = true;

  showDetails = signal(false);

  toggleDetails(): void {
    this.showDetails.update(visible => !visible);
  }

  onMouseEnter(): void {
    this.showDetails.set(true);
  }

  onMouseLeave(): void {
    this.showDetails.set(false);
  }
}
