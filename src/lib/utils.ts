import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(value: number) {
  if (value === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const exponent = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  const scaled = value / 1024 ** exponent;
  return `${scaled.toFixed(scaled >= 100 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function sentenceCase(value: string) {
  if (!value.length) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function tokenize(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9+.-]+/)
    .filter(Boolean);
}

export function compactActionLabel(label: string) {
  if (label === "Repository") return "Repo";
  if (label === "Live Demo") return "Live";
  if (label === "YouTube Demo") return "Video";
  if (label === "APK Releases") return "APK";
  return label;
}

export function extractYouTubeVideoId(url: string) {
  const shortsMatch = url.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]+)/i);
  const watchMatch = url.match(/[?&]v=([A-Za-z0-9_-]+)/i);
  const shortUrlMatch = url.match(/youtu\.be\/([A-Za-z0-9_-]+)/i);

  return shortsMatch?.[1] ?? watchMatch?.[1] ?? shortUrlMatch?.[1] ?? null;
}

export function getYouTubeEmbedUrl(url: string) {
  const videoId = extractYouTubeVideoId(url);

  if (!videoId) {
    return null;
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1&controls=1`;
}
