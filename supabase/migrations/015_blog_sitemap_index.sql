-- Migration: Add composite index for blog sitemap generation
-- Purpose: Optimize queries that filter by status='published' and order by published_at
-- Issue: Sitemap generation queries blog_posts by status and orders by published_at DESC
-- No composite index existed for this pattern, causing full table scans

-- Create composite index with WHERE clause for published posts only
-- This partial index is more efficient as it only indexes the rows we care about
CREATE INDEX idx_blog_sitemap ON blog_posts(status, published_at DESC) WHERE status = 'published';

-- Verify the index covers our query pattern
-- To validate this works, run: EXPLAIN ANALYZE SELECT slug, published_at FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC;
-- Expected: Index scan on idx_blog_sitemap instead of full table scan
