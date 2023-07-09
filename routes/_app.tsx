import { AppProps } from "$fresh/server.ts";

export default function App({ Component }: AppProps) {
  return (
    <div class="bg-peachyellow text-indigodye
                dark:bg-indigodye dark:text-peachyellow
                font-mono
                h-screen
                py-10">
      <div class="mx-auto w-[600px] flex flex-col space-y-10">
        <Component />
      </div>
    </div>
  );
}
