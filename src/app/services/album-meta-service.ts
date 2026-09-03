import { httpResource } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { YearsAndDecadesService } from '../api/api/yearsAndDecades.service';
import { YearsAndDecadesResponse } from '../api/model/yearsAndDecadesResponse';

@Service()
export class AlbumMetaService {
  private readonly yearsService = inject(YearsAndDecadesService);
  private apiUrl = 'http://localhost:8081/yearsAndDecades';

  readonly isLoading = signal<boolean>(false);
  readonly navData = signal<YearsAndDecadesResponse>({ releaseYears: [], decades: [] });

  aggregatedData = httpResource<YearsAndDecadesResponse>(
    () => {
      return this.apiUrl;
    },
    {
      defaultValue: { releaseYears: [], decades: [] },
    },
  );
}
