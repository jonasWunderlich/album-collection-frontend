import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { environment } from '../environment';
import { BASE_PATH } from './api/variables';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter([], withComponentInputBinding()),
    provideClientHydration(),
    {
      provide: BASE_PATH,
      useValue: environment.apiBasePath,
    },
  ],
};
