export const siteConfig = {
  siteName: '2026人資長論壇',
  title: '2026人資長論壇｜AI新世代人才永續新篇章',
  description:
    '2026人資長論壇聚焦 AI 助力、財務自立與健康福利，邀請企業領袖與人資決策者在新竹共同探討高齡化、缺工與人才永續的新解方。',
  keywords: [
    '2026人資長論壇',
    '人資長論壇',
    'HR論壇',
    'AI人才永續',
    '人才永續',
    '人力資源',
    'HR',
    '缺工',
    '高齡化',
    '企業健康福利',
    '財務自立',
    'ESG',
    '新竹論壇'
  ],
  language: 'zh-Hant-TW',
  locale: 'zh_TW',
  canonicalUrl: 'https://events.businesstoday.com.tw/2026/HRforum/',
  themeColor: '#0f7f83',
  ogImageName: 'fb-share.jpg',
  ogImageAlt: '2026人資長論壇活動主視覺',
  organizationName: '今周刊 Business Today',
  organizationUrl: 'https://www.businesstoday.com.tw/',
  organizationLogo: 'https://events.businesstoday.com.tw/2026/HRforum/favicon.png',
  showVisibleFaqSection: false,
  enableFaqSchema: false,
  sameAs: [
    'https://www.businesstoday.com.tw/',
    'https://esg.businesstoday.com.tw/',
    'https://esgschool.businesstoday.com.tw/'
  ]
}

function getContentArray(infoData) {
  return Array.isArray(infoData?.content) ? infoData.content : []
}

function getContentBy(infoData, matcher) {
  return getContentArray(infoData).find(matcher) ?? {}
}

function padNumber(value) {
  return String(value).padStart(2, '0')
}

function toIsoDate(dateParts, timeText) {
  if (!dateParts || !timeText) {
    return undefined
  }

  return `${dateParts.year}-${padNumber(dateParts.month)}-${padNumber(dateParts.day)}T${timeText}:00+08:00`
}

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function stripHtml(value = '') {
  return String(value)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseEventSchedule(signUpContent = {}) {
  const eventInfo = Array.isArray(signUpContent.event_info) ? signUpContent.event_info : []
  const dateItem = eventInfo.find((item) => item.label === '活動時間') ?? {}
  const dateText = stripHtml(dateItem.title)
  const timeText = stripHtml(dateItem.detail)

  const dateMatch = dateText.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/)
  const timeMatch = timeText.match(/(\d{1,2}:\d{2})\s*~\s*(\d{1,2}:\d{2})/)
  const dateParts = dateMatch
    ? { year: dateMatch[1], month: dateMatch[2], day: dateMatch[3] }
    : { year: '2026', month: '4', day: '29' }

  return {
    dateText,
    timeText,
    startDate: toIsoDate(dateParts, timeMatch?.[1] ?? '09:30'),
    endDate: toIsoDate(dateParts, timeMatch?.[2] ?? '16:50')
  }
}

function getTrafficVenue(infoData) {
  const trafficContent = getContentBy(infoData, (item) => item.cmsType === 'traffic' || item.titleEn === 'traffic')
  return trafficContent?.trafficInfo?.info?.[0] ?? {}
}

function getAgendaTopics(infoData) {
  const agendaContent = getContentBy(infoData, (item) => item.cmsType === 'agenda' || Array.isArray(item.agendaInfo))
  return (agendaContent?.agendaInfo ?? [])
    .map((item) => stripHtml(item?.topic))
    .filter((topic) => topic && topic !== '演講主題')
}

