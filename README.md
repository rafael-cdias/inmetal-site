# Site inMetal – www.inmetal.com.br

Site estático em **Astro 5**, hospedado na **Cloudflare Pages** e editável pelo **Pages CMS** (https://app.pagescms.org).

## Onde fica cada coisa

| O que | Arquivo |
|---|---|
| Produtos e serviços (texto, fotos, galeria) | `src/content/paginas/*.md` — o nome do arquivo é a URL (ex.: `totens.md` → `/totens/`) |
| Página inicial (vídeos, cartões) | `src/data/home.json` |
| Contato, WhatsApp, redes, mapa | `src/data/site.json` |
| Fotos, vídeos e logo | `public/uploads/` |
| Catálogo de painéis (PDF) | `public/Files/MODELO_2000_PAINEIS-compressed.pdf` |
| Painel do Pages CMS | `.pages.yml` (arquivo oculto — no Finder, `Cmd+Shift+.` para ver) |

## Cloudflare Pages

- Framework preset: **Astro**
- Build command: `npm run build`
- Output directory: `dist`
- Variável de ambiente: `NODE_VERSION = 22`

## Regras para não quebrar

- Campo novo no `.pages.yml` → declarar também em `src/content.config.ts` (páginas) ou `src/lib/dados.ts` (home/site) **no mesmo commit**. Os schemas são *strict*: se esquecer, o build falha com erro claro.
- Antes de publicar mudanças de estrutura: `node scripts/auditar-campos.mjs` (confere páginas × schema × painel).
- Vídeos: no máximo ~5 MB (limite da Cloudflare é 25 MB por arquivo). Use MP4 720p sem áudio.
