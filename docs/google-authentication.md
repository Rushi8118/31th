# Google Authentication Implementation Guide

> **Project**: Siddhivinayak Overseas  
> **Stack**: React + TypeScript + Vite + Supabase + Tailwind CSS + shadcn/ui  
> **Author**: Senior Full Stack Engineer  
> **Status**: Production-Ready ✓

---

## Table of Contents

1. [Feature Overview](#1-feature-overview)
2. [Architecture](#2-architecture)
3. [Prerequisites](#3-prerequisites)
4. [Supabase Setup](#4-supabase-setup)
5. [Environment Variables](#5-environment-variables)
6. [Folder Structure](#6-folder-structure)
7. [Frontend Implementation](#7-frontend-implementation)
8. [Backend](#8-backend)
9. [Database](#9-database)
10. [Authentication Flow](#10-authentication-flow)
11. [Security](#11-security)
12. [Error Handling](#12-error-handling)
13. [UI Improvements](#13-ui-improvements)
14. [Testing](#14-testing)
15. [Deployment](#15-deployment)
16. [Troubleshooting](#16-troubleshooting)
17. [Final Deliverables](#17-final-deliverables)

---

## 1. Feature Overview

### What is Google Authentication?

Google Authentication (Google Sign-In / OAuth 2.0) allows users to sign in to your application using their existing Google account credentials. Instead of creating a new username and password, users click a "Sign in with Google" button and are redirected to Google's consent screen to authorize the application.

### Benefits

| Benefit | Description |
|---------|-------------|
| **Frictionless Onboarding** | Users sign up with one click — no forms to fill |
| **Higher Conversion** | OAuth sign-in increases registration rates by 30-50% |
| **Passwordless** | No password to remember, reset, or leak |
| **Trusted Identity** | Google verifies the user's identity and email |
| **Profile Data** | Access to verified name, email, and avatar URL |
| **Reduced Support** | Fewer "forgot password" and account recovery tickets |
| **Security** | Google handles MFA, suspicious login detection, and credential security |

### Why It Improves UX

- Users don't need to remember another password
- Instant sign-up with pre-filled profile information
- Seamless cross-device authentication
- Reduces form abandonment rates significantly
- Works well on mobile (redirect flow instead of typing)

---

## 2. Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Vite SPA)                    │
│  ┌─────────────┐  ┌──────────┐  ┌────────────────────┐  │
│  │  LoginPage   │  │ AuthPage  │  │  AuthCallback      │  │
│  │  RegisterPage│  │ Provider  │  │  (OAuth Redirect)  │  │
│  └──────┬──────┘  └────┬─────┘  └─────────┬──────────┘  │
│         │              │                   │             │
│  ┌──────┴──────────────┴───────────────────┴──────────┐  │
│  │              Supabase Client SDK                     │  │
│  │    (createClient — PKCE flow, localStorage)          │  │
│  └───────────────────────┬──────────────────────────────┘  │
└──────────────────────────┼───────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   SUPABASE AUTH                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Built-in OAuth Provider: Google                  │   │
│  │  • Manages OAuth handshake                        │   │
│  │  • Exchanges auth code for tokens                 │   │
│  │  • Returns JWT + Refresh Token                    │   │
│  │  • Handles PKCE flow                              │   │
│  └──────────────────────┬───────────────────────────┘   │
│                         │                                │
│                         ▼                                │
│  ┌──────────────────────────────────────────────────┐   │
│  │              auth.users table                      │   │
│  │  (JWT issued, session created)                    │   │
│  └──────────────────────┬───────────────────────────┘   │
│                         │                                │
│                         ▼                                │
│  ┌──────────────────────────────────────────────────┐   │
│  │  TRIGGER: on_auth_user_created                    │   │
│  │  → app_private.handle_new_user()                  │   │
│  │  → INSERT INTO user_profiles                      │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  user_profiles table (RLS-enabled)                │   │
│  │  SELECT/INSERT/UPDATE own row only                │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────┬────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              GOOGLE OAUTH 2.0 SERVERS                     │
│  • User authenticates with Google                        │
│  • Consent screen displayed                              │
│  • Auth code returned to Supabase                        │
│  • User's profile info (name, email, avatar) shared      │
└─────────────────────────────────────────────────────────┘
```

### Authentication Flow Diagram

```
USER                    BROWSER                  SUPABASE              GOOGLE
 │                        │                        │                     │
 │  Click "Sign in       │                        │                     │
 │  with Google"         │                        │                     │
 │───────────────────────▶│                        │                     │
 │                        │                        │                     │
 │                        │  signInWithOAuth()     │                     │
 │                        │───────────────────────▶│                     │
 │                        │                        │                     │
 │                        │  Redirect to Google    │                     │
 │                        │◀───────────────────────│                     │
 │                        │                        │                     │
 │  Google Login Page     │                        │                     │
 │◀───────────────────────│                        │                     │
 │                        │                        │                     │
 │  Enter credentials     │                        │                     │
 │───────────────────────▶│                        │                     │
 │                        │  Auth request          │                     │
 │                        │─────────────────────────────────────────────▶│
 │                        │                        │                     │
 │  Consent screen        │                        │                     │
 │◀───────────────────────│                        │                     │
 │                        │                        │                     │
 │  Grant permissions     │                        │                     │
 │───────────────────────▶│                        │                     │
 │                        │  Auth code             │                     │
 │                        │◀─────────────────────────────────────────────│
 │                        │                        │                     │
 │                        │  Redirect to           │                     │
 │                        │  /auth/callback        │                     │
 │                        │  (with auth code)      │                     │
 │                        │───────────────────────▶│                     │
 │                        │                        │                     │
 │                        │  Exchange code for     │                     │
 │                        │  session               │                     │
 │                        │  (detectSessionInUrl)  │                     │
 │                        │◀───────────────────────│                     │
 │                        │                        │                     │
 │                        │  onAuthStateChange     │                     │
 │                        │  fires: "SIGNED_IN"    │                     │
 │                        │───────────────────────▶│                     │
 │                        │                        │                     │
 │                        │                        │  INSERT profile     │
 │                        │                        │  (trigger)          │
 │                        │                        │◀────────────────────│
 │                        │                        │                     │
 │  Redirect to           │                        │                     │
 │  /dashboard            │                        │                     │
 │◀───────────────────────│                        │                     │
 │                        │                        │                     │
```

### Component Architecture

```
App (BrowserRouter)
├── AuthProvider (Context)
│   ├── ThemeProvider
│   ├── QueryClientProvider
│   └── Routes
│       ├── /login          → LoginPage
│       ├── /register       → RegisterPage
│       ├── /auth/callback  → AuthCallback
│       ├── ProtectedRoute
│       │   └── /dashboard  → DashboardLayout
│       └── /*              → Public pages
```

### Session Flow

```
Page Load
    │
    ▼
AuthProvider mounts
    │
    ├─▶ supabase.auth.getSession()
    │       │
    │       ├─▶ Session exists → setUser() → fetchProfile()
    │       └─▶ No session    → isLoading = false
    │
    └─▶ onAuthStateChange subscription
            │
            ├─▶ SIGNED_IN  → setUser() → fetchProfile()
            ├─▶ SIGNED_OUT → clear user, profile, permissions
            ├─▶ TOKEN_REFRESHED → ignore (handled by SDK)
            └─▶ INITIAL_SESSION → set initial state
```

### Redirect Flow

```
Not authenticated:
  /dashboard → ProtectedRoute → /login?redirect=%2Fdashboard

After login:
  LoginPage  → signIn()       → /dashboard
  LoginPage  → signInWithGoogle() → Google → /auth/callback → /dashboard
  RegisterPage → signUp()     → /dashboard
  RegisterPage → signInWithGoogle() → Google → /auth/callback → /dashboard

On auth error:
  AuthCallback → error state  → /login (after 3s)
```

---

## 3. Prerequisites

### Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top of the page
3. Click **New Project**
4. Enter a project name (e.g., "Siddhivinayak Overseas")
5. Select your organization (if applicable)
6. Click **Create**
7. Wait for the project to be created, then select it from the dropdown

### Step 2: Enable Google OAuth

1. In the Google Cloud Console, navigate to **APIs & Services** → **Library**
2. Search for "Google OAuth API"
3. Click on **Google Identity Services API**
4. Click **Enable**

### Step 3: Configure OAuth Consent Screen

1. Navigate to **APIs & Services** → **OAuth consent screen**
2. Select **User Type**:
   - **External** (for most applications)
   - **Internal** (if you have a Google Workspace organization)
3. Click **Create**
4. Fill in the required fields:
   - **App name**: "Siddhivinayak Overseas"
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
5. Click **Save and Continue**
6. **Scopes**: Click **Add or Remove Scopes** and select:
   - `.../auth/userinfo.email` (see your email address)
   - `.../auth/userinfo.profile` (see your personal info)
   - `openid` (associate you with your personal info)
7. Click **Save and Continue**
8. **Test users**: You can add test user email addresses (optional for development)
9. Click **Save and Continue**

### Step 4: Create OAuth Credentials

1. Navigate to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: "Siddhivinayak Overseas Web Client"

### Step 5: Authorized JavaScript Origins

Add these URLs:

```
http://localhost:5173          (Vite dev server)
https://yourdomain.com         (Production)
https://www.yourdomain.com     (WWW variant, if applicable)
```

### Step 6: Authorized Redirect URIs

Add these URLs:

```
http://localhost:5173/auth/callback                    (Local dev)
https://yourdomain.com/auth/callback                   (Production)
https://[PROJECT_REF].supabase.co/auth/v1/callback     (Supabase fallback)
```

> **Note**: The Supabase redirect URI is critical — this is where Google sends the auth code, which Supabase then exchanges for a session.

### Step 7: Copy Your Credentials

After creation, copy the **Client ID** and **Client Secret**. You'll need the Client ID for Supabase configuration.

---

## 4. Supabase Setup

### Step 1: Enable Google Provider

1. Log in to your [Supabase Dashboard](https://app.supabase.com/)
2. Go to **Authentication** → **Providers**
3. Click **Google**
4. Toggle **Enable Sign in with Google** to ON
5. Enter your **Client ID** from Google Cloud Console
6. Enter your **Client Secret** from Google Cloud Console
7. Click **Save**

### Step 2: Configure Redirect URLs

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**
2. **Site URL**: `https://yourdomain.com` (production) or `http://localhost:5173` (dev)
3. **Redirect URLs**:
   ```
   http://localhost:5173/auth/callback
   https://yourdomain.com/auth/callback
   https://yourdomain.com/**
   ```

### Step 3: Authentication Settings

1. Go to **Authentication** → **Settings**
2. **Session duration**: 3600 (1 hour) — adjust as needed
3. **User Signups**: Enabled
4. **Email Confirmations**: Disabled (optional — Google already verifies emails)
5. **Security**:
   - **Allow multi-factor authentication**: Recommended (Google handles this)
   - **Enable PKCE**: Enabled (already configured in client)

### Step 4: Environment Variables

After setup, copy your project credentials from **Settings** → **API**:

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `VITE_SUPABASE_URL` | Supabase project URL | Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key | Settings → API → anon public key |

---

## 5. Environment Variables

### `.env` File

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_your_anon_key_here

# Site
VITE_SITE_URL=http://localhost:5173
```

### `.env.example` (for developers)

```env
# Supabase Configuration
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Site URL (used for OAuth redirects)
VITE_SITE_URL=
```

### Production `.env`

```env
VITE_SUPABASE_URL=https://ugvtrtlnufzkjgxhucji.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_your_actual_key
VITE_SITE_URL=https://siddhivinayakoverseas.com
```

---

## 6. Folder Structure

```
src/
├── components/
│   ├── auth-provider.tsx         # Auth context provider (session, profile, permissions)
│   ├── GoogleSignInButton.tsx    # Reusable Google OAuth button component
│   ├── ProtectedRoute.tsx        # Route guard (redirects unauthenticated users)
│   ├── ui/
│   │   ├── button.tsx            # shadcn button
│   │   ├── checkbox.tsx          # shadcn checkbox
│   │   └── label.tsx             # shadcn label (flex by default)
│   └── ...
├── hooks/
│   └── use-auth.ts               # Auth context consumer hook
├── lib/
│   ├── supabase/
│   │   └── client.ts             # Supabase client (createClient + PKCE + localStorage)
│   ├── logger.ts                 # Structured logging utility
│   └── validations/auth.ts       # Zod schemas + password strength
├── pages/
│   ├── LoginPage.tsx             # Email/password + Google sign-in
│   ├── RegisterPage.tsx          # Registration + password strength + Google sign-up
│   ├── AuthCallback.tsx          # OAuth redirect handler
│   └── ...
├── App.tsx                       # Route configuration
└── main.tsx                      # Entry point (AuthProvider wraps app)

supabase/
├── migrations/
│   └── 020_google_auth_profiles.sql  # Google OAuth profile migration
├── setup.sql                     # Full production schema (source of truth)
└── schema.sql                    # Schema (commented reference)

docs/
└── google-authentication.md      # This document
```

---

## 7. Frontend Implementation

### 7.1 Supabase Client (`src/lib/supabase/client.ts`)

The client is configured with PKCE flow for OAuth, localStorage for persistence, and auto token refresh.

```typescript
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createSupabaseClient(url, key, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
})
```

**Key configuration**:
- `storage: localStorage` — persists session across tabs and page refreshes
- `flowType: "pkce"` — Proof Key for Code Exchange (most secure OAuth flow)
- `detectSessionInUrl: true` — automatically detects OAuth callback URL params
- `autoRefreshToken: true` — automatically refreshes JWT when expired

### 7.2 Auth Provider (`src/components/auth-provider.tsx`)

The `AuthProvider` wraps the entire application and manages:

- **Session state**: user, profile, permissions
- **Session restoration**: calls `getSession()` on mount
- **Real-time subscription**: listens to `onAuthStateChange`
- **Auto-profile creation**: calls `fetchProfile()` and inserts a default row if missing
- **Google sign-in**: `signInWithGoogle()` initiates the OAuth flow
- **Sign out**: clears session, profile, permissions, and sessionStorage

```typescript
// Core OAuth function
const signInWithGoogle = useCallback(async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  return { data, error }
}, [])
```

**How `fetchProfile` works**:
1. Query `user_profiles` table for the current user ID
2. If `PGRST116` (not found) → insert a minimal profile with `user_role: "user"`, `status: "active"`
3. Return the profile or the newly inserted default
4. Also fetches permissions via `get_my_permissions` RPC

### 7.3 Google Sign-In Button (`src/components/GoogleSignInButton.tsx`)

A reusable button component with the official Google logo (SVG), loading spinner, and disabled state.

```typescript
interface GoogleSignInButtonProps {
  onClick: () => void
  isLoading?: boolean
  disabled?: boolean
  label?: string
}
```

Usage:
```tsx
<GoogleSignInButton
  onClick={handleGoogleLogin}
  isLoading={googleLoading}
  disabled={loading}
/>
```

### 7.4 Auth Callback (`src/pages/AuthCallback.tsx`)

Handles the OAuth redirect with three states:

| State | UI | Behavior |
|-------|-----|----------|
| `processing` | Spinning loader + "Authenticating..." | Waiting for session |
| `success` | Green checkmark + "Authentication successful!" | Redirects to `/dashboard` after 1s |
| `error` | Red X + error message + "Redirecting to login..." | Redirects to `/login` after 3s |

The callback handles:
- OAuth error parameters (`?error=access_denied`, `?error_description=...`)
- Session fetch failures
- Timeout (15 seconds) for stalled authentication

### 7.5 Protected Route (`src/components/ProtectedRoute.tsx`)

Route guard component that:
1. Shows a loading spinner while auth state is loading
2. Redirects to `/login?redirect=<current_path>` if not authenticated
3. Renders children if authenticated

```typescript
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <PageLoader />
  if (!user) return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  return <>{children}</>
}
```

### 7.6 Login Page (`src/pages/LoginPage.tsx`)

Features:
- Email/password form with validation
- Google Sign-In button
- Terms & Conditions checkbox
- Forgot password link
- Redirect to `/dashboard` on success
- If already authenticated, redirect immediately
- Loading states for both email and Google sign-in

### 7.7 Register Page (`src/pages/RegisterPage.tsx`)

Features:
- Full name, email, password, confirm password fields
- Real-time password strength meter (5 levels)
- Google Sign-Up button
- Terms & Conditions checkbox
- Password must meet minimum strength (score >= 4)
- If already authenticated, redirect to `/dashboard`

### 7.8 Session Persistence

The session is persisted automatically via:
1. **localStorage**: The Supabase client stores the session tokens in `localStorage`
2. **`getSession()` on mount**: On every page load, `AuthProvider` calls `supabase.auth.getSession()` to restore the session
3. **`onAuthStateChange`**: A subscription listens for `SIGNED_IN`, `SIGNED_OUT`, and `TOKEN_REFRESHED` events
4. **`autoRefreshToken`**: The SDK automatically refreshes the JWT before it expires (default: ~1 hour)

### 7.9 Logout

The `signOut()` function:
1. Calls `supabase.auth.signOut()` to clear the Supabase session
2. Clears user, profile, and permissions state
3. Clears `sessionStorage` (for any residual data)
4. Shows a success toast

---

## 8. Backend

### Do We Need Backend Changes?

For Google OAuth with Supabase, **no custom backend code is required**. Everything is handled by:

1. **Supabase Auth**: Google OAuth is configured in the Supabase dashboard
2. **Database Triggers**: The `on_auth_user_created` trigger auto-creates user profiles
3. **Row Level Security**: RLS policies protect data access
4. **Supabase Client SDK**: Handles the OAuth flow on the frontend

### What About the Session?

Supabase Auth issues a JWT that contains the user's identity. The frontend stores this JWT in `localStorage` and sends it with every request. The JWT is validated by Supabase's API gateway before any database operation.

### Admin Authentication

The project has a separate admin authentication system (HMAC-signed cookies in `src/lib/admin/auth.ts`). This is completely independent of Google OAuth and is only used for internal admin access.

---

## 9. Database

### 9.1 Profiles Table

The `user_profiles` table extends `auth.users` with application-specific profile data.

```sql
CREATE TABLE user_profiles (
    id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email               VARCHAR(255) NOT NULL,
    full_name           VARCHAR(200),
    first_name          VARCHAR(100),
    last_name           VARCHAR(100),
    username            VARCHAR(200),
    profile_photo_url   TEXT,
    phone               VARCHAR(20),
    whatsapp            VARCHAR(20),
    gender              VARCHAR(20),
    nationality         VARCHAR(100),
    current_city        VARCHAR(100),
    current_country     VARCHAR(100),
    education_level     VARCHAR(100),
    field_of_study      VARCHAR(200),
    onboarding_complete BOOLEAN DEFAULT FALSE,
    user_role           VARCHAR(20) NOT NULL DEFAULT 'user',
    status              VARCHAR(20) NOT NULL DEFAULT 'active',
    last_login_at       TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 9.2 Automatic Profile Creation (Trigger)

When a new user is created in `auth.users` (either via email sign-up or Google OAuth), a PostgreSQL trigger automatically creates a corresponding profile in `user_profiles`:

```sql
CREATE OR REPLACE FUNCTION app_private.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id, email, full_name, first_name, last_name,
    profile_photo_url, phone, whatsapp
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'full_name', ''), ''),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NULLIF(NEW.raw_user_meta_data->>'avatar_url', ''),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'whatsapp'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), user_profiles.full_name),
    first_name = COALESCE(EXCLUDED.first_name, user_profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, user_profiles.last_name),
    profile_photo_url = COALESCE(EXCLUDED.profile_photo_url, user_profiles.profile_photo_url),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION app_private.handle_new_user();
```

For Google OAuth, `raw_user_meta_data` contains:
```json
{
  "full_name": "John Doe",
  "avatar_url": "https://lh3.googleusercontent.com/...",
  "email": "john@gmail.com"
}
```

### 9.3 Row Level Security (RLS)

All tables have RLS enabled. The profile policies are:

```sql
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE USING (auth.uid() = id);
```

### 9.4 Fallback Profile Creation

The `AuthProvider` also has a frontend fallback: if the `fetchProfile` function gets a `PGRST116` error (profile not found), it inserts a default profile directly:

```typescript
if (error.code === "PGRST116") {
  await supabase.from("user_profiles").insert({
    id: userId,
    email: userEmail,
    status: "active",
    user_role: "user",
  })
}
```

This ensures that even if the database trigger fails, the user still gets a profile.

---

## 10. Authentication Flow

### Complete Step-by-Step Flow

```
Step 1: User clicks "Continue with Google"
├── Button calls handleGoogleLogin()
├── Sets googleLoading = true
├── Disables button to prevent double-click
└── Calls signInWithGoogle() from AuthContext

Step 2: AuthProvider initiates OAuth
├── supabase.auth.signInWithOAuth({
│     provider: "google",
│     options: { redirectTo: "https://site.com/auth/callback" }
│   })
└── Supabase constructs Google OAuth URL with PKCE challenge

Step 3: Browser redirects to Google
├── User sees Google login page
├── User enters credentials (or selects account)
└── Google shows consent screen (first time only)

Step 4: User grants permissions
├── Google generates auth code
├── Redirects to: supabase.co/auth/v1/callback?code=...
├── Supabase exchanges code + PKCE verifier for tokens
└── Supabase creates/updates auth.users row

Step 5: Database trigger fires
├── on_auth_user_created trigger runs
├── app_private.handle_new_user() inserts into user_profiles
├── Populates: id, email, full_name, avatar_url from Google
└── Fallback: if trigger fails, AuthProvider inserts on profile fetch

Step 6: Browser redirects to /auth/callback
├── AuthCallback component mounts
├── supabase.auth.getSession() returns the new session
├── detectSessionInUrl captures the fragment with tokens
└── onAuthStateChange fires with "SIGNED_IN" event

Step 7: AuthProvider processes new session
├── setUser(session.user) updates state
├── fetchProfile() loads profile from user_profiles
├── fetchPermissions() loads user permissions
└── isLoading = false

Step 8: AuthCallback redirects to /dashboard
├── useAuth().isAuthenticated = true
├── Navigate to /dashboard
└── User sees their dashboard

Step 9: Session Persistence
├── Tokens are stored in localStorage
├── autoRefreshToken refreshes JWT before expiry
└── Next page load: getSession() restores session
```

### Redirect After Login

The redirect logic:

1. **Login Page**: If `?redirect=` param exists, redirect there; otherwise `/dashboard`
2. **Register Page**: Always redirects to `/dashboard`
3. **AuthCallback**: Redirects to `/dashboard` on success, `/login` on error
4. **ProtectedRoute**: Redirects to `/login?redirect=<path>`

---

## 11. Security

### JWT (JSON Web Token)

- Issued by Supabase Auth after successful authentication
- Contains: `sub` (user ID), `email`, `role` (authenticated), `aud`, `exp`, `iat`
- Automatically refreshed by the SDK before expiry
- Stored in `localStorage` (encrypted by Supabase SDK)
- Validated by Supabase API gateway on every request

### OAuth Tokens

- **Access Token**: Short-lived (typically 1 hour), used for API calls
- **Refresh Token**: Long-lived, used to obtain new access tokens
- **ID Token**: Contains user profile info (name, email, avatar)
- Supabase manages token exchange and rotation automatically

### Refresh Tokens

- `autoRefreshToken: true` in the Supabase client config
- SDK automatically detects when the access token is about to expire
- Uses the refresh token to obtain a new access token
- Refresh tokens are rotated (new one issued with each refresh)

### Session Storage

- **Why localStorage**: Ensures session persists across page refreshes and browser tabs
- **Alternative**: `sessionStorage` (more secure, but session lost on tab close)
- Our implementation uses `localStorage` + PKCE for the best balance of UX and security
- On logout: `sessionStorage.clear()` removes any residual data

### CSRF Protection

- **PKCE flow**: The OAuth authorization code is exchanged using a cryptographic verifier. Even if an attacker intercepts the code, they can't exchange it without the verifier.
- **State parameter**: Supabase includes a `state` parameter in OAuth requests, which is validated on callback.

### XSS Protection

- Supabase SDK stores tokens in `localStorage` but does not expose them to JavaScript insecurely
- All user input is sanitized via React's built-in XSS protection
- Use React's JSX escaping (never use `dangerouslySetInnerHTML` with user data)
- Validate all inputs with Zod schemas (in `src/lib/validations/auth.ts`)

### Best Practices

| Practice | Implementation |
|----------|----------------|
| **PKCE Flow** | `flowType: "pkce"` in Supabase client |
| **Token Refresh** | `autoRefreshToken: true` |
| **Session Detection** | `detectSessionInUrl: true` |
| **HTTPS Only** | Enforced in production via Vercel/Cloudflare |
| **No Secret Exposure** | All keys are public (anon key is safe to expose) |
| **RLS Everywhere** | Every table has Row Level Security enabled |
| **Input Validation** | Zod schemas validate email, password, name |
| **Error Handling** | Auth errors are caught and shown to user (not logged) |
| **Logout Clears State** | User, profile, permissions, and storage are cleared |
| **Rate Limiting** | Supabase handles rate limiting on auth endpoints |

---

## 12. Error Handling

### Error Types and Responses

| Scenario | Error Message | User Experience |
|----------|---------------|-----------------|
| **Popup closed** | `popup_closed` | Toast: "Sign-in cancelled. You closed the popup before completing sign-in." |
| **Access denied** | `access_denied` | Toast: "Access denied. You denied the permission request." |
| **Invalid token** | JWT validation fails | User is signed out, redirected to login |
| **Network error** | Request fails | Toast: "An unexpected error occurred during Google Sign-In." |
| **Existing account** | Email already registered | Google handles this — user signs in |
| **New account** | First-time Google user | Profile auto-created via trigger |
| **Session expired** | Refresh fails | onAuthStateChange fires SIGNED_OUT |
| **Unknown error** | Generic error | Toast with `error.message` or "Failed to log in." |

### Error Handling Code (AuthProvider)

```typescript
const signInWithGoogle = useCallback(async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  return { data, error }
}, [])
```

The error is handled at the page level:

```typescript
const handleGoogleLogin = async () => {
  setGoogleLoading(true)
  try {
    const { error } = await signInWithGoogle()
    if (error) {
      if (error.message?.includes("popup_closed")) {
        toast.error("Sign-in cancelled.", {
          description: "You closed the popup before completing sign-in.",
        })
      } else if (error.message?.includes("access_denied")) {
        toast.error("Access denied.", {
          description: "You denied the permission request.",
        })
      } else {
        toast.error(error.message || "Google sign-in failed.")
      }
    }
  } catch (err: any) {
    toast.error("An unexpected error occurred during Google Sign-In.")
    console.error(err)
  } finally {
    setGoogleLoading(false)
  }
}
```

### AuthCallback Error Handling

```typescript
// URL error parameters from Google
const params = new URLSearchParams(window.location.search)
const errorParam = params.get("error")
const errorDescription = params.get("error_description")

if (errorParam) {
  // Show error, redirect to /login after 3s
}

// Session fetch failure
const { data, error: sessionError } = await supabase.auth.getSession()
if (sessionError) {
  // Show error, redirect to /login after 3s
}

// Timeout (15 seconds)
setTimeout(() => {
  if (status === "processing") {
    setError("Authentication timed out. Please try again.")
    // Redirect to /login after 3s
  }
}, 15000)
```

---

## 13. UI Improvements

### Google Sign-In Button

A custom button with the official Google logo SVG:

```tsx
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4">
    <path d="..." fill="#4285F4" />  {/* Blue - G */}
    <path d="..." fill="#34A853" />  {/* Green - o */}
    <path d="..." fill="#FBBC05" />  {/* Yellow - o */}
    <path d="..." fill="#EA4335" />  {/* Red - g */}
  </svg>
)
```

### Loading Spinner

- Uses `Loader2` from lucide-react with `animate-spin`
- Shown while `googleLoading` is `true`
- Button text changes to "Connecting..."
- Button is disabled during loading to prevent double-clicks

### Toast Notifications

- Success: "Welcome back!" or "Account created successfully!"
- Error: Descriptive messages for each error scenario
- Uses `sonner` toast library (already configured in `main.tsx`)

### Disabled Button

- `disabled={loading || googleLoading}` prevents interaction during auth
- Both email/password and Google buttons are disabled simultaneously
- Prevents race conditions and double submissions

### Responsive Design

- Button is `w-full` (full width of form)
- Consistent `rounded-full` styling matches other buttons
- `h-11` height matches input fields
- `border-border/70` subtle border with `hover:bg-muted/30` hover state

---

## 14. Testing

### Testing Checklist

#### 1. Google Sign-In Flow

- [ ] Click "Continue with Google" button
- [ ] Google login page opens in popup/redirect
- [ ] Select Google account
- [ ] Consent screen appears (first time)
- [ ] Grant permissions
- [ ] Redirect back to `/auth/callback`
- [ ] Loading state shows "Authenticating, please wait..."
- [ ] Success state shows "Authentication successful!"
- [ ] Redirected to `/dashboard`
- [ ] User profile is created in `user_profiles`
- [ ] User email and name are pre-populated from Google

#### 2. Session Persistence

- [ ] Close browser tab
- [ ] Open new tab and navigate to `/dashboard`
- [ ] User is still authenticated
- [ ] Profile loads correctly
- [ ] JWT is refreshed automatically before expiry

#### 3. Session Refresh

- [ ] Wait 1 hour (or manually expire the JWT)
- [ ] Make an API request
- [ ] Token is automatically refreshed
- [ ] Request succeeds

#### 4. Logout

- [ ] Click logout button
- [ ] Session is cleared
- [ ] Redirected to login page (or home page)
- [ ] Dashboard route is protected (redirects to `/login`)
- [ ] Refreshing the page shows login page (not dashboard)

#### 5. Protected Routes

- [ ] Visit `/dashboard` without authentication
- [ ] Redirected to `/login?redirect=%2Fdashboard`
- [ ] After login, redirected back to `/dashboard`
- [ ] Loading spinner shows while auth state is loading

#### 6. Error Scenarios

- [ ] Close popup before completing → "Sign-in cancelled" toast
- [ ] Deny permissions → "Access denied" toast
- [ ] Network error → "An unexpected error occurred" toast
- [ ] Invalid OAuth redirect → Error state on AuthCallback page
- [ ] Auth timeout (15s) → "Authentication timed out" → redirect to login

#### 7. Edge Cases

- [ ] Multiple rapid clicks on Google button (debounced)
- [ ] Google account with no profile photo
- [ ] Google account with unusual name characters
- [ ] Incognito/private browsing mode
- [ ] Safari browser (ITP restrictions)
- [ ] Mobile browser
- [ ] Slow network (loading states display correctly)

#### 8. Email/Password Authentication (Regression)

- [ ] Email/password login still works
- [ ] Email/password registration still works
- [ ] Password strength meter works
- [ ] Terms checkbox validation works

#### 9. RLS Policies

- [ ] User can read their own profile
- [ ] User can update their own profile
- [ ] User cannot read other users' profiles
- [ ] User cannot update other users' profiles

---

## 15. Deployment

### Vercel Setup

1. Push your code to GitHub/GitLab
2. Go to [Vercel](https://vercel.com/) and import your repository
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Node Version**: 20.x

4. Add Environment Variables:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_your_anon_key
   VITE_SITE_URL=https://yourdomain.com
   ```

5. Deploy

### Supabase Redirect URLs

After deploying to production, update your Supabase redirect URLs:

1. Go to **Authentication** → **URL Configuration**
2. **Site URL**: `https://yourdomain.com`
3. **Redirect URLs**: Add `https://yourdomain.com/auth/callback`

### Production Domain

1. In Vercel: Go to **Settings** → **Domains**
2. Add your custom domain (e.g., `siddhivinayakoverseas.com`)
3. Configure DNS (CNAME record pointing to `cname.vercel-dns.com`)

### Google Console Updates

After deploying to production:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add production URLs to **Authorized JavaScript Origins**:
   - `https://yourdomain.com`
   - `https://www.yourdomain.com` (if applicable)
5. Add production URLs to **Authorized Redirect URIs**:
   - `https://yourdomain.com/auth/callback`
   - `https://www.yourdomain.com/auth/callback` (if applicable)
   - `https://[PROJECT_REF].supabase.co/auth/v1/callback`
6. Click **Save**

---

## 16. Troubleshooting

### Common OAuth Errors

#### "Redirect URI Mismatch"

**Error**: `Error 400: redirect_uri_mismatch`

**Causes**:
- The redirect URI in Google Cloud Console doesn't match the actual redirect
- The Supabase redirect URL in Google Console is missing or incorrect

**Fix**:
1. Go to Google Cloud Console → Credentials → Edit OAuth client
2. Verify **Authorized Redirect URIs** includes:
   - `https://[PROJECT_REF].supabase.co/auth/v1/callback`
   - `http://localhost:5173/auth/callback` (for dev)
   - `https://yourdomain.com/auth/callback` (for prod)

#### "Invalid Client ID"

**Error**: `Error 400: invalid_client`

**Causes**:
- The Client ID in Supabase doesn't match Google Console
- The wrong credential type was selected

**Fix**:
1. Verify the Client ID in Supabase Dashboard → Authentication → Providers → Google
2. Verify the Client ID in Google Console → Credentials
3. Ensure it's a "Web application" credential type

#### "Provider Disabled"

**Error**: `Provider is disabled`

**Causes**:
- Google provider is toggled OFF in Supabase dashboard

**Fix**:
1. Go to Supabase Dashboard → Authentication → Providers
2. Toggle Google ON
3. Ensure Client ID and Secret are correctly entered

#### "Session Expired"

**Behavior**: User is suddenly logged out

**Causes**:
- JWT expired and refresh failed
- User manually cleared localStorage
- Supabase session revoked

**Fix**:
1. This is usually handled automatically by `autoRefreshToken: true`
2. User just needs to sign in again
3. Check Supabase Auth settings for session duration

#### "Popup Closed"

**Causes**:
- User closed the popup window before completing sign-in
- Popup was blocked by the browser

**Fix**:
1. Re-attempt sign-in
2. If popup is consistently blocked, the redirect flow will work (no popup)
3. The error is handled gracefully with a descriptive toast

#### "Access Denied"

**Causes**:
- User clicked "Cancel" or "Deny" on Google's consent screen
- User did not grant the requested permissions

**Fix**:
1. Inform user they need to grant permissions to sign in
2. Re-attempt sign-in

#### Network Error

**Causes**:
- User has no internet connection
- Google APIs are blocked by corporate firewall
- CORS issues (unusual with standard OAuth)

**Fix**:
1. Check internet connection
2. Try incognito mode
3. Check if Google APIs are accessible from the network

### Debugging Tips

#### Check the Browser Console

```
Open DevTools → Console
Look for:
- "Auth state changed: SIGNED_IN"
- "Auth state changed: TOKEN_REFRESHED"  
- Any error messages from Supabase SDK
```

#### Inspect Network Tab

```
Open DevTools → Network
Filter by "supabase" or "google"
Check:
- OAuth redirect URL (should include code parameter)
- /auth/v1/callback response
- Token exchange response
```

#### Verify Supabase Configuration

```bash
# Check if the Google provider is enabled
curl -s https://[PROJECT_REF].supabase.co/auth/v1/settings | jq

# Should show google provider in the external providers list
```

#### Test with Minimal Reproduction

1. Create a simple HTML file with the Supabase client
2. Call `signInWithOAuth({ provider: "google" })` 
3. Check if the OAuth flow completes
4. This isolates frontend-specific issues

### Supabase Auth Logs

1. Go to Supabase Dashboard → **Authentication** → **Logs**
2. Filter by `google` provider
3. Look for failed sign-in attempts
4. Check for error messages from the OAuth provider

---

## 17. Final Deliverables

### Files Implemented

| # | File | Purpose |
|---|------|---------|
| 1 | `src/lib/supabase/client.ts` | Supabase client with PKCE + localStorage |
| 2 | `src/components/auth-provider.tsx` | Auth context with Google OAuth, profile, session |
| 3 | `src/components/GoogleSignInButton.tsx` | Reusable Google OAuth button |
| 4 | `src/components/ProtectedRoute.tsx` | Route guard (auth → dashboard redirect) |
| 5 | `src/pages/LoginPage.tsx` | Login page with email + Google sign-in |
| 6 | `src/pages/RegisterPage.tsx` | Register page with email + Google sign-up |
| 7 | `src/pages/AuthCallback.tsx` | OAuth redirect handler with error states |
| 8 | `src/hooks/use-auth.ts` | Auth context consumer hook |
| 9 | `supabase/migrations/020_google_auth_profiles.sql` | DB migration for Google metadata |
| 10 | `docs/google-authentication.md` | This documentation |

### Verification Checklist

- [x] Supabase client configured with PKCE + localStorage
- [x] AuthProvider manages session, profile, permissions
- [x] Google OAuth initiated via `signInWithOAuth({ provider: "google" })`
- [x] AuthCallback handles OAuth redirect with success/error/timeout states
- [x] LoginPage has Google Sign-In with error handling
- [x] RegisterPage has Google Sign-Up with error handling
- [x] GoogleSignInButton has proper Google logo, loading state, disabled state
- [x] ProtectedRoute guards dashboard routes
- [x] Database trigger creates profile on user creation
- [x] Frontend fallback creates profile if trigger fails
- [x] RLS policies protect user data
- [x] Session persists across page refreshes (localStorage)
- [x] Token auto-refresh enabled
- [x] Error handling for all OAuth error scenarios
- [x] Loading states prevent double-clicks
- [x] Toast notifications for success and error

---

*Document version 1.0 — Last updated: July 2026*
*Project: Siddhivinayak Overseas — Immigration & Visa Consultants*
