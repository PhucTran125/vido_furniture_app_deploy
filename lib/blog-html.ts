import 'server-only';
import type { LocalizedRichContent } from '@/lib/types';

type TiptapNode = {
  type?: string;
  content?: TiptapNode[];
  text?: string;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  attrs?: Record<string, unknown>;
};

const LINK_CLASS = 'text-accent underline hover:text-primary transition-colors cursor-pointer';
const IMG_CLASS = 'max-w-full rounded-xl my-8 mx-auto shadow-sm';

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
}

function escapeAttr(s: string): string {
  return s.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
}

function isSafeUrl(url: unknown): url is string {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim().toLowerCase();
  if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:') || trimmed.startsWith('vbscript:')) return false;
  return true;
}

function applyMarks(text: string, marks: TiptapNode['marks']): string {
  if (!marks || marks.length === 0) return text;
  let out = text;
  for (const mark of marks) {
    switch (mark.type) {
      case 'bold':
        out = `<strong>${out}</strong>`;
        break;
      case 'italic':
        out = `<em>${out}</em>`;
        break;
      case 'strike':
        out = `<s>${out}</s>`;
        break;
      case 'code':
        out = `<code>${out}</code>`;
        break;
      case 'underline':
        out = `<u>${out}</u>`;
        break;
      case 'link': {
        const href = mark.attrs?.href;
        if (!isSafeUrl(href)) {
          // Drop the link wrapper, keep the text
          break;
        }
        out = `<a href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer" class="${LINK_CLASS}">${out}</a>`;
        break;
      }
      default:
        break;
    }
  }
  return out;
}

function renderChildren(nodes: TiptapNode[] | undefined): string {
  if (!nodes) return '';
  return nodes.map(renderNode).join('');
}

function renderNode(node: TiptapNode): string {
  switch (node.type) {
    case 'doc':
      return renderChildren(node.content);
    case 'paragraph':
      return `<p>${renderChildren(node.content)}</p>`;
    case 'text':
      return applyMarks(escapeHtml(node.text || ''), node.marks);
    case 'heading': {
      const level = Math.min(Math.max(Number(node.attrs?.level) || 1, 1), 6);
      return `<h${level}>${renderChildren(node.content)}</h${level}>`;
    }
    case 'bulletList':
      return `<ul>${renderChildren(node.content)}</ul>`;
    case 'orderedList':
      return `<ol>${renderChildren(node.content)}</ol>`;
    case 'listItem':
      return `<li>${renderChildren(node.content)}</li>`;
    case 'blockquote':
      return `<blockquote>${renderChildren(node.content)}</blockquote>`;
    case 'codeBlock':
      return `<pre><code>${renderChildren(node.content)}</code></pre>`;
    case 'horizontalRule':
      return '<hr>';
    case 'hardBreak':
      return '<br>';
    case 'image': {
      const src = node.attrs?.src;
      if (!isSafeUrl(src)) return '';
      const alt = typeof node.attrs?.alt === 'string' ? escapeAttr(node.attrs.alt) : '';
      return `<img src="${escapeAttr(src)}" alt="${alt}" class="${IMG_CLASS}" />`;
    }
    default:
      // Unknown node type — render children if any, log so we notice
      if (node.type) console.warn(`[blog-html] Unknown node type: ${node.type}`);
      return renderChildren(node.content);
  }
}

function renderOne(json: Record<string, unknown> | null): string {
  if (!json) return '';
  try {
    return renderNode(json as TiptapNode);
  } catch (e) {
    console.error('Error rendering blog content:', e);
    return '<p>Error loading content.</p>';
  }
}

export function renderBlogContent(content: LocalizedRichContent): { en: string; vi: string } {
  return {
    en: renderOne(content.en),
    vi: renderOne(content.vi),
  };
}
