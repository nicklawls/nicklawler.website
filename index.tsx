import { $, serve } from "bun";
import { type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as marked from "marked";

import metapost from "./entries/metapost.md" with { type: "text" };
import hello_world from "./entries/hello-world.md" with { type: "text" };

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

/** Has to be a string that react renders into, to control the <head> and <title> */
function appTemplate(body: ReactNode, head?: ReactNode): string {
  return `<!DOCTYPE html>
     <html lang="en">
      <head>
        ${renderToStaticMarkup(head ?? <title>{SITE_TITLE}</title>)}
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🥁</text></svg>"
        />
        <link href="${PATH_CSS_OUT}" rel="stylesheet" />
      </head>
      <body class="py-10 bg-peachyellow dark:bg-indigodye text-indigodye dark:text-peachyellow">
        <div
          class="font-mono px-5 w-200 md:mx-auto md:w-[600px] md:p-0 flex flex-col space-y-10"
        >
          ${renderToStaticMarkup(body)}
        </div>
      </body>
    </html>`;
}

const promise_hello_world = marked.parse(hello_world);
const promise_metapost = marked.parse(metapost);

/** Type predicate infrence means that only the ones with show: true make it! */
export const ENTRIES = (
  [
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
      show: true,
      content: await promise_hello_world,
    },
    {
      slug: "metapost",
      title: "How to Build This Website",
      date: new Date("7-21-2024"),
      file: "metapost.md",
      show: true,
      content: await promise_metapost,
    },
  ] as const
)
  .filter((entry) => entry.show)
  .sort((a, b) => a.date.getTime() - b.date.getTime());

function EntryPage({ entry }: { entry: (typeof ENTRIES)[number] }) {
  return (
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
            className="mt-8 markdown-body"
            dangerouslySetInnerHTML={{ __html: entry.content }}
          />
        </div>
      </div>
    </div>
  );
}

const server = serve({
  hostname: "0.0.0.0",
  port: process.env["PORT"] ?? 3000,
  development: process.env.NODE_ENV !== "production",
  routes: {
    "/": new Response(appTemplate(<FaqPage />), {
      headers: { "Content-Type": "text/html" },
    }),
    [PATH_CSS_OUT]: new Response(
      // TODO: this is such a hack
      // Interem between here and plugin would be to compile css with
      // tailwind programatically and not shell out.
      await $`bunx tailwindcss -i ./index.css`.blob(),
      {
        headers: { "Content-Type": "text/css" },
      },
    ),
  },
  fetch: async (request, _server) => {
    const pathname = new URL(request.url).pathname;
    const slug = pathname.replace("/", "");
    // TODO: pre-bake ENTRIES into an object for `routes`
    const entry = ENTRIES.find((e) => e.slug === slug);
    if (entry) {
      try {
        return new Response(
          appTemplate(
            <EntryPage entry={entry} />,
            <title>{entry.title}</title>,
          ),
          {
            headers: { "Content-Type": "text/html" },
          },
        );
      } catch (e) {
        console.error(e);
      }
    }

    return new Response(appTemplate(<p>404 not found: {pathname}</p>), {
      headers: { "Content-Type": "text/html" },
      status: 404,
    });
  },
});

console.log(server.url.href);