function buildFaqs({ signUpContent, schedule, trafficVenue, agendaTopics }) {
  const signUpInfo = Array.isArray(signUpContent?.signUp_info) ? signUpContent.signUp_info : []
  const audienceText = stripHtml(signUpInfo[0]?.detail)
  const registrationText = stripHtml(signUpInfo[1]?.detail)
  const locationName = [trafficVenue.title, trafficVenue.subTitle].filter(Boolean).join(' ')
  const locationText = stripHtml(trafficVenue.location)
  const transportSummary = (trafficVenue.description ?? [])
    .map((item) => {
      const detail = Array.isArray(item?.info?.detail) ? item.info.detail.join(' ') : item?.info?.detail
      const text = stripHtml(detail)
      return item?.label && text ? `${item.label}：${text}` : ''
    })
    .filter(Boolean)
    .join(' ')
  const agendaSummary = agendaTopics.slice(0, 4).join('、')

  return [
    {
      question: '2026 人資長論壇在談什麼？',
      answer: `本屆論壇聚焦 AI 助力、財務自立與健康福利三大面向，討論企業如何在高齡化與缺工壓力下打造更具韌性的人才競爭力。${agendaSummary ? ` 亮點議題包含 ${agendaSummary}。` : ''}`
    },
    {
      question: '活動時間與地點在哪裡？',
      answer: `論壇將於 ${schedule.dateText || '2026/4/29'} 舉行，活動時間為 ${schedule.timeText || '09:30 ~ 16:50'}。地點在 ${locationName}${locationText ? `，地址為 ${locationText}。` : '。'}`
    },
    {
      question: '誰適合參加 2026 人資長論壇？',
      answer: audienceText || '歡迎人力資源管理主管、財務主管、管理部門人員，以及對人才永續、AI 應用與企業健康福利議題有興趣的參與者報名。'
    },
    {
      question: '活動費用與報名方式是什麼？',
      answer: `本活動免費參加，需事先線上報名並採審核制。${registrationText || '活動人數及座位有限，主辦單位保有最終審核權。'}`
    },
    {
      question: '怎麼知道自己是否報名成功？',
      answer: '審核通過後，報名者會在報名後 5 個工作天內收到 email 與簡訊通知，活動前 1 至 3 天也會再收到報到序號簡訊。'
    },
    {
      question: '前往會場有哪些交通方式？',
      answer: transportSummary || '可搭乘高鐵、客運與市區公車前往陽明交通大學光復校區，校內停車區分散，建議提早抵達。'
    }
  ]
}

function normalizeSpeakers(speakers) {
  const speakerList = Array.isArray(speakers?.data) ? speakers.data : Array.isArray(speakers) ? speakers : []

  return speakerList
    .map((speaker) => ({
      '@type': 'Person',
      name: stripHtml(speaker?.name),
      jobTitle: stripHtml(speaker?.title)
    }))
    .filter((speaker) => speaker.name)
}

export function createSeoPayload({ infoData, speakers }) {
  const signUpContent = getContentBy(infoData, (item) => item.cmsType === 'signUp' || item.titleEn === 'sign up')
  const trafficVenue = getTrafficVenue(infoData)
  const agendaTopics = getAgendaTopics(infoData)
  const schedule = parseEventSchedule(signUpContent)
  const faqs = buildFaqs({ signUpContent, schedule, trafficVenue, agendaTopics })
  const speakerEntities = normalizeSpeakers(speakers)
  const ogImageUrl = new URL(siteConfig.ogImageName, siteConfig.canonicalUrl).toString()
  const organizationId = `${siteConfig.canonicalUrl}#organization`
  const websiteId = `${siteConfig.canonicalUrl}#website`
  const webpageId = `${siteConfig.canonicalUrl}#webpage`
  const eventId = `${siteConfig.canonicalUrl}#event`
  const faqId = `${siteConfig.canonicalUrl}#faq`
  const locationName = [trafficVenue.title, trafficVenue.subTitle].filter(Boolean).join(' ')
  const locationAddress = stripHtml(trafficVenue.location)

  return {
    title: siteConfig.title,
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    canonicalUrl: siteConfig.canonicalUrl,
    ogImageUrl,
    ogImageAlt: siteConfig.ogImageAlt,
    siteName: siteConfig.siteName,
    locale: siteConfig.locale,
    language: siteConfig.language,
    themeColor: siteConfig.themeColor,
    author: siteConfig.organizationName,
    faqs,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': organizationId,
        name: siteConfig.organizationName,
        url: siteConfig.organizationUrl,
        logo: {
          '@type': 'ImageObject',
          url: siteConfig.organizationLogo
        },
        sameAs: siteConfig.sameAs
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': websiteId,
        url: siteConfig.canonicalUrl,
        name: siteConfig.siteName,
        description: siteConfig.description,
        inLanguage: siteConfig.language,
        publisher: {
          '@id': organizationId
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': webpageId,
        url: siteConfig.canonicalUrl,
        name: siteConfig.title,
        description: siteConfig.description,
        inLanguage: siteConfig.language,
        isPartOf: {
          '@id': websiteId
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: ogImageUrl
        },
        about: agendaTopics,
        mainEntity: {
          '@id': eventId
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Event',
        '@id': eventId,
        name: siteConfig.title,
        description: siteConfig.description,
        url: siteConfig.canonicalUrl,
        image: [ogImageUrl],
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        inLanguage: siteConfig.language,
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        about: agendaTopics,
        location: {
          '@type': 'Place',
          name: locationName || '陽明交通大學 國際會議廳',
          sameAs: trafficVenue.locationUrl?.url,
          address: {
            '@type': 'PostalAddress',
            streetAddress: locationAddress,
            addressLocality: '新竹市',
            addressCountry: 'TW'
          }
        },
        organizer: {
          '@id': organizationId
        },
        performer: speakerEntities,
        offers: {
          '@type': 'Offer',
          url: `${siteConfig.canonicalUrl}#signUp`,
          price: '0',
          priceCurrency: 'TWD',
          availability: 'https://schema.org/InStock'
        }
      },
      siteConfig.enableFaqSchema
        ? {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            '@id': faqId,
            url: `${siteConfig.canonicalUrl}#faq`,
            mainEntity: faqs.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer
              }
            }))
          }
        : null,
      speakerEntities.length
        ? {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            '@id': `${siteConfig.canonicalUrl}#speakers`,
            name: '2026人資長論壇講者陣容',
            itemListElement: speakerEntities.map((speaker, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: speaker
            }))
          }
        : null
    ].filter(Boolean)
  }
}

