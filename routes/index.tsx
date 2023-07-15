import { Head } from "$fresh/runtime.ts";
import { Header, pages } from "../components/Header.tsx";
import { log } from "../log.ts";
import { title } from "../title.ts";

export default function Home() {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div class="flex flex-col space-y-5">
        <Header selectedPathname={pages.index.pathname} />
        {log.map((entry) => (
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
