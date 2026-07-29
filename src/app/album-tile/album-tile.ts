import { Component, Input } from '@angular/core';
import { Album } from '../../../api';

@Component({
  selector: 'app-album-tile',
  imports: [],
  templateUrl: './album-tile.html',
  styleUrl: './album-tile.scss',
})
export class AlbumTile {
  @Input() album!: Album;
}
