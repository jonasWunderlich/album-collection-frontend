import { Component, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import { Album } from '../../../../api';

interface AlbumData extends Album {
  artist: string;
  title: string;
  releaseYear: number;
}

@Component({
  selector: 'app-album-form',
  imports: [FormField],
  templateUrl: './album-form.html',
  styleUrl: './album-form.scss',
})
export class AlbumForm {
  protected albumModel = signal<AlbumData>({
    artist: '',
    title: '',
    releaseYear: 2026,
  });

  protected albumForm = form(this.albumModel, s => {
    required(s.artist, { message: 'Email is required' });
    required(s.title, { message: 'Password is required' });
    //required(s.releaseYear, {message: "releaseYear is required" }),
    // max(s.releaseYear, 2026, {message: 'releaseYear cant be bigger than 2026'});
  });

  onSubmit(event: Event) {
    event.preventDefault();
    const data = this.albumModel();
    console.log('Album in with:', data);
  }
}
