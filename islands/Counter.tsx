import { signal } from "@preact/signals";
import { Button } from "../components/Button.tsx";

interface CounterProps {
  diff?: number;
}

const count = signal(0);

export default function Counter({ diff = 1 }: CounterProps) {
  return (
    <div class="flex gap-2 w-full">
      <p class="flex-grow-1 font-bold text-xl">{count}</p>
      <Button onClick={() => count.value = count.value - diff}>-{diff}</Button>
      <Button onClick={() => count.value = count.value + diff}>+{diff}</Button>
    </div>
  );
}
