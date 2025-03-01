import { $, serve } from "bun";
import * as marked from "marked";
import { type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const Q = ({ children }: { children: ReactNode }) => (
  <i>
    <strong className="text-lg">{children}</strong>
  </i>
);

const A = ({ children }: { children: ReactNode }) => <p>{children}</p>;

const link = { target: "_blank" };

const SITE_TITLE = "Nick Lawler Website" as const;

const THE_STR = '["nick", "@"].concat(`${window.location.hostname}`).join("")';

const PAGES = {
  index: {
    label: "Dev Log",
    pathname: "/",
    show: true,
  },
  faq: {
    label: "F.A.Q.",
    pathname: "/faq",
    show: true,
  },
  links: {
    label: "Links",
    pathname: "/links",
  },
} as const;

const Header = ({ title }: { title: string }) => (
  <div className="flex flex-col space-y-8">
    <h1 className="font-bold text-5xl">{title}</h1>
  </div>
);

function FaqPage() {
  return (
    <>
      <Header title={SITE_TITLE} />
      <main className="space-y-10">
        <div className="space-y-1">
          <Q>What is this site?</Q>
          <A>
            The online business card of Nick Lawler, by way of 00's era F.A.Q.
          </A>
        </div>
        <div className="space-y-1">
          <Q>Who is Nick Lawler?</Q>
          <A>
            Me! A software engineer on the UI Team at{" "}
            <a {...link} href="https://www.extrahop.com">
              ExtraHop
            </a>
            .
          </A>
        </div>
        <div className="space-y-1">
          <Q>What do you work on?</Q>
          <div className="space-y-4">
            <A>
              My team builds the marquee user experiences for ExtraHop's NDR
              platform. I primarily work with React and TypeScript, with a focus
              on getting data from the backend to the frontend in one piece.
            </A>
          </div>
        </div>
        <div className="space-y-1">
          <Q>How do I get a hold of you?</Q>
          <A>
            <ul>
              <li>
                Email{" "}
                <a
                  {...link}
                  href={`mailto:${THE_STR}`}
                  className="text-sm font-bold font-italic"
                >
                  {THE_STR}
                </a>
              </li>
              <li>
                Comment on a repo on{" "}
                <a {...link} href="https://www.github.com/nicklawls">
                  GitHub
                </a>
              </li>
              <li>
                Reach out on{" "}
                <a {...link} href="https://www.linkedin.com/in/youreyes">
                  LinkedIn
                </a>
              </li>
            </ul>
          </A>
        </div>
      </main>
    </>
  );
}

const PATH_CSS_OUT = "/index.css" as const;

/** Render {@link title} and {@link body} into the right spots in the document */
function app_shell({
  /** `<title/>` element, defaults to the site title */
  title,
  /** Element that will be a descendant of the body. Its ancestors provide most of the page-level styling */
  body,
}: {
  title?: ReactNode;
  body: ReactNode;
}): string {
  const html = (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        {title ?? <title>{SITE_TITLE}</title>}
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🥁</text></svg>"
        />
        <link href={PATH_CSS_OUT} rel="stylesheet" />
      </head>
      <body className="py-10 bg-peachyellow dark:bg-indigodye text-indigodye dark:text-peachyellow">
        <div className="font-mono px-5 w-200 md:mx-auto md:w-[650px] md:p-0 flex flex-col space-y-10">
          {body}
        </div>
      </body>
    </html>
  );

  return `<!DOCTYPE html>\n` + renderToStaticMarkup(html);
}

interface Entry {
  title: string;
  date: Date;
  show: boolean;
  markdown: string;
}

import metapost from "./entries/metapost.md" with { type: "text" };
const promise_hello_world = marked.parse(hello_world);

import hello_world from "./entries/hello-world.md" with { type: "text" };
const promise_metapost = marked.parse(metapost);

import backwards from "./entries/backwards.md" with { type: "text" };
const promise_backwards = marked.parse(backwards);

const ENTRIES_BY_SLUG = {
  "/hello-world": {
    title: "Hello World",
    date: new Date("7-4-2023"),
    show: false,
    markdown: await promise_hello_world,
  },
  "/backwards": {
    title: "Reflecting the Serenity Prayer",
    date: new Date("2-28-2025"),
    show: true,
    markdown: await promise_backwards,
  },
  "/metapost": {
    title: "How to Build This Website",
    date: new Date("7-21-2024"),
    show: true,
    markdown: await promise_metapost,
  },
} as const satisfies { [slug: `/${string}`]: Entry };

/** Type predicate infrence means that only the ones with show: true make it! */
const ENTRIES_BY_DATE = Object.values(ENTRIES_BY_SLUG)
  .filter((entry) => entry.show)
  .sort((a, b) => a.date.getTime() - b.date.getTime());

import css from "./index.css" with { type: "text" };

const server = serve({
  hostname: "0.0.0.0",
  port: process.env["PORT"] ?? 3000,
  development: process.env.NODE_ENV !== "production",
  routes: {
    "/": new Response(app_shell({ body: <FaqPage /> }), {
      headers: { "Content-Type": "text/html" },
    }),
    [PATH_CSS_OUT]: new Response(
      // TODO: this is such a hack
      // Interem between here and plugin would be to compile css with
      // tailwind programatically and not shell out.
      await $`echo ${css} | bunx tailwindcss -i -`.blob(),
      {
        headers: { "Content-Type": "text/css" },
      },
    ),
    ...Object.fromEntries(
      Object.entries(ENTRIES_BY_SLUG)
        .values()
        // Not smart enough to infer a type predicate with nesting though
        .filter(([, entry]) => entry.show)
        .map(([slug, entry]) => [
          slug,
          new Response(
            app_shell({
              title: <title>{entry.title}</title>,
              body: (
                <div className="flex flex-col space-y-3">
                  <Header title={entry.title} />
                  <div>
                    <time className="text-gray-500">
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
                        className="mt-8 space-y-6"
                        dangerouslySetInnerHTML={{ __html: entry.markdown }}
                      />
                    </div>
                  </div>
                </div>
              ),
            }),
            {
              headers: { "Content-Type": "text/html" },
            },
          ),
        ]),
    ),
    "/*": new Response(app_shell({ body: <p>404 not found</p> }), {
      headers: { "Content-Type": "text/html" },
      status: 404,
    }),
  },
});

console.log(server.url.href);
