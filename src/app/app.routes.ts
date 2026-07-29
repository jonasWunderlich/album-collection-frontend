import { Routes } from '@angular/router';
import { AlbumWall } from './album-wall/album-wall';

export const routes: Routes = [
    { path: '', redirectTo: '2025', pathMatch: 'full' },
    { path: ':year', component: AlbumWall, },
    { path: ':decade', component: AlbumWall, },
];
