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

**Categorias do blog:** cada categoria tem URL própria (`/blog/categoria/<nome>`, definidas em
`src/utils/blogCategories.ts`). Com menos de 3 artigos a página funciona para o visitante, mas sai com
`noindex` e fora do sitemap; ao chegar em 3 artigos ela passa a ser indexada sozinha
(`MIN_ARTICLES_TO_INDEX`).

**Links de verdade:** menu, rodapé, cards do blog, categorias e palavras do dicionário são `<a href="/url">`
(o Google só segue esse tipo de link). O clique normal continua navegando dentro do site, sem recarregar.

## Contagem de visitas (Google Analytics 4)

Defina `VITE_GA_MEASUREMENT_ID` (ex.: `G-XXXXXXXXXX`) em **Pages → Settings → Variables and Secrets**
(variável de build) e faça um novo deploy. Sem essa variável nada é carregado. Cada troca de página dentro
do site envia um `page_view` com a URL e o título corretos (`src/utils/analytics.ts`).

## APIs (Cloudflare Pages Functions)

`/api/zodiac` e `/api/aureneffect` ficam em `functions/api/`. A lógica é a mesma do servidor local e
está em `server/api.ts` (usada pelos dois).

Variável opcional no painel do Cloudflare (**Pages → Settings → Variables and Secrets**):

- `OPENAI_API_KEY` — (opcional, tem prioridade) texto do Efeito Auren escrito pelo ChatGPT; `OPENAI_MODEL` troca o modelo (padrão `gpt-4o-mini`).
- `GEMINI_API_KEY` — habilita o texto refinado por IA. Sem ela as duas rotas respondem com as
  leituras prontas do próprio código (o site continua funcionando).

## Cálculo astronômico (Swiss Ephemeris + IANA + GeoNames)

Rodam no Cloudflare (Pages Functions), nada é calculado no navegador:

| Rota | O que faz |
| --- | --- |
| `GET /api/cities?q=sao pa` | Sugestões de cidade (GeoNames no Supabase: 236 mil cidades, nomes alternativos, fuso IANA de cada uma). |
| `POST /api/chart` `{date, time?, geonameid?}` | Converte a hora local do nascimento em UTC com o histórico real de fusos/horário de verão (IANA) e calcula Sol, Lua, planetas, Ascendente e Meio do Céu com o Swiss Ephemeris. Sem hora/cidade avisa que a Lua é aproximada e se o Sol muda de signo naquele dia. |

Arquivos: `server/engine/` (conversão de hora/fuso, busca de cidades e chamada ao engine). O WebAssembly e os dados `.se1` ficam no projeto aurenstar-engine.
O banco só expõe as funções `city_search` e `city_for_chart` à chave pública (dados públicos, no máximo 20 resultados).
**Licença / separação (decidido):** o Swiss Ephemeris gratuito é AGPL-3.0, por isso o cálculo dos planetas vive num projeto **separado e público**, `aurenstar-engine` (https://github.com/aurenstar/aurenstar-engine). Este site (privado) só envia a ele "hora em UTC + latitude + longitude" e recebe as posições. IANA (fusos) e GeoNames (cidades) ficam aqui, no site privado.
- Variável no Cloudflare: `ENGINE_URL` (endereço do aurenstar-engine; padrão `https://aurenstar-engine.oficial-safare.workers.dev`) e, se o engine exigir, `ENGINE_KEY`.
- Créditos obrigatórios (GeoNames CC BY 4.0 e outros) ficam na página `/credits`, com botão no rodapé ("Tools & Credits"), e o link "Source code" aponta para o repositório do engine.
- Em desenvolvimento local: rode o engine (`npm run dev` no projeto dele, porta 8788) e use `--binding ENGINE_URL=http://127.0.0.1:8788` no wrangler.

## Publicação no Cloudflare Pages

- Build command: `npm run build`
- Build output directory: `dist`
- Cada branch do GitHub gera uma prévia automática em `https://<branch>.<projeto>.pages.dev`.
