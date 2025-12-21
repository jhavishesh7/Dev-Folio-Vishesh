import { motion } from "framer-motion";
import { Heart, MessageCircle, Calendar, Clock, X, Send, Loader2, ExternalLink } from "lucide-react";
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

interface BlogDetailProps {
  blog: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
  onLikeUpdate: (blogId: string, liked: boolean) => void;
}

const BlogDetail = ({ blog, isOpen, onClose, onLikeUpdate }: BlogDetailProps) => {
  const navigate = useNavigate();
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(blog?.likes_count || 0);
  const [submitting, setSubmitting] = useState(false);
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
  }, [blog, isOpen]);

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

  if (!blog) return null;

  const readTime = blog.read_time || Math.ceil(blog.content.split(/\s+/).length / 200);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-primary/30 neon-border-cyan">
        <DialogHeader>
          <DialogTitle className="text-2xl sm:text-3xl terminal-text glow-text-cyan">
            {blog.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            <div className="flex flex-wrap items-center gap-4 mt-2">
              {blog.author && (
                <span className="terminal-text text-sm">
                  <span className="text-primary">Author:</span> {blog.author}
                </span>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" />
                <span className="terminal-text">
                  {format(new Date(blog.published_at || blog.created_at), 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span className="terminal-text">{readTime} min read</span>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* Cover Image */}
        {blog.cover_image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-64 sm:h-80 rounded-lg overflow-hidden mb-6 relative"
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
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground 
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
          className="max-w-none mb-8 blog-content"
        >
          <div 
            className="text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </motion.div>

        {/* Like and Comment Actions */}
        <div className="flex items-center justify-between mb-6 border-t border-border pt-6">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                liked
                  ? 'bg-primary/20 border-primary text-primary'
                  : 'bg-muted border-border text-muted-foreground hover:border-primary'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              <span className="terminal-text font-semibold">{likesCount}</span>
            </motion.button>

            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted border border-border">
              <MessageCircle className="w-5 h-5 text-muted-foreground" />
              <span className="terminal-text font-semibold text-muted-foreground">
                {comments.length}
              </span>
            </div>
          </div>

          {/* View in New Window Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const blogUrl = `${window.location.origin}/blog/${blog.id}`;
              window.open(blogUrl, '_blank', 'noopener,noreferrer');
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary text-primary hover:bg-primary/20 transition-all terminal-text"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="font-semibold">View in New Window</span>
          </motion.button>
        </div>

        {/* Comments Section */}
        <div className="border-t border-border pt-6">
          <h3 className="text-xl font-bold mb-4 terminal-text glow-text-cyan">
            Comments ({comments.length})
          </h3>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  placeholder="Your Name *"
                  value={commentForm.user_name}
                  onChange={(e) => setCommentForm({ ...commentForm, user_name: e.target.value })}
                  required
                  className="terminal-text"
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
                className="terminal-text"
              />
            </div>
            <Textarea
              placeholder="Write your comment... *"
              value={commentForm.content}
              onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
              required
              rows={4}
              className="terminal-text"
            />
            <Button
              type="submit"
              disabled={submitting || !commentForm.content.trim() || !commentForm.user_name.trim()}
              className="terminal-text"
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
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="terminal-text">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-muted/50 border border-border"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold terminal-text text-primary">
                        {comment.user_name}
                      </h4>
                      <p className="text-xs text-muted-foreground terminal-text">
                        {format(new Date(comment.created_at), 'MMM dd, yyyy • HH:mm')}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground terminal-text mt-2 whitespace-pre-wrap">
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

