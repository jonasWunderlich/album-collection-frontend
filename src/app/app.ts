import { Component, signal } from '@angular/core';
import { AlbumWall } from "./components/album-wall/album-wall";
import { PasswordDialog } from "./components/password-dialog/password-dialog";

@Component({
  selector: 'app-root',
  imports: [AlbumWall, PasswordDialog],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('myMusic');
}
