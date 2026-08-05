import { Component, output, signal } from '@angular/core';
import { SortButton } from '../sort-button/sort-button';
import { FilterOptions, FilterSettings, SortOptions } from '../types';

@Component({
  selector: 'app-controls-row',
  imports: [SortButton],
  templateUrl: './controls-row.html',
  styleUrl: './controls-row.scss',
})
export class ControlsRow {
  readonly filter = output<FilterSettings>();
  readonly SortOptions = SortOptions;
  readonly FilterOptions = FilterOptions;

  readonly filterSettings = signal<FilterSettings>({
    filterBy: [],
    direction: 'desc',
    search: '',
    sortBy: SortOptions.addedDate,
  });

  updateSearch(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const search = inputElement.value;

    this.filterSettings.update(prev => ({
      ...prev,
      search,
    }));
    
    this.emitChange();
  }

  clearSearch() {
    this.filterSettings.update(prev => ({
      ...prev,
      search: '',
    }));
    
    this.emitChange();
  }

  updateSort(value: SortOptions) {
    this.filterSettings.update(prev => {
      const isSameSort = prev.sortBy === value;
      return {
        ...prev,
        sortBy: value,
        direction: isSameSort && prev.direction === 'asc' ? 'desc' : isSameSort ? 'asc' : 'desc',
      };
    });

    this.emitChange();
  }

  updateFilter(filter: FilterOptions) {
    this.filterSettings.update(prev => {
      const exists = prev.filterBy.includes(filter);
      const newFilterBy = exists
        ? prev.filterBy.filter(f => f !== filter)
        : [...prev.filterBy, filter];

      return {
        ...prev,
        filterBy: newFilterBy,
      };
    });

    this.emitChange();
  }

  private emitChange() {
    this.filter.emit(this.filterSettings());
  }
}