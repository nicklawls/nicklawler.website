import { Head } from "$fresh/runtime.ts";
import { ComponentChildren } from "preact";
import { Header, PAGES } from "../components/Header.tsx";
import { SITE_TITLE } from "../title.ts";

const Q = ({ children }: { children: ComponentChildren }) => (
  <i>
    <strong>{children}</strong>
  </i>
);

const A = ({ children }: { children: ComponentChildren }) => <p>{children}</p>;

const link = { class: "underline", target: "_blank" };

export default function FaqPage() {
  return (
    <>
      <Head>
        <title>{`F.A.Q - ${SITE_TITLE}`}</title>
      </Head>
      <Header selectedPathname={PAGES.faq.pathname} title={SITE_TITLE} />
      <main class="space-y-12">
        <div>
          <Q>What is this site?</Q>
          <A>The software development weblog of Nick Lawler.</A>
        </div>
        <div>
          <Q>Who is Nick Lawler?</Q>
          <A>
            That would be me, a software engineer on the{" "}
            <a
              {...link}
              href="https://www.extrahop.com"
            >
              ExtraHop
            </a>{"  "}
            UI team.
          </A>
        </div>
        <div>
          <Q>
            What's the best way to get a hold of you with questions or feedback?
          </Q>
          <A>
            Email <i>nick</i> "at" this site's domain, or comment on the
            <br />
            <a
              {...link}
              href="https://github.com/nicklawls/nicklawler.website"
            >
              GitHub Repo
            </a>
            .
          </A>
        </div>
      </main>
    </>
  );
}
