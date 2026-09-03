import { httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { YearsAndDecadesResponse } from '../api/model/yearsAndDecadesResponse';
import { BASE_PATH } from '../api/variables';

@Service()
export class AlbumMetaService {
  private readonly basePath = inject(BASE_PATH);
  private apiUrl = `${this.basePath}/yearsAndDecades`;

  data = httpResource<YearsAndDecadesResponse>(
    () => {
      return this.apiUrl;
    },
    {
      defaultValue: { releaseYears: [], decades: [] },
    },
  );
}
