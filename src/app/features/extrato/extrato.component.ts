import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { catchError, finalize, of, timeout } from 'rxjs';

import { Transacao } from '../../core/models/transacao.model';
import { ExtratoService } from './extrato.service';

type EstadoExtrato = 'carregando' | 'sucesso' | 'vazio' | 'erro';

@Component({
  selector: 'app-extrato',
  standalone: true,
  templateUrl: './extrato.component.html',
  styleUrl: './extrato.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExtratoComponent implements OnInit {
  private readonly extratoService = inject(ExtratoService);

  private readonly formatadorMoeda = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  readonly estado = signal<EstadoExtrato>('carregando');
  readonly transacoes = signal<Transacao[]>([]);
  readonly erro = signal('');
  readonly carregando = computed(() => this.estado() === 'carregando');
  readonly saldo = computed(() =>
    this.transacoes().reduce((total, transacao) => total + this.valorNumerico(transacao.valor), 0)
  );
  readonly quantidade = computed(() => this.transacoes().length);

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.estado.set('carregando');
    this.erro.set('');
    this.transacoes.set([]);

    this.extratoService
      .listar()
      .pipe(
        timeout(10000),
        catchError((erro: unknown) => {
          this.erro.set(this.mensagemErro(erro));
          this.estado.set('erro');
          return of(null);
        }),
        finalize(() => {
          if (this.estado() === 'carregando') {
            this.estado.set('erro');
            this.erro.set('Verifique sua conexão e tente novamente.');
          }
        })
      )
      .subscribe((transacoes) => {
        if (!transacoes) {
          return;
        }

        const ordenadas = [...transacoes]
          .map((transacao) => ({ ...transacao, valor: this.valorNumerico(transacao.valor) }))
          .sort((a, b) => this.timestamp(b.data) - this.timestamp(a.data));

        this.transacoes.set(ordenadas);
        this.estado.set(ordenadas.length > 0 ? 'sucesso' : 'vazio');
      });
  }

  formatarMoeda(valor: number): string {
    return this.formatadorMoeda.format(this.valorNumerico(valor));
  }

  formatarValor(valor: number): string {
    const numero = this.valorNumerico(valor);
    return numero > 0 ? `+ ${this.formatarMoeda(numero)}` : this.formatarMoeda(numero);
  }

  formatarData(data: string): string {
    const valorData = new Date(data);

    if (Number.isNaN(valorData.getTime())) {
      return data;
    }

    const dia = this.comDoisDigitos(valorData.getDate());
    const mes = this.comDoisDigitos(valorData.getMonth() + 1);
    const ano = valorData.getFullYear();
    const hora = this.comDoisDigitos(valorData.getHours());
    const minuto = this.comDoisDigitos(valorData.getMinutes());

    return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
  }

  ehEntrada(valor: number): boolean {
    return this.valorNumerico(valor) >= 0;
  }

  private valorNumerico(valor: number | string | null | undefined): number {
    const numero =
      typeof valor === 'string' ? Number(valor.replace(/\./g, '').replace(',', '.')) : Number(valor);
    return Number.isFinite(numero) ? numero : 0;
  }

  private timestamp(data: string): number {
    const valor = new Date(data).getTime();
    return Number.isNaN(valor) ? 0 : valor;
  }

  private comDoisDigitos(valor: number): string {
    return String(valor).padStart(2, '0');
  }

  private mensagemErro(erro: unknown): string {
    if (erro instanceof Error && erro.message === 'API_URL_NAO_CONFIGURADA') {
      return 'A URL da API não foi configurada. Verifique a variável API_URL do deploy.';
    }

    return 'Verifique sua conexão e tente novamente.';
  }
}
