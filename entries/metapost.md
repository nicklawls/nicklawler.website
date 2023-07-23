_No devlog would be complete without an entry describing how it's built. What follows is a rough sketch of the design and implementation, highlighting points I find especially interesting._

---

About a year ago I first heard about [Fresh](https://fresh.deno.dev/).  It's a
web framework built by the folks behind the [Deno](https://deno.land/) JS
runtime. Wanting to put together some sort of devlog/blogfolio site, it offered
a few features that sounded especially attractive
* Zero-config global deployment via [Deno Deploy](https://deno.com/deploy).
* Great page load speed for static content.
* An excuse to try out Deno for the first time.

It was easy enough to set up the default Fresh project, get it running on Deno
deploy, and point a domain at it. Life and work intervened to slow me down, but
getting back to it this year I'm pretty happy how things turned out.

## Overview

A `tree` in the project directory yields the following.

```text
|> tree
.
├── README.md
├── components
│   └── Header.tsx
├── deno.json
├── deno.lock
├── dev.ts
├── entries
│   ├── hello-world.md
│   └── metapost.md
├── fresh.gen.ts
├── import_map.json
├── log.ts
├── main.ts
├── routes
│   ├── [slug].tsx
│   ├── _404.tsx
│   ├── _app.tsx
│   ├── faq.tsx
│   └── index.tsx
├── static
├── title.ts
└── twind.config.ts

5 directories, 19 files
```

This is a fairly normal fresh 1.1 setup. I've tried upgrading to 1.2 but encountered issues with VSCode. Maybe 1.3 fixes those.

Within `routes/`, `faq.tsx` and `index.tsx` form the two static routes, while `[slug].tsx` acts as a catch-all for log entries. `entries` contains markdown files for each entry. I will draw your attention however to `log.ts` in the root, as it's crucial to how those entries make it on to the page.

## Against Front Matter

Rather than relying on deno's `front-matter` package and parsing information out of each markdown file, I opted to write that data directly into a file, 
`log.ts`, that would server as an index of all entries and their metadata, including filename. Here's what that structure looks like.

```ts
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
```

To me, this is way nicer than front matter. The biggest reason why is that no parsing step is needed; all the info is already "parsed" into richly typed objects. With `as const`, most of the data is preserved at the type level, so autocompletion for `slug`, `title` etc will be exact strings. If for instance I want to link to one of these in my typescript code, autocomplete will give me
exact slugs to choose from.

The downside of course is that the metadata is not collocated with the content,
it's off in some other file, But I happily pay that cost to avoid parsing. I was more (though not fully) surprised to find that the high-fidelity types can introduce some friction too. When I went to build a proper index of posts keyed on slug, I ended up with a `Map<EntryMeta['slug'], EntryMeta>`. But you can't even index into this thing with a bare `string`! It must be one of the static slug strings, but trying to "parse" a string into that type defeats the purpose of having a `Map` in the first place. I ended up doing it like this:

```ts
const entriesBySlug = ENTRIES.reduce((acc, entry) => {
  acc.set(entry.slug, entry);
  return acc;
  // Annotation purposefully widens `slug`'s type to `string, so that we can do
  // slug existence check and retrieval with one `map.get()`
}, new Map<string, EntryMeta>());
```

---

To explain `EntryMeta`, I can say the other trick I pull here is to capture types straight from the static data discussed above.

```ts
export type EntryMeta = (typeof ENTRIES)[number];
```

And then define a fully realized entry as

```ts
export type Entry = EntryMeta & { content: string };

```

The final fetching function is then typed as 

```ts
export async function getEntry(
  slug: string,
): Promise<Entry | null>
```

Given all the above definitions, this function basically implements itself, AI optional!.

In a vacuum, this is the kind of TS code I like to write. 
* Encode as much info as I can with static data. 
* Sprinkle in explicit type definitions (or perhaps zod schemas) where I want strict checking. 
* Capture a type here or there, compose types to express higher-level properties I want to check. 
* Annotate or widen things to as necessary. 

With good taste and a little luck, this strikes a sweet balance between type safety, dynamism, and ergonomics.

## GFM

## Global CSS in twind

