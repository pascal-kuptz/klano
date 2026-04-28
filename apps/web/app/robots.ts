import type { MetadataRoute } from 'next';

// app.klano.ai is the auth-protected app — keep it out of search & AI crawlers.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', disallow: '/' }],
  };
}
