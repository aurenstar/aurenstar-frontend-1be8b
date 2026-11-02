# Aurenstar — front end

Site `aurenstar.com`: React 19 + Vite + Tailwind 4, publicado no **Cloudflare Pages**.

## Comandos

```bash
bun install            # instala as dependências
npm run dev            # servidor local (Express + Vite) em http://localhost:3000
npm run build          # vite build + pré-renderização (scripts/prerender.ts) -> pasta dist/
npm run lint           # checagem de tipos (tsc --noEmit)
```

Para testar o build exatamente como o Cloudflare Pages vai servir (páginas, redirecionamentos, headers e APIs):

```bash
npm run build
npx wrangler pages dev dist --compatibility-date=2026-10-01
```

## Como o SEO funciona

O site é um SPA (as telas são montadas no navegador). Para que o Google e os robôs de
pré-visualização (WhatsApp, Facebook, X...) vejam as informações certas de cada página **sem rodar
JavaScript**, o `npm run build` executa `scripts/prerender.ts` depois do Vite. Ele **não muda o visual**:
apenas grava um `.html` por rota com `title`, `description`, `canonical`, `robots`, Open Graph, Twitter
e dados estruturados (JSON-LD) já dentro do `<head>`.

| Arquivo | Para que serve |
| --- | --- |
| `src/utils/seoData.ts` | Fonte única dos dados de SEO de cada página (títulos, descrições, JSON-LD). **Edite aqui** para mudar textos de SEO. |
| `src/utils/seo.ts` | Aplica esses dados ao `<head>` quando o visitante navega dentro do site. |
| `src/utils/articleSlug.ts` | URLs dos artigos com palavras-chave (`/blog/<titulo-em-ingles>`). O `id` interno do artigo não muda. |
| `scripts/prerender.ts` | Gera o HTML de cada rota, o `sitemap.xml`, o `404.html` e os redirecionamentos de URLs antigas. |
| `public/_redirects`, `public/_headers`, `public/robots.txt` | Regras estáticas do Cloudflare Pages. |
| `public/og-aurenstar.png` | Imagem 1200×630 usada ao compartilhar links. Pode ser trocada por uma arte própria. |

**Novo artigo ou termo do dicionário:** basta adicioná-lo em `src/data/`. No próximo build ele ganha
página própria, entra no sitemap e recebe SEO automaticamente.

Páginas de resultado pessoal (`*-result`) e o painel interno `/dictionary` saem com `noindex` e ficam fora do sitemap.

## APIs (Cloudflare Pages Functions)

`/api/zodiac` e `/api/aureneffect` ficam em `functions/api/`. A lógica é a mesma do servidor local e
está em `server/api.ts` (usada pelos dois).

Variável opcional no painel do Cloudflare (**Pages → Settings → Variables and Secrets**):

- `GEMINI_API_KEY` — habilita o texto refinado por IA. Sem ela as duas rotas respondem com as
  leituras prontas do próprio código (o site continua funcionando).

## Publicação no Cloudflare Pages

- Build command: `npm run build`
- Build output directory: `dist`
- Cada branch do GitHub gera uma prévia automática em `https://<branch>.<projeto>.pages.dev`.
