import { useEffect, useRef, memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import mermaid from "mermaid";
import { Copy, Check, Info, Lightbulb, AlertTriangle, AlertCircle, ShieldAlert } from "lucide-react";
import { useState } from "react";

// Initialize mermaid with dark theme
mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  themeVariables: {
    primaryColor: "#00ffff",
    primaryTextColor: "#e0e0e0",
    primaryBorderColor: "#00ffff",
    lineColor: "#39ff14",
    secondaryColor: "#1a1a2e",
    tertiaryColor: "#0d0d1a",
    fontFamily: "monospace",
  },
  securityLevel: "loose",
  flowchart: { useMaxWidth: true, htmlLabels: true },
});

// Mermaid diagram renderer
const MermaidBlock = memo(({ content }: { content: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2, 10)}`);

  useEffect(() => {
    if (!containerRef.current || !content.trim()) return;

    const renderDiagram = async () => {
      try {
        const { svg } = await mermaid.render(idRef.current, content.trim());
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="text-red-400 text-sm p-3 border border-red-500/30 rounded bg-red-500/10 font-mono">
            <strong>Mermaid Error:</strong><br/>${(err as Error).message || "Failed to render diagram"}
          </div>`;
        }
      }
    };

    renderDiagram();
  }, [content]);

  return (
    <div className="my-4 flex justify-center overflow-x-auto">
      <div ref={containerRef} className="min-w-0" />
    </div>
  );
});

MermaidBlock.displayName = "MermaidBlock";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

