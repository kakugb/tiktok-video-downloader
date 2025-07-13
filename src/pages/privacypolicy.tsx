'use client';
import { Metadata } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const metadata: Metadata = {
  title: 'Privacy Policy | Tmate.cc',
  description: 'Learn how Tmate.cc handles your personal and non-personal information, cookies, and data usage in our Privacy Policy.',
  keywords: 'privacy policy, Tmate.cc, TikTok video downloader, data protection, cookies, user information',
  robots: 'index, follow',
  openGraph: {
    title: 'Privacy Policy | Tmate.cc',
    description: 'Understand Tmate.cc’s Privacy Policy, including how we handle personal information, cookies, and advertising data.',
    url: 'https://www.tmate.cc/privacy-policy',
    type: 'website',
    siteName: 'Tmate.cc',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | Tmate.cc',
    description: 'Review Tmate.cc’s Privacy Policy to learn about data handling, cookies, and user privacy.',
  },
};

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation('privacypolicy');

  // Fallback function to handle missing translations
  const translate = (key: string, fallback: string = key) => t(key) || fallback;

  return (
    <section className="bg-gray-50 text-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-teal-600 mb-4">
            {translate('title', 'Privacy Policy')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {translate('description', 'Learn about our privacy practices.')}
          </p>
          <p className="text-base text-gray-500 mt-2">
            {translate('last_revised', 'Last Revised')}: <span className="font-medium">{translate('revision_date', 'Unknown')}</span>
          </p>
        </header>

        <article className="space-y-12 text-base sm:text-lg leading-relaxed bg-white p-8 rounded-lg shadow-lg">
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-teal-500 mb-4">
              {translate('intro_title', 'Introduction')}
            </h2>
            <p>{translate('intro')}</p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-teal-500 mb-4">
              {translate('personal_info_title', 'Personal Identification Information')}
            </h2>
            <p>{translate('personal_info')}</p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-teal-500 mb-4">
              {translate('non_personal_info_title', 'Non-Personal Identification Information')}
            </h2>
            <p>{translate('non_personal_info')}</p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-teal-500 mb-4">
              {translate('cookies_title', 'Web Browser Cookies')}
            </h2>
            <p>{translate('cookies')}</p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-teal-500 mb-4">
              {translate('data_usage_title', 'How We Use Collected Information')}
            </h2>
            <p>{translate('data_usage')}</p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-teal-500 mb-4">
              {translate('advertising_title', 'Advertising')}
            </h2>
            <p>{translate('advertising')}</p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-teal-500 mb-4">
              {translate('google_adsense_title', 'Google AdSense')}
            </h2>
            <p>
              {translate('google_adsense').split('https://policies.google.com/technologies/ads')[0]}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-500 hover:text-teal-600 hover:underline transition-all duration-200"
              >
                https://policies.google.com/technologies/ads
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-teal-500 mb-4">
              {translate('policy_changes_title', 'Changes to This Privacy Policy')}
            </h2>
            <p>{translate('policy_changes')}</p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-teal-500 mb-4">
              {translate('acceptance_title', 'Your Acceptance of These Terms')}
            </h2>
            <p>{translate('acceptance')}</p>
          </section>
        </article>
      </div>
    </section>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'privacypolicy'])),
    },
  };
}

export default PrivacyPolicy;