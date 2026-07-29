import { Component, inject } from '@angular/core';
import { AlbumMetaService } from '../services/album-meta-service';

@Component({
  standalone: true,
  selector: 'app-nav',
  imports: [],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  albumMetaService = inject(AlbumMetaService);
  showMenu = false;
}
