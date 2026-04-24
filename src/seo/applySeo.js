function findHeadElement(tagName, attributeName, attributeValue, extraAttributes = {}) {
  return Array.from(document.head.querySelectorAll(tagName)).find((element) => {
    if (attributeName && element.getAttribute(attributeName) !== attributeValue) {
      return false
    }

    return Object.entries(extraAttributes).every(
      ([key, value]) => element.getAttribute(key) === value
    )
  })
}

function ensureMeta(attributeName, attributeValue, content) {
  if (!content) {
    return
  }

  let meta = findHeadElement('meta', attributeName, attributeValue)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute(attributeName, attributeValue)
    document.head.appendChild(meta)
  }

  meta.setAttribute('content', content)
}

function ensureLink(rel, href, extraAttributes = {}) {
  if (!href) {
    return
  }

  let link = findHeadElement('link', 'rel', rel, extraAttributes)
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', rel)
    document.head.appendChild(link)
  }

  link.setAttribute('href', href)
  Object.entries(extraAttributes).forEach(([key, value]) => {
    link.setAttribute(key, value)
  })
}

export function applySeo(seoPayload) {
  if (typeof document === 'undefined' || !seoPayload) {
    return
  }

  document.documentElement.lang = seoPayload.language

  let title = document.head.querySelector('title')
  if (!title) {
    title = document.createElement('title')
    document.head.appendChild(title)
  }
  title.textContent = seoPayload.title

  ensureMeta('name', 'description', seoPayload.description)
  ensureMeta('name', 'keywords', seoPayload.keywords.join(', '))
  ensureMeta(
    'name',
    'robots',
    'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  )
  ensureMeta('name', 'author', seoPayload.author)
  ensureMeta('name', 'theme-color', seoPayload.themeColor)
  ensureMeta('property', 'og:locale', seoPayload.locale)
  ensureMeta('property', 'og:type', 'website')
  ensureMeta('property', 'og:site_name', seoPayload.siteName)
  ensureMeta('property', 'og:title', seoPayload.title)
  ensureMeta('property', 'og:description', seoPayload.description)
  ensureMeta('property', 'og:url', seoPayload.canonicalUrl)
  ensureMeta('property', 'og:image', seoPayload.ogImageUrl)
  ensureMeta('property', 'og:image:alt', seoPayload.ogImageAlt)
  ensureMeta('name', 'twitter:card', 'summary_large_image')
  ensureMeta('name', 'twitter:title', seoPayload.title)
  ensureMeta('name', 'twitter:description', seoPayload.description)
  ensureMeta('name', 'twitter:image', seoPayload.ogImageUrl)

  ensureLink('canonical', seoPayload.canonicalUrl)
  ensureLink('alternate', seoPayload.canonicalUrl, { hreflang: 'zh-TW' })
  ensureLink('alternate', seoPayload.canonicalUrl, { hreflang: 'x-default' })

  document.head
    .querySelectorAll('script[data-seo-json-ld]')
    .forEach((script) => script.parentNode?.removeChild(script))

  seoPayload.structuredData.forEach((item, index) => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.seoJsonLd = `runtime-${index}`
    script.textContent = JSON.stringify(item)
    document.head.appendChild(script)
  })
}
