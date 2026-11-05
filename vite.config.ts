import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

/**
 * Automatically written dictionary terms are big (3 languages + FAQ). The browser bundle only gets a light copy
 * (enough for the dictionary list); each term page loads its full text from /dictionary-data/<slug>.json.
 * Node scripts (prerender, tests, the robot) still read the full file, so search engines get everything.
 */
const lightDictionary = () => ({
  name: 'light-dictionary',
  enforce: 'pre' as const,
  resolveId(source: string, importer?: string) {
    if (!source.endsWith('dictionaryGenerated.json') || !importer) return null;
    return '\0light-dictionary:' + path.resolve(path.dirname(importer), source) + '?light.js';
  },
  load(id: string) {
    if (!id.startsWith('\0light-dictionary:')) return null;
    const file = id.slice('\0light-dictionary:'.length).replace('?light.js', '');
    (this as any).addWatchFile?.(file);
    const code = fs.readFileSync(file, 'utf8');
    const keep = ['termo', 'perguntaGoogle', 'resumoUmaLinha', 'chamadaCuriosa'];
    const light = (JSON.parse(code) as any[]).map((t) => ({
      id: t.id, slug: t.slug, termo: t.termo, tituloSEO: t.tituloSEO, perguntaGoogle: t.perguntaGoogle, categoria: t.categoria, icone: t.icone,
      resumoUmaLinha: t.resumoUmaLinha, explicacaoEducativa: t.explicacaoEducativa, chamadaCuriosa: t.chamadaCuriosa,
      oQueSignifica: '', oQueSignificaNaAstrologia: '', exemploFicticio: '', dicaRapida: '', miniJogo: { pergunta: '', opcoes: [] },
      termosRelacionados: t.termosRelacionados, ferramentaRelacionada: t.ferramentaRelacionada,
      traducoes: Object.fromEntries(Object.entries(t.traducoes || {}).map(([l, v]: [string, any]) => [l, Object.fromEntries(keep.map((k) => [k, v?.[k]]))])),
    }));
    return { code: `export default ${JSON.stringify(light)}`, map: null };
  },
});


/**
 * Same idea for the WordPress articles: the browser bundle (home page, blog list) only needs titles, pictures and
 * summaries. The long text (sections, quote, key points) loads when an article is opened (ensureFullArticles).
 * Only blogArticles.ts gets the light copy; every other importer (and Node scripts) read the full file.
 */
const lightArticles = () => ({
  name: 'light-articles',
  enforce: 'pre' as const,
  resolveId(source: string, importer?: string) {
    if (!source.endsWith('wordpressArticles.generated.json') || !importer) return null;
    if (path.basename(importer.split('?')[0]) !== 'blogArticles.ts') return null;
    return '\0light-articles:' + path.resolve(path.dirname(importer), source) + '?light.js';
  },
  load(id: string) {
    if (!id.startsWith('\0light-articles:')) return null;
    const file = id.slice('\0light-articles:'.length).replace('?light.js', '');
    (this as any).addWatchFile?.(file);
    const light = (JSON.parse(fs.readFileSync(file, 'utf8')) as any[]).map((a) => ({ ...a, sections: [], keyTakeaways: { pt: [], en: [], es: [] } }));
    return { code: `export default ${JSON.stringify(light)}`, map: null };
  },
});

export default defineConfig(() => {
  return {
    plugins: [lightDictionary(), lightArticles(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
