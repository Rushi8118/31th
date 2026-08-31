import { countryNameToCode } from "@/lib/flags"

interface FlagIconProps {
  country?: string
  code?: string
  className?: string
}

export function FlagIcon({ country, code, className }: FlagIconProps) {
  const resolvedCode = (country ? countryNameToCode(country) : undefined) ||
                       (code ? countryNameToCode(code) : undefined)

  if (!resolvedCode) {
    return (
      <span className={className} aria-hidden="true" title={country || code || 'Country'}>
        🌐
      </span>
    )
  }

  return (
    <span
      className={["fi", `fi-${resolvedCode}`, className].filter(Boolean).join(" ")}
      aria-hidden="true"
      title={country || code?.toUpperCase()}
    />
  )
}
