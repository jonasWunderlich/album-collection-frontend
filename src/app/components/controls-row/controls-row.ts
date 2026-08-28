import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { SortButton } from '../sort-button/sort-button';
import { FilterOptions, FilterSettings, SortOptions } from '../types';

@Component({
  selector: 'app-controls-row',
  imports: [SortButton],
  templateUrl: './controls-row.html',
  styleUrl: './controls-row.scss',
})
export class ControlsRow {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly SortOptions = SortOptions;
  readonly FilterOptions = FilterOptions;

  // QueryParams als REAKTIVES Signal umwandeln
  private readonly queryParams = toSignal(this.route.queryParams, {
    initialValue: this.route.snapshot.queryParams,
  });

  // filterSettings reagiert jetzt automatisch auf jede URL-Änderung
  readonly filterSettings = computed<FilterSettings>(() => {
    const params = this.queryParams();
    const filterByRaw = params['filterBy'];

    return {
      search: params['search'] ?? '',
      sortBy: (params['sortBy'] as SortOptions) ?? SortOptions.addedDate,
      direction: (params['direction'] as 'asc' | 'desc') ?? 'desc',
      filterBy: filterByRaw
        ? Array.isArray(filterByRaw)
          ? filterByRaw
          : [filterByRaw]
        : [],
    };
  });

  private updateQueryParams(newParams: Record<string, any>) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: newParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  updateSearch(event: Event) {
    const search = (event.target as HTMLInputElement).value;
    this.updateQueryParams({ search: search || null });
  }

  clearSearch() {
    this.updateQueryParams({ search: null });
  }

  setSort(value: SortOptions) {
    const current = this.filterSettings();
    const isSameSort = current.sortBy === value;

    let direction: 'asc' | 'desc';
    if (isSameSort) {
      direction = current.direction === 'asc' ? 'desc' : 'asc';
    } else {
      direction = value === SortOptions.artist ? 'asc' : 'desc';
    }

    this.updateQueryParams({
      sortBy: value,
      direction,
    });
  }

  setFilter(value: FilterOptions) {
    const currentFilterBy = this.filterSettings().filterBy;
    const exists = currentFilterBy.includes(value);

    const newFilterBy = exists
      ? currentFilterBy.filter(f => f !== value)
      : [...currentFilterBy, value];

    this.updateQueryParams({
      filterBy: newFilterBy.length > 0 ? newFilterBy : null,
    });
  }
}
