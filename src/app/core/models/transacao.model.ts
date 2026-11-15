export interface Transacao {
  id: string | number;
  descricao: string;
  valor: number;
  data: string;
  tipo?: 'ENTRADA' | 'SAIDA';
}
