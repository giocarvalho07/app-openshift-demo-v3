# PRD-P3 — Frontend Angular: Extrato Bancário com Design System Bradesco

**Versão:** 2.0 (consolidado)
**Projeto:** P3 — Extrato Bancário
**Idioma:** Português (Brasil)
**Status:** Pronto para implementação e validação
**Base:** PRD-P3 v1.0 + PRD do Sistema de Design Bradesco v1.0

> **Aviso de marca:** este documento é conceitual e educacional. Os tokens, componentes e referências visuais inspirados no Bradesco não autorizam uso comercial da marca, do logotipo ou da identidade oficial. O Bradesco possui sistemas oficiais próprios (Liquid e Base); qualquer uso real deve ser alinhado e autorizado internamente.

---

## 1. Visão Geral

### 1.1 Contexto

Terceiro e último projeto da trilha da palestra sobre o Red Hat OpenShift Developer Sandbox. O P3 é a experiência visual da trilha: um frontend Angular 17 com uma tela de extrato bancário que consome apenas o `GET /api/transacoes` do Projeto 2 (PRD-P2), aplicando os fundamentos do Sistema de Design Bradesco para entregar uma interface atrativa, acessível e consistente.

O projeto é executado ao vivo durante a palestra e demonstra, de ponta a ponta, o ciclo:

**código Angular → build multi-stage → imagem no OpenShift → Route HTTPS → consumo da API Spring Boot (P2)**

### 1.2 Objetivo Geral

Demonstrar o deploy de um frontend Angular no OpenShift via **Import from Git** com **Containerfile multi-stage** (build Node + serve Nginx), consumindo uma API Spring Boot e exibindo um extrato bancário com estados de UI bem definidos e identidade visual baseada no Sistema de Design Bradesco.

### 1.3 Objetivos Específicos

- Demonstrar deploy de Angular com Containerfile multi-stage (Node 20 + Nginx).
- Demonstrar injeção da variável de ambiente `API_URL` em runtime, apontando para a Route do P2.
- Demonstrar consumo de API REST com `HttpClient` e `provideHttpClient`.
- Demonstrar estados de UI: **carregando**, **erro**, **vazio** e **sucesso**.
- Aplicar tokens de cor, tipografia, espaçamento, grid e componentes do Sistema de Design Bradesco.
- Garantir acessibilidade mínima WCAG 2.1 AA (contraste, foco, área de toque, leitores de tela).
- (Bônus) Demonstrar Dev Spaces com edição ao vivo e commit.

### 1.4 Fora de Escopo

- Tela de cadastro de transações (o `POST` é demonstrado via `curl` no P2).
- Autenticação e autorização.
- Edição ou exclusão de transações.
- Testes automatizados E2E e unitários.
- Persistência local (`localStorage`, IndexedDB etc.).
- Identidade verbal corporativa completa, materiais offline e campanhas sazonais.
- Uso comercial da marca Bradesco, do logotipo ou da fonte proprietária.

---

## 2. Público-Alvo e Premissas

### 2.1 Público-Alvo

- Desenvolvedores frontend Angular iniciantes/intermediários em containers e Kubernetes.
- Estudantes e profissionais em transição para cloud-native.
- Tech leads avaliando OpenShift como plataforma para SPAs.
- Designers e POs interessados em Design System aplicado a produto.

### 2.2 Premissas de Conhecimento

Git básico, Angular com standalone components, REST APIs e noções de containers.

### 2.3 Dependências Críticas

- ⚠️ O P2 deve estar deployado, acessível por Route HTTPS e com **CORS habilitado** para a origem do P3.
- ⚠️ O P2 deve ter transações populadas (seed realizado pelo palestrante) para a tela não abrir vazia.
- O contrato do `GET /api/transacoes` deve estar estável e documentado.
- O Sandbox deve estar válido e com cota disponível.

---

## 3. Arquitetura

