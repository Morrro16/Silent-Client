import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const rawSiteUrl = process.env.VITE_SITE_URL?.trim()

if (!rawSiteUrl) {
  console.error('Set VITE_SITE_URL to the canonical production HTTPS address before building.')
  process.exit(1)
}

let siteOrigin
try {
  const parsedUrl = new URL(rawSiteUrl)
  if (parsedUrl.protocol !== 'https:' || !parsedUrl.hostname) throw new Error('HTTPS address required')
  siteOrigin = parsedUrl.origin
} catch {
  console.error('VITE_SITE_URL must be a valid HTTPS origin, for example https://silentclient.com.')
  process.exit(1)
}

const viteBasePath = process.env.VITE_BASE_PATH || '/'
const normalizedBasePath = viteBasePath.replace(/^\/+|\/+$/g, '')
const basePath = normalizedBasePath ? `/${normalizedBasePath}/` : '/'
const siteBaseUrl = `${siteOrigin}${basePath}`.replace(/\/$/, '')
const siteRootUrl = `${siteBaseUrl}/`
const pages = [
  {
    route: '',
    pageKey: 'home',
    language: 'ru',
    title: 'Silent Client — клиент для DDRaceNetwork (DDNet)',
    description: 'Silent Client — клиент для DDRaceNetwork (DDNet) с визуальными настройками и дополнительными функциями. Скачать для Windows и Linux, открыть обзор и документацию.',
    noscript: 'Silent Client — клиент для DDRaceNetwork (DDNet) с визуальными настройками и дополнительными функциями. Доступны обзор, загрузка для Windows и Linux, а также документация.',
  },
  {
    route: 'download',
    pageKey: 'download',
    language: 'ru',
    title: 'Скачать Silent Client 5.0 для Windows и Linux',
    description: 'Скачайте Silent Client 5.0 для DDRaceNetwork. На странице доступны архив клиента для Windows 11 и более ранних версий, а также Linux.',
    noscript: 'Скачайте Silent Client версии 5.0 для Windows 11 и более ранних версий или Linux. Один ZIP-архив доступен для обеих систем.',
  },
  {
    route: 'documentation',
    pageKey: 'documentation',
    language: 'ru',
    title: 'Документация Silent Client — функции и настройки',
    description: 'Руководство по функциям и настройкам Silent Client: Ти, игроки, чат, интерфейс, экран и мир, текстуры.',
    noscript: 'Документация Silent Client содержит описание функций во вкладках Ти, Игроки, Чат, Интерфейс, Экран и Мир, Текстуры. Настройки клиента находятся в Настройки → SClient.',
  },
  {
    route: 'en',
    pageKey: 'home',
    language: 'en',
    title: 'Silent Client — a client for DDRaceNetwork (DDNet)',
    description: 'Silent Client is a DDRaceNetwork (DDNet) client with visual settings and extra features. Download for Windows or Linux, browse the overview, and read the documentation.',
    noscript: 'Silent Client is a DDRaceNetwork (DDNet) client with visual settings and extra features. Browse the overview, download for Windows or Linux, and read the documentation.',
  },
  {
    route: 'en/download',
    pageKey: 'download',
    language: 'en',
    title: 'Download Silent Client 5.0 for Windows and Linux',
    description: 'Download Silent Client 5.0 for DDRaceNetwork. The client archive is available for Windows 11 and earlier versions, as well as Linux.',
    noscript: 'Download Silent Client version 5.0 for Windows 11 and earlier versions or Linux. One ZIP archive is available for both systems.',
  },
  {
    route: 'en/documentation',
    pageKey: 'documentation',
    language: 'en',
    title: 'Silent Client documentation — features and settings',
    description: 'Guides to Silent Client features and settings: Tee, players, chat, interface, screen and world, and textures.',
    noscript: 'Silent Client documentation describes the Tee, Players, Chat, Interface, Screen and World, and Textures sections. Find the settings at Settings → SClient.',
  },
]

