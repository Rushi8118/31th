import { z } from "zod"

// Shared password validation across auth flows.
// Keep messages user-facing and specific for better UX.
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .superRefine((val, ctx) => {
    const hasUpper = /[A-Z]/.test(val)
    const hasLower = /[a-z]/.test(val)
    const hasNumber = /[0-9]/.test(val)
    // Special character = anything that's not a letter, digit, or whitespace.
    const hasSpecial = /[^A-Za-z0-9\s]/.test(val)

    if (!hasUpper) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must contain at least one uppercase letter",
      })
    }
    if (!hasLower) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must contain at least one lowercase letter",
      })
    }
    if (!hasNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must contain at least one number",
      })
    }
    if (!hasSpecial) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must contain at least one special character",
      })
    }
  })

export const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: passwordSchema,
})

export type PasswordStrengthLevel = "Weak" | "Fair" | "Good" | "Strong"

export type PasswordStrength = {
  score: number
  maxScore: number
  level: PasswordStrengthLevel
  issues: string[]
  checks: {
    minLength: boolean
    hasUpper: boolean
    hasLower: boolean
    hasNumber: boolean
    hasSpecial: boolean
  }
}

export function getPasswordStrength(password: string): PasswordStrength {
  const minLength = password.length >= 8
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[^A-Za-z0-9\s]/.test(password)

  const maxScore = 5
  const score =
    (minLength ? 1 : 0) +
    (hasUpper ? 1 : 0) +
    (hasLower ? 1 : 0) +
    (hasNumber ? 1 : 0) +
    (hasSpecial ? 1 : 0)

  const level: PasswordStrengthLevel =
    score <= 1 ? "Weak" : score <= 3 ? "Fair" : score <= 4 ? "Good" : "Strong"

  const issues: string[] = []
  if (!minLength) issues.push("Password must be at least 8 characters long")
  if (!hasUpper)
    issues.push("Password must contain at least one uppercase letter")
  if (!hasLower)
    issues.push("Password must contain at least one lowercase letter")
  if (!hasNumber) issues.push("Password must contain at least one number")
  if (!hasSpecial)
    issues.push("Password must contain at least one special character")

  return {
    score,
    maxScore,
    level,
    issues,
    checks: { minLength, hasUpper, hasLower, hasNumber, hasSpecial },
  }
}

