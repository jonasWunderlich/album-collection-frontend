import { Component, inject, Input } from '@angular/core';
import { AlbumFilterService } from '../../services/album-filter-service';
import { SortOptions } from '../types';

@Component({
  selector: 'app-album-tile-filter-link',
  imports: [],
  templateUrl: './album-tile-filter-link.html',
  styleUrl: './album-tile-filter-link.scss',
})
export class AlbumTileFilterLink {
  private readonly albumFilterService = inject(AlbumFilterService);

  @Input() filter!: string;
  @Input() value?: string | number;
  @Input() sortBy: SortOptions = SortOptions.releaseYear;

  setFilter(): void {
    if (this.value) {
      this.albumFilterService.replaceFilters({
        [this.filter]: this.value,
        sortBy: this.sortBy,
        sortDir: 'desc',
      });
    }
  }
}
