import type { ReactNode } from "react";

type Block =
  | { type: "heading"; level: 2 | 3; value: string }
  | { type: "paragraph"; value: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "code"; value: string };

function tableCells(line: string) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getContents(source: string) {
  return parseMarkdown(source).flatMap((block) => block.type === "heading" && block.level === 2 ? [{ id: slugify(block.value), title: block.value }] : []);
}

function parseMarkdown(source: string): Block[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];

  for (let index = 0; index < lines.length;) {
    const line = lines[index].trim();

    if (!line || line.startsWith("# ")) {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        code.push(lines[index]);
        index += 1;
      }
      blocks.push({ type: "code", value: code.join("\n") });
      index += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push({ type: "heading", level: 2, value: line.slice(3).trim() });
      index += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push({ type: "heading", level: 3, value: line.slice(4).trim() });
      index += 1;
      continue;
    }

    if (line.startsWith("|") && index + 1 < lines.length && /^\|?[\s:|-]+\|?$/.test(lines[index + 1].trim())) {
      const headers = tableCells(line);
      const rows: string[][] = [];
      index += 2;
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        rows.push(tableCells(lines[index]));
        index += 1;
      }
      blocks.push({ type: "table", headers, rows });
      continue;
    }

    const ordered = /^\d+\.\s/.test(line);
    if (line.startsWith("- ") || ordered) {
      const items: string[] = [];
      const matcher = ordered ? /^\d+\.\s+/ : /^-\s+/;
      while (index < lines.length && matcher.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(matcher, ""));
        index += 1;
      }
      blocks.push({ type: "list", ordered, items });
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (index < lines.length && lines[index].trim()) {
      const next = lines[index].trim();
      if (next.startsWith("#") || next.startsWith("```") || next.startsWith("- ") || /^\d+\.\s/.test(next)) {
        break;
      }
      paragraph.push(next);
      index += 1;
    }
    blocks.push({ type: "paragraph", value: paragraph.join(" ") });
  }

  return blocks;
}

function inline(value: string): ReactNode[] {
  return value.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)]+\))/g).filter(Boolean).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={`${part}-${index}`}>{part.slice(1, -1)}</code>;
    }
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (link) return <a href={link[2]} key={`${part}-${index}`} target="_blank" rel="noopener noreferrer">{link[1]}</a>;
    return part;
  });
}

export function MarkdownContent({ source }: { source: string }) {
  const blocks = parseMarkdown(source);

  return (
    <div className="prose">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const id = slugify(block.value);
          return block.level === 2
            ? <h2 id={id} key={`${id}-${index}`}>{block.value}</h2>
            : <h3 id={id} key={`${id}-${index}`}>{block.value}</h3>;
        }
        if (block.type === "list") {
          const items = block.items.map((item, itemIndex) => <li key={`${item}-${itemIndex}`}>{inline(item)}</li>);
          return block.ordered
            ? <ol key={`list-${index}`}>{items}</ol>
            : <ul key={`list-${index}`}>{items}</ul>;
        }
        if (block.type === "code") {
          return <pre key={`code-${index}`}><code>{block.value}</code></pre>;
        }
        if (block.type === "table") {
          return <div className="table-scroll" key={`table-${index}`}><table><thead><tr>{block.headers.map((cell, cellIndex) => <th scope="col" key={cellIndex}>{inline(cell)}</th>)}</tr></thead><tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{inline(cell)}</td>)}</tr>)}</tbody></table></div>;
        }
        return <p key={`paragraph-${index}`}>{inline(block.value)}</p>;
      })}
    </div>
  );
}
