import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Save, ArrowLeft, Upload, Loader2, Terminal, X } from "lucide-react";
import { supabase, BlogPost } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { uploadImage, fileToBase64 } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

const BlogEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "",
    tags: "",
    cover_image: "",
    read_time: "",
  });

  useEffect(() => {
    if (isEditing) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title || "",
          slug: data.slug || "",
          excerpt: data.excerpt || "",
          content: data.content || "",
          author: data.author || "",
          tags: data.tags ? data.tags.join(", ") : "",
          cover_image: data.cover_image || "",
          read_time: data.read_time?.toString() || "",
        });
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
      toast({
        title: "Error",
        description: "Failed to load blog post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadingImage(true);

      // Try to upload to Supabase Storage first
      try {
        const imageUrl = await uploadImage(file);
        setFormData((prev) => ({ ...prev, cover_image: imageUrl }));
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      } catch (storageError) {
        // Fallback to base64 if storage fails
        console.warn("Storage upload failed, using base64:", storageError);
        const base64 = await fileToBase64(file);
        setFormData((prev) => ({ ...prev, cover_image: base64 }));
        toast({
          title: "Success",
          description: "Image converted to base64 (storage may not be configured)",
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
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.slug.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      const tagsArray = formData.tags
        ? formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [];

      const blogData: Partial<BlogPost> = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || null,
        content: formData.content,
        author: formData.author || null,
        tags: tagsArray.length > 0 ? tagsArray : null,
        cover_image: formData.cover_image || null,
        read_time: formData.read_time ? parseInt(formData.read_time) : null,
        updated_at: new Date().toISOString(),
      };

      if (isEditing) {
        const { error } = await supabase
          .from("blogs")
          .update(blogData)
          .eq("id", id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Blog post updated successfully",
        });
      } else {
        const { error } = await supabase.from("blogs").insert(blogData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Blog post created successfully",
        });
      }

      navigate("/admin/blogs");
    } catch (err: any) {
      console.error("Error saving blog:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to save blog post",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent z-0" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2 terminal-text glow-text-cyan">
                {isEditing ? "EDIT_POST.exe" : "NEW_POST.exe"}
              </h1>
              <p className="text-muted-foreground terminal-text">
                {isEditing ? "Edit your blog post" : "Create a new blog post"}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/blogs")}
              className="terminal-text"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title" className="terminal-text">
                Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter blog title"
                required
                className="terminal-text mt-2"
              />
            </div>

            {/* Slug */}
            <div>
              <Label htmlFor="slug" className="terminal-text">
                Slug *
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: generateSlug(e.target.value) }))
                }
                placeholder="url-friendly-slug"
                required
                className="terminal-text mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1 terminal-text">
                URL-friendly identifier (auto-generated from title)
              </p>
            </div>

            {/* Cover Image */}
            <div>
              <Label className="terminal-text">Cover Image</Label>
              <div className="mt-2 space-y-2">
                {formData.cover_image && (
                  <div className="relative inline-block">
                    <img
                      src={formData.cover_image}
                      alt="Cover"
                      className="h-32 w-auto rounded-lg border border-border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setFormData((prev) => ({ ...prev, cover_image: "" }))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="terminal-text"
                  />
                  {uploadingImage && (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  )}
                </div>
                <Input
                  type="url"
                  value={formData.cover_image}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, cover_image: e.target.value }))
                  }
                  placeholder="Or enter image URL"
                  className="terminal-text"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <Label htmlFor="excerpt" className="terminal-text">
                Excerpt
              </Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                placeholder="Short summary of the blog post"
                rows={3}
                className="terminal-text mt-2"
              />
            </div>

            {/* Content */}
            <div>
              <Label className="terminal-text">Content *</Label>
              <div className="mt-2">
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) =>
                    setFormData((prev) => ({ ...prev, content }))
                  }
                  placeholder="Start writing your blog post..."
                />
              </div>
            </div>

            {/* Author */}
            <div>
              <Label htmlFor="author" className="terminal-text">
                Author
              </Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, author: e.target.value }))
                }
                placeholder="Author name"
                className="terminal-text mt-2"
              />
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags" className="terminal-text">
                Tags (comma-separated)
              </Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tags: e.target.value }))
                }
                placeholder="React, JavaScript, Web Development"
                className="terminal-text mt-2"
              />
            </div>

            {/* Read Time */}
            <div>
              <Label htmlFor="read_time" className="terminal-text">
                Read Time (minutes)
              </Label>
              <Input
                id="read_time"
                type="number"
                value={formData.read_time}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, read_time: e.target.value }))
                }
                placeholder="Auto-calculated if not provided"
                className="terminal-text mt-2"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={saving}
                className="terminal-text flex-1"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? "Update Post" : "Create Post"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogEditor;

