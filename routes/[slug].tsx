import { Handlers, PageProps } from "$fresh/server.ts";

import { Entry, getEntry } from "../log.ts";
import { CSS, render } from "$gfm";
import { Head } from "$fresh/runtime.ts";
import { Header, PAGES } from "../components/Header.tsx";

export const handler: Handlers<Entry> = {
  async GET(_req, ctx) {
    const entry = await getEntry(ctx.params.slug);
    if (entry === null) return ctx.renderNotFound();
    return ctx.render(entry);
  },
};

const CUSTOM_CSS = `${CSS}
  .markdown-body ul {
      list-style: disc;
  }
  .markdown-body ol {
      list-style: numeric;
  }
  .markdown-body {
    --color-canvas-default: auto;
    --color-fg-default: auto;
  }
`;

export default function EntryPage({ data: entry }: PageProps<Entry>) {
  return (
    <>
      <Head>
        <title>{entry.title}</title>
        <style dangerouslySetInnerHTML={{ __html: CUSTOM_CSS }} />
      </Head>
      <div class="flex flex-col space-y-3">
        <Header selectedPathname={PAGES.index.pathname} title={entry.title} />
        <div>
          <time class="text-gray-500">
            {entry.date.toLocaleDateString("en-us", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <div
            data-color-mode="auto"
            data-light-theme="light"
            data-dark-theme="dark"
          >
            <div
              class="mt-8 markdown-body"
              dangerouslySetInnerHTML={{ __html: render(entry.content) }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
