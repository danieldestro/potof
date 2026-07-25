# potof

SPA mobile-first para buscar, navegar e favoritar fotos de eventos esportivos do
[fotop.com.br](https://fotop.com.br), usando busca por selfie.

## Arquitetura

```
[Browser: React SPA] <--mesma origem--> [Node.js backend (BFF)] <--HTTP--> [fotop.com.br]
```

O navegador do usuário só conversa com o backend potof (mesma origem, sem CORS). O
backend é quem mantém a sessão do fotop.com.br (`FOTOPSITESESSID`) por usuário, reenvia
a selfie para `salva-face`, busca a página de resultados e faz o parsing do HTML
(`.foto-item[data-id] a.fotoCorredor img`) devolvendo JSON limpo para o front.

- `backend/` — Node.js + TypeScript + Fastify. Proxy/scraper do fotop.com.br.
- `frontend/` — React + Vite + TypeScript. SPA mobile-first.

## Rodando localmente

```bash
npm install

# terminal 1
npm run dev:backend   # http://localhost:4000

# terminal 2
npm run dev:frontend  # http://localhost:5173 (proxy /api -> backend)
```

Acesse `http://localhost:5173/evento/{id}` (ex: `300101`).

## Fluxo implementado

1. `POST /api/eventos/:id/selfie` — garante a sessão fotop (visita `fotos/eventos?evento={id}`)
   e reencaminha a selfie (multipart) para `fotos/eventos/salva-face`.
2. `GET /api/eventos/:id/fotos` — busca `fotos/eventos/busca/evento/{id}/rc/{n}` (incrementando
   `rc` até vir uma página vazia — hoje não há paginação real, mas o backend já suporta se
   passar a existir) e retorna as fotos como JSON.
3. Frontend: upload de selfie → grid de fotos encontradas → visualizador em tela cheia com
   navegação por seta do teclado, swipe e botões → favoritos salvos em `localStorage` por
   evento (sem persistência no servidor, por ora).

## Itens em aberto (assunções pendentes de confirmação)

Um HAR de navegação real confirmou a estrutura do grid de fotos e o modelo de dados (visto
nas respostas de `commerceft/cesta/*` e na página de produto), mas duas chamadas ficaram sem
corpo de resposta capturado no HAR:

- **`POST /fotos/eventos/salva-face`**: não temos o nome real do campo do multipart nem o
  formato do JSON de resposta (204 bytes). Hoje o backend usa um valor padrão configurável
  via `FOTOP_SELFIE_FIELD_NAME` (default `"foto"`) em
  `backend/src/fotop/fotopClient.ts`. **Ajustar assim que confirmado.**
- **`GET /fotos/eventos/busca/evento/{id}/rc/1`** pós-selfie: a estrutura do grid foi inferida
  da página de produto (`commerceft/produtos/foto/...`), que reaproveita o mesmo layout —
  mas vale confirmar que essa é de fato a lista filtrada pelo rosto, e não o álbum completo
  do evento.

Para resolver, capture um HAR com **"Save all as HAR with content"** no DevTools (Network,
clique direito) durante o fluxo: abrir evento → enviar selfie → ver resultado.

## Variáveis de ambiente (backend)

| Variável                    | Padrão                     | Descrição                                   |
|------------------------------|----------------------------|----------------------------------------------|
| `PORT`                        | `4000`                      | Porta do backend                              |
| `FRONTEND_ORIGIN`              | `http://localhost:5173`    | Origem liberada no CORS                       |
| `FOTOP_SELFIE_FIELD_NAME`      | `foto`                      | Nome do campo multipart enviado a `salva-face`|
