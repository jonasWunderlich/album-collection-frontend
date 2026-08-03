import { Component, Input } from '@angular/core';
import { Direction } from '../../types/types';

@Component({
  selector: 'app-sort-button',
  imports: [],
  templateUrl: './sort-button.html',
  styleUrl: './sort-button.scss',
})
export class SortButton {
  @Input() active: boolean = false;
  @Input() direction: Direction = 'desc';
  @Input() label: string = '';
}
