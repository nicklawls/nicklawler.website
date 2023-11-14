import { Head } from "$fresh/runtime.ts";
import { ComponentChildren } from "preact";
import { Header, PAGES } from "../components/Header.tsx";
import { SITE_TITLE } from "../title.ts";

const Q = ({ children }: { children: ComponentChildren }) => (
  <i>
    <strong class="text-lg">{children}</strong>
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
      <main class="space-y-10">
        <div class="space-y-1">
          <Q>What is this site?</Q>
          <A>The online "business card" of Nick Lawler.</A>
        </div>
        <div class="space-y-1">
          <Q>Who is Nick Lawler?</Q>
          <A>
            Me! A software engineer on the UI Team at{" "}
            <a
              {...link}
              href="https://www.extrahop.com"
            >
              ExtraHop
            </a>.
          </A>
        </div>
        <div class="space-y-1">
          <Q>What do you work on?</Q>
          <div class="space-y-4">
            <A>
              My team builds the marquee user experiences for ExtraHop's NDR
              platform. I primarily work with React and TypeScript, with a focus
              on getting data from the backend to the frontend in one piece.
            </A>
            <A>
              In my spare time I like to tinker with programming language tech
              and web tech, and think about how to smoosh the two together.
            </A>
          </div>
        </div>
        <div class="space-y-1">
          <Q>
            How do I get a hold of you?
          </Q>
          <A>
            <ul>
              <li>
                Email{" "}
                <a
                  {...link}
                  href={`mailto:${THE_STR}`}
                  class="text-sm font-bold font-italic"
                >
                  {THE_STR}
                </a>
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

const THE_STR = '["nick", "@"].concat(`${window.location.hostname}`).join("")';
