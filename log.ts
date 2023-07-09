import { join } from "path";

export const log = ([
  {
    title: "Hello World",
    date: "7-4-2023",
    md: "hello-world.md",
    slug: "hello-world",
    uuid: "f4b77ab6-d090-4237-a8f7-5dc3595fa542",
    show: true,
  },
  {
    title: "Hello World 2",
    date: "7-6-2023",
    md: "hello-world.md",
    slug: "hello-world-2",
    uuid: "f4b77ab6-d090-4237-a8f7-5dc3595fa543",
    show: true,
  },
] as const).map((x) => ({ ...x, date: new Date(x.date) })).toSorted((a, b) => {
  if (a.date < b.date) return 1;
  if (a.date > b.date) return -1;
  return 0;
});

export type Entry = (typeof log)[number] & { content: string };

export async function getEntry(
  slug: string,
): Promise<Entry | null> {
  const entry = log.find((x) => x.slug === slug);
  if (!entry) {
    return null;
  }

  try {
    const content = await Deno.readTextFile(join("./posts", `${slug}.md`));

    return {
      content,
      ...entry,
    };
  } catch {
    return null;
  }
}
