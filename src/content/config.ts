import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pricingTier = z.object({
  features: z.array(z.string()),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    order: z.number(),
    icon: z.string(),
    title: z.string(),
    h1: z.string(),
    tagline: z.string(),
    seoTitle: z.string(),
    seoDescription: z.string(),
    includedItems: z.array(
      z.object({
        icon: z.string(),
        label: z.string(),
      })
    ),
    subServices: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    ),
    process: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    ),
    pricing: z.object({
      essentiel: pricingTier,
      croissance: pricingTier,
      signature: pricingTier,
    }),
    faq: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    ),
    relatedServices: z.array(z.string()),
    caseStudyPlaceholder: z.string(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    category: z.string(),
    publishDate: z.coerce.date(),
    heroImage: z.string().optional(),
    seoTitle: z.string(),
    seoDescription: z.string(),
  }),
});

const home = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/home' }),
  schema: z.object({
    seoTitle: z.string(),
    seoDescription: z.string(),
    hero: z.object({
      title: z.string(),
      subtitle: z.string(),
    }),
    trust: z.object({
      heading: z.string(),
      items: z.array(
        z.object({
          icon: z.string(),
          label: z.string(),
        })
      ),
    }),
    servicesIntro: z.object({
      heading: z.string(),
      description: z.string(),
    }),
    differentiation: z.object({
      heading: z.string(),
      description: z.string(),
      points: z.array(
        z.object({
          icon: z.string(),
          title: z.string(),
          description: z.string(),
        })
      ),
    }),
    process: z.object({
      heading: z.string(),
      description: z.string(),
      steps: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
        })
      ),
    }),
    caseStudies: z.object({
      heading: z.string(),
      description: z.string(),
      items: z.array(
        z.object({
          sector: z.string(),
          challenge: z.string(),
          result: z.string(),
        })
      ),
    }),
    testimonials: z.object({
      heading: z.string(),
      items: z.array(
        z.object({
          quote: z.string(),
          author: z.string(),
          role: z.string(),
        })
      ),
    }),
    stats: z.object({
      heading: z.string(),
      items: z.array(
        z.object({
          value: z.string(),
          label: z.string(),
        })
      ),
    }),
    finalCta: z.object({
      heading: z.string(),
      description: z.string(),
    }),
  }),
});

const about = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/about' }),
  schema: z.object({
    seoTitle: z.string(),
    seoDescription: z.string(),
    hero: z.object({
      title: z.string(),
      subtitle: z.string(),
    }),
    mission: z.object({
      heading: z.string(),
      paragraphs: z.array(z.string()),
    }),
    beyondOrdinary: z.object({
      heading: z.string(),
      paragraphs: z.array(z.string()),
    }),
    values: z.array(
      z.object({
        icon: z.string(),
        title: z.string(),
        description: z.string(),
      })
    ),
    multilingual: z.object({
      heading: z.string(),
      description: z.string(),
      languages: z.array(z.string()),
    }),
    finalCta: z.object({
      heading: z.string(),
      description: z.string(),
    }),
  }),
});

export const collections = { services, blog, home, about };
