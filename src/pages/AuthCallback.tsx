import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing")

  useEffect(() => {
    let mounted = true

    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search)
        const errorParam = params.get("error")
        const errorDescription = params.get("error_description")

        if (errorParam) {
          const message = errorDescription
            ? decodeURIComponent(errorDescription.replace(/\+/g, " "))
            : "Google authentication failed."
          if (mounted) {
            setError(message)
            setStatus("error")
            toast.error(message)
            setTimeout(() => navigate("/login"), 2500)
          }
          return
        }

        // PKCE flow code exchange
        const code = params.get("code")
        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) {
            console.error("Exchange code error:", exchangeError)
            if (mounted) {
              setError(exchangeError.message)
              setStatus("error")
              toast.error(exchangeError.message || "Failed to exchange auth token.")
              setTimeout(() => navigate("/login"), 2500)
            }
            return
          }

          if (data?.session && mounted) {
            setStatus("success")
            toast.success("Successfully signed in with Google!")
            setTimeout(() => navigate("/"), 500)
            return
          }
        }

        // Check if session already active or from hash fragment
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
          if (mounted) {
            setError(sessionError.message)
            setStatus("error")
            setTimeout(() => navigate("/login"), 2500)
          }
          return
        }

        if (sessionData?.session && mounted) {
          setStatus("success")
          toast.success("Successfully signed in with Google!")
          setTimeout(() => navigate("/"), 500)
          return
        }
      } catch (err: any) {
        console.error("Auth callback exception:", err)
        if (mounted) {
          setError(err?.message || "Unexpected authentication error")
          setStatus("error")
          setTimeout(() => navigate("/login"), 2500)
        }
      }
    }

    void handleCallback()

    // Listen to onAuthStateChange as a backup
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && mounted) {
        setStatus("success")
        setTimeout(() => navigate("/"), 500)
      }
    })

    const timeout = setTimeout(() => {
      if (mounted && status === "processing") {
        setError("Authentication took too long. Redirecting to login...")
        setStatus("error")
        setTimeout(() => navigate("/login"), 2000)
      }
    }, 10000)

    return () => {
      mounted = false
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [navigate])

  return (
    <>
      <Helmet>
        <title>Authenticating | Siddhivinayak Overseas</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        {status === "processing" && (
          <div className="flex flex-col items-center gap-4 text-center max-w-sm">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <h2 className="text-lg font-semibold text-foreground">Completing Sign-In</h2>
            <p className="text-sm text-muted-foreground">Authenticating your Google account, please wait a moment...</p>
          </div>
        )}
        {status === "success" && (
          <div className="flex flex-col items-center gap-4 text-center max-w-sm">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            <h2 className="text-lg font-semibold text-foreground">Signed In Successfully!</h2>
            <p className="text-sm text-emerald-600 font-medium">Redirecting to your dashboard...</p>
          </div>
        )}
        {status === "error" && (
          <div className="flex flex-col items-center gap-4 text-center max-w-sm">
            <XCircle className="h-10 w-10 text-destructive" />
            <h2 className="text-lg font-semibold text-foreground">Authentication Failed</h2>
            <p className="text-sm text-destructive">{error}</p>
            <p className="text-xs text-muted-foreground">Redirecting to login page...</p>
          </div>
        )}
      </div>
    </>
  )
}
