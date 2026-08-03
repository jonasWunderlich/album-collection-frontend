import { Component, EventEmitter, Output } from '@angular/core';
import { FilterSettings, SearchBy } from '../types/types';
import { SortButton } from "./sort-button/sort-button";

@Component({
  selector: 'app-controls-row',
  imports: [SortButton],
  templateUrl: './controls-row.html',
  styleUrl: './controls-row.scss',
})
export class ControlsRow {

  filterSettings: FilterSettings = {
    filterBy: [],
    direction: 'desc',
    search: '',
    sortBy: 'addedDate'
  };

  @Output() filter = new EventEmitter<FilterSettings>();

  updateSearch(search: string) {
    this.filterSettings.search = search;
    this.filter.emit(this.filterSettings);
  }

  updateSort(sortBy: SearchBy) {
    if (this.filterSettings.sortBy === sortBy) {
      this.filterSettings.direction = this.filterSettings.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.filterSettings.sortBy = sortBy;
      this.filterSettings.direction = 'desc';
    }
    this.filter.emit(this.filterSettings);
  }

  updateFilter(filter: string) {
    if (this.filterSettings.filterBy.includes(filter)) {
      this.filterSettings.filterBy = this.filterSettings.filterBy.filter(f => f !== filter);
    } else {
      this.filterSettings.filterBy.push(filter);
    }
    this.filter.emit(this.filterSettings);
  }

  clearSearch() {
    this.filterSettings.search = '';
    this.filter.emit(this.filterSettings);
  }
}
