import { PageProps } from "$fresh/server.ts";

export default function GreetPage(props: PageProps) {
  const { name } = props.params;
  return (
    <main>
      <p>Sup {name}!</p>
    </main>
  );
}
