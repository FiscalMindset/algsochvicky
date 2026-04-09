import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
};

export function SectionHeading({ eyebrow, title, description, aside }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-col gap-5 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.34em] text-accent/80">{eyebrow}</div>
        <h2 className="text-balance font-display text-3xl font-semibold leading-[0.96] text-ink sm:text-4xl lg:text-[3.7rem]">
          {title}
        </h2>
        <p className="mt-4 max-w-2xl text-pretty text-sm leading-7 text-muted sm:text-base lg:text-lg">{description}</p>
      </div>
      {aside ? <div className="max-w-md text-sm text-muted">{aside}</div> : null}
    </div>
  );
}
