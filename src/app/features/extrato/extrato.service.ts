import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { AppConfigService } from '../../core/config/app-config.service';
import { Transacao } from '../../core/models/transacao.model';

@Injectable({ providedIn: 'root' })
export class ExtratoService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(AppConfigService);

  listar(): Observable<Transacao[]> {
    if (!this.config.apiUrl) {
      return throwError(() => new Error('API_URL_NAO_CONFIGURADA'));
    }

    return this.http.get<Transacao[]>(`${this.config.apiUrl}/api/transacoes`, {
      params: { _: Date.now() }
    });
  }
}
