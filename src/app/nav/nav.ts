import { Component, inject } from '@angular/core';
import { AlbumMetaService } from '../services/album-meta-service';
import { RouterLink, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-nav',
  imports: [RouterLink],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  albumMetaService = inject(AlbumMetaService);
  router = inject(Router);
  menuHidden = false;

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
