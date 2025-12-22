import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Calendar, Clock, X, Send, Loader2, ExternalLink, Share2, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, BlogPost, BlogComment, getUserId } from "@/lib/supabase";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";

interface BlogDetailProps {
  blog: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
  onLikeUpdate: (blogId: string, liked: boolean) => void;
}

const BlogDetail = ({ blog, isOpen, onClose, onLikeUpdate }: BlogDetailProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(blog?.likes_count || 0);
  const [submitting, setSubmitting] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [commentForm, setCommentForm] = useState({
    user_name: "",
    user_email: "",
    content: "",
  });

  useEffect(() => {
    if (blog && isOpen) {
      fetchComments();
      checkLikeStatus();
      fetchLikesCount();
    }
    // Close share menu when dialog closes
    if (!isOpen) {
      setShowShareMenu(false);
    }
  }, [blog, isOpen]);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showShareMenu && !target.closest('.relative')) {
        setShowShareMenu(false);
      }
    };

    if (showShareMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showShareMenu]);

  const fetchComments = async () => {
    if (!blog) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('blog_id', blog.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkLikeStatus = async () => {
    if (!blog) return;
    
    try {
      const userId = getUserId();
      const { data } = await supabase
        .from('blog_likes')
        .select('id')
        .eq('blog_id', blog.id)
        .eq('user_id', userId)
        .single();

      setLiked(!!data);
    } catch (err) {
      // User hasn't liked this post
      setLiked(false);
    }
  };

  const fetchLikesCount = async () => {
    if (!blog) return;
    
    try {
      const { count, error } = await supabase
        .from('blog_likes')
        .select('*', { count: 'exact', head: true })
        .eq('blog_id', blog.id);

      if (error) throw error;
      setLikesCount(count || 0);
    } catch (err) {
      console.error('Error fetching likes count:', err);
    }
  };

  const handleLike = async () => {
    if (!blog) return;

    try {
      const userId = getUserId();

      if (liked) {
        // Unlike
        const { error } = await supabase
          .from('blog_likes')
          .delete()
          .eq('blog_id', blog.id)
          .eq('user_id', userId);

        if (error) throw error;
        setLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
        onLikeUpdate(blog.id, false);
      } else {
        // Like
        const { error } = await supabase
          .from('blog_likes')
          .insert({
            blog_id: blog.id,
            user_id: userId,
          });

        if (error) throw error;
        setLiked(true);
        setLikesCount(prev => prev + 1);
        onLikeUpdate(blog.id, true);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog || !commentForm.content.trim() || !commentForm.user_name.trim()) return;

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('blog_comments')
        .insert({
          blog_id: blog.id,
          user_name: commentForm.user_name,
          user_email: commentForm.user_email || null,
          content: commentForm.content,
        });

      if (error) throw error;

      // Reset form and refresh comments
      setCommentForm({ user_name: "", user_email: "", content: "" });
      fetchComments();
    } catch (err) {
      console.error('Error submitting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyLink = async () => {
    if (!blog) return;
    
    const blogUrl = `${window.location.origin}/blog/${blog.id}`;
    
    try {
      await navigator.clipboard.writeText(blogUrl);
      setCopied(true);
      setShowShareMenu(false);
      toast({
        title: "Link copied!",
        description: "Blog link has been copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!blog) return null;

  const readTime = blog.read_time || Math.ceil(blog.content.split(/\s+/).length / 200);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl md:max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-card border-primary/30 neon-border-cyan p-4 sm:p-6 mx-2 sm:mx-0">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
            <div className="flex-1 min-w-0">
          <DialogTitle className="text-xl sm:text-2xl md:text-3xl terminal-text glow-text-cyan break-words">
            {blog.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 mt-2">
              {blog.author && (
                <span className="terminal-text text-xs sm:text-sm truncate">
                  <span className="text-primary">Author:</span> {blog.author}
                </span>
              )}
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="terminal-text">
                  {format(new Date(blog.published_at || blog.created_at), 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="terminal-text">{readTime} min read</span>
              </div>
            </div>
          </DialogDescription>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* View in New Window Button - Moved to top */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const blogUrl = `${window.location.origin}/blog/${blog.id}`;
                  window.open(blogUrl, '_blank', 'noopener,noreferrer');
                }}
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg bg-primary/10 border border-primary text-primary hover:bg-primary/20 transition-all terminal-text text-xs sm:text-sm"
              >
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="font-semibold hidden sm:inline">View in New Window</span>
                <span className="font-semibold sm:hidden">New Window</span>
              </motion.button>

              {/* Share Button */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg bg-secondary/10 border border-secondary text-secondary hover:bg-secondary/20 transition-all terminal-text text-xs sm:text-sm"
                >
                  <Share2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="font-semibold hidden sm:inline">Share</span>
                </motion.button>

                {/* Share Menu Dropdown */}
                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-40 sm:w-48 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden"
                    >
                      <button
                        onClick={handleCopyLink}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors terminal-text text-xs sm:text-sm"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>Link Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 flex-shrink-0" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Cover Image */}
        {blog.cover_image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-48 sm:h-64 md:h-80 rounded-lg overflow-hidden mb-4 sm:mb-6 relative"
          >
            <img
              src={blog.cover_image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
          </motion.div>
        )}

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 sm:px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground 
                         border border-border terminal-text"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-none mb-6 sm:mb-8 blog-content"
        >
          <div 
            className="text-sm sm:text-base text-muted-foreground leading-relaxed prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </motion.div>

        {/* Like and Comment Actions */}
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 border-t border-border pt-4 sm:pt-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border transition-all text-sm sm:text-base ${
                liked
                  ? 'bg-primary/20 border-primary text-primary'
                  : 'bg-muted border-border text-muted-foreground hover:border-primary'
              }`}
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${liked ? 'fill-current' : ''}`} />
              <span className="terminal-text font-semibold">{likesCount}</span>
            </motion.button>

            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-muted border border-border">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
              <span className="terminal-text font-semibold text-muted-foreground text-sm sm:text-base">
                {comments.length}
              </span>
            </div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-border pt-4 sm:pt-6">
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 terminal-text glow-text-cyan">
            Comments ({comments.length})
          </h3>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Input
                  placeholder="Your Name *"
                  value={commentForm.user_name}
                  onChange={(e) => setCommentForm({ ...commentForm, user_name: e.target.value })}
                  required
                  className="terminal-text text-sm sm:text-base"
                />
                <p className="text-xs text-muted-foreground mt-1 terminal-text">
                  Just your name is required - no login needed!
                </p>
              </div>
              <Input
                type="email"
                placeholder="Email (optional)"
                value={commentForm.user_email}
                onChange={(e) => setCommentForm({ ...commentForm, user_email: e.target.value })}
                className="terminal-text text-sm sm:text-base"
              />
            </div>
            <Textarea
              placeholder="Write your comment... *"
              value={commentForm.content}
              onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
              required
              rows={4}
              className="terminal-text text-sm sm:text-base"
            />
            <Button
              type="submit"
              disabled={submitting || !commentForm.content.trim() || !commentForm.user_name.trim()}
              className="terminal-text w-full sm:w-auto text-sm sm:text-base"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Post Comment
                </>
              )}
            </Button>
          </form>

          {/* Comments List */}
          {loading ? (
            <div className="flex items-center justify-center py-6 sm:py-8">
              <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-primary" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-muted-foreground">
              <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
              <p className="terminal-text text-sm sm:text-base">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 sm:p-4 rounded-lg bg-muted/50 border border-border"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold terminal-text text-primary text-sm sm:text-base truncate">
                        {comment.user_name}
                      </h4>
                      <p className="text-xs text-muted-foreground terminal-text">
                        {format(new Date(comment.created_at), 'MMM dd, yyyy • HH:mm')}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground terminal-text mt-2 whitespace-pre-wrap break-words">
                    {comment.content}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogDetail;

