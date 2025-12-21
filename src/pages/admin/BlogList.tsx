import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Terminal,
  Loader2,
  Search,
} from "lucide-react";
import { supabase, BlogPost } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const BlogList = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; blog: BlogPost | null }>({
    open: false,
    blog: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.blog) return;

    const blogId = deleteDialog.blog.id; // Store the ID before async operation
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from("blogs")
        .delete()
        .eq("id", blogId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });

      setDeleteDialog({ open: false, blog: null });
      setIsDeleting(false);
      fetchBlogs();
    } catch (err) {
      console.error("Error deleting blog:", err);
      setIsDeleting(false);
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    navigate("/admin/login");
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 terminal-text glow-text-cyan">
                BLOG_ADMIN.exe
              </h1>
              <p className="text-muted-foreground terminal-text">
                Manage your blog posts
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => navigate("/admin/blogs/new")} className="terminal-text">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="terminal-text"
              >
                Logout
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 terminal-text"
            />
          </div>
        </motion.div>

        {/* Blog List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredBlogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Terminal className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground terminal-text text-lg">
              {searchQuery ? "No blogs found matching your search" : "No blog posts yet"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => navigate("/admin/blogs/new")}
                className="mt-4 terminal-text"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Post
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {filteredBlogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card/80 border border-border rounded-xl p-6 hover:border-primary transition-all neon-border-cyan"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 terminal-text glow-text-cyan">
                      {blog.title}
                    </h3>
                    <p className="text-muted-foreground mb-3 line-clamp-2">
                      {blog.excerpt || blog.content.substring(0, 150) + "..."}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="terminal-text">
                          {format(new Date(blog.created_at), "MMM dd, yyyy")}
                        </span>
                      </div>
                      <span className="terminal-text">Slug: {blog.slug}</span>
                      {blog.author && (
                        <span className="terminal-text">Author: {blog.author}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/blogs/${blog.id}`)}
                      className="terminal-text"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteDialog({ open: true, blog })}
                      className="terminal-text text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={deleteDialog.open} 
        onOpenChange={(open) => {
          // Only close if not currently deleting
          if (!open && !isDeleting) {
            setDeleteDialog({ open: false, blog: null });
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog.blog?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="terminal-text"
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="terminal-text bg-destructive hover:bg-destructive/90 disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlogList;

