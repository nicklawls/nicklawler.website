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
    <h1 class="font-bold text-5xl">
      {title}
    </h1>
  </div>
);
