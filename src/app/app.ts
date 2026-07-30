import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from "./nav/nav";
import { ControlsRow } from "./controls-row/controls-row";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, ControlsRow],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('musicAngularApp');
}