const build = spawnSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build'], { stdio: 'inherit' })
if (build.status !== 0) process.exit(build.status || 1)

const htmlPath = resolve('dist/index.html')
const sourceHtml = readFileSync(htmlPath, 'utf8')
const today = new Date().toISOString().slice(0, 10)
const escapeHtml = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

function setMeta(html, attribute, name, value) {
  const tag = `<meta ${attribute}="${escapeHtml(name)}" content="${escapeHtml(value)}" />`
  const pattern = new RegExp(`<meta\\s+[^>]*\\b${attribute}="${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`, 'i')
  if (pattern.test(html)) return html.replace(pattern, tag)
  return html.replace('</head>', `    ${tag}\n  </head>`)
}

function setCanonical(html, url) {
  const tag = `<link rel="canonical" href="${escapeHtml(url)}" />`
  const pattern = /<link\s+[^>]*rel="canonical"[^>]*>/i
  if (pattern.test(html)) return html.replace(pattern, tag)
  return html.replace('</head>', `    ${tag}\n  </head>`)
}

function makeStructuredData(page, pageUrl) {
  const webSiteId = `${siteRootUrl}#website`
  const localizedHomeUrl = `${siteBaseUrl}/${page.language === 'en' ? 'en/' : ''}`
  const breadcrumbNames = page.language === 'en'
    ? { home: 'Home', download: 'Download', documentation: 'Documentation' }
    : { home: 'Главная', download: 'Скачать', documentation: 'Документация' }
  const webPage = {
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: page.title,
    description: page.description,
    inLanguage: page.language,
    isPartOf: { '@id': webSiteId },
  }
  const graph = [
    {
      '@type': 'WebSite',
      '@id': webSiteId,
      url: siteRootUrl,
      name: 'Silent Client',
      inLanguage: ['ru', 'en'],
    },
  ]

  if (page.pageKey === 'download') {
    graph.push({
      '@type': 'SoftwareApplication',
      '@id': `${siteBaseUrl}/#software`,
      name: 'Silent Client',
      applicationCategory: 'GameApplication',
      operatingSystem: 'Windows 11 and earlier, Linux',
      softwareVersion: '5.0',
      description: page.language === 'en'
        ? 'Client for DDRaceNetwork (DDNet), available as a ZIP archive for Windows and Linux.'
        : 'Клиент для DDRaceNetwork (DDNet), доступный в ZIP-архиве для Windows и Linux.',
      downloadUrl: `${siteBaseUrl}/downloads/Silent-Client-5.0.zip`,
      url: pageUrl,
    })
    webPage.about = { '@id': `${siteBaseUrl}/#software` }
  }

  if (page.pageKey !== 'home') {
    const parent = { '@type': 'ListItem', position: 1, name: breadcrumbNames.home, item: localizedHomeUrl }
    const currentName = breadcrumbNames[page.pageKey]
    const breadcrumbId = `${pageUrl}#breadcrumb`
    webPage.breadcrumb = { '@id': breadcrumbId }
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId,
      itemListElement: [
        parent,
        { '@type': 'ListItem', position: 2, name: currentName, item: pageUrl },
      ],
    })
  }

  graph.push(webPage)
  return { '@context': 'https://schema.org', '@graph': graph }
}

function localePageUrl(language, pageKey) {
  const languagePath = language === 'en' ? 'en/' : ''
  const pagePath = pageKey === 'home' ? '' : `${pageKey}/`
  return `${siteBaseUrl}/${languagePath}${pagePath}`
}

function setAlternate(html, language, url) {
  const tag = `<link rel="alternate" hreflang="${language}" href="${escapeHtml(url)}" />`
  const pattern = new RegExp(`<link\\s+[^>]*rel="alternate"[^>]*hreflang="${language}"[^>]*>`, 'i')
  if (pattern.test(html)) return html.replace(pattern, tag)
  return html.replace('</head>', `    ${tag}\n  </head>`)
}

