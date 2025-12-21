import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, MessageCircle, Calendar, Clock, Loader2, Terminal, ExternalLink } from "lucide-react";
import { supabase, BlogPost, BlogComment, getUserId } from "@/lib/supabase";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const BlogPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [commentForm, setCommentForm] = useState({
    user_name: "",
    user_email: "",
    content: "",
  });

  useEffect(() => {
    if (id) {
      fetchBlog();
      fetchComments();
      checkLikeStatus();
      fetchLikesCount();
    }
  }, [id]);

  const fetchBlog = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      
      if (!data) {
        setError('Blog post not found');
        return;
      }

      setBlog(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching blog:', err);
      setError('Failed to load blog post. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    if (!id) return;
    
    try {
      setCommentsLoading(true);
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('blog_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const checkLikeStatus = async () => {
    if (!id) return;
    
    try {
      const userId = getUserId();
      const { data } = await supabase
        .from('blog_likes')
        .select('id')
        .eq('blog_id', id)
        .eq('user_id', userId)
        .single();

      setLiked(!!data);
    } catch (err) {
      setLiked(false);
    }
  };

  const fetchLikesCount = async () => {
    if (!id) return;
    
    try {
      const { count, error } = await supabase
        .from('blog_likes')
        .select('*', { count: 'exact', head: true })
        .eq('blog_id', id);

      if (error) throw error;
      setLikesCount(count || 0);
    } catch (err) {
      console.error('Error fetching likes count:', err);
    }
  };

  const handleLike = async () => {
    if (!id) return;

    try {
      const userId = getUserId();

      if (liked) {
        const { error } = await supabase
          .from('blog_likes')
          .delete()
          .eq('blog_id', id)
          .eq('user_id', userId);

        if (error) throw error;
        setLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        const { error } = await supabase
          .from('blog_likes')
          .insert({
            blog_id: id,
            user_id: userId,
          });

        if (error) throw error;
        setLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !commentForm.content.trim() || !commentForm.user_name.trim()) return;

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('blog_comments')
        .insert({
          blog_id: id,
          user_name: commentForm.user_name,
          user_email: commentForm.user_email || null,
          content: commentForm.content,
        });

      if (error) throw error;

      setCommentForm({ user_name: "", user_email: "", content: "" });
      fetchComments();
    } catch (err) {
      console.error('Error submitting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground terminal-text">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <Terminal className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2 terminal-text">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-6 terminal-text">
            {error || 'The blog post you are looking for does not exist.'}
          </p>
          <Button onClick={() => navigate('/')} className="terminal-text">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const readTime = blog.read_time || Math.ceil(blog.content.split(/\s+/).length / 200);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="terminal-text"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 terminal-text glow-text-cyan">
            {blog.title}
          </h1>
          
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            {blog.author && (
              <span className="terminal-text">
                <span className="text-primary">Author:</span> {blog.author}
              </span>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="terminal-text">
                {format(new Date(blog.published_at || blog.created_at), 'MMM dd, yyyy')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="terminal-text">{readTime} min read</span>
            </div>
          </div>

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
        </motion.div>

        {/* Cover Image */}
        {blog.cover_image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden mb-8 relative"
          >
            <img
              src={blog.cover_image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-none mb-12 blog-content"
        >
          <div 
            className="text-muted-foreground leading-relaxed text-base sm:text-lg"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </motion.div>

        {/* Like and Comment Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-between mb-8 border-t border-border pt-6"
        >
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

          {/* Share Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: blog.title,
                  text: blog.excerpt || blog.content.substring(0, 150),
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary text-primary hover:bg-primary/20 transition-all terminal-text"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="font-semibold">Share</span>
          </motion.button>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-border pt-8"
        >
          <h2 className="text-2xl font-bold mb-6 terminal-text glow-text-cyan">
            Comments ({comments.length})
          </h2>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-8 space-y-4">
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
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Post Comment
                </>
              )}
            </Button>
          </form>

          {/* Comments List */}
          {commentsLoading ? (
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
        </motion.div>
      </article>
    </div>
  );
};

export default BlogPage;

