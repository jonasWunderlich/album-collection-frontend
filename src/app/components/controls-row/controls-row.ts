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

  setSort(value: SortOptions) {
    this.filterSettings.update(prev => {
      const isSameSort = prev.sortBy === value;

      if (isSameSort) {
        return {
          ...prev,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      } else {
        switch (value) {
          case SortOptions.artist:
            return {
              ...prev,
              sortBy: value,
              direction: 'asc',
            };
          default: {
            return {
              ...prev,
              sortBy: value,
              direction: 'desc',
            };
          }
        }
      }
    });
    this.emitChange();
  }

  setFilter(value: FilterOptions) {
    this.filterSettings.update(prev => {
      const exists = prev.filterBy.includes(value);
      const newFilterBy = exists
        ? prev.filterBy.filter(f => f !== value)
        : [...prev.filterBy, value];

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
