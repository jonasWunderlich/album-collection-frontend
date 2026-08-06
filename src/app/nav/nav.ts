import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlbumMetaService } from '../services/album-meta-service';

@Component({
  standalone: true,
  selector: 'app-nav',
  imports: [RouterLink],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  yearsAndDecades = inject(AlbumMetaService).releaseYearSummary;
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  router = inject(Router);
  menuHidden = true;

  activeYear?: number;
  activeDecade?: number;

  constructor() {
    // Route-Params sauber und sicher abonnieren (Triggert NUR bei ECHTEM URL-Wechsel)
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      console.log('active route', params);
      const yearParam = params.get('year');
      const decadeParam = params.get('decade');
      this.activeYear = yearParam ? parseInt(yearParam, 10) : undefined;
      this.activeDecade = decadeParam ? parseInt(decadeParam, 10) : undefined;
      // this.resetAndFetch();
    });
  }

  get currentPeriod(): string {
    const url = this.router.url;
    const parts = url.split('/');
    if (parts.length >= 3) {
      const type = parts[1];
      const val = parts[2];
      if (type === 'year') {
        return `Records in ${val}`;
      } else if (type === 'decade') {
        return `Records in ${val}s`;
      }
    }
    return 'Collection';
  }
}
