import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouteStateService {
  private readonly route = inject(ActivatedRoute);

  // Reaktiv abgelegtes ParamMap-Signal
  private readonly params = toSignal(this.route.paramMap);

  // Helper für sauberen Zugriff ohne Boilerplate
  private getParam(key: string): string | undefined {
    return this.params()?.get(key) ?? undefined;
  }

  private getNumberParam(key: string): number | undefined {
    const val = this.getParam(key);
    return val ? parseInt(val, 10) : undefined;
  }

  private getBoolParam(key: string): boolean | undefined {
    const val = this.getParam(key);
    return val !== undefined ? val === 'true' : undefined;
  }

  // --- Parameter Signals ---
  readonly releaseYear = computed(() => this.getNumberParam('releaseYear'));
  readonly decade = computed(() => this.getNumberParam('decade'));
  readonly owned = computed(() => this.getBoolParam('owned'));
  readonly favorite = computed(() => this.getBoolParam('favorite'));
  readonly wishlist = computed(() => this.getBoolParam('wishlist'));
  readonly albumArtist = computed(() => this.getParam('albumArtist'));
  readonly publisher = computed(() => this.getParam('publisher'));
  readonly genre = computed(() => this.getParam('genre'));
  readonly style = computed(() => this.getParam('style'));
  readonly country = computed(() => this.getParam('country'));
  readonly city = computed(() => this.getParam('city'));

  // --- Derived Signals (Navigation) ---
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