function renderPageHtml(page) {
  const pageUrl = localePageUrl(page.language, page.pageKey)
  const imageUrl = `${siteBaseUrl}/social-card.svg`
  let html = sourceHtml
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`)
    .replace(/<html\b[^>]*\blang="[^"]*"/i, `<html lang="${page.language}"`)

  html = setMeta(html, 'name', 'description', page.description)
  html = setMeta(html, 'property', 'og:title', page.title)
  html = setMeta(html, 'property', 'og:description', page.description)
  html = setMeta(html, 'property', 'og:url', pageUrl)
  html = setMeta(html, 'property', 'og:image', imageUrl)
  html = setMeta(html, 'property', 'og:image:alt', page.title)
  html = setMeta(html, 'property', 'og:locale', page.language === 'en' ? 'en_US' : 'ru_RU')
  html = setMeta(html, 'name', 'twitter:title', page.title)
  html = setMeta(html, 'name', 'twitter:description', page.description)
  html = setMeta(html, 'name', 'twitter:image', imageUrl)
  html = setMeta(html, 'name', 'twitter:image:alt', page.title)
  html = setCanonical(html, pageUrl)
  html = setAlternate(html, 'ru', localePageUrl('ru', page.pageKey))
  html = setAlternate(html, 'en', localePageUrl('en', page.pageKey))
  html = setAlternate(html, 'x-default', localePageUrl('ru', page.pageKey))

  const jsonLd = JSON.stringify(makeStructuredData(page, pageUrl)).replaceAll('<', '\\u003c')
  html = html.replace('</head>', `    <script type="application/ld+json">${jsonLd}</script>\n  </head>`)

  const nav = page.language === 'en'
    ? { label: 'Main navigation', home: 'Home', download: 'Download', documentation: 'Documentation' }
    : { label: 'Основная навигация', home: 'Главная', download: 'Скачать', documentation: 'Документация' }
  const href = pageKey => `${basePath}${page.language === 'en' ? 'en/' : ''}${pageKey === 'home' ? '' : `${pageKey}/`}`
  const noScript = `<noscript><main><h1>${escapeHtml(page.title)}</h1><p>${escapeHtml(page.noscript)}</p><nav aria-label="${escapeHtml(nav.label)}"><a href="${href('home')}">${escapeHtml(nav.home)}</a><a href="${href('download')}">${escapeHtml(nav.download)}</a><a href="${href('documentation')}">${escapeHtml(nav.documentation)}</a></nav></main></noscript>`
  html = html.replace(/<noscript>[\s\S]*?<\/noscript>/i, noScript)
  return html
}

const sitemapUrls = []
for (const page of pages) {
  const pageUrl = localePageUrl(page.language, page.pageKey)
  const routeParts = page.route ? page.route.split('/') : []
  const outputPath = routeParts.length ? resolve('dist', ...routeParts, 'index.html') : htmlPath
  if (routeParts.length) mkdirSync(resolve('dist', ...routeParts), { recursive: true })
  writeFileSync(outputPath, renderPageHtml(page), 'utf8')
  const alternateLinks = pages
    .filter(alternatePage => alternatePage.pageKey === page.pageKey)
    .map(alternatePage => `<xhtml:link rel="alternate" hreflang="${alternatePage.language}" href="${escapeHtml(localePageUrl(alternatePage.language, alternatePage.pageKey))}" />`)
  alternateLinks.push(`<xhtml:link rel="alternate" hreflang="x-default" href="${escapeHtml(localePageUrl('ru', page.pageKey))}" />`)
  sitemapUrls.push(`<url><loc>${escapeHtml(pageUrl)}</loc><lastmod>${today}</lastmod>${alternateLinks.join('')}</url>`)
}

writeFileSync(
  resolve('dist/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${sitemapUrls.join('')}</urlset>\n`,
  'utf8',
)
writeFileSync(resolve('dist/robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteBaseUrl}/sitemap.xml\n`, 'utf8')

console.log('Production pages, canonical links, structured data, sitemap.xml, and robots.txt generated.')
