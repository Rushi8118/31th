import { useState, useRef, useCallback } from 'react'
import {
  Upload, Trash2, Copy, RefreshCw, FolderOpen, FileImage,
  FileText, Video, File, Grid3X3, List, Search, AlertTriangle,
  ImageIcon, X, ExternalLink, ChevronRight, Home, Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { useFileManager, ALLOWED_TYPES, MAX_FILE_SIZE, type FileItem } from '@/hooks/useFileManager'

const FOLDERS = [
  { label: 'All Files',  value: '',          icon: FolderOpen  },
  { label: 'Images',     value: 'images',    icon: ImageIcon   },
  { label: 'Documents',  value: 'documents', icon: FileText    },
  { label: 'Videos',     value: 'videos',    icon: Video       },
  { label: 'Blog Media', value: 'blog',      icon: FileImage   },
  { label: 'Other',      value: 'other',     icon: File        },
]

function FileIcon({ mimeType, className }: { mimeType: string; className?: string }) {
  if (mimeType.startsWith('image/'))  return <ImageIcon className={className} />
  if (mimeType.startsWith('video/'))  return <Video      className={className} />
  if (mimeType === 'application/pdf' || mimeType.includes('word') || mimeType === 'text/plain')
                                      return <FileText   className={className} />
  return <File className={className} />
}

function isImage(mimeType: string) {
  return mimeType.startsWith('image/') && mimeType !== 'image/svg+xml'
}

type ViewMode = 'grid' | 'list'
type SortBy  = 'date' | 'name' | 'size'

export default function FileManagerPage() {
  const [activeFolder, setActiveFolder]   = useState('')
  const [viewMode, setViewMode]           = useState<ViewMode>('grid')
  const [search, setSearch]               = useState('')
  const [sortBy, setSortBy]               = useState<SortBy>('date')
  const [filterType, setFilterType]       = useState('all')
  const [deleteTarget, setDeleteTarget]   = useState<FileItem | null>(null)
  const [isDragging, setIsDragging]       = useState(false)
  const [previewFile, setPreviewFile]     = useState<FileItem | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    files, isLoading, isError, refetch,
    uploadProgress, uploadFile, uploadLoading,
    deleteFile, deleteLoading,
    copyUrl, formatSize, getCategory,
  } = useFileManager(activeFolder)

  const folderInfo = FOLDERS.find(f => f.value === activeFolder) ?? FOLDERS[0]

  const filtered = (files || [])
    .filter((f: any) => !f.isFolder)
    .filter((f: any) => filterType === 'all' || getCategory(f.mimeType) === filterType)
    .filter((f: any) => !search || f.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a: any, b: any) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'size') return b.size - a.size
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return
    Array.from(fileList).forEach(file => {
      uploadFile({ file, targetFolder: activeFolder || undefined })
    })
  }, [uploadFile, activeFolder])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const confirmDelete = () => {
    if (!deleteTarget) return
    deleteFile(deleteTarget.fullPath, {
      onSettled: () => setDeleteTarget(null),
    })
  }

  const totalSize = (files || []).filter((a: any) => !a.isFolder).reduce((a: any, f: any) => a + f.size, 0)
  const pendingUploads = Object.entries(uploadProgress)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">File Manager</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {(files || []).filter((f: any) => !f.isFolder).length} files · {formatSize(totalSize)} used · Supabase Storage
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploadLoading}>
            <Upload className="w-4 h-4 mr-1.5" />
            Upload Files
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar — folder list */}
        <aside className="w-48 shrink-0 space-y-1">
          <p className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Folders</p>
          {FOLDERS.map(folder => {
            const Icon = folder.icon
            const active = activeFolder === folder.value
            return (
              <button
                key={folder.value}
                onClick={() => setActiveFolder(folder.value)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {folder.label}
              </button>
            )
          })}

          <div className="pt-4 border-t border-border/40 mt-4 px-2 space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Allowed types</p>
            <p className="text-xs text-muted-foreground">Images: JPG, PNG, WebP, GIF, SVG, AVIF</p>
            <p className="text-xs text-muted-foreground">Docs: PDF, DOC, DOCX, TXT</p>
            <p className="text-xs text-muted-foreground">Video: MP4, WebM, OGG</p>
            <p className="text-xs text-muted-foreground font-medium mt-2">Max size: 20 MB</p>
          </div>
        </aside>

        {/* Main area */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Home className="w-3.5 h-3.5" />
            <span>/</span>
            <span className="font-medium text-foreground">{folderInfo.label}</span>
            {activeFolder && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-muted-foreground">{activeFolder}</span>
              </>
            )}
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search files…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 h-8 text-sm"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32 h-8 text-sm">
                <Filter className="w-3.5 h-3.5 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="images">Images</SelectItem>
                <SelectItem value="documents">Documents</SelectItem>
                <SelectItem value="videos">Videos</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={v => setSortBy(v as SortBy)}>
              <SelectTrigger className="w-28 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Newest</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="size">Size</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex border border-border rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Upload in progress */}
          {pendingUploads.length > 0 && (
            <div className="space-y-2">
              {pendingUploads.map(([name, pct]) => (
                <div key={name} className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2">
                  <Upload className="w-4 h-4 text-primary shrink-0 animate-bounce" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{name}</p>
                    <div className="mt-1 h-1 rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{pct}%</span>
                </div>
              ))}
            </div>
          )}

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5 scale-[1.01]'
                : 'border-border/60 hover:border-primary/50 hover:bg-accent/30'
            }`}
          >
            <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">Drop files here or click to browse</p>
            <p className="text-xs text-muted-foreground mt-1">Images, PDFs, Word docs, Videos · Max 20 MB each</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={[
              ...ALLOWED_TYPES.images,
              ...ALLOWED_TYPES.documents,
              ...ALLOWED_TYPES.videos,
            ].join(',')}
            className="hidden"
            onChange={e => handleFiles(e.target.files)}
          />

          {/* Error */}
          {isError && (
            <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-medium">Could not load files</p>
                <p className="text-xs mt-0.5">
                  The "media" storage bucket may not exist yet. Create it in your Supabase dashboard → Storage → New bucket → name it <code className="font-mono">media</code>, set to Public.
                </p>
              </div>
            </div>
          )}

          {/* File grid / list */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 && !isError ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FolderOpen className="w-10 h-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-foreground">No files yet</p>
              <p className="text-xs text-muted-foreground mt-1">Upload your first file using the drop zone above.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filtered.map((file: any) => (
                <div
                  key={file.fullPath}
                  className="group relative rounded-xl border border-border/60 bg-card overflow-hidden hover:border-primary/40 hover:shadow-md transition-all"
                >
                  {/* Preview */}
                  <div
                    className="aspect-square bg-muted/30 flex items-center justify-center cursor-pointer"
                    onClick={() => isImage(file.mimeType) && setPreviewFile(file)}
                  >
                    {isImage(file.mimeType) ? (
                      <img
                        src={file.publicUrl}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    ) : (
                      <FileIcon mimeType={file.mimeType} className="w-10 h-10 text-muted-foreground/50" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-2">
                    <p className="text-xs font-medium truncate" title={file.name}>{file.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{formatSize(file.size)}</p>
                  </div>

                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => copyUrl(file.publicUrl, file.name)}
                      className="rounded-lg bg-white/90 p-2 hover:bg-white transition-colors"
                      title="Copy URL"
                    >
                      <Copy className="w-4 h-4 text-gray-800" />
                    </button>
                    <a
                      href={file.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-white/90 p-2 hover:bg-white transition-colors"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-800" />
                    </a>
                    <button
                      onClick={() => setDeleteTarget(file)}
                      className="rounded-lg bg-red-500/90 p-2 hover:bg-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List view */
            <div className="rounded-xl border border-border/60 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/30">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Name</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Type</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground hidden md:table-cell">Size</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Uploaded</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((file: any, i: any) => (
                    <tr
                      key={file.fullPath}
                      className={`border-b border-border/20 hover:bg-muted/20 transition-colors ${i === filtered.length - 1 ? 'border-b-0' : ''}`}
                    >
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          {isImage(file.mimeType) ? (
                            <img
                              src={file.publicUrl}
                              alt=""
                              className="w-7 h-7 rounded object-cover shrink-0"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded bg-muted flex items-center justify-center shrink-0">
                              <FileIcon mimeType={file.mimeType} className="w-4 h-4 text-muted-foreground" />
                            </div>
                          )}
                          <span className="font-medium truncate max-w-[160px]" title={file.name}>{file.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 hidden sm:table-cell">
                        <Badge variant="secondary" className="text-[10px]">
                          {getCategory(file.mimeType)}
                        </Badge>
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground text-xs hidden md:table-cell">
                        {formatSize(file.size)}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground text-xs hidden lg:table-cell">
                        {file.createdAt ? new Date(file.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => copyUrl(file.publicUrl, file.name)}
                            className="p-1.5 rounded hover:bg-accent transition-colors"
                            title="Copy URL"
                          >
                            <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                          <a
                            href={file.publicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded hover:bg-accent transition-colors"
                            title="Open"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                          </a>
                          <button
                            onClick={() => setDeleteTarget(file)}
                            className="p-1.5 rounded hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 shrink-0">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Delete file?</h3>
                <p className="text-sm text-muted-foreground mt-1 break-all">
                  "{deleteTarget.name}" will be permanently removed from storage.
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting…' : 'Delete permanently'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Image preview lightbox */}
      {previewFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setPreviewFile(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPreviewFile(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewFile.publicUrl}
              alt={previewFile.name}
              className="max-w-full max-h-[80vh] rounded-xl object-contain"
            />
            <div className="mt-3 flex items-center justify-between">
              <p className="text-white/70 text-sm">{previewFile.name} · {formatSize(previewFile.size)}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => copyUrl(previewFile.publicUrl, previewFile.name)}
                  className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy URL
                </button>
                <a
                  href={previewFile.publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open original
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
