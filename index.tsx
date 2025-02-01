import { serve, type ServeOptions } from "bun";
import type { ReactNode } from "react";

import { renderToStaticMarkup } from "react-dom/server";

const Q = ({ children }: { children: ReactNode }) => (
  <i>
    <strong className="text-lg">{children}</strong>
  </i>
);

const A = ({ children }: { children: ReactNode }) => <p>{children}</p>;

const link = { target: "_blank" };

const SITE_TITLE = "Nick Lawler Web Site" as const;

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

const Header = ({ title }: { selectedPathname?: string; title: string }) => (
  <div className="flex flex-col space-y-8">
    <h1 className="font-bold text-5xl">{title}</h1>
  </div>
);

function FaqPage() {
  return (
    <>
      {/* <Head>
        <title>{`${SITE_TITLE}`}</title>
      </Head> */}
      <Header selectedPathname={PAGES.faq.pathname} title={SITE_TITLE} />
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

const options: ServeOptions = {
  port: 3000,
  development: true,
  static: {
    "/": new Response(renderToStaticMarkup(<FaqPage />), {
      headers: { "Content-Type": "text/html" },
    }),
  },
  fetch: async (request, _server) => {
    return new Response(
      renderToStaticMarkup(
        <p>404 not found: {new URL(request.url).pathname}</p>,
      ),
      { headers: { "Content-Type": "text/html" } },
    );
  },
};

serve(options);
