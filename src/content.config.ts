import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/*
 * IMPORTANTE (playbook 3.5): todos os schemas usam .strict().
 * Se um campo existir no .md / no Pages CMS e NÃO estiver declarado aqui,
 * o build FALHA com erro claro — em vez de o Zod descartar o valor em silêncio.
 * Ao adicionar campo no .pages.yml, adicione aqui no MESMO commit.
 */

const imagemGaleria = z.object({
  imagem: z.string(),
  legenda: z.string().optional(),
}).strict();

const paginas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/paginas' }),
  schema: z.object({
    titulo: z.string(),
    menu: z.string().optional(),
    tipo: z.enum(['produto', 'servico', 'institucional']),
    ordem: z.number().default(99),
    descricao: z.string(),
    capa: z.string().optional(),
    video_youtube: z.string().optional(),
    catalogo: z.object({
      titulo: z.string(),
      texto: z.string(),
      arquivo: z.string(),
      botao: z.string().default('Baixe aqui'),
    }).strict().optional(),
    paleta: z.object({
      titulo: z.string(),
      texto: z.string(),
      imagem: z.string(),
    }).strict().optional(),
    galeria_titulo: z.string().optional(),
    galeria: z.array(imagemGaleria).default([]),
  }).strict(),
});

export const collections = { paginas };
