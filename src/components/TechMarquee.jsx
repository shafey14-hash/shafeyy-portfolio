import { marqueeItems } from "../data/projects";

function Row() {
  return (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {marqueeItems.map((item) => (
        <span key={item} className="flex items-center gap-10">
          <span className="whitespace-nowrap font-display text-2xl font-medium text-white/25 md:text-3xl">
            {item}
          </span>
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
        </span>
      ))}
    </div>
  );
}

export default function TechMarquee() {
  return (
    <div className="mt-24 overflow-hidden border-y border-white/10 py-6 md:mt-32">
      <div className="marquee-track flex w-max">
        <Row />
        <Row />
      </div>
    </div>
  );
}
