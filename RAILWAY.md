# Deploy no Railway

Este projeto sobe como **dois serviços** dentro do mesmo projeto Railway:

1. **`web`** — o processo Node único (Fastify) que serve a API (`/api/*`) **e** o build
   estático do frontend (mesma origem, sem CORS — ver `backend/src/server.ts`). Builder
   NIXPACKS, configurado por [`railway.json`](railway.json) na raiz do repo.
2. **`mariadb`** — banco próprio, via Dockerfile em [`deploy/mariadb/`](deploy/mariadb/),
   com volume persistente. Não é o addon "MySQL" do Railway nem o template oficial
   "MariaDB": é a imagem `mariadb:10` com `innodb_ft_min_token_size=2` aplicado por
   arquivo de config (`deploy/mariadb/custom.cnf`), reproduzindo exatamente o que
   `docker-compose.yml` faz em dev via `command:`. Esse parâmetro é obrigatório — sem
   ele, o índice FULLTEXT (`eventos_busca_fulltext`) descarta tokens de 2 caracteres
   como "5k", "8k" e UFs, e a busca passa a divergir silenciosamente entre dev e prod
   (ver comentário no docker-compose.yml e em `backend/src/db/fulltextMaintenance.ts`).
   Validado localmente com `docker build` + `SHOW VARIABLES LIKE 'innodb_ft_min_token_size'`
   antes de escrever este guia.

Não existe deploy separado de "frontend" — o SPA é servido pelo mesmo processo backend,
de propósito (evita os problemas de cookie cross-site que `SameSite=Lax` teria em
domínios diferentes; ver `README.md`).

## Passo a passo

### 1. Criar o projeto e o serviço `mariadb`

1. No painel Railway, crie um projeto novo e conecte este repositório GitHub.
2. Adicione um serviço **"Deploy from GitHub repo"** apontando para o mesmo repo, mas em
   **Settings → Source → Root Directory** defina `deploy/mariadb` e **Builder** `Dockerfile`.
   Renomeie o serviço para `mariadb` (os nomes importam: as variáveis do serviço `web`
   abaixo referenciam esse nome).
3. Em **Settings → Volumes**, adicione um volume montado em `/var/lib/mysql` (senão os
   dados somem a cada deploy).
4. Em **Variables**, defina:

   | Variável                | Valor                                  |
   |--------------------------|-----------------------------------------|
   | `MARIADB_DATABASE`       | `potof`                                 |
   | `MARIADB_USER`           | `potof`                                 |
   | `MARIADB_PASSWORD`       | gere um valor forte (`openssl rand -hex 24`) |
   | `MARIADB_ROOT_PASSWORD`  | gere um valor forte (`openssl rand -hex 24`) |

   Marque `MARIADB_PASSWORD` e `MARIADB_ROOT_PASSWORD` como *sensitive* no painel.
5. Faça deploy do serviço e confirme nos logs que o MariaDB subiu sem erro.

### 2. Criar o serviço `web`

1. Adicione outro serviço a partir do mesmo repo, **Root Directory** = raiz do repo (o
   `railway.json` já configura build/start/healthcheck automaticamente — não precisa
   mexer em builder).
