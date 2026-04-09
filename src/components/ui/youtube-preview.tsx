import { ExternalLink, Play } from "lucide-react";
import { cn, getYouTubeThumbnailUrl } from "../../lib/utils";

type YouTubePreviewProps = {
  url: string;
  title: string;
  className?: string;
  aspectClassName?: string;
  note?: string;
};

export function YouTubePreview({
  url,
  title,
  className,
  aspectClassName = "aspect-video",
  note = "Open video demo"
}: YouTubePreviewProps) {
  const thumbnailUrl = getYouTubeThumbnailUrl(url);

  if (!thumbnailUrl) {
    return null;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "group block overflow-hidden rounded-[18px] border border-line/70 bg-black/25 transition hover:border-accent/30",
        className
      )}
      aria-label={`${title} video demo`}
    >
      <div className={cn("relative overflow-hidden", aspectClassName)}>
        <img
          src={thumbnailUrl}
          alt={`${title} video preview`}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute left-3 top-3 rounded-full border border-accent/30 bg-black/45 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-accent/85">
          Video preview
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white">{title}</div>
            <div className="mt-1 text-xs text-white/75">{note}</div>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur">
            <Play size={16} fill="currentColor" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line/60 px-3 py-2.5 text-[11px] text-muted">
        <span>Opens on YouTube</span>
        <ExternalLink size={14} />
      </div>
    </a>
  );
}