```text
┌─────────────────────────────────────────────────────────────┐
│                    Developer Sandbox                        │
│                                                             │
│  ┌──────────────────────┐          ┌──────────────────────┐  │
│  │ P2: API              │◄─────────│ P3: Frontend         │  │
│  │ Spring Boot          │  GET     │ Angular 17           │  │
│  │ /api/transacoes      │  HTTPS   │ HttpClient           │  │
│  │ (CORS habilitado)    │          │ (GET only)           │  │
│  └──────────────────────┘          └──────────────────────┘  │
│            ▲                                  │             │
│            │                                  ▼             │
│     Route HTTPS                          Route HTTPS        │
│  p2-extrato.apps...                  p3-extrato.apps...      │
└─────────────────────────────────────────────────────────────┘
```

### 3.1 Fluxo de Dados

1. Usuário acessa a Route HTTPS do P3.
2. Nginx entrega o bundle Angular e o arquivo `env.js` com `API_URL` em runtime.
3. `ExtratoService` executa `GET {API_URL}/api/transacoes`.
4. O componente calcula o saldo, ordena e formata as transações.
5. A tela transiciona entre os estados carregando, sucesso, vazio e erro.

### 3.2 Decisões Arquiteturais

| Decisão | Justificativa |
| --- | --- |
| Angular standalone components | Menos boilerplate e alinhado ao Angular 17+. |
| `provideHttpClient()` no `app.config.ts` | Configuração funcional moderna, sem NgModule. |
| `env.js` gerado no startup do container | Permite promover a mesma imagem entre ambientes sem rebuild. |
| Nginx como servidor estático | Imagem leve, cacheável e adequada a SPA. |
| Containerfile multi-stage | Build reprodutível e imagem final mínima. |
| Design System baseado em tokens CSS | Consistência visual e baixo custo de manutenção. |

---

## 4. Sistema de Design Aplicado

### 4.1 Princípios

1. **Clareza financeira** — saldo, valores e datas devem ser legíveis e hierarquizados sem ambiguidade.
2. **Confiança e solidez** — o vermelho institucional é identidade, não decoração; uso intencional.
3. **Acessibilidade por padrão** — contraste, área de toque e leitores de tela são critérios de aceite.
4. **Eficiência no fluxo** — atualizar o extrato deve ser uma ação imediata e evidente.
5. **Consistência** — mesmo componente e mesmo comportamento em todos os breakpoints.

### 4.2 Cores

| Token | Valor | Uso no P3 |
| --- | --- | --- |
| `--color-brand-primary` | `#CC092F` | Cabeçalho, CTA "Atualizar", detalhes de marca |
| `--color-brand-primary-hover` | `#A80726` | Hover/pressed do CTA |
| `--color-brand-secondary` | `#053F89` | Links, ícones e dados financeiros secundários |
| `--color-neutral-900` | `#000000` | Texto principal |
| `--color-neutral-700` | `#4A4A4A` | Texto secundário, datas |
| `--color-neutral-200` | `#EBEBEB` | Divisores e fundos de card |
| `--color-neutral-000` | `#FFFFFF` | Superfícies e cards |
| `--color-feedback-success` | `#1E7D32` | Valores positivos e confirmações |
| `--color-feedback-warning` | `#B26A00` | Alertas não bloqueantes |
| `--color-feedback-error` | `#C62828` | Erros de carregamento |

**Regras obrigatórias:**

- O vermelho da marca **não** deve ser usado como cor de erro.
- Contraste mínimo de **4.5:1** para texto e **3:1** para elementos de interface.
- Informação nunca deve depender apenas de cor: usar sinal (`+`/`-`) e rótulo textual.

### 4.3 Tipografia

**Família principal:** fonte proprietária Bradesco, quando licenciada.
**Fallback digital:** `Montserrat, Inter, system-ui, sans-serif`.

| Token | Tamanho / Line-height | Uso no P3 |
| --- | --- | --- |
| `font-display` | 32 / 40 | Título "Meu Extrato" |
| `font-heading` | 24 / 32 | Valor do saldo |
| `font-subheading` | 18 / 24 | Subtítulos de seção |
| `font-body` | 16 / 24 | Descrição das transações |
| `font-caption` | 14 / 20 | Datas e legendas |
| `font-micro` | 12 / 16 | Rótulos auxiliares |

