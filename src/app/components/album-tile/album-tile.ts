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
}
