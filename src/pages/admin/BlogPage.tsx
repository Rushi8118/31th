import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Eye,
  FileText,
  Globe2,
  Loader2,
  Lock,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
} from 'lucide-react'
import { PermissionGuard } from '@/components/auth/PermissionGuard'
import { AiBlogWriter } from '@/components/admin/blog/AiBlogWriter'
import { BlogContent } from '@/components/blog/BlogContent'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAdminBlogPosts } from '@/hooks/useAdminBlogPosts'
import type { GeneratedBlogPost } from '@/lib/ai/blog-generator'
import { formatDistanceToNow } from 'date-fns'

type EditorState = GeneratedBlogPost & { id?: string }

export default function AdminBlogPage() {
  const { posts, isLoading, saveGenerated, saving, setStatus, remove } = useAdminBlogPosts()
  const [search, setSearch] = useState('')
  const [showWriter, setShowWriter] = useState(false)
  const [editor, setEditor] = useState<EditorState | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return posts
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    )
  }, [posts, search])

  const openEditor = (draft: GeneratedBlogPost, id?: string) => {
    setEditor({ ...draft, id })
    setShowWriter(false)
  }

  const handleSave = async (status: 'draft' | 'review' | 'published') => {
    if (!editor) return
    const saved = await saveGenerated({
      draft: editor,
      status,
      id: editor.id,
    })
    setEditor({ ...editor, id: saved.id, slug: saved.slug })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <FileText className="h-6 w-6 text-primary" />
            Blog Posts
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            AI-written, SEO-optimized articles — private drafts or public publish.
          </p>
        </div>
        <PermissionGuard permission="blogs.create">
          <Button className="gap-1.5" onClick={() => setShowWriter((v) => !v)}>
            <Plus className="h-4 w-4" />
            {showWriter ? 'Hide AI writer' : 'Write with AI'}
          </Button>
        </PermissionGuard>
      </div>

      {showWriter && (
        <AiBlogWriter
          onGenerated={(draft) => openEditor(draft)}
        />
      )}

      {editor && (
        <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Pencil className="h-4 w-4" />
              Review & edit before publish
            </h2>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" disabled={saving} onClick={() => handleSave('draft')}>
                <Lock className="mr-1 h-4 w-4" />
                Save private draft
              </Button>
              <PermissionGuard permission="blogs.publish">
                <Button disabled={saving} onClick={() => handleSave('published')}>
                  {saving ? (
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-1 h-4 w-4" />
                  )}
                  Publish public
                </Button>
              </PermissionGuard>
              <Button variant="ghost" onClick={() => setEditor(null)}>
                Close
              </Button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              <Field label="Title">
                <Input
                  value={editor.title}
                  onChange={(e) => setEditor({ ...editor, title: e.target.value })}
                />
              </Field>
              <Field label="Slug">
                <Input
                  value={editor.slug}
                  onChange={(e) => setEditor({ ...editor, slug: e.target.value })}
                />
              </Field>
              <Field label="Excerpt">
                <textarea
                  value={editor.excerpt}
                  onChange={(e) => setEditor({ ...editor, excerpt: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                />
              </Field>
              <Field label="Meta title">
                <Input
                  value={editor.meta_title}
                  onChange={(e) => setEditor({ ...editor, meta_title: e.target.value })}
                />
              </Field>
              <Field label="Meta description">
                <textarea
                  value={editor.meta_desc}
                  onChange={(e) => setEditor({ ...editor, meta_desc: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                />
              </Field>
              <Field label="Keywords (comma separated)">
                <Input
                  value={editor.keywords.join(', ')}
                  onChange={(e) =>
                    setEditor({
                      ...editor,
                      keywords: e.target.value
                        .split(',')
                        .map((k) => k.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </Field>
            </div>
            <div className="space-y-3">
              <Field label="HTML content (editable)">
                <textarea
                  value={editor.content}
                  onChange={(e) => setEditor({ ...editor, content: e.target.value })}
                  rows={18}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 font-mono text-xs"
                />
              </Field>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Live preview
            </p>
            <h3 className="text-2xl font-bold text-foreground">{editor.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{editor.excerpt}</p>
            <div className="mt-6">
              <BlogContent html={editor.content} />
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts by title, slug, status…"
          className="pl-9"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading posts…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="font-medium text-foreground">No blog posts yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Use “Write with AI” to generate your first SEO article.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((post) => {
              const isPublic = post.status === 'published'
              return (
                <div
                  key={post.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-semibold text-foreground">{post.title}</h3>
                      <StatusPill status={post.status} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      /blog/{post.slug} · {post.category} · updated{' '}
                      {post.updated_at
                        ? formatDistanceToNow(new Date(post.updated_at), { addSuffix: true })
                        : '—'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {isPublic && (
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/blog/${post.slug}`} target="_blank">
                          <Eye className="mr-1 h-3.5 w-3.5" />
                          View
                        </Link>
                      </Button>
                    )}
                    <PermissionGuard permission="blogs.update">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          openEditor(
                            {
                              title: post.title,
                              slug: post.slug,
                              excerpt: post.excerpt || '',
                              content: post.content,
                              category: post.category as GeneratedBlogPost['category'],
                              tags: post.tags || [],
                              meta_title: post.meta_title || post.title,
                              meta_desc: post.meta_desc || '',
                              keywords: post.keywords || [],
                              canonical_path: `/blog/${post.slug}`,
                            },
                            post.id,
                          )
                        }
                      >
                        <Pencil className="mr-1 h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </PermissionGuard>
                    <PermissionGuard permission="blogs.publish">
                      {!isPublic ? (
                        <Button size="sm" onClick={() => setStatus({ id: post.id, status: 'published' })}>
                          <Globe2 className="mr-1 h-3.5 w-3.5" />
                          Publish
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setStatus({ id: post.id, status: 'draft' })}
                        >
                          <Lock className="mr-1 h-3.5 w-3.5" />
                          Unpublish
                        </Button>
                      )}
                    </PermissionGuard>
                    <PermissionGuard permission="blogs.delete">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600"
                        onClick={() => {
                          if (window.confirm('Delete this post permanently?')) remove(post.id)
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </PermissionGuard>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    draft: 'bg-slate-100 text-slate-700 border-slate-200',
    review: 'bg-amber-100 text-amber-800 border-amber-200',
    archived: 'bg-zinc-100 text-zinc-600 border-zinc-200',
  }
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
        styles[status] || styles.draft
      }`}
    >
      {status === 'published' ? 'public' : status === 'draft' ? 'private' : status}
    </span>
  )
}
