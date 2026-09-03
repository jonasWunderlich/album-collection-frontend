import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AlbumMetaService } from '../services/album-meta-service';
import { RouteStateService } from '../services/route-state-service';

@Component({
  selector: 'app-nav',
  imports: [RouterLink],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  menuHidden = true;
  readonly yearsAndDecades = inject(AlbumMetaService).navData();
  readonly routeState = inject(RouteStateService);
}
