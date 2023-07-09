import { tw } from "twind";

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
  { title = true, selectedPathname }: {
    selectedPathname?: string;
    title?: boolean;
  },
) => (
  <div class="flex flex-col space-y-3">
    {title && (
      <h1 class="font-bold text-3xl">
        Nick Lawler Web Site
      </h1>
    )}
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
  </div>
);
