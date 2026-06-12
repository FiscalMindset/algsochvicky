export function FiscalMindsetBadge() {
  return (
    <div className="mt-5 flex items-center justify-end gap-2">
      <a
        href="https://github.com/FiscalMindset"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-line/60 bg-black/20 px-3 py-1.5 transition hover:border-accent/30 hover:bg-accent/10 group"
      >
        <img
          src="https://avatars.githubusercontent.com/u/254638087?v=4"
          alt="FiscalMindset"
          className="h-5 w-5 rounded-full border border-line/50"
        />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted group-hover:text-accent transition-colors">
          @FiscalMindset
        </span>
      </a>
    </div>
  );
}
