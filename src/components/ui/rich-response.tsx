import type { ReactNode } from "react";

type RichResponseProps = {
  content: string;
  empty?: string;
};

type InlinePart = {
  value: string;
  strong: boolean;
};

function parseInline(value: string) {
  const parts = value.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);

  return parts.map<InlinePart>((part) => ({
    value: part.replace(/^\*\*|\*\*$/g, ""),
    strong: part.startsWith("**") && part.endsWith("**")
  }));
}

function renderInline(value: string) {
  return parseInline(value).map((part, index) =>
    part.strong ? <strong key={`${part.value}-${index}`} className="font-semibold text-ink">{part.value}</strong> : <span key={`${part.value}-${index}`}>{part.value}</span>
  );
}

function renderList(items: string[], ordered: boolean, key: string) {
  const ListTag = ordered ? "ol" : "ul";
  return (
    <ListTag
      key={key}
      className={ordered ? "ml-5 list-decimal space-y-2 text-sm leading-7 text-muted" : "ml-5 list-disc space-y-2 text-sm leading-7 text-muted"}
    >
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>{renderInline(item)}</li>
      ))}
    </ListTag>
  );
}

export function RichResponse({ content, empty }: RichResponseProps) {
  if (!content.trim()) {
    return <p className="text-sm leading-7 text-muted">{empty ?? ""}</p>;
  }

  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let paragraphBuffer: string[] = [];
  let listBuffer: string[] = [];
  let orderedList = false;

  function flushParagraph() {
    if (!paragraphBuffer.length) {
      return;
    }

    const paragraph = paragraphBuffer.join(" ").trim();
    if (paragraph) {
      blocks.push(
        <p key={`paragraph-${blocks.length}`} className="text-sm leading-7 text-muted">
          {renderInline(paragraph)}
        </p>
      );
    }
    paragraphBuffer = [];
  }

  function flushList() {
    if (!listBuffer.length) {
      return;
    }

    blocks.push(renderList(listBuffer, orderedList, `list-${blocks.length}`));
    listBuffer = [];
    orderedList = false;
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push(
        <h4 key={`h4-${blocks.length}`} className="mt-2 text-base font-semibold text-ink">
          {renderInline(trimmed.slice(4))}
        </h4>
      );
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push(
        <h3 key={`h3-${blocks.length}`} className="mt-3 text-lg font-semibold text-ink">
          {renderInline(trimmed.slice(3))}
        </h3>
      );
      continue;
    }

    const unorderedMatch = trimmed.match(/^[-*•]\s+(.*)$/);
    if (unorderedMatch) {
      flushParagraph();
      if (!listBuffer.length) {
        orderedList = false;
      }
      listBuffer.push(unorderedMatch[1]);
      continue;
    }

    const orderedMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (orderedMatch) {
      flushParagraph();
      if (!listBuffer.length) {
        orderedList = true;
      }
      listBuffer.push(orderedMatch[1]);
      continue;
    }

    flushList();
    paragraphBuffer.push(trimmed);
  }

  flushParagraph();
  flushList();

  return <div className="space-y-4">{blocks}</div>;
}
