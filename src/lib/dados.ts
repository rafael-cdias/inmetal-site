import { z } from 'astro/zod';
import siteJson from '../data/site.json';
import homeJson from '../data/home.json';

const vazio = (v: unknown): boolean =>
  v === '' || v === null || v === undefined ||
  (typeof v === 'object' && !Array.isArray(v) && Object.values(v as object).every(vazio));
const opcional = <T extends z.ZodTypeAny>(t: T) => z.preprocess((v) => (vazio(v) ? undefined : v), t.optional());

/* Mesma regra do content.config.ts: .strict() para não perder campos em silêncio. */

const SiteSchema = z.object({
  nome: z.string(),
  slogan: z.string(),
  descricao: z.string(),
  logo: z.string(),
  empresa_rodape: z.string(),
  telefone: z.string(),
  whatsapp: z.string(),
  whatsapp_exibicao: z.string(),
  whatsapp_mensagem: z.string(),
  email: z.string(),
  endereco: z.string(),
  cidade: z.string(),
  horario: z.string(),
  contato_texto: z.string(),
  contato_capa: opcional(z.string()),
  contato_capa_posicao: opcional(z.string()),
  instagram: opcional(z.string()),
  facebook: opcional(z.string()),
  youtube: opcional(z.string()),
  mapa_embed: z.string(),
}).strict();

const Card = z.object({
  titulo: z.string(),
  imagem: z.string(),
  link: z.string(),
  texto: z.string(),
}).strict();

const HomeSchema = z.object({
  destaques: z.array(z.object({
    titulo: z.string(),
    video: opcional(z.string()),
    poster: opcional(z.string()),
    link: z.string(),
    imagens: z.array(z.object({
      imagem: z.string(),
      rotulo: z.string(),
      categoria: z.string(),
    }).strict()).default([]),
  }).strict()),
  intro_titulo: z.string(),
  intro_texto: z.string(),
  servicos_titulo: z.string(),
  servicos: z.array(Card),
  produtos_titulo: z.string(),
  produtos: z.array(Card),
  catalogo: opcional(z.object({
    titulo: z.string(),
    texto: z.string(),
    arquivo: z.string(),
    capa: z.string(),
    botao: z.string(),
  }).strict()),
}).strict();

export const site = SiteSchema.parse(siteJson);
export const home = HomeSchema.parse(homeJson);

export const whatsappLink = (msg = site.whatsapp_mensagem) =>
  `https://wa.me/${site.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;

export const telLink = `tel:+55${site.telefone.replace(/\D/g, '')}`;

/** Parágrafos simples a partir de texto com quebras de linha duplas. */
export const paragrafos = (t: string) => t.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
