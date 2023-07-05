import { log } from "../log.ts";

export default function Home() {
  return (
    <div class="flex flex-col space-y-5">
      {log.map((entry) => (
        <p class="space-x-2">
          <span class="text-xs">
            {new Date(entry.date).toLocaleDateString("en-us", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <a class="text-xl font-bold hover:underline" href={`/${entry.slug}`}>
            {entry.title}
          </a>
        </p>
      ))}
    </div>
  );
}
