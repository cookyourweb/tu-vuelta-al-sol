import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: 'es'
});

export const config = {
  // Skip all paths that aren't pages that should be internationalized
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
