import { Component, signal } from '@angular/core';
import { AlbumWall } from "./components/album-wall/album-wall";

@Component({
  selector: 'app-root',
  imports: [AlbumWall],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('myMusic');
}
