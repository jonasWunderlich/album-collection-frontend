import { Routes } from '@angular/router';
import { AlbumWall } from './components/album-wall/album-wall';

export const routes: Routes = [
  { path: '', component: AlbumWall },
  { path: 'releaseYear/:releaseYear', component: AlbumWall },
  { path: 'decade/:decade', component: AlbumWall },
  { path: 'albumArtist/:albumArtist', component: AlbumWall },
  { path: 'publisher/:publisher', component: AlbumWall },
  { path: 'genre/:genre', component: AlbumWall },
  { path: 'style/:style', component: AlbumWall },
  { path: 'country/:country', component: AlbumWall },
  { path: 'city/:city', component: AlbumWall },
  { path: 'owned', component: AlbumWall },
  { path: 'favorite', component: AlbumWall },
];