**Pesos:** 400 (regular), 600 (semibold), 700 (bold). Valores monetários usam 600/700 e `font-variant-numeric: tabular-nums`.

### 4.4 Espaçamento, Raios e Elevação

- Escala base: **4, 8, 12, 16, 24, 32, 48, 64 px**.
- Padding de tela: **16px** mobile / **24px** desktop.
- Gap entre cards: **12px**.
- Alvo de toque mínimo: **48x48px**.
- Raios: `radius-sm` 4px (tags), `radius-md` 8px (cards/botões), `radius-lg` 16px (modais/bottom sheets).
- Sombras: no máximo dois níveis (`elevation-1`, `elevation-2`), sutis.

### 4.5 Grid

| Breakpoint | Colunas | Gutter | Margem | Largura máxima |
| --- | --- | --- | --- | --- |
| Mobile | 4 | 16px | 16px | — |
| Tablet | 8 | 24px | 24px | — |
| Desktop | 12 | 24px | 24px | 1200px |

O conteúdo principal do extrato ocupa no máximo **8 colunas** no desktop, centralizado, para manter legibilidade financeira.

### 4.6 Componentes do Escopo Mínimo Viável

| Categoria | Componentes usados no P3 |
| --- | --- |
| Ações | Button primário, Button secundário, Icon Button com rótulo acessível |
| Entrada | Não aplicável nesta tela (fora de escopo) |
| Navegação | Header com título e ação contextual |
| Feedback | Skeleton Loading, Spinner, Empty State, Error State, Toast (opcional) |
| Conteúdo financeiro | Card de Saldo, Card de Transação, indicador de tendência |
| Estrutura | Container, App Bar, seção de lista |

### 4.7 Estrutura da Tela

A tela segue a referência conceitual **"4 + 3"** apenas como inspiração de hierarquia e redução de carga cognitiva. Para o P3, o foco é uma única tela de extrato:

1. **App Bar** — "Meu Extrato" + ação "Atualizar".
2. **Card de Saldo** — saldo consolidado e quantidade de transações.
3. **Lista de Transações** — cards com descrição, data, valor e indicador.
4. **Estados de UI** — carregando, erro, vazio e sucesso.

### 4.8 Diretrizes de Conteúdo (UX Writing)

- **Tom:** empático, direto e seguro; evitar jargão técnico e juridiquês.
- **Erros:** informar o que aconteceu e o que fazer agora.
- **Confirmações:** não aplicável (tela somente leitura).
- **Linguagem simples:** "Saldo atual", "Nenhuma transação encontrada", "Não foi possível carregar seu extrato".
- **Personalização:** não usar nome do cliente nesta versão.

---

## 5. Descrição Funcional

### 5.1 Cabeçalho

- Título: **"Meu Extrato"**.
- Ação à direita: botão **"Atualizar"** com ícone de recarregar.
- Durante a requisição, o botão entra em estado `loading` e fica desabilitado.
- O cabeçalho permanece visível durante todos os estados.

### 5.2 Saldo Atual

- Calculado no cliente: `saldo = soma(valor de todas as transações)`.
- Exibido com formatação pt-BR: `R$ 1.234,56`.
- Positivo em `--color-feedback-success`, negativo em `--color-feedback-error`, zero em `--color-neutral-900`.
- Exibe também a quantidade de transações: `"12 transações"`.
- Enquanto carrega, usa skeleton no lugar do valor.

### 5.3 Lista de Transações

Cada item exibe:

- **Descrição** da transação.
- **Data** formatada em `dd/MM/yyyy HH:mm`.
- **Valor** formatado em `R$`, com sinal explícito (`+`/`-`).
- **Indicador visual**: ícone de entrada/saída + cor semântica.
- **Status**, quando existir no contrato da API.

Regras:

- Ordenação padrão: **data decrescente** (mais recente primeiro).
- Valores positivos em verde; negativos em vermelho; nunca apenas por cor.
- Linhas longas devem quebrar sem sobrepor o valor.
- Lista com `gap` de 12px e cards com `radius-md`.

### 5.4 Botão "Atualizar"

