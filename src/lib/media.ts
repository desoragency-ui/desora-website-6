import type { ImageMetadata } from 'astro';

/**
 * Art-directed photography, resolved by slot name.
 *
 * Files live in `src/assets/media/` (not `public/`) so Astro's image pipeline
 * optimises them: WebP/AVIF conversion, responsive srcset, and intrinsic
 * dimensions that prevent layout shift. Drop a new file in that folder and it
 * is picked up automatically; the slot name is the filename without extension.
 *
 * See design-system/imagery.md for the direction these were shot to.
 */
const files = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/media/*.{jpg,jpeg,png,webp,avif}',
  { eager: true }
);

const bySlot = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(files)) {
  const slot = path.split('/').pop()!.replace(/\.[^.]+$/, '');
  bySlot.set(slot, mod.default);
}

/** Returns the image for a slot, or undefined so callers can fall back gracefully. */
export function getMedia(slot: string): ImageMetadata | undefined {
  return bySlot.get(slot);
}

/** Service pages resolve their hero image from the service slug. */
export function getServiceMedia(slug: string): ImageMetadata | undefined {
  return getMedia(`service-${slug}`);
}

export const mediaSlots = [...bySlot.keys()].sort();