export function buildIndexHtmlSeoTags(seoPayload) {
  const metaTags = [
    { tag: 'title', children: seoPayload.title },
    { tag: 'meta', attrs: { name: 'description', content: seoPayload.description } },
    { tag: 'meta', attrs: { name: 'keywords', content: seoPayload.keywords.join(', ') } },
    {
      tag: 'meta',
      attrs: {
        name: 'robots',
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      }
    },
    { tag: 'meta', attrs: { name: 'author', content: seoPayload.author } },
    { tag: 'meta', attrs: { name: 'theme-color', content: seoPayload.themeColor } },
    { tag: 'meta', attrs: { property: 'og:locale', content: seoPayload.locale } },
    { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
    { tag: 'meta', attrs: { property: 'og:site_name', content: seoPayload.siteName } },
    { tag: 'meta', attrs: { property: 'og:title', content: seoPayload.title } },
    { tag: 'meta', attrs: { property: 'og:description', content: seoPayload.description } },
    { tag: 'meta', attrs: { property: 'og:url', content: seoPayload.canonicalUrl } },
    { tag: 'meta', attrs: { property: 'og:image', content: seoPayload.ogImageUrl } },
    { tag: 'meta', attrs: { property: 'og:image:alt', content: seoPayload.ogImageAlt } },
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
    { tag: 'meta', attrs: { name: 'twitter:title', content: seoPayload.title } },
    { tag: 'meta', attrs: { name: 'twitter:description', content: seoPayload.description } },
    { tag: 'meta', attrs: { name: 'twitter:image', content: seoPayload.ogImageUrl } },
    { tag: 'link', attrs: { rel: 'canonical', href: seoPayload.canonicalUrl } },
    {
      tag: 'link',
      attrs: { rel: 'alternate', hreflang: 'zh-TW', href: seoPayload.canonicalUrl }
    },
    {
      tag: 'link',
      attrs: { rel: 'alternate', hreflang: 'x-default', href: seoPayload.canonicalUrl }
    }
  ].map((tag) => ({
    ...tag,
    injectTo: 'head'
  }))

  const structuredDataTags = seoPayload.structuredData.map((item, index) => ({
    tag: 'script',
    attrs: {
      type: 'application/ld+json',
      'data-seo-json-ld': `static-${index}`
    },
    children: JSON.stringify(item),
    injectTo: 'head'
  }))

  return [...metaTags, ...structuredDataTags]
}

export function createSitemapXml({ canonicalUrl, lastmod }) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '  <url>',
    `    <loc>${escapeXml(canonicalUrl)}</loc>`
  ]

  if (lastmod) {
    lines.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`)
  }

  lines.push('    <changefreq>weekly</changefreq>')
  lines.push('    <priority>1.0</priority>')
  lines.push('  </url>')
  lines.push('</urlset>')

  return `${lines.join('\n')}\n`
}

export function createRobotsTxt({ canonicalUrl }) {
  const sitemapUrl = new URL('sitemap.xml', canonicalUrl).toString()

  return `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`
}