- Refaz o `GET` e recompõe saldo e lista.
- Exibe spinner e desabilita durante a requisição.
- Em caso de erro, permite nova tentativa.
- Deve ter `aria-label="Atualizar extrato"` e foco visível.

### 5.5 Estados de UI

| Estado | Gatilho | Comportamento visual | Acessibilidade |
| --- | --- | --- | --- |
| **Carregando** | Requisição em andamento | Skeleton no card de saldo + spinner na lista | `aria-busy="true"` e texto "Carregando extrato" |
| **Sucesso** | Lista com 1+ transações | Saldo + lista renderizados | Anúncio educado da atualização |
| **Vazio** | Lista vazia | Empty State "Nenhuma transação encontrada" + orientação | Texto lido por leitor de tela |
| **Erro** | Falha de rede/HTTP | Mensagem amigável + botão "Tentar novamente" | `role="alert"` e foco no erro |

**Mensagens de erro sugeridas:**

- Título: "Não foi possível carregar seu extrato".
- Descrição: "Verifique sua conexão e tente novamente."
- Ação: "Tentar novamente".

### 5.6 Mockup Textual

```text
┌─────────────────────────────────────────────┐
│  Meu Extrato                    [↻ Atualizar]│
├─────────────────────────────────────────────┤
│  ┌───────────────────────────────────────┐  │
│  │ Saldo atual                           │  │
│  │ R$ 2.450,00                           │  │
│  │ 4 transações                          │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │ ↑ Salário               + R$ 3.000,00 │  │
│  │   05/11/2026 08:00                    │  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │ ↓ Mercado               - R$ 350,00   │  │
│  │   04/11/2026 19:32                    │  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │ ↓ Conta de luz          - R$ 200,00   │  │
│  │   03/11/2026 10:15                    │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## 6. Contrato da API (P2)

### 6.1 Endpoint Consumido

```http
GET {API_URL}/api/transacoes
Accept: application/json
```

### 6.2 Resposta Esperada

```json
[
  {
    "id": "b2c912f7-2d52-48e5-ac52-4a0365b11e77",
    "descricao": "Salário",
    "valor": 6000.00,
    "data": "2026-11-15T04:18:40.673295893",
    "tipo": "ENTRADA"
  },
  {
    "id": 2,
    "descricao": "Mercado",
    "valor": -350.00,
    "data": "2026-11-04T19:32:00",
    "tipo": "SAIDA"
  }
]
```

### 6.3 Regras de Integração

- `valor`: número decimal; positivo para entrada, negativo para saída.
- `data`: ISO-8601; converter para `Date` e formatar em pt-BR.
- Campos desconhecidos devem ser ignorados.
- Resposta vazia (`[]`) aciona o estado vazio, não o estado de erro.
- HTTP 4xx/5xx, timeout ou erro de rede acionam o estado de erro.
- Timeout recomendado: **10 segundos**.

### 6.4 CORS

O P2 deve permitir a origem exata da Route do P3, por exemplo:

```text
Access-Control-Allow-Origin: https://p3-extrato.apps.sandbox... 
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

**Validação obrigatória antes da palestra:**

```bash
curl -i -H "Origin: https://ROUTE-DO-P3" {API_URL}/api/transacoes
```

A resposta deve conter o header `Access-Control-Allow-Origin` com a origem do P3.

---

## 7. Requisitos Técnicos

### 7.1 Stack

| Item | Especificação |
| --- | --- |
| Framework | Angular 17.3+ com standalone components |
| Linguagem | TypeScript 5.4 |
| HTTP | `provideHttpClient()` + `HttpClient` |
| Estilo | SCSS com tokens CSS custom properties |
| Build | `ng build` (output em `dist/app-openshift-v3`) |
| Servidor | Nginx alpine (preferencialmente unprivileged, porta 4200) |
| Container | Multi-stage (Node 20 build + Nginx serve) |
| Porta | 4200 |
| Configuração | `API_URL` injetada em runtime via `env.js` |
| Repositório | GitHub público `openshift-demo-angular-extrato` |
| Deploy | Import from Git com detecção de Containerfile |
| Recursos | Requests 100m CPU / 128Mi RAM · Limits 250m CPU / 256Mi RAM |

