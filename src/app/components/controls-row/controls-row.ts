import { Component, computed, inject } from '@angular/core';
import { SortButton } from '../sort-button/sort-button';
import { SortOptions } from '../types';
import { AlbumFilterService } from '../../services/album-filter-service';

@Component({
  selector: 'app-controls-row',
  imports: [SortButton],
  templateUrl: './controls-row.html',
  styleUrl: './controls-row.scss',
})
export class ControlsRow {
  private readonly albumFilterService = inject(AlbumFilterService);
  readonly SortOptions = SortOptions;

  readonly filters = computed(() => this.albumFilterService.parsedQueryParams());

  updateSearch(event: Event): void {
    const search = (event.target as HTMLInputElement).value;
    this.albumFilterService.updateFilters({ search: search || undefined });
  }

  clearSearch(): void {
    this.albumFilterService.updateFilters({ search: undefined });
  }

  setSort(value: SortOptions): void {
    this.albumFilterService.updateFilters({
      sortBy: value,
    });
  }

  toggleFilter(key: 'tino' | 'wire'): void {
    const isActive = this.albumFilterService.parsedQueryParams()[key];
    this.albumFilterService.updateFilters({
      [key]: !isActive ? 'true' : null,
    });
  }
}
