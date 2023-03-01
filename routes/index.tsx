import { Button } from "../components/Button.tsx";
import Counter from "../islands/Counter.tsx";

export default function Home() {
  return (
    <body class="bg-peachyellow dark:bg-indigodye dark:text-yellow w-screen h-screen">
      <div class="p-5 mx-auto max-w-screen-md">
        <div class="flex items-center space-x-2">
          <img
            src="/logo.svg"
            height="100px"
            alt="the fresh logo: a sliced lemon dripping with juice"
          />
          <div class="text-center dark:text-bittersweet">
            Nick Lawler Web Site
          </div>
        </div>
        <Counter />
        <Counter diff={2} />
        <Counter diff={3} />
        <Button>
          Dark Mode
        </Button>
      </div>
    </body>
  );
}
