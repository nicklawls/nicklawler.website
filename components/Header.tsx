import { tw } from "twind";

export const PAGES = {
  index: {
    label: "Dev Log",
    pathname: "/",
    show: true,
  },
  faq: {
    label: "F.A.Q.",
    pathname: "/faq",
    show: true,
  },
  links: {
    label: "Links",
    pathname: "/links",
  },
} as const;

export const Header = (
  { title, selectedPathname }: {
    selectedPathname?: string;
    title: string;
  },
) => (
  <div class="flex flex-col space-y-8">
    <div class="flex flex-row space-x-10 text-xl">
      {Object.values(PAGES).filter((p) => "show" in p && p.show).map((p) => (
        <a
          class={tw(
            "hover:underline",
            p.pathname === selectedPathname && "underline",
          )}
          href={p.pathname}
        >
          {p.label}
        </a>
      ))}
    </div>
    <h1 class="font-bold text-5xl">
        {title}
      </h1>
  </div>
);
