// Auditoria cruzada (playbook 3.5): campos usados nas páginas x schema Zod x .pages.yml
// Uso: node scripts/auditar-campos.mjs
import { readFileSync, readdirSync } from 'node:fs';

const yml = readFileSync('.pages.yml', 'utf8');
const bloco = (nome) => {
  const i = yml.indexOf(`- name: ${nome}\n`);
  const j = yml.indexOf('\n  - name: ', i + 5);
  return yml.slice(i, j === -1 ? undefined : j);
};
const camposYml = (txt) => new Set([...txt.matchAll(/name: (\w+)/g)].map((m) => m[1]));
const camposZod = (txt) => new Set([...txt.matchAll(/^\s*(\w+): z\./gm)].map((m) => m[1]));

const cfg = readFileSync('src/content.config.ts', 'utf8');
const dados = readFileSync('src/lib/dados.ts', 'utf8');
const astro = ['src/pages/[slug].astro', 'src/pages/index.astro', 'src/pages/contato.astro', 'src/layouts/Base.astro', 'src/components/Galeria.astro']
  .map((f) => readFileSync(f, 'utf8')).join('\n');

let erros = 0;
const comparar = (titulo, a, b, ignorar = []) => {
  const falta = [...a].filter((x) => !b.has(x) && !ignorar.includes(x));
  if (falta.length) { erros++; console.log(`✗ ${titulo}: ${falta.join(', ')}`); }
  else console.log(`✓ ${titulo}`);
};

// Páginas
const ymlPag = camposYml(bloco('paginas')); ymlPag.delete('paginas');
const zodPag = camposZod(cfg); zodPag.delete('schema');
comparar('Páginas: no .pages.yml mas não no Zod', ymlPag, zodPag, ['body']);
comparar('Páginas: no Zod mas não no .pages.yml', zodPag, ymlPag);
const astroPag = readFileSync('src/pages/[slug].astro', 'utf8') + readFileSync('src/layouts/Base.astro', 'utf8');
const usadosPag = new Set([...astroPag.matchAll(/\b(?:d|p\.data|f|d\.paleta|d\.catalogo)\.(\w+)/g)].map((m) => m[1]));
comparar('Páginas: usado nos .astro mas não no Zod', usadosPag, zodPag, ['length', 'id', 'match', 'imagem']);

// Site e Home
for (const nome of ['site', 'home']) {
  const y = camposYml(bloco(nome)); y.delete(nome);
  const ini = dados.indexOf(nome === 'site' ? 'const SiteSchema' : 'const Card');
  const fim = dados.indexOf(nome === 'site' ? 'const Card' : 'export const site');
  const z = camposZod(dados.slice(ini, fim));
  comparar(`${nome}: no .pages.yml mas não no Zod`, y, z);
  comparar(`${nome}: no Zod mas não no .pages.yml`, z, y);
  const json = JSON.parse(readFileSync(`src/data/${nome}.json`, 'utf8'));
  const chaves = new Set(); const andar = (o) => { if (Array.isArray(o)) o.forEach(andar); else if (o && typeof o === 'object') Object.entries(o).forEach(([k, v]) => { chaves.add(k); andar(v); }); };
  andar(json);
  comparar(`${nome}: no JSON mas não no .pages.yml`, chaves, y);
}

// Front-matter real dos .md
const fm = new Set();
for (const f of readdirSync('src/content/paginas')) {
  const t = readFileSync(`src/content/paginas/${f}`, 'utf8').split('---')[1];
  [...t.matchAll(/^\s*(?:- )?(\w+):/gm)].forEach((m) => fm.add(m[1]));
}
comparar('Páginas: no .md mas não no .pages.yml', fm, ymlPag);

process.exit(erros ? 1 : 0);
