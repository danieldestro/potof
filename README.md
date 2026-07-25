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

Dois HARs de navegação real confirmaram a estrutura do grid de fotos, o modelo de dados
(visto nas respostas de `commerceft/cesta/*` e na página de produto) e o formulário real de
envio da selfie (`#formReconhecimento` em `fotos/eventos?evento={id}`): campo do arquivo é
`selfie`, acompanhado de `evento`, `order` e os campos de recorte `cropx/cropy/cropw/croph/
wresponsive/hresponsive` (enviados vazios quando o usuário não recorta manualmente, que é o
fluxo replicado pelo backend).

Ainda não foi possível capturar (o Chrome não retém corpo de upload de arquivo nem de
respostas de navegação principal no HAR, mesmo com "Save all as HAR with content"):

- **Resposta JSON do `salva-face`** (204 bytes): formato exato de sucesso/erro ainda não
  confirmado. O backend hoje só checa o status HTTP e repassa o corpo cru (`raw`) para o
  frontend — ajustar a interpretação assim que confirmado.
- **`GET /fotos/eventos/busca/evento/{id}/rc/1`** pós-selfie: a estrutura do grid foi inferida
  da página de produto (`commerceft/produtos/foto/...`), que reaproveita o mesmo layout —
  vale confirmar que essa é de fato a lista filtrada pelo rosto, e não o álbum completo do
  evento.

## Variáveis de ambiente (backend)

| Variável           | Padrão                     | Descrição                     |
|---------------------|----------------------------|--------------------------------|
| `PORT`              | `4000`                      | Porta do backend               |
| `FRONTEND_ORIGIN`   | `http://localhost:5173`    | Origem liberada no CORS        |
