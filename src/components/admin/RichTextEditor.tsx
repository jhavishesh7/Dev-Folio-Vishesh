import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useRef } from "react";
import { uploadImage, fileToBase64 } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ content, onChange, placeholder = "Start writing..." }: RichTextEditorProps) => {
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Underline,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none min-h-[400px] p-4 terminal-text",
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setShowImageDialog(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      
      // Try Supabase Storage first
      try {
        const url = await uploadImage(file);
        editor.chain().focus().setImage({ src: url }).run();
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      } catch (storageError) {
        // Fallback to base64
        const base64 = await fileToBase64(file);
        editor.chain().focus().setImage({ src: base64 }).run();
        toast({
          title: "Success",
          description: "Image added (using base64)",
        });
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setShowLinkDialog(false);
    }
  };

  const MenuButton = ({ onClick, isActive, children, tooltip }: any) => (
    <Button
      type="button"
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      className="h-8 w-8 p-0"
      title={tooltip}
    >
      {children}
    </Button>
  );

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/50">
        {/* Text Formatting */}
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          tooltip="Bold"
        >
          <Bold className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          tooltip="Italic"
        >
          <Italic className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          tooltip="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          tooltip="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          tooltip="Code"
        >
          <Code className="w-4 h-4" />
        </MenuButton>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Headings */}
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          tooltip="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          tooltip="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          tooltip="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </MenuButton>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Lists */}
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          tooltip="Bullet List"
        >
          <List className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          tooltip="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          tooltip="Quote"
        >
          <Quote className="w-4 h-4" />
        </MenuButton>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Media */}
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Upload Image"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ImageIcon className="w-4 h-4" />
            )}
          </Button>
        </div>

        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" title="Add Image from URL">
              <ImageIcon className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Image from URL</DialogTitle>
              <DialogDescription>Enter image URL or paste base64 data</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Image URL or base64 data"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <Button onClick={addImage} className="w-full">
                Add Image
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant={editor.isActive("link") ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              title="Add Link"
            >
              <LinkIcon className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Link</DialogTitle>
              <DialogDescription>Enter the URL for the link</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
              <Button onClick={addLink} className="w-full">
                Add Link
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Undo/Redo */}
        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          tooltip="Undo"
        >
          <Undo className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          tooltip="Redo"
        >
          <Redo className="w-4 h-4" />
        </MenuButton>
      </div>

      {/* Editor Content */}
      <div className="min-h-[400px] max-h-[600px] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;

