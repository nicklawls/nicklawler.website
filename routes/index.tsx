const Header = () => (
  <div class="mx-auto w-[600px]">
    <div class="flex flex-col space-y-3">
      <h1 class="font-bold text-3xl font-mono">
        Nick Lawler Web Site
      </h1>
      <div class="flex flex-row space-x-10 text-xl">
        <div>Dev Log</div>
        <div>F.A.Q.</div>
        <div>Stannery</div>
      </div>
    </div>
  </div>
);

export default function Home() {
  return (
    <body class="bg-peachyellow text-indigodye
                 dark:bg-indigodye dark:text-peachyellow
                 w-screen h-screen py-10">
      <Header/>
    </body>
  );
}
