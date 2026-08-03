import { Routes } from '@angular/router';
import { AlbumWall } from './components/album-wall/album-wall';

export const routes: Routes = [
    { path: '', redirectTo: 'year/2026', pathMatch: 'full' },
    { path: 'year/:year', component: AlbumWall },
    { path: 'decade/:decade', component: AlbumWall },
];
