import { AppProps } from "$fresh/server.ts";

const Header = () => (
  <div class="flex flex-col space-y-3">
    <h1 class="font-bold text-3xl">
      Nick Lawler Web Site
    </h1>
    <div class="flex flex-row space-x-10 text-xl">
      <div>Dev Log</div>
      <div>F.A.Q.</div>
      <div>Stannery</div>
    </div>
  </div>
);

export default function App({ Component }: AppProps) {
  return (
    <div class="bg-peachyellow text-indigodye
                dark:bg-indigodye dark:text-peachyellow
                font-mono
                w-screen h-screen
                py-10">
      <div class="mx-auto w-[600px] flex flex-col space-y-10">
        <Header />
        <Component />
      </div>
    </div>
  );
}
