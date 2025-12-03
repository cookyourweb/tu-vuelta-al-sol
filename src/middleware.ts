import { NextRequest, NextResponse } from 'next/server';
import { locales } from './i18n';

function getPreferredLocale(acceptLanguage: string): string {
  // Parse Accept-Language header (e.g. "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7")
  const languages = acceptLanguage.split(',').map(lang => {
    const [locale, q = '1'] = lang.trim().split(';q=');
    return {
      locale: locale.split('-')[0], // Take primary language (pt-BR -> pt)
      quality: parseFloat(q)
    };
  }).sort((a, b) => b.quality - a.quality);

  // Check if user's preferred language is supported
  for (const lang of languages) {
    if (locales.includes(lang.locale as any)) {
      return lang.locale;
    }
  }

  // Default to Spanish
  return 'es';
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes, static files, etc.
  if (pathname.startsWith('/api') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/_vercel') ||
      pathname.includes('.')) {
    return NextResponse.next();
  }

  // Check if pathname already contains a locale
  const hasLocale = locales.some(locale =>
    pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (hasLocale) {
    return NextResponse.next();
  }

  // Detect user's preferred language from browser
  const acceptLanguage = request.headers.get('accept-language') || 'es';
  const preferredLocale = getPreferredLocale(acceptLanguage);

  // Redirect to the appropriate locale
  request.nextUrl.pathname = `/${preferredLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip all paths that aren't pages that should be internationalized
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
