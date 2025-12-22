import { motion } from "framer-motion";
import { BookOpen, Calendar, Clock, ArrowRight, Terminal, Code2, Sparkles, Heart, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase, BlogPost } from "@/lib/supabase";
import { format } from "date-fns";
import BlogDetail from "./BlogDetail";

const Blog = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('blogs')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(12);

      if (fetchError) throw fetchError;
      
      // Fetch likes and comments counts for each blog
      const blogsWithCounts = await Promise.all(
        (data || []).map(async (blog) => {
          const [likesResult, commentsResult] = await Promise.all([
            supabase
              .from('blog_likes')
              .select('*', { count: 'exact', head: true })
              .eq('blog_id', blog.id),
            supabase
              .from('blog_comments')
              .select('*', { count: 'exact', head: true })
              .eq('blog_id', blog.id),
          ]);

          return {
            ...blog,
            likes_count: likesResult.count || 0,
            comments_count: commentsResult.count || 0,
          };
        })
      );
      
      setBlogs(blogsWithCounts);
      setError(null);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs. Please check your Supabase configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleReadArticle = (blog: BlogPost) => {
    setSelectedBlog(blog);
    setIsDetailOpen(true);
  };

  const handleLikeUpdate = (blogId: string, liked: boolean) => {
    setBlogs(prevBlogs =>
      prevBlogs.map(blog =>
        blog.id === blogId
          ? {
              ...blog,
              likes_count: liked
                ? (blog.likes_count || 0) + 1
                : Math.max(0, (blog.likes_count || 0) - 1),
            }
          : blog
      )
    );
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const getTechyGradient = (index: number) => {
    const gradients = [
      "from-cyan-500/20 to-transparent",
      "from-violet-500/20 to-transparent",
      "from-primary/20 to-transparent",
      "from-secondary/20 to-transparent",
      "from-emerald-500/20 to-transparent",
      "from-pink-500/20 to-transparent",
    ];
    return gradients[index % gradients.length];
  };

  const getTechyGlow = (index: number) => {
    const glows = ["neon-border-cyan", "neon-border-violet"];
    return glows[index % glows.length];
  };

  return (
    <section id="blog" className="min-h-screen py-8 sm:py-12 md:py-20 px-4 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <motion.div
            className="flex items-center justify-center gap-3 mb-4"
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Code2 className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-secondary" />
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 glow-text-cyan terminal-text">
            BLOG_CENTER.exe
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-2">
            Decrypting knowledge, one post at a time
          </p>
        </motion.div>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <Terminal className="w-12 h-12 text-primary mb-4 animate-pulse" />
            <p className="text-muted-foreground terminal-text">Loading blog posts...</p>
            <div className="mt-4 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-destructive/10 border border-destructive rounded-xl p-6 text-center"
          >
            <Terminal className="w-8 h-8 text-destructive mx-auto mb-2" />
            <p className="text-destructive terminal-text">{error}</p>
          </motion.div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground terminal-text text-lg mb-2">
              No blog posts found.
            </p>
            <p className="text-muted-foreground terminal-text text-sm">
              The blog table is empty. Add some posts to get started!
            </p>
          </motion.div>
        )}

        {!loading && !error && blogs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {blogs.map((blog, index) => {
              const readTime = blog.read_time || getReadTime(blog.content);
              const publishedDate = blog.published_at || blog.created_at;
              
              return (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 50, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -15,
                    rotateY: 5,
                    transition: { duration: 0.3 }
                  }}
                  className="group relative"
                  style={{ perspective: "1000px" }}
                >
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${getTechyGradient(index)} rounded-xl blur-xl`}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  
                  <motion.div 
                    className={`relative p-4 sm:p-6 rounded-xl bg-card/80 border border-border 
                                hover:border-primary transition-all duration-300 ${getTechyGlow(index)}
                                backdrop-blur-md h-full flex flex-col shadow-2xl`}
                    whileHover={{ 
                      boxShadow: "0 0 30px rgba(0, 240, 255, 0.3)",
                      borderColor: "rgba(0, 240, 255, 0.8)"
                    }}
                  >
                    {/* Cover Image */}
                    {blog.cover_image && (
                      <motion.div
                        className="w-full h-40 sm:h-48 mb-3 sm:mb-4 rounded-lg overflow-hidden relative"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img 
                          src={blog.cover_image} 
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                      </motion.div>
                    )}

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 terminal-text group-hover:glow-text-cyan transition-all line-clamp-2">
                      {blog.title}
                    </h3>
                    
                    {/* Excerpt */}
                    <p className="text-muted-foreground mb-3 sm:mb-4 leading-relaxed flex-grow line-clamp-3 text-xs sm:text-sm md:text-base">
                      {blog.excerpt || blog.content.substring(0, 150) + '...'}
                    </p>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground 
                                     border border-border terminal-text"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-xs text-muted-foreground mb-3 sm:mb-4 border-t border-border pt-3 sm:pt-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span className="terminal-text truncate">
                          {format(new Date(publishedDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span className="terminal-text">{readTime} min read</span>
                      </div>
                    </div>

                    {/* Author */}
                    {blog.author && (
                      <div className="text-xs text-muted-foreground mb-3 sm:mb-4 terminal-text truncate">
                        <span className="text-primary">Author:</span> {blog.author}
                      </div>
                    )}

                    {/* Likes and Comments Count */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Heart className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="terminal-text">{blog.likes_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="terminal-text">{blog.comments_count || 0}</span>
                      </div>
                    </div>

                    {/* Read More Button */}
                    <motion.button
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReadArticle(blog)}
                      className="flex items-center gap-2 text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors mt-auto group/btn w-full sm:w-auto"
                    >
                      <span className="terminal-text">Read Article</span>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform flex-shrink-0" />
                    </motion.button>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Terminal Footer */}
        {!loading && !error && blogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-card/50 border border-border rounded-lg terminal-text text-sm text-muted-foreground">
              <Terminal className="w-4 h-4 text-primary" />
              <span>Total Articles: {blogs.length}</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Blog Detail Dialog */}
      <BlogDetail
        blog={selectedBlog}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedBlog(null);
        }}
        onLikeUpdate={handleLikeUpdate}
      />
    </section>
  );
};

export default Blog;


