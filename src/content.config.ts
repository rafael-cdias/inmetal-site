import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/*
 * IMPORTANTE (playbook 3.5): todos os schemas usam .strict().
 * Se um campo existir no .md / no Pages CMS e NÃO estiver declarado aqui,
 * o build FALHA com erro claro — em vez de o Zod descartar o valor em silêncio.
 * Ao adicionar campo no .pages.yml, adicione aqui no MESMO commit.
 */

/* O Pages CMS grava campos opcionais deixados em branco como "" (ou null), e objetos
 * opcionais como { titulo: "", ... }. Tratamos isso como "não preenchido". */
const vazio = (v: unknown): boolean =>
  v === '' || v === null || v === undefined ||
  (typeof v === 'object' && !Array.isArray(v) && Object.values(v as object).every(vazio));
const opcional = <T extends z.ZodTypeAny>(t: T) => z.preprocess((v) => (vazio(v) ? undefined : v), t.optional());

const imagemGaleria = z.object({
  imagem: z.string(),
  legenda: opcional(z.string()),
}).strict();

const paginas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/paginas' }),
  schema: z.object({
    titulo: z.string(),
    menu: opcional(z.string()),
    tipo: z.enum(['produto', 'servico', 'institucional']),
    ordem: z.preprocess((v) => (vazio(v) ? undefined : v), z.number().default(99)),
    descricao: z.string(),
    capa: opcional(z.string()),
    capa_posicao: opcional(z.string()),
    capa_ajuste: opcional(z.enum(['preencher', 'inteira'])),
    video: opcional(z.string()),
    video_capa: opcional(z.string()),
    video_youtube: opcional(z.string()),
    catalogo: opcional(z.object({
      titulo: z.string(),
      texto: z.string(),
      arquivo: z.string(),
      capa: opcional(z.string()),
      botao: z.preprocess((v) => (vazio(v) ? undefined : v), z.string().default('Baixe aqui')),
    }).strict()),
    paleta: opcional(z.object({
      titulo: z.string(),
      texto: z.string(),
      imagem: z.string(),
    }).strict()),
    galeria_titulo: opcional(z.string()),
    galeria: z.preprocess((v) => (v == null ? [] : v), z.array(imagemGaleria)),
  }).strict(),
});

export const collections = { paginas };
