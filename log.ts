import { join } from "path";

const entries = {
  "hello-world": {
    title: "Hello World",
    date: new Date("7-4-2023"),
    file: "hello-world.md",
    show: true,
  },
  "hello-world-2": {
    title: "Hello World 2",
    date: new Date("7-6-2023"),
    file: "hello-world-2.md",
    show: true,
  },
} as const;

export type EntryMeta = (typeof entries)[keyof typeof entries];

export const log = Object.values(entries)
  .filter((entry) => "show" in entry && entry.show)
  .toSorted((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return 0;
  });

export type Entry = EntryMeta & { content: string };

export async function getEntry(
  slug: string,
): Promise<Entry | null> {
  const entry = (entries as { [slug in string]?: EntryMeta })[slug];
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
