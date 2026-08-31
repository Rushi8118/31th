# Cloudflare Free Tier Setup for Siddhivinayak Overseas

## 1. DNS — Point Hostinger domain to Cloudflare

1. Log into Cloudflare → Add site → enter your domain
2. Choose Free plan → Cloudflare gives you nameservers (e.g. ns1.cloudflare.com)
3. In Hostinger control panel → Domains → Nameservers → paste Cloudflare's nameservers
4. Wait 1–24 hours for propagation

### DNS Records (create in Cloudflare)
| Type  | Name | Value                        | Proxy  |
|-------|------|------------------------------|--------|
| A     | @    | (your Hostinger server IP)   | ✅ On  |
| CNAME | www  | yourdomain.com               | ✅ On  |
| A     | mail | (your Hostinger server IP)   | ❌ Off |

---

## 2. SSL/TLS Settings
- SSL/TLS → Overview → **Full (Strict)**
- SSL/TLS → Edge Certificates → **Always Use HTTPS: ON**
- SSL/TLS → Edge Certificates → **HSTS: ON** (max-age=31536000, includeSubDomains, preload)
- SSL/TLS → Edge Certificates → **Minimum TLS Version: TLS 1.2**

---

## 3. Speed → Optimization
- Speed → Optimization → **Auto Minify: JS ✅, CSS ✅, HTML ✅**
- Speed → Optimization → **Brotli: ON**
- Speed → Optimization → **Rocket Loader: OFF** (breaks React bundle)
- Speed → Optimization → **Early Hints: ON**
- Caching → Configuration → **Browser Cache TTL: 1 year**
- Caching → Configuration → **Cache Level: Standard**

---

## 4. WAF Rules (Security → WAF → Custom Rules)

### Rule 1: Block bad bots
- Name: Block Bad Bots
- Expression: `(cf.client.bot) and not (cf.verified_bot_category in {"Search Engine Crawlers"})`
- Action: **Block**

### Rule 2: Rate-limit login endpoint
- Name: Login Rate Limit
- Expression: `(http.request.uri.path contains "/login" or http.request.uri.path contains "/register") and http.request.method eq "POST"`
- Action: **Rate Limit** → 10 requests per 60 seconds per IP
- Mitigation: **Block** for 600 seconds

### Rule 3: Protect admin panel
- Name: Admin Panel Protection
- Expression: `(http.request.uri.path contains "/#/admin" or http.request.uri.path contains "/admin")`
- Action: **Rate Limit** → 100 requests per 60 seconds per IP

### Rule 4: Block SQL injection & XSS attempts
- Name: OWASP Core Rules
- Security → WAF → Managed Rules → Enable **Cloudflare Managed Ruleset**
- Enable **Cloudflare OWASP Core Ruleset** (set sensitivity to Medium)

### Rule 5: Country blocking (optional — block high-risk countries)
- Expression: `ip.geoip.country in {"KP" "IR" "CU" "SY"}`
- Action: **Block**

---

## 5. DDoS Protection
- Security → DDoS → **HTTP DDoS attack protection: High**
- Security → Bots → **Bot Fight Mode: ON** (free)
- Security → Settings → **Security Level: Medium**
- Security → Settings → **Challenge Passage: 30 minutes**

---

## 6. Page Rules (3 free)

### Rule 1: Bypass cache for Supabase API calls (not needed — different domain)

### Rule 2: Always HTTPS
- URL: `http://yourdomain.com/*`
- Setting: **Always Use HTTPS**

### Rule 3: Cache everything for static assets
- URL: `yourdomain.com/assets/*`
- Settings: Cache Level = Cache Everything, Edge Cache TTL = 1 month

---

## 7. Hostinger Premium DNS Integration
If using Hostinger DNS (not Cloudflare nameservers), use **Cloudflare for SaaS** or add 
Cloudflare as an intermediate proxy by setting Hostinger's DNS A record to point to 
Cloudflare's Anycast IP. Ask Hostinger support to enable "External Nameservers" mode.

---

## Expected PageSpeed Impact
- TTFB: -40–70ms (Cloudflare edge cache)
- LCP: -200–500ms (Brotli + CDN)
- Total score improvement: +8–15 points on top of .htaccess optimizations
