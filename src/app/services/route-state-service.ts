import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RouteStateService {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private activeParamMap = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => {
        let current = this.route;
        while (current.firstChild) {
          current = current.firstChild;
        }
        return current.snapshot.paramMap;
      }),
    ),
  );

  // Basissignale für Jahr und Dekade
  readonly releaseYear = computed(() => {
    const val = this.activeParamMap()?.get('releaseYear');
    return val ? parseInt(val, 10) : undefined;
  });

  readonly decade = computed(() => {
    const val = this.activeParamMap()?.get('decade');
    return val ? parseInt(val, 10) : undefined;
  });

  readonly owned = computed(() => {
    const val = this.activeParamMap()?.get('owned');
    return val ? val === 'true' : undefined;
  });

  readonly favorite = computed(() => {
    const val = this.activeParamMap()?.get('favorite');
    return val ? val === 'true' : undefined;
  });

  readonly prevYear = computed(() => {
    const y = this.releaseYear();
    return y && y > 1900 ? y - 1 : undefined;
  });

  readonly nextYear = computed(() => {
    const y = this.releaseYear();
    return y && y < 2026 ? y + 1 : undefined;
  });

  readonly prevDecade = computed(() => {
    const d = this.decade();
    return d ? d - 10 : undefined;
  });

  readonly nextDecade = computed(() => {
    const d = this.decade();
    return d && d < 2020 ? d + 10 : undefined;
  });
}
