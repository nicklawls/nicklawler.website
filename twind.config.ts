import { Options } from "$fresh/plugins/twind.ts";

export default {
  selfURL: import.meta.url,
  theme: {
    colors: {
      peachyellow: "#EFD28D",
      indigodye: "#004777",
      bittersweet: "#FF5A5F",
    },
    extend: {
      fontFamily: {
        "sans": ["Veranda"],
      },
    },
  },
} as Options;
