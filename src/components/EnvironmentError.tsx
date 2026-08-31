import { AlertTriangle, Terminal } from "lucide-react"

interface EnvironmentErrorProps {
  message?: string
}

export function EnvironmentError({ message }: EnvironmentErrorProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 ring-1 ring-red-500/30">
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Configuration Error</h1>
            <p className="text-sm text-gray-400">The application cannot start</p>
          </div>
        </div>

        {message && (
          <div className="rounded-xl border border-red-500/20 bg-red-950/30 p-4">
            <p className="text-sm leading-relaxed text-red-300">{message}</p>
          </div>
        )}

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <Terminal className="h-4 w-4 text-amber-400" />
            Quick fix — create a .env.local file at the project root:
          </div>
          <pre className="rounded-lg bg-gray-950 p-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
{`# .env.local
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here`}
          </pre>
          <p className="text-xs text-gray-500">
            Find these values in your Supabase project → Settings → API.
            Then restart the development server.
          </p>
        </div>

        <p className="text-xs text-gray-600 text-center">
          See <code className="text-gray-400">.env.example</code> for a complete template.
        </p>
      </div>
    </div>
  )
}

export default EnvironmentError
