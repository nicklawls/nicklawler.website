import { AppProps } from "$fresh/server.ts";
import { tw } from "twind";
import { State } from "./_middleware.ts";

const pages = [
  {
    label: "Dev Log",
    pathname: "/",
    show: true,
  },
  {
    label: "F.A.Q.",
    pathname: "/faq",
    show: true,
  },
  {
    label: "Stannery",
    pathname: "/stan",
  },
];

const Header = (props: { selectedPathname?: string }) => (
  <div class="flex flex-col space-y-3">
    <h1 class="font-bold text-3xl">
      Nick Lawler Web Site
    </h1>
    <div class="flex flex-row space-x-10 text-xl">
      {pages.filter((p) => p.show).map((p) => (
        <a
          class={tw(
            "hover:underline",
            p.pathname === props.selectedPathname && "underline",
          )}
          href={p.pathname}
        >
          {p.label}
        </a>
      ))}
    </div>
  </div>
);

export default function App({ Component, state }: AppProps & { state: State }) {
  return (
    <div class="bg-peachyellow text-indigodye
                dark:bg-indigodye dark:text-peachyellow
                font-mono
                h-screen
                py-10">
      <div class="mx-auto w-[600px] flex flex-col space-y-10">
        <Header />
        <Component />
      </div>
    </div>
  );
}
