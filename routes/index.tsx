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

const link = { target: "_blank" };

export default function FaqPage() {
  return (
    <>
      <Head>
        <title>{`${SITE_TITLE}`}</title>
      </Head>
      <Header selectedPathname={PAGES.faq.pathname} title={SITE_TITLE} />
      <main class="space-y-12">
        <div>
          <Q>What is this site?</Q>
          <A>The online "business card" of Nick Lawler.</A>
        </div>
        <div>
          <Q>Who is Nick Lawler?</Q>
          <A>
            That would be me, a software engineer on the UI Team at{" "}
            <a
              {...link}
              href="https://www.extrahop.com"
            >
              ExtraHop
            </a>.
          </A>
        </div>
        <div>
          <Q>What do you work on?</Q>
          <A>"the back end of the front end"</A>
        </div>
        <div>
          <Q>
            How do I get ahold of you?
          </Q>
          <A>
            <ul>
              <li>
                Email <i>nick</i> "at" <i>this site's host</i> "dot"{"  "}
                <i>this site's domain</i>
              </li>
              <li>
                Comment on a repo on{" "}
                <a
                  {...link}
                  href="https://www.github.com/nicklawls"
                >
                  GitHub
                </a>
              </li>
              <li>
                Reach out on <a{...link} href="https://www.linkedin.com/in/youreyes">LinkedIn</a>
              </li>
            </ul>
          </A>
        </div>
      </main>
    </>
  );
}
