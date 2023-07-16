import { join } from "path";

export const ENTRIES = ([
  {
    slug: "hello-world",
    title: "Hello World",
    date: new Date("7-4-2023"),
    file: "hello-world.md",
    show: true,
  },
  {
    slug: "hello-world-2",
    title: "Hello World 2",
    date: new Date("7-6-2023"),
    file: "hello-world-2.md",
    show: true,
  },
] as const)
  .filter((entry) => "show" in entry && entry.show === true)
  .toSorted((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return 0;
  });

export type EntryMeta = (typeof ENTRIES)[number];

const entriesBySlug = new Map<string, EntryMeta>(
  ENTRIES.map((entry) => [entry.slug, entry]),
);

export type Entry = EntryMeta & { content: string };

export async function getEntry(
  slug: string,
): Promise<Entry | null> {
  const entry = entriesBySlug.get(slug);
  if (entry === undefined) {
    return null;
  }

  try {
    const content = await Deno.readTextFile(join("./entries", entry.file));

    return {
      ...entry,
      content,
    };
  } catch {
    return null;
  }
}
