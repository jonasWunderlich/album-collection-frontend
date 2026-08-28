import { Routes } from '@angular/router';
import { AlbumWall } from './components/album-wall/album-wall';

export const routes: Routes = [
  { path: '', redirectTo: 'releaseYear/2026', pathMatch: 'full' },
  { path: 'releaseYear/:releaseYear', component: AlbumWall },
  { path: 'decade/:decade', component: AlbumWall },
  { path: 'artist/:artist', component: AlbumWall },
  { path: 'owned', component: AlbumWall },
  { path: 'favorite', component: AlbumWall },
];
