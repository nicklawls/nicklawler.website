import { tw } from "twind";

import title from "../title.ts";

export const pages = [
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
    pathname: "/stans",
  },
];

export const Header = (
  { title: hasTitle = true, selectedPathname }: {
    selectedPathname?: string;
    title?: boolean;
  },
) => (
  <div class="flex flex-col space-y-5">
    <div class="flex flex-row space-x-10 text-xl">
      {pages.filter((p) => p.show).map((p) => (
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
    {hasTitle && (
      <h1 class="font-bold text-5xl">
        {title}
      </h1>
    )}
  </div>
);
