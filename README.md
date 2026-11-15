# P3 — Extrato Bancário Angular

Frontend Angular 17 que consome `GET /api/transacoes` do Projeto 2 (Spring Boot) e exibe um extrato bancário com identidade visual baseada no Sistema de Design Bradesco (conceitual/educacional).

## Requisitos

- Node.js 20 LTS
- npm 10+
- API do P2 acessível e com CORS habilitado para esta origem
- Docker (opcional) e acesso ao OpenShift Developer Sandbox

## Desenvolvimento local

1. Ajuste `src/assets/env.js` com a URL da API:

```js
window.__env = {
  apiUrl: 'https://api-extrato-giovannidecarvalhome-dev.apps.rm3.7wse.p1.openshiftapps.com'
};
```

2. Instale as dependências e inicie o servidor:

```bash
npm ci
npm start
```

A aplicação estará disponível em `http://localhost:4200`.

## Build de produção

```bash
npm run build
```

O bundle é gerado em `dist/app-openshift-v3/browser`.

## Container

Build da imagem:

```bash
docker build -t extrato-angular .
```

Execução local:

```bash
docker run --rm -p 4200:4200 -e API_URL=http://localhost:8080 extrato-angular
```

A variável `API_URL` é aplicada em runtime: o container gera `env.js` no startup, sem necessidade de reconstruir a imagem. A aplicação fica disponível em `http://localhost:4200` e o health check em `/healthz`.

## Deploy no OpenShift

1. Console Developer → **+Add → Import from Git**.
2. Informe a URL do repositório público.
3. Confirme que o **Containerfile** foi detectado.
4. Defina **Target Port = 4200** e marque **Create Route**.
5. Adicione a variável de ambiente `API_URL` com a Route HTTPS do P2.
6. Configure os recursos:

```yaml
resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 250m
    memory: 256Mi
```

7. Aguarde o build e acesse a Route.

Probes sugeridas:

- Liveness: `GET /healthz`
- Readiness: `GET /healthz`

## Contrato consumido

```http
GET {API_URL}/api/transacoes
Accept: application/json
```

```json
[
  {
    "id": "b2c912f7-2d52-48e5-ac52-4a0365b11e77",
    "descricao": "Salário",
    "valor": 6000.0,
    "data": "2026-11-15T04:18:40.673295893",
    "tipo": "ENTRADA"
  }
]
```

O frontend calcula o saldo somando os valores, ordena por data decrescente e exibe os estados de carregando, sucesso, vazio e erro.

> **Atenção:** se o `GET /api/transacoes` alternar entre `[]` e uma lista populada, o P2 provavelmente está com múltiplas réplicas e banco em memória. Para a demonstração, escale o P2 para 1 réplica ou use um banco compartilhado. O frontend também envia um parâmetro anti-cache a cada atualização.

## Estrutura

```text
src/app/core/            modelos e configuração runtime
src/app/features/extrato componente, template, estilos e serviço
src/assets/brand/        logos, favicons e manifest PWA
src/styles/_tokens.scss  tokens do design system
Containerfile            build multi-stage Node + Nginx
nginx.conf               SPA, cache e health check na porta 4200
docker-entrypoint.d/     geração do env.js em runtime
```

## Aviso de marca

Projeto conceitual e educacional. Não autoriza uso comercial da marca, do logotipo ou da identidade oficial do Bradesco.
