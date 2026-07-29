import { Component } from '@angular/core';
import { AlbumTile } from "../album-tile/album-tile";
import { Album } from '../api';

@Component({
  selector: 'app-album-wall',
  imports: [AlbumTile],
  templateUrl: './album-wall.html',
  styleUrl: './album-wall.scss',
})
export class AlbumWall {


  album: Album = {
    id: 28629,
    addedDate: "2026-04-17",
    title: "All Clouds Bring Not Rain",
    releaseYear: 2026,
    publisher: "Fire Records",
    genre: "Rock, Pop",
    style: "Indie Rock, Indie Pop, Psychedelic Rock, Experimental",
    reissue: false,
    artist: "Memorials",
    fan: true,
    country: "UK",
    city: "Brighton, East Sussex",
    rating: 9,
    owned: true,
    tino: false,
    wire: false,
    hidden: false,
    videoUrl: "https://www.youtube.com/watch?v=jGofSjCykh8",
    bandcampUrl: "https://memorialsmusic.bandcamp.com/track/reimagined-river",
  }

}
