import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BlogContent } from '@/components/blog/BlogContent'
import { usePublicBlogPost } from '@/hooks/useAdminBlogPosts'
import { articleSchema, breadcrumbSchema } from '@/lib/seo/schema'
import { SITE_NAME, absoluteUrl } from '@/lib/seo/site'
import { format } from 'date-fns'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, isLoading } = usePublicBlogPost(slug)

  if (isLoading) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-16">
          <div className="h-10 w-2/3 animate-pulse rounded bg-muted" />
          <div className="mt-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 animate-pulse rounded bg-muted/70" />
            ))}
          </div>
        </main>
        <SiteFooter />
      </>
    )
  }

  if (!post) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Post not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This article is private, unpublished, or the link is incorrect.
          </p>
          <Link to="/blog" className="mt-4 inline-flex items-center gap-1 text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>
        </main>
        <SiteFooter />
      </>
    )
  }

  const title = post.meta_title || post.title
  const description = post.meta_desc || post.excerpt || ''
  const canonical = post.canonical_url || absoluteUrl(`/blog/${post.slug}`)
  const keywords = (post.keywords || []).join(', ')

  const schemas = [
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
    articleSchema({
      title: post.title,
      description,
      path: `/blog/${post.slug}`,
      datePublished: post.published_at || post.created_at,
      dateModified: post.updated_at || post.published_at || post.created_at,
    }),
  ]

  return (
    <>
      <Helmet>
        <title>{`${title} | ${SITE_NAME}`}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <script type="application/ld+json">{JSON.stringify(schemas)}</script>
      </Helmet>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <article className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> All posts
          </Link>
          <header className="mt-6 border-b border-border pb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              {post.category.replace(/_/g, ' ')}
            </p>
            <h1 className="mt-2 font-serif text-3xl font-bold leading-tight text-foreground md:text-4xl">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-4 text-base text-muted-foreground">{post.excerpt}</p>
            )}
            {post.published_at && (
              <p className="mt-4 text-xs text-muted-foreground">
                Published {format(new Date(post.published_at), 'MMMM d, yyyy')} · {SITE_NAME}
              </p>
            )}
          </header>
          <div className="py-8">
            <BlogContent html={post.content} />
          </div>
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <p className="font-semibold text-foreground">Need personal guidance?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Book a free consultation with Siddhivinayak Overseas in Surat for study or work visa
              pathways.
            </p>
            <Link
              to="/contact"
              className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline"
            >
              Contact our Surat office →
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  )
}
