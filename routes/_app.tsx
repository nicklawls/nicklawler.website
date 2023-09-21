import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { css } from "twind/css";
import { tw } from "twind";

const globalStyles = css({
  ":global": {
    body: {
      "@apply": [
        "bg-peachyellow",
        "dark:bg-indigodye",
        "text-indigodye",
        "dark:text-peachyellow",
        "py-10",
      ],
    },

    a: {
      color: (ctx) => ctx.theme("colors.bittersweet"),
      textDecoration: "underline",
    },
  },
});

export default function App({ Component }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🥁</text></svg>"
        >
        </link>
      </Head>
      <div
        class={tw(
          globalStyles,
          "font-mono",
          "px-5 w-200",
          "md:mx-auto md:w-[600px] md:p-0",
          "flex flex-col space-y-10",
        )}
      >
        <Component />
      </div>
    </>
  );
}
