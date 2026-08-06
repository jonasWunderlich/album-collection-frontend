import { httpResource } from '@angular/common/http';
import { Service } from '@angular/core';
import { ReleaseYearSummaryDto } from '../../../api';

@Service()
export class AlbumMetaService {
  private apiUrl = 'http://localhost:8080/api/albums/release-years';

  releaseYearSummary = httpResource<ReleaseYearSummaryDto>(
    () => {
      return this.apiUrl;
    },
    {
      defaultValue: { releaseYears: [], decades: [] },
    },
  );
}
