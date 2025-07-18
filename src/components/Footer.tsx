'use client';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import Head from 'next/head';
import { GlobeAltIcon, ChatBubbleLeftIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
  const { t } = useTranslation('common');

  // Social media links from environment variables or defaults
  const socialLinks = {
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com/tmatesite',
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/tmatesite',
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com/tmatesite',
  };

  return (
    <footer className="bg-gray-50 text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Schema Markup for Organization */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Tmate',
              url: 'https://tmate.cc',
              logo: 'https://tmate.cc/logo.png',
              sameAs: [socialLinks.twitter, socialLinks.instagram, socialLinks.facebook],
            }),
          }}
        />
      </Head>

      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* Legal Section */}
          <div>
            <h3 className="text-2xl font-bold text-teal-600 mb-4">
              {t('legal', 'Legal')}
            </h3>
            <nav aria-label="Legal navigation">
              <ul className="space-y-3 text-gray-700">
                <li>
                  <Link
                    href="/privacypolicy"
                    className="text-base font-semibold hover:text-teal-500 hover:underline hover:scale-105 transition-all duration-200"
                  >
                    {t('privacyPolicy', 'Privacy Policy')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/termsofuse"
                    className="text-base font-semibold hover:text-teal-500 hover:underline hover:scale-105 transition-all duration-200"
                  >
                    {t('termsOfUse', 'Terms of Use')}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-2xl font-bold text-teal-600 mb-4">
              {t('support', 'Support')}
            </h3>
            <nav aria-label="Support navigation">
              <ul className="space-y-3 text-gray-700">
                <li>
                  <Link
                    href="/contactus"
                    className="text-base font-semibold hover:text-teal-500 hover:underline hover:scale-105 transition-all duration-200"
                  >
                    {t('contactUs', 'Contact Us')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-base font-semibold hover:text-teal-500 hover:underline hover:scale-105 transition-all duration-200"
                  >
                    {t('faq', 'FAQ')}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Explore Section */}
          <div>
            <h3 className="text-2xl font-bold text-teal-600 mb-4">
              {t('explore', 'Explore')}
            </h3>
            <nav aria-label="Explore navigation">
              <ul className="space-y-3 text-gray-700">
                <li>
                  <Link
                    href="/blog"
                    className="text-base font-semibold hover:text-teal-500 hover:underline hover:scale-105 transition-all duration-200"
                  >
                    {t('blog', 'Blog')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-to-download"
                    className="text-base font-semibold hover:text-teal-500 hover:underline hover:scale-105 transition-all duration-200"
                  >
                    {t('howToDownload', 'How to Download TikTok Videos')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sitemap"
                    className="text-base font-semibold hover:text-teal-500 hover:underline hover:scale-105 transition-all duration-200"
                  >
                    {t('sitemap', 'Sitemap')}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Connect Section */}
          <div>
            <h3 className="text-2xl font-bold text-teal-600 mb-4">
              {t('connect', 'Connect With Us')}
            </h3>
            <nav aria-label="Social media navigation">
              <ul className="flex justify-center md:justify-start space-x-4">
                <li>
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-teal-500 hover:scale-110 transition-all duration-200"
                    aria-label={t('followTwitter', 'Follow Tmate on Twitter for updates')}
                  >
                    <GlobeAltIcon className="h-6 w-6" />
                  </a>
                </li>
                <li>
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-teal-500 hover:scale-110 transition-all duration-200"
                    aria-label={t('followInstagram', 'Follow Tmate on Instagram for updates')}
                  >
                    <ChatBubbleLeftIcon className="h-6 w-6" />
                  </a>
                </li>
                <li>
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-teal-500 hover:scale-110 transition-all duration-200"
                    aria-label={t('followFacebook', 'Follow Tmate on Facebook for updates')}
                  >
                    <UserGroupIcon className="h-6 w-6" />
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm mt-12 text-gray-700 border-t border-gray-200 pt-6">
          © {new Date().getFullYear()} Tmate.cc — {t('poweredBy', 'Powered by Tmate')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;