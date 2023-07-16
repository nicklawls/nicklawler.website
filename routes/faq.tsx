import { Head } from "$fresh/runtime.ts";
import { Header, PAGES } from "../components/Header.tsx";
import { SITE_TITLE } from "../title.ts";

export default function FaqPage() {
  return (
    <>
      <Head>
        <title>{`F.A.Q - ${SITE_TITLE}`}</title>
      </Head>
      <Header selectedPathname={PAGES.faq.pathname} title={SITE_TITLE} />
      <main>
        <h1>About</h1>
        <p>This is about page</p>
      </main>
    </>
  );
}
