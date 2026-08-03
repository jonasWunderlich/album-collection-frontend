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
    search: '',
    searchBy: 'addedDate',
    filterBy: [],
    direction: 'desc'
  };

  @Output() filter = new EventEmitter<FilterSettings>();

  updateSort(sortBy: SearchBy) {
    if (this.filterSettings.searchBy === sortBy) {
      this.filterSettings.direction = this.filterSettings.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.filterSettings.searchBy = sortBy;
      this.filterSettings.direction = 'desc';
    }
    this.filter.emit(this.filterSettings);
  }

  updateFilter(filter: String) {
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
