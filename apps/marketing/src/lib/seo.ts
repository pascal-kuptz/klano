export const SITE = {
  name: 'Klano',
  domain: 'klano.ai',
  url: 'https://klano.ai',
  appUrl: 'https://app.klano.ai',
  defaultLocale: 'de',
  locales: ['de', 'en'] as const,
  twitter: '@klanoai',
  ogImage: '/og/default.png',
  description: {
    de: 'Klano ist der digitale Bandkollege. Booking, Koordination, Follow-ups — automatisiert, damit Musiker wieder Musiker sein können.',
    en: "Klano is the digital bandmate. Booking, coordination, follow-ups — automated, so musicians can be musicians again.",
  },
  tagline: {
    de: 'Make musicians be musicians.',
    en: 'Make musicians be musicians.',
  },
} as const;

export type Locale = (typeof SITE.locales)[number];

export function localizedUrl(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === SITE.defaultLocale) return `${SITE.url}${clean}`;
  return `${SITE.url}/${locale}${clean}`;
}

/**
 * Schema.org Organization — emitted on every page.
 * @see https://schema.org/Organization
 */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.url}#organization`,
    name: SITE.name,
    url: SITE.url,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE.url}/brand/logo.png`,
    },
    sameAs: [
      // fill in once social profiles exist
    ],
    description: SITE.description.de,
    foundingLocation: {
      '@type': 'Country',
      name: 'CH',
    },
  };
}

/**
 * Schema.org SoftwareApplication for the Klano product.
 * @see https://schema.org/SoftwareApplication
 */
export function softwareApplicationJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${SITE.url}#software`,
    name: SITE.name,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Band Management',
    operatingSystem: 'Web',
    description: SITE.description[locale],
    url: SITE.appUrl,
    offers: [
      {
        '@type': 'Offer',
        name: 'Free',
        price: '0',
        priceCurrency: 'CHF',
        category: 'Subscription',
      },
      {
        '@type': 'Offer',
        name: 'Pro',
        price: '19',
        priceCurrency: 'CHF',
        category: 'Subscription',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '19',
          priceCurrency: 'CHF',
          billingDuration: 'P1M',
        },
      },
    ],
    inLanguage: ['de', 'en'],
    publisher: { '@id': `${SITE.url}#organization` },
  };
}

/**
 * Schema.org WebSite with SearchAction — helps Google understand site structure.
 */
export function websiteJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description[locale],
    inLanguage: locale,
    publisher: { '@id': `${SITE.url}#organization` },
  };
}
