import { join } from "path";

export const ENTRIES = ([
  {
    slug: "hello-world",
    title: "Hello World",
    date: new Date("7-4-2023"),
    file: "hello-world.md",
    show: false,
  },
  {
    slug: "hello-world-2",
    title: "Hello World 2",
    date: new Date("7-6-2023"),
    file: "hello-world-2.md",
    show: false,
  },
  {
    slug: "metapost",
    title: "How to Build This Website",
    date: new Date("7-21-2024"),
    file: "metapost.md",
    show: true,
  },
] as const)
  .filter((entry) => "show" in entry && entry.show === true)
  .sort((a, b) => a.date.getTime() - b.date.getTime());

export type EntryMeta = (typeof ENTRIES)[number];

const entriesBySlug = ENTRIES.reduce((acc, entry) => {
  acc.set(entry.slug, entry);
  return acc;
  // Annotation purposefully widens `slug`'s type to `string, so that we can do
  // slug existence check and retrieval with one `map.get()`
}, new Map<string, EntryMeta>());

export type Entry = EntryMeta & { content: string };

export async function getEntry(
  slug: string,
): Promise<Entry | null> {
  const entry = entriesBySlug.get(slug);
  if (entry === undefined) {
    console.error("Slug not in index", { slug });
    return null;
  }

  try {
    const content = await Deno.readTextFile(join("./entries", entry.file));

    return {
      ...entry,
      content,
    };
  } catch (e) {
    console.error("File not found", e);
    return null;
  }
}