### 7.2 Estrutura de Pastas Proposta

```text
src/
├── app/
│   ├── app.component.ts
│   ├── app.config.ts
│   ├── app.routes.ts
│   ├── core/
│   │   ├── config/
│   │   │   └── app-config.service.ts
│   │   └── models/
│   │       └── transacao.model.ts
│   └── features/
│       └── extrato/
│           ├── extrato.component.ts
│           ├── extrato.component.html
│           ├── extrato.component.scss
│           └── extrato.service.ts
├── assets/
│   └── env.js
├── styles/
│   ├── _tokens.scss
│   └── _reset.scss
└── styles.scss
```

### 7.3 Configuração de HTTP

```ts
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
};
```

### 7.4 Injeção de `API_URL` em Runtime

**Arquivo base** `src/assets/env.template.js`:

```js
window.__env = {
  apiUrl: '${API_URL}'
};
```

**Entrypoint do container** (`docker-entrypoint.d/40-env.sh`):

```sh
#!/bin/sh
envsubst '${API_URL}' < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js
```

**Leitura no Angular**:

```ts
const apiUrl = (window as any).__env?.apiUrl ?? '';
```

Requisitos:

- `env.js` deve ser servido com `Cache-Control: no-store`.
- A imagem não deve ser reconstruída para trocar a URL da API.
- A variável `API_URL` deve ser configurada no Deployment do OpenShift.
- Se `API_URL` estiver vazia, a aplicação deve exibir o estado de erro com mensagem de configuração.

### 7.5 Containerfile Multi-Stage (referência)

```dockerfile
# stage 1 — build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# stage 2 — runtime
FROM nginxinc/nginx-unprivileged:1.25-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/app-openshift-v3/browser /usr/share/nginx/html
COPY docker-entrypoint.d/40-env.sh /docker-entrypoint.d/40-env.sh
USER 101
EXPOSE 4200
```

> **Nota:** `nginxinc/nginx-unprivileged` é recomendado para OpenShift, que executa containers com UID arbitrário. Caso seja usado `nginx:alpine`, é necessário ajustar permissões e portas para evitar falha de startup.

### 7.6 Nginx (referência)

```nginx
server {
  listen 4200;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  location = /env.js {
    add_header Cache-Control "no-store";
    try_files $uri =404;
  }

  location / {
    try_files $uri $uri/ /index.html;
  }

  location = /healthz {
    return 200 'ok';
    add_header Content-Type text/plain;
  }
}
```

### 7.7 Recursos no OpenShift

```yaml
resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 250m
    memory: 256Mi
```

- Target Port: **4200**.
- Criar Route com TLS (edge).
- Probes sugeridas: `GET /healthz` para liveness e readiness.

---

## 8. Acessibilidade (WCAG 2.1 AA)

### 8.1 Requisitos Obrigatórios

- Contraste mínimo **4.5:1** para texto e **3:1** para componentes de interface.
- Área de toque mínima de **48x48px**.
- Navegação completa por teclado, com foco visível.
- Ordem de foco lógica: cabeçalho → botão atualizar → lista.
- Uso de elementos semânticos: `header`, `main`, `section`, `ul`/`li`, `button`.
- Textos alternativos em ícones: `aria-hidden="true"` para decorativos e `aria-label` em ações.
- Estados dinâmicos anunciados: `aria-live="polite"` para sucesso e `role="alert"` para erro.
- `aria-busy="true"` durante carregamento.
- Não transmitir informação apenas por cor; usar sinal e texto.
- Respeitar `prefers-reduced-motion` para animações de skeleton/spinner.

### 8.2 Checklist de Acessibilidade

- [ ] Contraste validado com ferramenta (ex.: axe, Lighthouse).
- [ ] Tela navegável apenas com teclado.
- [ ] Leitores de tela anunciam carregamento, erro, vazio e sucesso.
- [ ] Botões com rótulo acessível.
- [ ] Foco visível em todos os elementos interativos.
- [ ] Zoom de 200% sem perda de conteúdo.
- [ ] Nenhuma informação dependente exclusivamente de cor.

