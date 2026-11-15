import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, finalize, of, timeout } from 'rxjs';

import { Transacao } from '../../core/models/transacao.model';
import { ExtratoService } from './extrato.service';

type EstadoExtrato = 'carregando' | 'sucesso' | 'vazio' | 'recarregando' | 'erro';
type FiltroTipo = 'todas' | 'entrada' | 'saida';

const TAMANHO_PAGINA = 5;
const CHAVE_TENTATIVAS = 'extrato-tentativas-vazio';
const MAX_TENTATIVAS = 3;
const ATRASO_RECARGA = 1500;

@Component({
  selector: 'app-extrato',
  standalone: true,
  imports: [FormsModule],
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
  readonly filtroTipo = signal<FiltroTipo>('todas');
  readonly filtroData = signal('');
  readonly paginaAtual = signal(1);
  readonly tamanhoPagina = TAMANHO_PAGINA;
  readonly carregando = computed(() => this.estado() === 'carregando');
  readonly saldo = computed(() =>
    this.transacoes().reduce((total, transacao) => total + this.valorNumerico(transacao.valor), 0)
  );
  readonly quantidade = computed(() => this.transacoes().length);

  readonly transacoesFiltradas = computed(() => {
    const tipo = this.filtroTipo();
    const data = this.filtroData();

    return this.transacoes().filter((transacao) => {
      const entrada = this.ehEntrada(transacao.valor);

      if (tipo === 'entrada' && !entrada) {
        return false;
      }

      if (tipo === 'saida' && entrada) {
        return false;
      }

      if (data) {
        return this.dataIso(transacao.data) === data;
      }

      return true;
    });
  });

  readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.transacoesFiltradas().length / TAMANHO_PAGINA))
  );
  readonly paginaAtualSegura = computed(() => Math.min(this.paginaAtual(), this.totalPaginas()));
  readonly temPaginacao = computed(() => this.transacoesFiltradas().length > TAMANHO_PAGINA);
  readonly paginas = computed(() =>
    Array.from({ length: this.totalPaginas() }, (_, indice) => indice + 1)
  );
  readonly transacoesPagina = computed(() => {
    const filtradas = this.transacoesFiltradas();

    if (filtradas.length <= TAMANHO_PAGINA) {
      return filtradas;
    }

    const inicio = (this.paginaAtualSegura() - 1) * TAMANHO_PAGINA;
    return filtradas.slice(inicio, inicio + TAMANHO_PAGINA);
  });

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.estado.set('carregando');
    this.erro.set('');
    this.transacoes.set([]);
    this.paginaAtual.set(1);

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

        if (ordenadas.length > 0) {
          this.limparTentativas();
          this.estado.set('sucesso');
          return;
        }

        this.recarregarQuandoVazio();
      });
  }

  alterarTipo(tipo: FiltroTipo): void {
    this.filtroTipo.set(tipo);
    this.paginaAtual.set(1);
  }

  alterarData(data: string): void {
    this.filtroData.set(data);
    this.paginaAtual.set(1);
  }

  limparFiltros(): void {
    this.filtroTipo.set('todas');
    this.filtroData.set('');
    this.paginaAtual.set(1);
  }

  irParaPagina(pagina: number): void {
    this.paginaAtual.set(Math.min(Math.max(pagina, 1), this.totalPaginas()));
  }

  paginaAnterior(): void {
    this.irParaPagina(this.paginaAtualSegura() - 1);
  }

  proximaPagina(): void {
    this.irParaPagina(this.paginaAtualSegura() + 1);
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

  private recarregarQuandoVazio(): void {
    const tentativas = this.lerTentativas();

    if (tentativas >= MAX_TENTATIVAS) {
      this.estado.set('vazio');
      return;
    }

    this.salvarTentativas(tentativas + 1);
    this.estado.set('recarregando');

    setTimeout(() => window.location.reload(), ATRASO_RECARGA);
  }

  private lerTentativas(): number {
    try {
      return Number(window.sessionStorage.getItem(CHAVE_TENTATIVAS) ?? 0);
    } catch {
      return 0;
    }
  }

  private salvarTentativas(total: number): void {
    try {
      window.sessionStorage.setItem(CHAVE_TENTATIVAS, String(total));
    } catch {
      return;
    }
  }

  private limparTentativas(): void {
    try {
      window.sessionStorage.removeItem(CHAVE_TENTATIVAS);
    } catch {
      return;
    }
  }

  private dataIso(data: string): string {
    const somenteData = /^(\d{4})-(\d{2})-(\d{2})/.exec(data);

    if (somenteData) {
      return `${somenteData[1]}-${somenteData[2]}-${somenteData[3]}`;
    }

    const valorData = new Date(data);

    if (Number.isNaN(valorData.getTime())) {
      return '';
    }

    const ano = valorData.getFullYear();
    const mes = this.comDoisDigitos(valorData.getMonth() + 1);
    const dia = this.comDoisDigitos(valorData.getDate());

    return `${ano}-${mes}-${dia}`;
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
