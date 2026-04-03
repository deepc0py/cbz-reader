import { unzip } from 'unzipit';

const IMAGE_RE = /\.(jpe?g|png|webp|gif|bmp)$/i;

export interface MangaPage {
  index: number;
  name: string;
  url: string;
}

export async function extractCBZ(
  file: File,
  onProgress?: (loaded: number, total: number) => void,
): Promise<MangaPage[]> {
  const { entries } = await unzip(file);

  const imageEntries = Object.entries(entries)
    .filter(([name]) => IMAGE_RE.test(name) && !name.startsWith('__MACOSX'))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  const pages: MangaPage[] = [];

  for (let i = 0; i < imageEntries.length; i++) {
    const [name, entry] = imageEntries[i];
    const blob = await entry.blob();
    const url = URL.createObjectURL(blob);
    pages.push({ index: i, name, url });
    onProgress?.(i + 1, imageEntries.length);
  }

  return pages;
}

export function revokePages(pages: MangaPage[]) {
  for (const page of pages) {
    URL.revokeObjectURL(page.url);
  }
}