---

## 9. Critérios de Aceite

### 9.1 Funcionais

- [ ] Frontend acessível via Route HTTPS.
- [ ] Tela exibe a lista de transações retornadas pelo `GET` do P2.
- [ ] Saldo calculado corretamente (soma de todos os `valor`).
- [ ] Valores formatados em `R$` e datas em `dd/MM/yyyy HH:mm`.
- [ ] Botão "Atualizar" refaz a requisição e atualiza saldo/lista.
- [ ] Estado de carregando com skeleton/spinner.
- [ ] Estado de erro com mensagem amigável e "Tentar novamente".
- [ ] Estado vazio com "Nenhuma transação encontrada".
- [ ] Ordenação por data decrescente.
- [ ] `API_URL` alterável sem rebuild da imagem.

### 9.2 Visuais e Design System

- [ ] Tokens de cor, tipografia, espaçamento e raio aplicados.
- [ ] Vermelho da marca usado apenas em ações/identidade, nunca como erro.
- [ ] Layout responsivo em mobile, tablet e desktop conforme grid.
- [ ] Valores positivos em verde e negativos em vermelho, com sinal textual.
- [ ] Componentes seguem estados default/hover/pressed/disabled/loading.

### 9.3 Não Funcionais

- [ ] Build concluído em menos de 5 minutos.
- [ ] Sem erros de CORS no console do navegador.
- [ ] Container inicia com UID arbitrário no OpenShift.
- [ ] Probes de liveness/readiness respondendo em `/healthz`.
- [ ] Recursos dentro dos limites definidos.
- [ ] Lighthouse de acessibilidade ≥ 90.

---

## 10. Roteiro de Demonstração

1. Abrir o Console Developer → **+Add → Import from Git**.
2. Colar a URL do repositório Angular.
3. Confirmar que o OpenShift detectou o **Containerfile**.
4. Definir **Target Port = 4200** e marcar **Create Route**.
5. Configurar a variável `API_URL` com a Route do P2.
6. Aguardar o build e abrir a Route.
7. Mostrar o extrato populado (seed do P2).
8. Clicar em **"Atualizar"**.
9. (Opcional ao vivo) Executar `curl -X POST` no P2 adicionando uma transação.
10. Clicar novamente em **"Atualizar"** e mostrar a nova linha.
11. Bônus: abrir Dev Spaces, editar um texto, commitar e ver a atualização automática.
12. Encerrar destacando o ciclo de feedback curto entre frontend e API.

---

## 11. Plano de Validação Pré-Palestra

### D-5 — Dry-run

- [ ] Build local (`npm ci && npm run build`) abaixo de 5 minutos.
- [ ] Container build local funcionando.
- [ ] Container responde em `http://localhost:4200`.
- [ ] `env.js` gerado corretamente a partir de `API_URL`.
- [ ] Deploy de teste no Sandbox concluído.
- [ ] Route HTTPS acessível.

### D-1 — Validação de dependências

- [ ] P2 respondendo em `/api/transacoes`.
- [ ] CORS do P2 liberado para a Route do P3.
- [ ] Seed de transações executado no P2.
- [ ] Extrato exibindo dados no P3.
- [ ] Estados de carregando, erro, vazio e sucesso testados.
- [ ] Sandbox dentro da validade e com cota.
- [ ] Plano B (gravação/vídeo) disponível.

### D0 — Antes da palestra

- [ ] Abrir a Route do P3 e confirmar o extrato populado.
- [ ] Testar "Atualizar".
- [ ] Ter o `curl` de seed à mão.
- [ ] Fechar abas e notificações desnecessárias.

---

## 12. Riscos e Mitigações

