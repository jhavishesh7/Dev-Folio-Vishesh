-- ============================================
-- COMPLETE BLOG SYSTEM SETUP
-- Run this entire script in your Supabase SQL Editor
-- ============================================

-- 1. Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  slug TEXT UNIQUE NOT NULL,
  author TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  tags TEXT[],
  cover_image TEXT,
  read_time INTEGER
);

-- 2. Create blog_likes table
CREATE TABLE IF NOT EXISTS blog_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(blog_id, user_id)
);

-- 3. Create blog_comments table
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blog_likes_blog_id ON blog_likes(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_user_id ON blog_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_id ON blog_comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created_at ON blog_comments(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Blogs policies
DROP POLICY IF EXISTS "Allow public read access" ON blogs;
CREATE POLICY "Allow public read access" ON blogs
  FOR SELECT USING (true);

-- Blog likes policies
DROP POLICY IF EXISTS "Allow public to like posts" ON blog_likes;
CREATE POLICY "Allow public to like posts" ON blog_likes
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public to read likes" ON blog_likes;
CREATE POLICY "Allow public to read likes" ON blog_likes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow users to delete their likes" ON blog_likes;
CREATE POLICY "Allow users to delete their likes" ON blog_likes
  FOR DELETE USING (true);

-- Blog comments policies
DROP POLICY IF EXISTS "Allow public to insert comments" ON blog_comments;
CREATE POLICY "Allow public to insert comments" ON blog_comments
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public to read comments" ON blog_comments;
CREATE POLICY "Allow public to read comments" ON blog_comments
  FOR SELECT USING (true);

-- ============================================
-- SAMPLE DATA (Optional - Remove if you want empty tables)
-- ============================================

-- Uncomment the following lines to add sample blog posts:

/*
INSERT INTO blogs (title, content, excerpt, slug, author, tags, read_time)
VALUES (
  'Getting Started with React',
  'React is a powerful JavaScript library for building user interfaces. In this comprehensive guide, we will explore the fundamentals of React, including components, props, state, and hooks.

React allows you to build complex UIs from small, reusable pieces called components. Each component is a JavaScript function that returns JSX, which looks like HTML but is actually JavaScript.

Here are some key concepts:
- Components: The building blocks of React applications
- Props: Data passed from parent to child components
- State: Component-specific data that can change over time
- Hooks: Functions that let you use state and other React features

By the end of this guide, you will have a solid understanding of React and be ready to build your own applications!',
  'Learn the basics of React in this comprehensive guide covering components, props, state, and hooks.',
  'getting-started-with-react',
  'Vishesh Jha',
  ARRAY['React', 'JavaScript', 'Web Development', 'Frontend'],
  5
);

INSERT INTO blogs (title, content, excerpt, slug, author, tags, read_time)
VALUES (
  'Understanding TypeScript',
  'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds static type definitions to JavaScript, which helps catch errors early and makes your code more maintainable.

Key features of TypeScript:
- Static typing: Catch errors at compile time
- Better IDE support: Enhanced autocomplete and refactoring
- Improved code documentation: Types serve as inline documentation
- Easier refactoring: Type system helps ensure changes are safe

TypeScript is especially useful for large codebases where maintaining code quality becomes challenging.',
  'Discover how TypeScript can improve your JavaScript development workflow with static typing and better tooling.',
  'understanding-typescript',
  'Vishesh Jha',
  ARRAY['TypeScript', 'JavaScript', 'Programming', 'Web Development'],
  4
);
*/

