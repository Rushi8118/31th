// Ambient declarations for Next.js modules (not installed as dependency)
// These allow legacy Next.js pages in app/ and auth/ to type-check without errors.

declare module "next" {
  import type { Metadata, ResolvingMetadata, Viewport, ResolvingViewport } from "next/types"

  export type { Metadata, ResolvingMetadata, Viewport, ResolvingViewport }
}

declare module "next/link" {
  import type { ComponentProps, ReactNode } from "react"

  interface LinkProps extends ComponentProps<"a"> {
    href: string
    children?: ReactNode
    prefetch?: boolean
    replace?: boolean
    scroll?: boolean
    shallow?: boolean
    passHref?: boolean
  }

  const Link: React.ForwardRefExoticComponent<
    LinkProps & React.RefAttributes<HTMLAnchorElement>
  >
  export default Link
}

declare module "next/headers" {
  export function cookies(): {
    get: (name: string) => { name: string; value: string } | undefined
    getAll: (name?: string) => { name: string; value: string }[]
    has: (name: string) => boolean
    set: (name: string, value: string, options?: Record<string, unknown>) => void
    delete: (name: string) => void
  }
  export function headers(): Headers
}

declare module "next/image" {
  import type { ComponentProps, ReactElement } from "react"

  interface ImageProps extends Omit<ComponentProps<"img">, "src" | "alt" | "width" | "height"> {
    src: string
    alt: string
    width?: number
    height?: number
    fill?: boolean
    priority?: boolean
    quality?: number
    placeholder?: "blur" | "empty"
    blurDataURL?: string
    unoptimized?: boolean
    onLoadingComplete?: (img: HTMLImageElement) => void
  }

  const Image: React.ForwardRefExoticComponent<ImageProps & React.RefAttributes<HTMLImageElement>>
  export default Image
}

declare module "next/font/google" {
  interface FontOptions {
    subsets?: string[]
    weight?: string | string[]
    display?: "auto" | "block" | "swap" | "fallback" | "optional"
    variable?: string
    [key: string]: unknown
  }

  interface FontResult {
    className: string
    style: { fontFamily: string }
    variable?: string
  }

  export function Inter(options?: FontOptions): FontResult
  export function Roboto(options?: FontOptions): FontResult
  export function Poppins(options?: FontOptions): FontResult
  export function Open_Sans(options?: FontOptions): FontResult
  export function Lato(options?: FontOptions): FontResult
  export function Montserrat(options?: FontOptions): FontResult
  export function Geist(options?: FontOptions): FontResult
  export function Geist_Mono(options?: FontOptions): FontResult
  export function Playfair_Display(options?: FontOptions): FontResult
}

declare module "next/script" {
  import type { ScriptHTMLAttributes } from "react"

  interface ScriptProps extends ScriptHTMLAttributes<HTMLScriptElement> {
    strategy?: "beforeInteractive" | "afterInteractive" | "lazyOnload" | "worker"
  }

  const Script: React.FC<ScriptProps>
  export default Script
}

declare module "next/server" {
  export class NextResponse extends Response {
    cookies: {
      set: (
        name: string,
        value: string,
        options?: {
          httpOnly?: boolean
          sameSite?: "strict" | "lax" | "none"
          secure?: boolean
          path?: string
          maxAge?: number
        }
      ) => void
      get: (name: string) => { name: string; value: string } | undefined
      delete: (name: string) => void
    }
    static json(
      body: unknown,
      init?: ResponseInit
    ): NextResponse
    static redirect(
      url: string | URL,
      status?: number
    ): NextResponse
    static next(): NextResponse
  }

  export interface NextRequest extends Request {
    cookies: {
      get: (name: string) => { name: string; value: string } | undefined
      getAll: (name?: string) => { name: string; value: string }[]
      has: (name: string) => boolean
      set: (
        name: string,
        value: string,
        options?: Record<string, unknown>
      ) => void
      delete: (name: string) => void
    }
    nextUrl: URL
    geo?: {
      city?: string
      country?: string
      region?: string
      latitude?: string
      longitude?: string
    }
    ip?: string
  }
}

declare module "next/navigation" {
  export function useRouter(): {
    push: (url: string, options?: { scroll?: boolean }) => void
    replace: (url: string, options?: { scroll?: boolean }) => void
    refresh: () => void
    back: () => void
    forward: () => void
    prefetch: (url: string) => void
  }

  export function useSearchParams(): {
    get: (key: string) => string | null
    getAll: (key: string) => string[]
    has: (key: string) => boolean
    forEach: (callback: (value: string, key: string) => void) => void
    entries: () => IterableIterator<[string, string]>
    keys: () => IterableIterator<string>
    values: () => IterableIterator<string>
    toString: () => string
  }

  export function usePathname(): string
  export function useParams(): Record<string, string | string[]>
  export function redirect(url: string, type?: "replace" | "push"): never
  export function notFound(): never
}

declare module "@vercel/analytics/next" {
  export function Analytics(): JSX.Element
}

declare module "react-phone-number-input/style.css" {
  const content: string
  export default content
}

declare module "*.module.css" {
  const classes: Record<string, string>
  export default classes
}

declare module "*.css" {
  const content: string
  export default content
}