| Risco | Impacto | Mitigação |
| --- | --- | --- |
| P2 indisponível ou sem CORS | Alto | Validar P2 em D-1; testar `GET` e preflight antes da palestra |
| P2 sem transações (tela vazia) | Médio | Seed em D-1; ter `curl` de seed à mão |
| Build Angular lento | Médio | `npm ci`, multi-stage e cache de camadas; dry-run em D-5 |
| Container falha com UID arbitrário | Alto | Usar Nginx unprivileged e permissões adequadas |
| `API_URL` incorreta | Alto | Validar `env.js` no container e mensagem clara de erro |
| Expiração do Sandbox | Alto | Verificar validade em D-1; plano B com gravação |
| Dev Spaces indisponível | Baixo | Bônus opcional, não crítico |
| Rede/Internet instável | Alto | Vídeos/gifs de fallback |
| Uso indevido da marca Bradesco | Médio | Manter caráter conceitual/educacional; não usar logo oficial |
| Divergência com Liquid/Base | Médio | Alinhar tokens e componentes às diretrizes internas em uso real |

---

## 13. Roadmap e Entregáveis

| Fase | Entregas | Prazo estimado |
| --- | --- | --- |
| Fase 1 — Fundação | Projeto Angular, tokens, layout base, configuração de `API_URL` | 1–2 dias |
| Fase 2 — Integração | Service, modelo, cálculo de saldo, formatação pt-BR | 1 dia |
| Fase 3 — Estados e Acessibilidade | Loading, erro, vazio, sucesso, WCAG AA | 1 dia |
| Fase 4 — Container e Deploy | Containerfile, Nginx, deploy no OpenShift, validação | 1 dia |
| Fase 5 — Ensaio | Dry-run, checklist D-5/D-1, ajustes finais | 1 dia |

**Artefatos esperados:**

- Código Angular 17 no repositório público.
- `Containerfile` multi-stage.
- `nginx.conf` e script de entrypoint.
- `env.template.js`.
- Documentação de deploy (README).
- Checklist de validação preenchido.

---

## 14. Anexos

### A1-P3 — Modelo de Transação

```ts
export interface Transacao {
  id: string | number;
  descricao: string;
  valor: number;
  data: string;
  tipo?: 'ENTRADA' | 'SAIDA';
}
```

### A2-P3 — Serviço de Extrato

```ts
@Injectable({ providedIn: 'root' })
export class ExtratoService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Transacao[]> {
    const apiUrl = (window as any).__env?.apiUrl ?? '';
    return this.http.get<Transacao[]>(`${apiUrl}/api/transacoes`);
  }
}
```

### A3-P3 — Regras de Formatação

```ts
const formatoMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

const formatoData = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});
```

### A4-P3 — Containerfile de Referência

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.25-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/app-openshift-v3/browser /usr/share/nginx/html
COPY docker-entrypoint.d/40-env.sh /docker-entrypoint.d/40-env.sh
USER 101
EXPOSE 4200
```

### A5-P3 — Script de Seed (P2)

```bash
curl -X POST "$API_URL/api/transacoes" \
  -H "Content-Type: application/json" \
  -d '{"descricao":"Salário","valor":3000.00,"data":"2026-11-05T08:00:00"}'

curl -X POST "$API_URL/api/transacoes" \
  -H "Content-Type: application/json" \
  -d '{"descricao":"Mercado","valor":-350.00,"data":"2026-11-04T19:32:00"}'
```

### A6-P3 — Checklist de Validação Pré-Palestra

- [ ] P2 respondendo com CORS para a origem do P3.
- [ ] P2 com transações populadas.
- [ ] P3 com Route HTTPS acessível.
- [ ] `API_URL` configurada no Deployment.
- [ ] `env.js` servido com `no-store` e valor correto.
- [ ] Saldo calculado corretamente.
- [ ] Valores e datas em pt-BR.
- [ ] Botão "Atualizar" funcional.
- [ ] Estados de carregando, erro, vazio e sucesso validados.
- [ ] Navegação por teclado e contraste validados.
- [ ] Build abaixo de 5 minutos.
- [ ] `/healthz` respondendo.
- [ ] Plano B de demonstração disponível.

---

## 15. Mensagem-Chave

> "Ciclo de feedback curto: você vê o resultado visual do seu extrato Angular quase instantaneamente, consumindo sua API Spring Boot sem configurar servidores web ou pipelines complexos — e com uma experiência consistente, acessível e alinhada ao Design System."
