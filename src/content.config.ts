import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/gallery' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['roofing', 'siding', 'windows', 'doors', 'gutters', 'remodeling']),
    image: z.string(),
    alt: z.string(),
    location: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

const reviews = defineCollection({
  loader: glob({ pattern: '**/*.{json,yaml,yml}', base: './src/content/reviews' }),
  schema: z.object({
    quote: z.string(),
    author: z.string(),
    location: z.string().optional(),
    service: z.string().optional(),
    source: z.enum(['google', 'facebook', 'bbb', 'other']).optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { gallery, reviews };