2. Em **Variables**, defina:

   | Variável | Valor | Observação |
   |---|---|---|
   | `DATABASE_URL` | `mysql://${{mariadb.MARIADB_USER}}:${{mariadb.MARIADB_PASSWORD}}@${{mariadb.RAILWAY_PRIVATE_DOMAIN}}:3306/${{mariadb.MARIADB_DATABASE}}` | referência às variáveis do serviço `mariadb` via rede privada Railway |
   | `NODE_ENV` | `production` | **obrigatório** — sem isso os cookies de sessão (`potof_sid`, `potof_admin_sid`) sobem sem `Secure`, ver `backend/src/routes/eventos.ts` e `routes/admin/auth.ts` |
   | `ADMIN_SESSION_SECRET` | gere com `openssl rand -hex 32` | assina o cookie de sessão do admin |
   | `ADMIN_SEED_EMAIL` | email do primeiro admin | só usado pelo seed (passo 3) |
   | `ADMIN_SEED_PASSWORD` | senha forte | idem — marque como *sensitive* |
   | `SYNC_SCHEDULER_ENABLED` | `true` | sync automático de catálogo dos provedores roda dentro do próprio processo (ver `providers/scheduler.ts`) — não precisa de cron externo no Railway |
   | `SYNC_INTERVAL_HOURS` | `6` | ajuste se quiser outro intervalo |
   | `FEATURE_AI_PHOTO_EDIT` | `true` | efeitos de IA habilitados |
   | `AI_PROVIDER` | `openai` (ou `gemini`) | escolha o provedor |
   | `OPENAI_API_KEY` | sua chave OpenAI | obrigatório se `AI_PROVIDER=openai`; marque como *sensitive* |
   | `GEMINI_API_KEY` | sua chave Gemini | só se for usar `AI_PROVIDER=gemini` |
   | `FRONTEND_ORIGIN` | preencha depois do passo 3 | ver nota abaixo |

   Não defina `PORT` — o Railway injeta a própria e o app já lê `process.env.PORT`
   (`backend/src/server.ts`).
3. Faça o deploy. Depois que ele subir, vá em **Settings → Networking → Generate Domain**
   para obter a URL pública (ex.: `potof-production.up.railway.app`). Volte em
   **Variables** e ajuste `FRONTEND_ORIGIN` para essa URL — como front e back estão na
   mesma origem em produção, essa variável não é usada para bloquear nada no caminho
   normal, mas é o valor que `@fastify/cors` espera caso algum dia exista uma origem
   separada (preview environment, domínio alternativo etc.), então mantenha-a correta.
4. Confirme o healthcheck: `railway.json` já aponta para `GET /api/health`.

### 3. Popular o banco (uma vez, após o primeiro deploy)

O `start` do backend (`prisma migrate deploy && node dist/server.js`) já aplica as
migrations sozinho a cada boot. Mas o **seed** (admin, provedores, categorias com ícones)
não roda automaticamente — rode uma vez via Railway CLI:

```bash
railway link            # conecta ao projeto (escolha o serviço "web")
railway run --service web npm run prisma:seed --workspace backend
```

O script (`backend/prisma/seed.ts`) é idempotente (usa `upsert` / checa existência antes
de criar), então rodar de novo depois de um redeploy não duplica nada nem quebra.

### 4. Verificar

- `https://<seu-dominio>/api/health` → `{"status":"ok"}`.
- `https://<seu-dominio>/admin` → login com `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD`.
- `https://<seu-dominio>/evento/300101` (ou outro id existente) → fluxo de busca por selfie.
- Logs do serviço `web` ~1 min após o boot devem mostrar o primeiro ciclo do sync
  scheduler (`sync scheduler: sincronização automática concluída`).

## Variáveis — referência completa

Ver [`backend/.env.example`](backend/.env.example) para a lista com os comentários
originais de cada variável (usado em dev; em produção o `.env` não existe, tudo vem do
painel do Railway).

## Notas

- **Réplicas**: o `railway.json` não define `numReplicas` (fica em 1). Se algum dia
  escalar para mais de uma réplica, mover `prisma migrate deploy` do `startCommand` para
  `deploy.preDeployCommand` evita que múltiplas réplicas tentem migrar ao mesmo tempo —
  não fiz essa mudança agora porque não há necessidade concreta dela hoje.
- **Manutenção do índice FULLTEXT**: `rebuildEventosFulltextIndex` (ver
  `backend/src/db/fulltextMaintenance.ts`) já roda sozinho depois de cada sync completo —
  nenhuma ação manual necessária em produção.
- **`ai-photo-test/`**: é uma ferramenta de dev (`workspace` no `package.json` raiz), não
  entra no build de produção (`npm run build` só builda `backend` e `frontend`), mas
  `npm install` na raiz ainda instala suas dependências. Sem impacto funcional, só builda
  um pouco mais devagar — não vale a complexidade de excluir agora.
