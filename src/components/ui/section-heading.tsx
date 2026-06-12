import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string | ReactNode;
  aside?: ReactNode;
};

export function SectionHeading({ eyebrow, title, description, aside }: SectionHeadingProps) {
  const desc =
    typeof description === "string" ? (
      <p className="mt-4 max-w-2xl text-pretty text-sm leading-7 text-muted sm:text-base lg:text-lg">{description}</p>
    ) : (
      <div className="mt-4 max-w-2xl flex flex-wrap gap-2">{description}</div>
    );
  return (
    <div className="mb-8 flex flex-col gap-5 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <div className="mb-4 inline-block rounded-full border-2 border-orange-500 bg-gray-100 px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.3em] text-gray-900">
          {eyebrow}
        </div>
        <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl lg:text-[3.7rem]" style={{lineHeight: '1.2'}}>
          {title}
        </h2>
        {desc}
      </div>
      {aside ? <div className="max-w-md text-sm text-muted">{aside}</div> : null}
    </div>
  );
}
