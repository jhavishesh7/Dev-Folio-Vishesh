import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, Eye, EyeOff, FileText, Copy, Check, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import MarkdownPreview from "./MarkdownPreview";

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MarkdownEditor = ({ content, onChange, placeholder = "Paste or type your markdown here..." }: MarkdownEditorProps) => {
  const [showPreview, setShowPreview] = useState(true);
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Handle .md file upload
  const handleFileUpload = useCallback((file: File) => {
    if (!file.name.endsWith(".md") && !file.name.endsWith(".markdown") && file.type !== "text/markdown" && file.type !== "text/plain") {
      toast({
        title: "Invalid File",
        description: "Please upload a .md or .markdown file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      onChange(text);
      toast({
        title: "File Loaded",
        description: `"${file.name}" has been loaded successfully`,
      });
    };
    reader.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to read the file",
        variant: "destructive",
      });
    };
    reader.readAsText(file);
  }, [onChange, toast]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  // Insert markdown shortcuts
  const insertAtCursor = (before: string, after: string = "") => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = content.substring(start, end);
    const newContent = content.substring(0, start) + before + selected + after + content.substring(end);
    onChange(newContent);
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = start + before.length;
      ta.selectionEnd = start + before.length + selected.length;
    }, 0);
  };

  // Keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "b": e.preventDefault(); insertAtCursor("**", "**"); break;
        case "i": e.preventDefault(); insertAtCursor("*", "*"); break;
        case "k": e.preventDefault(); insertAtCursor("[", "](url)"); break;
        case "`": e.preventDefault(); insertAtCursor("```\n", "\n```"); break;
      }
    }
    // Tab to insert spaces
    if (e.key === "Tab") {
      e.preventDefault();
      insertAtCursor("  ");
    }
  };

  // Toolbar buttons
  const toolbarButtons = [
    { label: "B", title: "Bold (Ctrl+B)", action: () => insertAtCursor("**", "**") },
    { label: "I", title: "Italic (Ctrl+I)", action: () => insertAtCursor("*", "*"), italic: true },
    { label: "H1", title: "Heading 1", action: () => insertAtCursor("# ") },
    { label: "H2", title: "Heading 2", action: () => insertAtCursor("## ") },
    { label: "H3", title: "Heading 3", action: () => insertAtCursor("### ") },
    { label: "—", title: "Horizontal Rule", action: () => insertAtCursor("\n---\n") },
    { label: "🔗", title: "Link (Ctrl+K)", action: () => insertAtCursor("[", "](url)") },
    { label: "🖼", title: "Image", action: () => insertAtCursor("![alt](", ")") },
    { label: "<>", title: "Code Block (Ctrl+`)", action: () => insertAtCursor("```\n", "\n```") },
    { label: "•", title: "Bullet List", action: () => insertAtCursor("- ") },
    { label: "1.", title: "Numbered List", action: () => insertAtCursor("1. ") },
    { label: "❝", title: "Blockquote", action: () => insertAtCursor("> ") },
    { label: "📊", title: "Table", action: () => insertAtCursor("| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n") },
    { label: "📈", title: "Mermaid Chart", action: () => insertAtCursor("```mermaid\ngraph TD\n  A[Start] --> B[Process]\n  B --> C[End]\n", "```\n") },
    { label: "∑", title: "Math Block", action: () => insertAtCursor("$$\n", "\n$$") },
  ];

  const containerClass = fullscreen
    ? "fixed inset-0 z-50 bg-background flex flex-col"
    : "border border-border rounded-lg overflow-hidden bg-card flex flex-col";

  return (
    <div className={containerClass}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/50">
        {/* File upload */}
        <input
          type="file"
          accept=".md,.markdown,text/markdown,text/plain"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2 text-xs terminal-text"
          onClick={() => fileInputRef.current?.click()}
          title="Upload .md file"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Upload .md</span>
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Formatting toolbar */}
        {toolbarButtons.map((btn, i) => (
          <Button
            key={i}
            type="button"
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 text-xs ${btn.italic ? "italic" : ""}`}
            onClick={btn.action}
            title={btn.title}
          >
            {btn.label}
          </Button>
        ))}

        <div className="flex-1" />

        {/* Right-side actions */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={handleCopy}
          title="Copy markdown"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
        </Button>
        <Button
          type="button"
          variant={showPreview ? "default" : "ghost"}
          size="sm"
          className="h-8 gap-1.5 px-2 text-xs"
          onClick={() => setShowPreview(!showPreview)}
          title={showPreview ? "Hide Preview" : "Show Preview"}
        >
          {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{showPreview ? "Hide" : "Preview"}</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setFullscreen(!fullscreen)}
          title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {fullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </Button>
      </div>

      {/* Editor + Preview */}
      <div
        className={`flex ${fullscreen ? "flex-1 overflow-hidden" : ""}`}
        style={fullscreen ? {} : { minHeight: "500px", maxHeight: "700px" }}
      >
        {/* Editor pane */}
        <div
          className={`relative flex flex-col ${showPreview ? "w-1/2 border-r border-border" : "w-full"}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Drag overlay */}
          {dragOver && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-primary/10 border-2 border-dashed border-primary rounded-lg">
              <div className="text-center">
                <FileText className="w-10 h-10 mx-auto mb-2 text-primary" />
                <p className="text-primary terminal-text font-semibold">Drop .md file here</p>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-b border-border">
            <span className="text-xs terminal-text text-muted-foreground flex items-center gap-1.5">
              <FileText className="w-3 h-3" />
              Markdown
            </span>
            <span className="text-xs text-muted-foreground terminal-text">
              {content.length} chars • {content.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 w-full resize-none bg-transparent p-4 text-sm font-mono leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none overflow-auto"
            spellCheck={false}
          />
        </div>

        {/* Preview pane */}
        {showPreview && (
          <div className="w-1/2 flex flex-col overflow-hidden">
            <div className="flex items-center px-3 py-1.5 bg-muted/30 border-b border-border">
              <span className="text-xs terminal-text text-muted-foreground flex items-center gap-1.5">
                <Eye className="w-3 h-3" />
                Preview
              </span>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <MarkdownPreview content={content} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;
