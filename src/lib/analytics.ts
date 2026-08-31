export const GA_EVENTS = {
  PHONE_CLICK: "phone_click",
  WHATSAPP_CLICK: "whatsapp_click",
  FORM_SUBMIT: "form_submit",
} as const

export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number,
) {
  if (typeof window === "undefined") return

  const payload: Record<string, unknown> = {
    event_category: category,
    event_label: label,
  }

  if (typeof value === "number") {
    payload.value = value
  }

  if (typeof (window as any).gtag === "function") {
    ;(window as any).gtag("event", action, payload)
  } else if (typeof (window as any).dataLayer !== "undefined") {
    ;(window as any).dataLayer.push({
      event: action,
      ...payload,
    })
  }
}
