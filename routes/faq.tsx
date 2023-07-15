import { Head } from "$fresh/runtime.ts";
import { Header, pages } from "../components/Header.tsx";
import { title } from "../title.ts";

export default function FaqPage() {
  return (
    <>
      <Head>
        <title>{`F.A.Q - ${title}`}</title>
      </Head>
      <Header selectedPathname={pages.faq.pathname} title={false} />
      <main>
        <h1>About</h1>
        <p>This is about page</p>
      </main>
    </>
  );
}
