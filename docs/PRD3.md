# PRD-P3 — Frontend Angular: Tela de Extrato Bancário

**Versão:** 1.0
**Projeto:** P3
**Data:** [Data]
**Status:** Rascunho para validação

---

## 1. Contexto e Objetivo

### 1.1 Contexto

Terceiro e último projeto da trilha da palestra sobre o Red Hat OpenShift Developer Sandbox. O P3 é a experiência: um frontend Angular com uma tela simples de extrato bancário que consome apenas o `GET /api/transacoes` do Projeto 2 (PRD-P2). Visualmente atrativo para a plateia, é o projeto executado ao vivo durante a palestra.

### 1.2 Objetivo Geral

Demonstrar deploy de frontend Angular no OpenShift via Import from Git com Containerfile multi-stage, consumindo uma API Spring Boot (P2) e exibindo um extrato bancário com estados de UI bem definidos.

### 1.3 Objetivos Específicos

- Demonstrar deploy de Angular com Containerfile multi-stage (build + Nginx)
- Demonstrar injeção de variável de ambiente `API_URL` apontando para a Route do P2
- Demonstrar consumo de API REST com `HttpClient`
- Demonstrar estados de UI: carregando, erro, vazio e sucesso
- (Bônus) Demonstrar Dev Spaces com edição ao vivo

### 1.4 Fora de Escopo

- Tela de cadastro de transações (o POST é demonstrado via `curl` no P2)
- Autenticação/autorização
- Edição/exclusão de transações
- Testes automatizados (E2E, unitários)
- Persistência local (`localStorage`, etc.)

---

## 2. Público-Alvo

- Desenvolvedores frontend Angular iniciantes/intermediários em containers e Kubernetes
- Estudantes e profissionais em transição para cloud-native
- Tech leads avaliando OpenShift como plataforma para SPAs

**Premissas de conhecimento:** Git básico, Angular (standalone components), REST APIs.

---

## 3. Restrições e Premissas Técnicas

| Item | Restrição |
| --- | --- |
| Plataforma | Red Hat OpenShift Developer Sandbox (free tier) |
| Cota de recursos | ~3 cores, 14 GB RAM, 40 GB storage |
| Validade | 30 dias (renovável) |
| Tempo de build | < 5 min |
| Imagens | `node:20-alpine` (build) + `nginx:alpine` (serve) |
| Conectividade | Repositório público no GitHub |
| Idioma | UI em pt-BR |

**Premissas (dependências):**

- ⚠️ O P3 depende do P2 estar deployado e com CORS habilitado para a origem do P3
- ⚠️ O P3 depende do P2 ter transações populadas (seed feito pelo palestrante) para a tela não abrir vazia
- O P3 é executado ao vivo durante a palestra

---

## 4. Arquitetura

```text
┌─────────────────────────────────────────────────────┐
│              Developer Sandbox                       │
│                                                      │
│  ┌────────────────┐          ┌────────────────┐     │
│  │ P2: API        │◄─────────│ P3: Front      │     │
│  │ Spring Boot    │  GET     │ Angular        │     │
│  │ Extrato        │  /api/   │ Extrato        │     │
│  │                │  transacoes│ (GET only)   │     │
│  └────────────────┘          └────────────────┘     │
│         ▲                            │              │
│         │                            ▼              │
│    Route HTTPS                  Route HTTPS         │
└─────────────────────────────────────────────────────┘
```

---

## 5. Descrição Funcional

SPA Angular com uma única tela:

- **Cabeçalho:** "Meu Extrato"
- **Saldo atual:** calculado no cliente somando `valor` de todas as transações
- **Lista de transações:** descrição, valor formatado (R$), data formatada (pt-BR)
- **Botão "Atualizar":** refaz o GET
- **Indicadores visuais:** valores positivos em verde, negativos em vermelho

**Estados de UI:**

- **Carregando:** spinner
- **Erro:** mensagem amigável + botão "Tentar novamente"
- **Vazio:** "Nenhuma transação encontrada"

---

## 6. Requisitos Técnicos

| Item | Especificação |
| --- | --- |
| Framework | Angular 17+ (standalone components) |
| HTTP | `HttpClient` (`provideHttpClient`) |
| Build | `ng build` (output em `dist/`) |
| Servidor | Nginx alpine |
| Containerfile | Multi-stage (build Angular + serve com Nginx) |
| Porta | 4200 |
| Variável de ambiente | `API_URL` injetada em runtime (via `env.js` ou `assets/config.json`) apontando para a Route do P2 |
| Repositório | GitHub público (`openshift-demo-angular-extrato`) |
| Deploy | Import from Git (detecta Containerfile) |
| Recursos | Requests: 100m CPU / 128Mi RAM · Limits: 250m CPU / 256Mi RAM |

---

## 7. Critérios de Aceite

- [ ] Frontend acessível via Route HTTPS
- [ ] Tela exibe lista de transações retornadas pelo GET do P2
- [ ] Saldo calculado corretamente (soma dos `valor`)
- [ ] Valores e datas formatados em pt-BR (R$ e dd/MM/yyyy HH:mm)
- [ ] Botão "Atualizar" refaz a requisição
- [ ] Estados de carregando/erro/vazio funcionam
- [ ] Build concluído em < 5 min
- [ ] Sem erros de CORS
- [ ] Pré-requisito validado: P2 respondendo com CORS para a origem do P3

---

## 8. Roteiro de Demonstração

1. Console Developer → +Add → Import from Git
2. Colar URL do repositório Angular
3. OpenShift detecta o Containerfile
4. Definir Target Port = 4200, marcar "Create Route"
5. Configurar `API_URL` apontando para a Route do P2
6. Aguardar build → abrir Route
7. Mostrar extrato populado (seed feito no P2)
8. Clicar em "Atualizar"
9. (Opcional ao vivo) `curl -X POST` no P2 adicionando nova transação → clicar "Atualizar" no frontend → nova linha aparece
10. Bônus: abrir Dev Spaces, editar texto no Angular, commit → ver atualização automática

---

## 9. Mensagem-chave

> "Ciclo de feedback curto: você vê o resultado visual do seu extrato Angular quase instantaneamente, consumindo sua API Spring Boot sem configurar servidores web ou pipelines complexos."

---

## 10. Riscos e Mitigações

| Risco | Impacto | Mitigação |
| --- | --- | --- |
| P2 indisponível ou sem CORS | Alto | Validar P2 em D-1; testar GET antes da palestra |
| P2 sem transações (tela vazia) | Médio | Seed do P2 em D-1; ter curl de seed à mão |
| Build Angular lento | Médio | `npm ci` + Containerfile multi-stage otimizado; dry-run em D-5 |
| Expiração do Sandbox | Alto | Verificar validade em D-1; plano B (gravação) |
| Dev Spaces indisponível | Baixo | Bônus opcional, não crítico |
| Rede/Internet instável | Alto | Vídeos/gifs de fallback |

---

## 11. Anexos (a produzir)

- **A1-P3.** Exemplo de Containerfile multi-stage (Node + Nginx)
- **A2-P3.** Configuração de `API_URL` em runtime (`env.js`)
- **A3-P3.** Componente `ExtratoComponent` de referência
- **A4-P3.** Mockup textual da tela de extrato
- **A5-P3.** Checklist de validação pré-palestra (P3, incluindo validação do P2)
