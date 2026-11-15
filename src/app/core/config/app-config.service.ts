import { Injectable } from '@angular/core';

interface AppEnvironment {
  apiUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private readonly environment = ((window as unknown as { __env?: AppEnvironment }).__env ?? {});

  readonly apiUrl = (this.environment.apiUrl ?? '').trim().replace(/\/+$/, '');
}
