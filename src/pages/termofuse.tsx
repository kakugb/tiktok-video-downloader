import { Metadata } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const metadata: Metadata = {
  title: 'Terms of Service | Tmate.cc',
  description: 'Review the Terms of Service for Tmate.cc. Understand your rights, responsibilities, and legal disclaimers when using our TikTok Video Downloader website.',
  keywords: 'terms of service, Tmate.cc, TikTok video downloader, website usage, legal agreement, user responsibilities',
  robots: 'index, follow',
  openGraph: {
    title: 'Terms of Service | Tmate.cc',
    description: 'Learn about the terms and conditions for using Tmate.cc, including user rights, responsibilities, and legal disclaimers.',
    url: 'https://www.tmate.cc/terms-of-service',
    type: 'website',
    siteName: 'Tmate.cc',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | Tmate.cc',
    description: 'Understand the terms and conditions for using Tmate.cc’s TikTok Video Downloader services.',
  },
};

const TermOfUse: React.FC = () => {
  const { t } = useTranslation('termofuse');

  return (
    <section className="bg-gray-50 text-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-teal-600 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </header>

        <article className="space-y-12 text-base sm:text-lg leading-relaxed bg-white p-8 rounded-lg shadow-lg">
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-teal-500 mb-4">
              {t('agreement_title')}
            </h2>
            <p>{t('agreement_description')}</p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-teal-500 mb-4">
              {t('license_title')}
            </h2>
            <p>{t('license_description')}</p>
            <ul className="list-disc pl-6 space-y-3 mt-4">
              <li>{t('license_restriction_1')}</li>
              <li>{t('license_restriction_2')}</li>
              <li>{t('license_restriction_3')}</li>
              <li>{t('license_restriction_4')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-teal-500 mb-4">
              {t('disclaimer_title')}
            </h2>
            <p>{t('disclaimer_description')}</p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-teal-500 mb-4">
              {t('limitations_title')}
            </h2>
            <p>{t('limitations_description')}</p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-teal-500 mb-4">
              {t('revisions_title')}
            </h2>
            <p>{t('revisions_description')}</p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-teal-500 mb-4">
              {t('links_title')}
            </h2>
            <p>{t('links_description')}</p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-teal-500 mb-4">
              {t('modifications_title')}
            </h2>
            <p>{t('modifications_description')}</p>
          </section>
        </article>
      </div>
    </section>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'termofuse'])),
    },
  };
}

export default TermOfUse;