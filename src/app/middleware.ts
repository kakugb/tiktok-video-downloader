import { NextRequest, NextResponse } from 'next/server';

// List of supported locales
const supportedLocales = ['en', 'de', 'id', 'uk', 'ko', 'ja', 'pl', 'ar', 'nl', 'tr', 'pt', 'it', 'es', 'fr'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip paths that already have a supported locale prefix
  if (supportedLocales.some((locale) => pathname.startsWith(`/${locale}`))) {
    return NextResponse.next();
  }

  // Read Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  let detectedLocale = 'en';

  if (acceptLanguage) {
    const acceptedLangs = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().slice(0, 2)); // Get 2-letter language codes

    detectedLocale = acceptedLangs.find((lang) => supportedLocales.includes(lang)) || 'en';
  }

  // Redirect to the detected locale
  return NextResponse.redirect(new URL(`/${detectedLocale}${pathname}`, request.url));
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|locales|api).*)'], // Exclude internal paths
};