const MarkdownPreview = memo(({ content, className = "" }: MarkdownPreviewProps) => {
  const remarkPlugins = useMemo(() => [remarkGfm, remarkMath], []);
  const rehypePlugins = useMemo(() => [
    rehypeRaw,
    rehypeKatex,
    [rehypeHighlight, { detect: true, ignoreMissing: true }] as any,
  ], []);

  if (!content.trim()) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground/50 terminal-text text-sm">
        <div className="text-center">
          <p className="text-lg mb-1">📝</p>
          <p>Start typing markdown to see preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`markdown-preview ${className}`}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={{
          // Headings
          h1: ({ children, ...props }) => (
            <h1 className="text-3xl font-bold mb-4 mt-6 pb-2 border-b border-border text-foreground" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-2xl font-bold mb-3 mt-5 pb-1.5 border-b border-border/50 text-foreground" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-xl font-semibold mb-2 mt-4 text-foreground" {...props}>
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 className="text-lg font-semibold mb-2 mt-3 text-foreground" {...props}>
              {children}
            </h4>
          ),
          h5: ({ children, ...props }) => (
            <h5 className="text-base font-semibold mb-1 mt-2 text-foreground" {...props}>
              {children}
            </h5>
          ),
          h6: ({ children, ...props }) => (
            <h6 className="text-sm font-semibold mb-1 mt-2 text-muted-foreground" {...props}>
              {children}
            </h6>
          ),

          // Paragraphs - added support for GitHub style alerts [!NOTE], [!TIP], etc.
          p: ({ children, ...props }) => {
            const content = String(children);
            const alertMatch = typeof children === 'string' ? children.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)/s) : null;
            
            if (alertMatch) {
              const type = alertMatch[1];
              const text = alertMatch[2];
              
              const alertStyles: Record<string, { icon: any, color: string, bg: string, border: string }> = {
                NOTE: { icon: Info, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
                TIP: { icon: Lightbulb, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
                IMPORTANT: { icon: ShieldAlert, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
                WARNING: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
                CAUTION: { icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" },
              };
              
              const style = alertStyles[type];
              const Icon = style.icon;
              
              return (
                <div className={`my-4 p-4 rounded-lg border-l-4 ${style.bg} ${style.border} flex gap-3 items-start transition-all hover:brightness-110`}>
                  <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${style.color}`} />
                  <div>
                    <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${style.color}`}>{type}</div>
                    <div className="text-sm leading-relaxed text-muted-foreground">{text || children}</div>
                  </div>
                </div>
              );
            }

            return (
              <p className="mb-3 leading-relaxed text-muted-foreground" {...props}>
                {children}
              </p>
            );
          },

          // Links
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors inline-flex items-center gap-1 group"
              {...props}
            >
              {children}
              <span className="inline-block transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
            </a>
          ),

          // Images
          img: ({ src, alt, ...props }) => (
            <span className="block my-6">
              <span className="relative group block overflow-hidden rounded-lg border border-border shadow-2xl">
                <img
                  src={src}
                  alt={alt || ""}
                  className="max-w-full h-auto transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  {...props}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </span>
              {alt && (
                <span className="block text-xs text-muted-foreground mt-2 text-center italic terminal-text">
                  // {alt}
                </span>
              )}
            </span>
          ),

          // Code blocks — detect mermaid
          code: ({ className: codeClassName, children, ...props }) => {
            const match = /language-(\w+)/.exec(codeClassName || "");
            const lang = match ? match[1] : "";
            const codeStr = String(children).replace(/\n$/, "");

            // Mermaid diagrams
            if (lang === "mermaid") {
              return <MermaidBlock content={codeStr} />;
            }

            // Block code (has language or multiline)
            if (lang || codeStr.includes("\n")) {
              return <CodeBlock lang={lang} code={codeStr} className={codeClassName} {...props} />;
            }

            // Inline code
            return (
              <code
                className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-cyan-400 border border-border/50"
                {...props}
              >
                {children}
              </code>
            );
          },

          // Pre (wrapper for code blocks)
          pre: ({ children, ...props }) => (
            <>{children}</>
          ),

          // Tables
          table: ({ children, ...props }) => (
            <div className="my-4 overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-muted/70" {...props}>
              {children}
            </thead>
          ),
          th: ({ children, ...props }) => (
            <th className="px-4 py-2.5 text-left font-semibold text-foreground border-b border-border" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="px-4 py-2 text-muted-foreground border-b border-border/50" {...props}>
              {children}
            </td>
          ),
          tr: ({ children, ...props }) => (
            <tr className="hover:bg-muted/30 transition-colors" {...props}>
              {children}
            </tr>
          ),

          // Lists
          ul: ({ children, ...props }) => (
            <ul className="list-disc list-inside mb-3 space-y-1 text-muted-foreground ml-2" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal list-inside mb-3 space-y-1 text-muted-foreground ml-2" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="leading-relaxed" {...props}>
              {children}
            </li>
          ),

          // Blockquote
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="my-4 pl-4 border-l-4 border-primary/50 bg-primary/5 py-2 pr-4 rounded-r-lg italic text-muted-foreground"
              {...props}
            >
              {children}
            </blockquote>
          ),

          // Horizontal rule
          hr: (props) => (
            <hr className="my-6 border-border" {...props} />
          ),

          // Strong & em
          strong: ({ children, ...props }) => (
            <strong className="font-bold text-foreground" {...props}>
              {children}
            </strong>
          ),
          em: ({ children, ...props }) => (
            <em className="italic text-muted-foreground" {...props}>
              {children}
            </em>
          ),

          // Delete (strikethrough)
          del: ({ children, ...props }) => (
            <del className="line-through text-muted-foreground/60" {...props}>
              {children}
            </del>
          ),

          // Task list items (checkbox)
          input: ({ type, checked, ...props }) => {
            if (type === "checkbox") {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  readOnly
                  className="mr-2 accent-primary"
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

// Separate CodeBlock component for copy functionality
const CodeBlock = memo(({ lang, code, className, ...props }: any) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6">
      <div className="absolute top-0 right-0 flex items-center gap-2 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground bg-muted/80 rounded-bl-lg border-l border-b border-border z-10 backdrop-blur-sm">
        {lang}
        <button
          onClick={handleCopy}
          className="ml-2 hover:text-primary transition-colors focus:outline-none"
          title="Copy code"
        >
          {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>
      <pre className="bg-[#0d1117]/80 border border-border rounded-lg overflow-x-auto text-sm relative transition-all group-hover:border-primary/30 group-hover:shadow-[0_0_20px_rgba(0,255,255,0.1)]">
        <code className={`block p-4 ${className}`} {...props}>
          {code}
        </code>
      </pre>
    </div>
  );
});

CodeBlock.displayName = "CodeBlock";

MarkdownPreview.displayName = "MarkdownPreview";

export default MarkdownPreview;
