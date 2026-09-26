import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

/**
 * Share-card image for Open Graph / Twitter (WhatsApp, LinkedIn, Facebook,
 * X, iMessage previews all read these tags).
 *
 * Pages with their own photograph (services, case studies) get it cropped to
 * the 1200x630 card every platform expects. Everything else falls back to the
 * branded card in public/og/desora.jpg.
 */
export interface OgImage {
  src: string;
  width: number;
  height: number;
  type: string;
}

export const defaultOgImage: OgImage = {
  src: '/og/desora.jpg',
  width: 1200,
  height: 630,
  type: 'image/jpeg',
};

export async function ogImageFrom(media: ImageMetadata | undefined): Promise<OgImage> {
  if (!media) return defaultOgImage;
  // Never ask for more pixels than the source has: sharp does not upscale, so
  // the file would come out narrower than the size declared in the meta tags.
  // Keeping the 1.91:1 card ratio at the source's width keeps the two equal.
  const width = Math.min(1200, media.width);
  const height = Math.round((width * 630) / 1200);
  const img = await getImage({
    src: media,
    width,
    height,
    fit: 'cover',
    position: 'center',
    format: 'jpg',
    quality: 78,
  });
  return { src: img.src, width, height, type: 'image/jpeg' };
}
