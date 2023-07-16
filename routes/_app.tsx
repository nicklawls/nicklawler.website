import { AppProps } from "$fresh/server.ts";
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
      ],
    },
  },
});

export default function App({ Component }: AppProps) {
  return (
    <div class={`${tw(globalStyles)} font-mono h-screen py-10`}>
      <div class="px-5 w-200 
                  md:mx-auto md:w-[600px] md:p-0
                  flex flex-col space-y-10">
        <Component />
      </div>
    </div>
  );
}
