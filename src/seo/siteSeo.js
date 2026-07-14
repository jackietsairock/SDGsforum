export const siteConfig = {
  siteName: '2026SDGs永續城市交流論壇',
  title: '2026 SDGs永續城市交流論壇 | 幸福城市．永續治理',
  description:
    '由《今周刊》及新北市主辦「2026 SDGs永續城市交流論壇」，邀集中央部會、地方首長及各縣市局處代表，共同探討智慧治理、城市韌性與永續發展，透過首長圓桌對談及創新治理案例分享，促進跨域交流與政策借鏡。公務人員全程參與可申請終身學習時數。',
  keywords: [
    '幸福城市',
    '永續治理',
    '城市治理',
    '智慧治理',
    '城市韌性',
    'SDGs',
    '永續發展',
    '地方治理',
    '公共政策',
    '跨域合作',
    '城市創新',
    '縣市首長論壇',
    '公務人員研習',
    '公務人員終身學習',
    '今周刊',
    '永續城市SDGs大調查'
  ],
  language: 'zh-Hant-TW',
  locale: 'zh_TW',
  canonicalUrl: 'https://events.businesstoday.com.tw/2026/SDGsforum/',
  themeColor: '#0f7f83',
  ogImageName: 'fb-share.jpg',
  ogImageAlt: '2026 SDGs永續城市交流論壇活動主視覺',
  organizationName: '今周刊 Business Today',
  organizationUrl: 'https://www.businesstoday.com.tw/',
  organizationLogo: 'https://events.businesstoday.com.tw/2026/SDGsforum/favicon.png',
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

function parseEventSchedule(eventContent = {}) {
  const eventInfo = Array.isArray(eventContent.event_info) ? eventContent.event_info : []
  const dateItem = eventInfo.find((item) => ['活動時間', '日期'].includes(item.label)) ?? {}
  const dateText = stripHtml(dateItem.title)
  const timeText = stripHtml(dateItem.detail)

  const dateMatch = dateText.match(/(\d{4})(?:\/|年)(\d{1,2})(?:\/|月)(\d{1,2})/)
  const timeMatch = timeText.match(/(\d{1,2}:\d{2})\s*(?:~|-|–|—)\s*(\d{1,2}:\d{2})/)
  const dateParts = dateMatch
    ? { year: dateMatch[1], month: dateMatch[2], day: dateMatch[3] }
    : { year: '2026', month: '8', day: '4' }

  return {
    dateText,
    timeText,
    startDate: toIsoDate(dateParts, timeMatch?.[1] ?? '13:30'),
    endDate: toIsoDate(dateParts, timeMatch?.[2] ?? '16:30')
  }
}

function getTrafficVenue(infoData) {
  const trafficContent = getContentBy(infoData, (item) => item.cmsType === 'traffic' || item.titleEn === 'traffic')
  return trafficContent?.trafficInfo?.info?.[0] ?? {}
}

function getEventVenue(eventContent, trafficVenue) {
  const eventInfo = Array.isArray(eventContent?.event_info) ? eventContent.event_info : []
  const locationItem = eventInfo.find((item) => ['活動地點', '地點'].includes(item.label)) ?? {}
  const locationName = stripHtml(locationItem.title) || stripHtml(trafficVenue.title)
  const locationAddress = stripHtml(locationItem.detail || trafficVenue.location)
    .replace(/^[（(]|[）)]$/g, '')

  return { locationName, locationAddress }
}

const eventTopics = [
  '智慧治理',
  '城市韌性',
  '永續發展',
  '地方治理',
  '公共政策',
  '跨域合作',
  '城市創新'
]

function buildFaqs({ signUpContent, schedule, venue, trafficVenue }) {
  const signUpInfo = Array.isArray(signUpContent?.signUp_info) ? signUpContent.signUp_info : []
  const registrationText = stripHtml(signUpInfo[1]?.detail)
  const transportSummary = (trafficVenue.description ?? [])
    .map((item) => {
      const detail = Array.isArray(item?.info?.detail) ? item.info.detail.join(' ') : item?.info?.detail
      const text = stripHtml(detail)
      return item?.label && text ? `${item.label}：${text}` : ''
    })
    .filter(Boolean)
    .join(' ')

  return [
    {
      question: '2026 SDGs永續城市交流論壇在談什麼？',
      answer: '論壇以「幸福城市．永續治理」為核心，邀集中央部會、地方首長及各縣市治理團隊，透過首長圓桌對談與創新治理案例分享，促進城市間的經驗交流與跨域合作。'
    },
    {
      question: '活動時間與地點在哪裡？',
      answer: `論壇將於 ${schedule.dateText || '2026 年 8 月 4 日（二）'} 舉行，活動時間為 ${schedule.timeText || '13:30 ~ 16:30（13:00 開放報到）'}。地點在 ${venue.locationName || '新光人壽新板金融大樓 17F 會議廳'}${venue.locationAddress ? `，地址為 ${venue.locationAddress}。` : '。'}`
    },
    {
      question: '論壇聚焦哪些城市治理議題？',
      answer: `核心議題包括 ${eventTopics.join('、')}，期望透過政策經驗與實務案例交流，共同打造更具韌性、更永續且更幸福的城市。`
    },
    {
      question: '誰適合參加永續城市交流論壇？',
      answer: '歡迎中央與地方政府團隊、縣市首長與局處代表、公務人員，以及關心 SDGs、永續發展、公共政策與城市創新的實務工作者報名參加。'
    },
    {
      question: '參加論壇可以申請公務人員終身學習時數嗎？',
      answer: '可以。公務人員全程參與本論壇可申請終身學習時數，實際認證方式與時數以主辦單位現場公告為準。'
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
      answer: transportSummary || '可搭乘捷運、臺鐵或高鐵至板橋站，步行約 3 至 5 分鐘即可抵達新光人壽新板金融大樓。'
    }
  ]
}

export function createSeoPayload({ infoData }) {
  const eventContent = getContentBy(infoData, (item) => item.cmsType === 'agenda' || Array.isArray(item.event_info))
  const signUpContent = getContentBy(infoData, (item) => item.cmsType === 'signUp' || item.titleEn === 'sign up')
  const trafficVenue = getTrafficVenue(infoData)
  const schedule = parseEventSchedule(eventContent)
  const venue = getEventVenue(eventContent, trafficVenue)
  const faqs = buildFaqs({ signUpContent, schedule, venue, trafficVenue })
  const ogImageUrl = new URL(siteConfig.ogImageName, siteConfig.canonicalUrl).toString()
  const organizationId = `${siteConfig.canonicalUrl}#organization`
  const websiteId = `${siteConfig.canonicalUrl}#website`
  const webpageId = `${siteConfig.canonicalUrl}#webpage`
  const eventId = `${siteConfig.canonicalUrl}#event`
  const faqId = `${siteConfig.canonicalUrl}#faq`

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
        about: eventTopics,
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
        about: eventTopics,
        location: {
          '@type': 'Place',
          name: venue.locationName || '新光人壽新板金融大樓 17F 會議廳',
          ...(trafficVenue.locationUrl?.url ? { sameAs: trafficVenue.locationUrl.url } : {}),
          address: {
            '@type': 'PostalAddress',
            streetAddress: venue.locationAddress,
            addressLocality: '新北市',
            addressCountry: 'TW'
          }
        },
        organizer: [
          {
            '@id': organizationId
          },
          {
            '@type': 'GovernmentOrganization',
            name: '新北市'
          }
        ],
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
