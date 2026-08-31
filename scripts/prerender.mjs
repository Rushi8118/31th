/**
 * Post-build prerender for public SEO routes.
 * Starts vite preview, renders each route with Playwright, writes HTML into dist/.
 */
import { spawn } from 'node:child_process'
import { mkdir, writeFile, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const distDir = path.join(root, 'dist')
const PORT = 4179
const BASE = `http://127.0.0.1:${PORT}`

const ROUTES = [
  '/',
  '/visa-consultants-in-surat',
  '/study-visa',
  '/work-visa',
  '/countries',
  '/study-in-uk',
  '/study-in-france',
  '/study-in-germany',
  '/study-in-spain',
  '/study-in-dubai',
  '/study-in-singapore',
  '/study-in-canada',
  '/study-in-australia',
  '/study-in-usa',
  '/study-in-ireland',
  '/study-in-new-zealand',
  '/work-visa/albania',
  '/work-visa/armenia',
  '/work-visa/austria',
  '/work-visa/belarus',
  '/work-visa/croatia',
  '/work-visa/denmark',
  '/work-visa/finland',
  '/work-visa/france',
  '/work-visa/germany',
  '/work-visa/hungary',
  '/work-visa/ireland',
  '/work-visa/italy',
  '/work-visa/malta',
  '/work-visa/moldova',
  '/work-visa/netherlands',
  '/work-visa/norway',
  '/work-visa/poland',
  '/work-visa/portugal',
  '/work-visa/romania',
  '/work-visa/slovakia',
  '/work-visa/spain',
  '/work-visa/sweden',
  '/work-visa/switzerland',
  '/work-visa/uk',
  '/work-visa/azerbaijan',
  '/work-visa/israel',
  '/work-visa/japan',
  '/work-visa/kazakhstan',
  '/work-visa/malaysia',
  '/work-visa/maldives',
  '/work-visa/qatar',
  '/work-visa/russia',
  '/work-visa/saudi-arabia',
  '/work-visa/singapore',
  '/work-visa/australia',
  '/work-visa/new-zealand',
  '/work-visa/canada',
  '/work-visa/usa',
  '/work-visa/africa',
  '/work-visa/gulf',
  '/post-study-work-visa',
  '/guides',
  '/guides/canada-student-visa-requirements',
  '/guides/canada-study-visa-documents',
  '/guides/uk-student-visa-requirements',
  '/guides/australia-student-visa-requirements',
  '/guides/japan-ssw-visa-guide',
  '/guides/visa-rejection-reasons',
  '/guides/ielts-requirements-for-study-abroad',
  '/guides/post-study-work-visa-comparison',
  '/success-stories',
  '/services',
  '/about',
  '/reviews',
  '/contact',
  '/privacy',
  '/terms',
  '/404',
]

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function waitForServer(url, attempts = 40) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url)
      if (res.ok || res.status === 404) return
    } catch {
      // retry
    }
    await sleep(250)
  }
  throw new Error(`Preview server did not start at ${url}`)
}

function outFileForRoute(route) {
  if (route === '/') return path.join(distDir, 'index.html')
  const clean = route.replace(/^\//, '').replace(/\/$/, '')
  return path.join(distDir, clean, 'index.html')
}

async function main() {
  await access(distDir)

  // Run vite via node directly — avoids shell wrappers and DEP0190 warning.
  const viteCli = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js')
  const previewArgs = [viteCli, 'preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort']
  const preview = spawn(
    process.execPath,
    previewArgs,
    {
      cwd: root,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env },
    },
  )

  let previewLog = ''
  preview.stdout.on('data', (d) => {
    previewLog += d.toString()
  })
  preview.stderr.on('data', (d) => {
    previewLog += d.toString()
  })

  try {
    await waitForServer(BASE)
    // Prefer system Chrome when Playwright's bundled Chromium isn't installed yet.
    let browser
    try {
      browser = await chromium.launch({ headless: true, channel: 'chrome' })
    } catch {
      browser = await chromium.launch({ headless: true })
    }
    const page = await browser.newPage()

    for (const route of ROUTES) {
      const url = `${BASE}${route === '/404' ? '/this-page-does-not-exist-prerender' : route}`
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
      await page.waitForSelector('#root', { timeout: 30000 })
      // Give helmet/lazy routes a moment to settle
      await sleep(400)
      const html = await page.content()
      const target = outFileForRoute(route === '/404' ? '/404' : route)
      await mkdir(path.dirname(target), { recursive: true })
      await writeFile(target, html, 'utf8')
      console.log(`prerendered ${route} -> ${path.relative(root, target)}`)
    }

    await browser.close()
  } finally {
    // Cross-platform process cleanup
    try {
      preview.kill()
      await sleep(500)
      if (!preview.killed && process.platform === 'win32' && preview.pid) {
        // On Windows, force-kill the process tree
        spawn('taskkill', ['/pid', String(preview.pid), '/T', '/F'], { stdio: 'ignore' })
      } else if (!preview.killed) {
        preview.kill('SIGKILL')
      }
    } catch {
      // Process may have already exited
    }
  }

  if (previewLog.includes('error')) {
    console.warn('Preview log contained errors:\n', previewLog.slice(-1000))
  }
  console.log(`Prerender complete (${ROUTES.length} routes)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
