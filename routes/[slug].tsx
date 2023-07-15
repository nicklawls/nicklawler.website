import { Handlers, PageProps } from "$fresh/server.ts";

import { Entry, getEntry } from "../log.ts";
import { CSS, render } from "$gfm";
import { Head } from "$fresh/runtime.ts";
import { Header } from "../components/Header.tsx";

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

export default function EntryPage({ data: post }: PageProps<Entry>) {
  return (
    <>
      <Head>
        <title>{post.title}</title>
        <style dangerouslySetInnerHTML={{ __html: CUSTOM_CSS }} />
      </Head>
      <div class="flex flex-col space-y-8">
        <Header selectedPathname="/" title={false} />
        <div>
          <h1 class="text-5xl font-bold">{post.title}</h1>
          <time class="text-gray-500">
            {post.date.toLocaleDateString("en-us", {
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
              dangerouslySetInnerHTML={{ __html: render(post.content) }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
