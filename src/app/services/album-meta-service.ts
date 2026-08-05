import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReleaseYearSummaryDto } from '../../../api';

@Injectable({
  providedIn: 'root', // Singleton: Existiert nur 1x in der gesamten App
})
export class AlbumMetaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/albums/release-years';

  // Der HTTP-Call wird beim ersten Auslesen ausgelöst und das Ergebnis gecacht
  readonly releaseYearSummary = toSignal(
    this.http.get<ReleaseYearSummaryDto>(this.apiUrl),
    {
      initialValue: { releaseYears: [], decades: [] },
    },
  );
}
