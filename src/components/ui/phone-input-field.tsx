import React, { useState, useEffect, useRef, useMemo } from "react"
import { ChevronDown, Search, Check } from "lucide-react"
import { getCountries, getCountryCallingCode } from "react-phone-number-input/input"
import type { Country } from "react-phone-number-input"
import en from "react-phone-number-input/locale/en"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

export interface PhoneInputFieldProps {
  id?: string
  name?: string
  value?: string
  onChange?: (value: string | undefined) => void
  defaultCountry?: Country
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
  icon?: React.ReactNode
  autoFocus?: boolean
}

function getFlagEmoji(countryCode: string): string {
  try {
    return countryCode
      .toUpperCase()
      .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
  } catch {
    return "🌐"
  }
}

// Popular visa destination countries displayed at the top of the list
const PRIORITY_COUNTRIES: Country[] = [
  "IN", // India
  "GB", // United Kingdom
  "CA", // Canada
  "AU", // Australia
  "JP", // Japan
  "DE", // Germany
  "US", // United States
  "AE", // UAE / Dubai
  "SG", // Singapore
  "NZ", // New Zealand
  "FR", // France
  "IE", // Ireland
]

export function PhoneInputField({
  id,
  name,
  value = "",
  onChange,
  defaultCountry = "IN",
  placeholder,
  disabled = false,
  required = false,
  className = "",
  icon,
  autoFocus,
}: PhoneInputFieldProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(defaultCountry)
  const [localNumber, setLocalNumber] = useState("")
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Build full country list with localized names and dial codes
  const countryList = useMemo(() => {
    const all = getCountries()
    return all
      .map((code) => {
        let callingCode = ""
        try {
          callingCode = getCountryCallingCode(code)
        } catch {
          callingCode = ""
        }
        const countryName = en[code] || code
        return {
          code,
          name: countryName,
          callingCode,
          flag: getFlagEmoji(code),
          isPriority: PRIORITY_COUNTRIES.includes(code),
        }
      })
      .filter((c) => c.callingCode)
      .sort((a, b) => {
        const aPri = PRIORITY_COUNTRIES.indexOf(a.code)
        const bPri = PRIORITY_COUNTRIES.indexOf(b.code)
        if (aPri !== -1 && bPri !== -1) return aPri - bPri
        if (aPri !== -1) return -1
        if (bPri !== -1) return 1
        return a.name.localeCompare(b.name)
      })
  }, [])

  // Filtered countries for search
  const filteredCountries = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return countryList
    return countryList.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.callingCode.includes(q.replace("+", "")) ||
        c.code.toLowerCase().includes(q)
    )
  }, [countryList, searchQuery])

  // Get calling code for currently selected country
  const currentCallingCode = useMemo(() => {
    try {
      return getCountryCallingCode(selectedCountry)
    } catch {
      return "91"
    }
  }, [selectedCountry])

  // Parse initial or external `value` prop
  useEffect(() => {
    if (!value) {
      setLocalNumber("")
      return
    }

    // If external value starts with '+', check if it matches a known calling code
    if (value.startsWith("+")) {
      const cleanVal = value.replace(/\s+/g, "")
      // Find matching country with longest calling code prefix
      let bestMatch: { code: Country; callingCode: string } | null = null

      for (const c of countryList) {
        const prefix = `+${c.callingCode}`
        if (cleanVal.startsWith(prefix)) {
          if (!bestMatch || c.callingCode.length > bestMatch.callingCode.length) {
            bestMatch = { code: c.code, callingCode: c.callingCode }
          }
        }
      }

      if (bestMatch) {
        setSelectedCountry(bestMatch.code)
        const remaining = cleanVal.slice(bestMatch.callingCode.length + 1)
        setLocalNumber(remaining)
      } else {
        setLocalNumber(value.replace("+", ""))
      }
    } else {
      // Just local number
      setLocalNumber(value)
    }
  }, [value, countryList])

  // Handle local number input changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value

    // If user pasted a full international number with '+' (e.g. +91 98765 43210)
    if (raw.trim().startsWith("+")) {
      const clean = raw.replace(/\s+/g, "")
      let matched = false
      for (const c of countryList) {
        const prefix = `+${c.callingCode}`
        if (clean.startsWith(prefix)) {
          setSelectedCountry(c.code)
          const localPart = clean.slice(prefix.length)
          setLocalNumber(localPart)
          const full = `+${c.callingCode}${localPart}`
          onChange?.(localPart ? full : undefined)
          matched = true
          break
        }
      }
      if (matched) return
    }

    // Keep only numbers, spaces, and dashes
    const cleaned = raw.replace(/[^\d\s-]/g, "")
    setLocalNumber(cleaned)

    const digitsOnly = cleaned.replace(/\D/g, "")
    if (!digitsOnly) {
      onChange?.(undefined)
    } else {
      const full = `+${currentCallingCode}${digitsOnly}`
      onChange?.(full)
    }
  }

  // Handle country selection
  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country)
    setOpen(false)
    setSearchQuery("")

    let newCallingCode = "91"
    try {
      newCallingCode = getCountryCallingCode(country)
    } catch {}

    const digitsOnly = localNumber.replace(/\D/g, "")
    if (digitsOnly) {
      onChange?.(`+${newCallingCode}${digitsOnly}`)
    }
  }

  // Auto-focus search input when popover opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 50)
    } else {
      setSearchQuery("")
    }
  }, [open])

  // Formatted combined value for hidden form submission
  const digits = localNumber.replace(/\D/g, "")
  const combinedValue = digits ? `+${currentCallingCode}${digits}` : ""

  const defaultPlaceholder =
    selectedCountry === "IN"
      ? "e.g. 98765 43210"
      : selectedCountry === "GB"
      ? "e.g. 7911 123456"
      : selectedCountry === "US" || selectedCountry === "CA"
      ? "e.g. 416 555 0199"
      : "Enter phone number"

  return (
    <div className={`relative flex items-center w-full rounded-md border border-border/70 bg-background/50 transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/40 ${className}`}>
      {/* Hidden input for standard native form submits */}
      {name && <input type="hidden" name={name} value={combinedValue} />}

      {/* Optional Leading Icon (e.g. Phone or WhatsApp) */}
      {icon && (
        <div className="pointer-events-none pl-3 text-muted-foreground shrink-0">
          {icon}
        </div>
      )}

      {/* Dedicated Country Selector Trigger */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <button
            type="button"
            className="flex items-center gap-1.5 h-10 px-3 border-r border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors text-sm font-medium shrink-0 rounded-l-md focus:outline-none select-none"
            title={`Select Country Code (Current: +${currentCallingCode})`}
            aria-label="Select Country Calling Code"
          >
            <span className="text-base leading-none" aria-hidden="true">
              {getFlagEmoji(selectedCountry)}
            </span>
            <span className="font-mono text-xs font-semibold text-foreground">
              +{currentCallingCode}
            </span>
            <ChevronDown className="h-3 w-3 text-muted-foreground opacity-70" />
          </button>
        </PopoverTrigger>

        {/* Searchable Country Code Dropdown */}
        <PopoverContent
          align="start"
          sideOffset={6}
          className="w-72 p-0 rounded-xl border border-border/70 bg-card shadow-2xl backdrop-blur-xl z-[9999]"
        >
          {/* Search Box */}
          <div className="flex items-center gap-2 p-2.5 border-b border-border/50 bg-muted/20">
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search country or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          {/* Country List */}
          <div className="max-h-60 overflow-y-auto p-1.5 scrollbar-thin">
            {filteredCountries.length === 0 ? (
              <div className="py-4 text-center text-xs text-muted-foreground">
                No countries found
              </div>
            ) : (
              filteredCountries.map((c) => {
                const isSelected = c.code === selectedCountry
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleSelectCountry(c.code)}
                    className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                      isSelected
                        ? "bg-primary/15 text-primary font-semibold"
                        : "hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-sm shrink-0">{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 pl-2">
                      <span className="font-mono text-[11px] text-muted-foreground">
                        +{c.callingCode}
                      </span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Pure Local Phone Number Input (NO country code prefix typed inside) */}
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder={placeholder || defaultPlaceholder}
        value={localNumber}
        onChange={handleNumberChange}
        disabled={disabled}
        required={required}
        autoFocus={autoFocus}
        className="h-10 w-full bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  )
}

export default PhoneInputField
