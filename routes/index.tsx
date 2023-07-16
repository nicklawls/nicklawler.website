import { Head } from "$fresh/runtime.ts";
import { Header, PAGES } from "../components/Header.tsx";
import { ENTRIES } from "../log.ts";
import { SITE_TITLE } from "../title.ts";

export default function Home() {
  return (
    <>
      <Head>
        <title>{SITE_TITLE}</title>
      </Head>
      <div class="flex flex-col space-y-5">
        <Header selectedPathname={PAGES.index.pathname} title={SITE_TITLE} />
        {ENTRIES.map((entry) => (
          <p class="space-x-2">
            <span class="text-xs">
              {entry.date.toLocaleDateString("en-us", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <a
              class="text-xl font-bold hover:underline"
              href={`/${entry.slug}`}
            >
              {entry.title}
            </a>
          </p>
        ))}
      </div>
    </>
  );
}
