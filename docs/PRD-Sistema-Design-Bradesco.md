# Sistema de Design Bradesco — PRD (Documento de Requisitos de Produto)

**Versão:** 1.0 (baseada em análise de referência pública e brand guidelines)
**Idioma:** Português (Brasil)
**Status:** Proposta / Conceito

> **Observação importante:** Este PRD foi elaborado a partir de informações públicas sobre a marca Bradesco e do projeto conceitual disponível no Behance (redesign do app por Daniel Rodrigues Fernandes). Não substitui a documentação oficial interna (Liquid / Base Design System). Seu uso é destinado a estudos, prototipação ou alinhamento conceitual.

---

## 1. Visão Geral

### 1.1 Objetivo

Criar um sistema de design unificado para os produtos digitais do Bradesco (app, internet banking, atendimento), garantindo:

- Consistência visual e de experiência entre canais;
- Redução de retrabalho entre design e desenvolvimento;
- Acessibilidade (WCAG 2.1 AA) como requisito obrigatório;
- Escalabilidade para novos produtos e squads.

### 1.2 Escopo

**Incluído:** tokens de design (cor, tipografia, espaçamento, elevação), biblioteca de componentes, padrões de layout, diretrizes de conteúdo, documentação de uso.

**Não incluído:** identidade verbal corporativa completa, materiais offline (impressos), campanhas sazonais.

### 1.3 Público-alvo

- Designers de produto (UX/UI);
- Desenvolvedores front-end (web e mobile);
- Product Owners e squads de discovery;
- Time de acessibilidade e compliance.

---

## 2. Princípios de Design

1. **Clareza financeira** — Informação sensível (saldo, transações, seguros) deve ser legível e hierarquizada sem ambiguidade.
2. **Confiança e solidez** — O vermelho institucional é identidade, não decoração; seu uso deve ser intencional.
3. **Acessibilidade por padrão** — Contraste, tamanho de toque e leitores de tela são critérios de aceite, não extras.
4. **Eficiência no fluxo** — Reduzir etapas em operações críticas (pagamento, transferência, sinistro).
5. **Consistência multiplataforma** — Mesmo componente, mesmo comportamento em iOS, Android e web.

---

## 3. Fundamentos (Design Tokens)

### 3.1 Cores

| Token | Valor | Uso |
| --- | --- | --- |
| `color-brand-primary` | `#CC092F` | CTA principal, marca, destaques de ação |
| `color-brand-primary-hover` | `#A80726` (derivado) | Estado hover/pressed |
| `color-brand-secondary` | `#053F89` | Dados financeiros, gráficos, links secundários |
| `color-neutral-900` | `#000000` | Texto principal |
| `color-neutral-700` | `#4A4A4A` | Texto secundário |
| `color-neutral-200` | `#EBEBEB` | Fundos, divisores, cards |
| `color-neutral-000` | `#FFFFFF` | Superfícies |
| `color-feedback-success` | `#1E7D32` | Confirmações |
| `color-feedback-warning` | `#B26A00` | Alertas |
| `color-feedback-error` | `#C62828` | Erros (distinto do vermelho da marca) |

**Regras:**

- Nunca usar o vermelho da marca como cor de erro (evitar confusão semântica).
- Contraste mínimo de 4.5:1 para texto e 3:1 para elementos de interface.

### 3.2 Tipografia

**Família principal:** fonte proprietária Bradesco (quando disponível).
**Fallback digital:** Montserrat, Inter, system-ui, sans-serif.

**Escala (mobile-first):**

| Token | Tamanho / Line-height | Uso |
| --- | --- | --- |
| `font-display` | 32 / 40 | Títulos de tela |
| `font-heading` | 24 / 32 | Seções |
| `font-subheading` | 18 / 24 | Subtítulos |
| `font-body` | 16 / 24 | Texto padrão |
| `font-caption` | 14 / 20 | Legendas |
| `font-micro` | 12 / 16 | Rótulos auxiliares (usar com cautela) |

**Pesos:** 400 (regular), 600 (semibold), 700 (bold).

### 3.3 Espaçamento

Escala baseada em múltiplos de 4px: **4, 8, 12, 16, 24, 32, 48, 64**.

- Padding padrão de tela: 16px (mobile) / 24px (desktop).
- Gap entre cards: 12px.
- Altura mínima de alvo de toque: 48px.

### 3.4 Elevação e Bordas

- `radius-sm`: 4px (inputs, tags)
- `radius-md`: 8px (cards, botões)
- `radius-lg`: 16px (modais, bottom sheets)
- Sombras: sutis, com no máximo 2 níveis (`elevation-1`, `elevation-2`) para não poluir a interface financeira.

