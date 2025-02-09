import { $, file, serve } from "bun";
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

const PATH_CSS_OUT = "/index.out.css" as const;

/** Has to be a string that react renders into, to control the <head> and <title> */
function appTemplate(body: string): string {
  return `<!DOCTYPE html>
     <html lang="en">
      <head>
        <title>${SITE_TITLE}</title>
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
          ${body}
        </div>
      </body>
    </html>`;
}

// TODO: this is such a hack
// Interem between here and plugin would be to compile css with
// tailwind programatically and include it in the app template.
await $`bunx tailwindcss -i ./index.css -o ./${PATH_CSS_OUT} `.quiet();

serve({
  hostname: "0.0.0.0",
  port: process.env["PORT"] ?? 3000,
  development: true,
  static: {
    "/": new Response(appTemplate(renderToStaticMarkup(<FaqPage />)), {
      headers: { "Content-Type": "text/html" },
    }),
    [PATH_CSS_OUT]: new Response(await file(`.${PATH_CSS_OUT}`).bytes(), {
      headers: { "Content-Type": "text/css" },
    }),
  },
  fetch: async (request, _server) => {
    return new Response(
      appTemplate(
        renderToStaticMarkup(
          <p>404 not found: {new URL(request.url).pathname}</p>,
        ),
      ),
      { headers: { "Content-Type": "text/html" } },
    );
  },
});
