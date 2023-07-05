import { Handlers, PageProps } from "$fresh/server.ts";

import { Entry, getEntry } from "../log.ts";

export const handler: Handlers<Entry> = {
  async GET(_req, ctx) {
    const entry = await getEntry(ctx.params.slug);
    if (entry === null) return ctx.renderNotFound();
    return ctx.render(entry);
  },
};

export default function EntryPage({ data: post }: PageProps<Entry>) {
  return (
    <div>
      <h1 class="text-5xl font-bold">{post.title}</h1>
      <time class="text-gray-500">
        {new Date(post.date).toLocaleDateString("en-us", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
      <div class="mt-8" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}