### 3.5 Grid

- **Mobile:** 4 colunas, gutter 16px, margem 16px.
- **Tablet:** 8 colunas, gutter 24px.
- **Desktop:** 12 colunas, gutter 24px, largura máxima 1200px.

---

## 4. Componentes (Escopo Mínimo Viável)

### 4.1 Ações

- **Button** (primário, secundário, terciário, destrutivo) — estados default/hover/pressed/disabled/loading.
- **Link** — inline e standalone.
- **Icon Button** — com rótulo acessível obrigatório.

### 4.2 Entrada de Dados

- **Input** (texto, numérico, senha) — com label flutuante, mensagem de erro e helper text.
- **Select / Dropdown**
- **Checkbox / Radio / Switch**
- **Masked Input** (CPF, agência, conta, valor monetário) — crítico para o contexto bancário.

### 4.3 Navegação

- **Bottom Navigation** (mobile) — até 5 itens.
- **Tab Bar**
- **Breadcrumb** (web)
- **Header** com ações contextuais.

### 4.4 Feedback

- **Toast / Snackbar**
- **Modal / Dialog**
- **Bottom Sheet**
- **Skeleton Loading**
- **Empty State**

### 4.5 Conteúdo Financeiro

- **Card de Conta / Saldo**
- **Card de Transação** (com ícone, valor, data, status)
- **Card de Produto / Seguro**
- **Gráfico de Gastos** (barras/linha, com paleta acessível).

### 4.6 Estrutura de Home (referência conceitual)

Estrutura **"4 + 3"**: 4 ações principais (Pagar, Transferir, Extrato, Cartões) + 3 auxiliares (Ajuda, Seguros, Cofre).

**Objetivo:** reduzir carga cognitiva na tela inicial.

---

## 5. Diretrizes de Conteúdo (UX Writing)

- **Tom:** empático, direto e seguro. Evitar jargão técnico e juridiquês.
- **Erros:** sempre indicar o que aconteceu + o que fazer agora.
- **Confirmações:** mostrar resumo da ação antes de concluir operações financeiras.
- **Linguagem simples:** substituir termos complexos por equivalentes claros (ex.: "saldo disponível" em vez de "saldo passível de movimentação").
- **Personalização:** usar nome do cliente com moderação e contexto.

---

## 6. Acessibilidade (Requisitos Obrigatórios)

- Contraste mínimo WCAG 2.1 AA.
- Suporte completo a leitores de tela (VoiceOver / TalkBack).
- Navegação por teclado em todas as telas web.
- Área de toque mínima de 48x48px.
- Não depender exclusivamente de cor para transmitir informação (usar ícone + rótulo).
- Testes com usuários PCD (referência ao programa Beta PCD do Bradesco).

---

## 7. Documentação e Governança

### 7.1 Documentação

- Site de documentação (Storybook ou similar) com exemplos de código e uso.
- Fichas de componente: anatomia, estados, acessibilidade, dos/don'ts.
- Versionamento semântico dos tokens e componentes.

### 7.2 Governança

- Design System Core Team responsável pela evolução.
- Processo de contribuição por squads (RFC + revisão).
- Canal de suporte (Slack/Teams) e office hours.
- Métricas de adoção: % de telas usando componentes do DS, tickets de inconsistência, tempo de implementação.

---

## 8. Roadmap Sugerido

| Fase | Entregas | Prazo estimado |
| --- | --- | --- |
| Fase 1 — Fundação | Tokens, tipografia, cores, grid, documentação inicial | 4–6 semanas |
| Fase 2 — Componentes Core | Botões, inputs, navegação, feedback | 6–8 semanas |
| Fase 3 — Componentes Financeiros | Cards de conta/transação, máscaras, gráficos | 6 semanas |
| Fase 4 — Adoção e Acessibilidade | Migração de telas piloto, auditoria WCAG, testes PCD | Contínuo |

---

## 9. Riscos e Considerações

- **Uso indevido da marca:** o vermelho e o logo Bradesco são protegidos; este PRD é conceitual e não autoriza uso comercial da identidade.
- **Divergência com sistemas oficiais:** o Bradesco já possui o Liquid (banco) e o Base (seguros). Recomenda-se alinhar este PRD às diretrizes internas antes de qualquer implementação real.
- **Fonte proprietária:** a ausência da fonte oficial em protótipos pode gerar diferenças visuais; usar fallback documentado.
