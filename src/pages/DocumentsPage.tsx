import React, { useState } from 'react'
import { useDocuments, DocumentRow } from '@/hooks/useDocuments'
import { useApplications } from '@/hooks/useApplications'
import {
  FileText,
  Upload,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trash2,
  Paperclip,
  CloudUpload,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

export default function DocumentsPage() {
  const { applications } = useApplications()
  const { documents, uploadDocument, uploadProgress, uploadLoading, deleteDocument } = useDocuments()
  
  const [dragActive, setDragActive] = useState(false)
  const [selectedAppId, setSelectedAppId] = useState('')
  const [customDocName, setCustomDocName] = useState('Passport Copy')

  // Handle Drag Over
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  // Handle Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0])
    }
  }

  // Handle File Input Selection
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0])
    }
  }

  const handleFileSelected = (file: File) => {
    uploadDocument({
      file,
      documentName: customDocName,
      appId: selectedAppId || undefined,
    })
  }

  // Get status items mapping
  const getStatusBadge = (status: DocumentRow['status']) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
            <CheckCircle className="h-3 w-3" /> Verified
          </span>
        )
      case 'Rejected':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20 shrink-0">
            <AlertTriangle className="h-3 w-3" /> Rejected
          </span>
        )
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 shrink-0">
            <CheckCircle className="h-3 w-3" /> Uploaded
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload files zone container */}
      <div className="bg-card border border-border/50 rounded-2xl p-5 md:p-6 shadow-sm space-y-4">
        <h3 className="font-serif text-base font-bold text-[#1a1a2e]">Upload Secure Files</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Select Application Folder */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase">Target Application</label>
            <select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="w-full h-10 px-3.5 text-xs font-semibold rounded-xl border border-border/60 bg-[#F5F0E8]/20 focus:border-[#C49A2B]/40 focus:outline-none"
            >
              <option value="">General Documents folder</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  ✈️ {app.countries?.name} - {app.visa_programs?.name}
                </option>
              ))}
            </select>
          </div>

          {/* Document label choice */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase">Document Type Name</label>
            <select
              value={customDocName}
              onChange={(e) => setCustomDocName(e.target.value)}
              className="w-full h-10 px-3.5 text-xs font-semibold rounded-xl border border-border/60 bg-[#F5F0E8]/20 focus:border-[#C49A2B]/40 focus:outline-none"
            >
              <option value="Passport Copy">Passport Copy</option>
              <option value="Academic Transcripts">Academic Transcripts</option>
              <option value="IELTS / English Scorecard">IELTS / English Scorecard</option>
              <option value="Work Experience Letters">Work Experience Letters</option>
              <option value="Financial Statements">Financial Proof / Statements</option>
              <option value="Resume / CV">Resume / CV</option>
              <option value="ID Card / Aadhar">National ID Card</option>
            </select>
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3 transition relative overflow-hidden min-h-[160px] ${
            dragActive
              ? 'border-[#C49A2B] bg-[#C49A2B]/5'
              : 'border-border/70 bg-[#F5F0E8]/10 hover:border-[#C49A2B]/45'
          }`}
        >
          <input
            type="file"
            id="file-upload-input"
            className="hidden"
            accept=".pdf, .jpeg, .jpg, .png"
            onChange={handleFileInput}
            disabled={uploadLoading}
          />
          <label htmlFor="file-upload-input" className="cursor-pointer flex flex-col items-center gap-2.5">
            <span className="p-3 bg-[#1a1a2e]/5 text-[#C49A2B] rounded-full">
              <CloudUpload className="h-6 w-6" />
            </span>
            <div className="leading-tight">
              <p className="text-xs font-bold text-[#1a1a2e]">
                Drag and drop your file here, or <span className="text-[#C49A2B] hover:underline">browse</span>
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Supports: PDF, JPG, PNG | Max size: 5MB
              </p>
            </div>
          </label>

          {/* Progress bar container */}
          {uploadLoading && (
            <div className="absolute inset-0 bg-card/90 flex flex-col items-center justify-center p-6 gap-3 z-10">
              <p className="text-xs font-bold text-[#1a1a2e] animate-pulse">
                Uploading securely... {uploadProgress}%
              </p>
              <Progress value={uploadProgress} className="w-full max-w-xs h-2 bg-[#F5F0E8]" />
            </div>
          )}
        </div>
      </div>

      {/* Grouped Folder grids */}
      <div className="space-y-6">
        <h3 className="font-serif text-base font-bold text-[#1a1a2e] border-b border-border/30 pb-2">
          Your Document Repository
        </h3>

        {documents.length === 0 ? (
          <div className="py-16 text-center bg-card border border-border/50 rounded-2xl shadow-sm">
            <FileText className="h-14 w-14 text-muted-foreground/35 mx-auto mb-3" />
            <p className="text-xs text-muted-foreground font-semibold">No uploaded files found.</p>
            <p className="text-[10px] text-muted-foreground mt-1">Your uploaded visa credentials will be listed here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-card border border-border/50 rounded-2xl p-4.5 flex items-start gap-3.5 justify-between shadow-sm hover:border-[#C49A2B]/35 hover:shadow transition"
              >
                <div className="flex items-start gap-3 overflow-hidden">
                  <span className="p-2.5 bg-[#F5F0E8]/50 text-[#C49A2B] rounded-xl shrink-0">
                    <FileText className="h-5 w-5" />
                  </span>
                  <div className="leading-tight space-y-1 overflow-hidden">
                    <h4 className="text-xs font-bold text-[#1a1a2e] truncate" title={doc.name}>
                      {doc.name}
                    </h4>
                    {doc.file_size && (
                      <p className="text-[10px] text-muted-foreground">
                        Size: {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                    <span className="text-[9px] text-muted-foreground/80 block">
                      Uploaded: {new Date(doc.created_at).toLocaleDateString()}
                    </span>
                    
                    {/* Status item badge */}
                    <div className="pt-1.5">{getStatusBadge(doc.status)}</div>
                  </div>
                </div>

                {/* Trash delete file */}
                <button
                  onClick={() => deleteDocument({ id: doc.id, filePath: doc.file_path })}
                  className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-full transition shrink-0"
                  aria-label="Delete File"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
