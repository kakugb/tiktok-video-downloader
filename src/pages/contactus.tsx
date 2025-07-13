'use client';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Metadata } from 'next';
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us | SaveTT.cc',
  description: 'Contact SaveTT.cc for support, questions, or to report errors related to our TikTok Video Downloader services.',
  keywords: 'contact us, SaveTT.cc, TikTok video downloader, support, customer service, error reporting',
  robots: 'index, follow',
  openGraph: {
    title: 'Contact Us | SaveTT.cc',
    description: 'Reach out to SaveTT.cc for help or to report issues with our TikTok Video Downloader platform.',
    url: 'https://www.savett.cc/contactus',
    type: 'website',
    siteName: 'SaveTT.cc',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | SaveTT.cc',
    description: 'Contact SaveTT.cc for support or error reporting with our TikTok Video Downloader services.',
  },
};

const ContactUs: React.FC = () => {
  const { t } = useTranslation('contactus');

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

        <article className="bg-white p-8 rounded-lg shadow-lg space-y-8">
          <section className="text-base sm:text-lg text-gray-700">
            <p>
              {t('faq_instruction')}{' '}
              <Link
                href="/faq"
                className="text-teal-500 hover:text-teal-600 hover:underline transition-all duration-200"
              >
                {t('faq_link', 'FAQ')}
              </Link>
            </p>
            <p className="mt-6">
              {t('email_instruction')}{' '}
              <a
                href={`mailto:${t('email')}`}
                className="text-teal-500 hover:text-teal-600 hover:underline transition-all duration-200"
                aria-label={`Email ${t('email')}`}
              >
                {t('email')}
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-teal-500 mb-6">
              {t('connect_title')}
            </h2>
            <nav aria-label="Social media navigation">
              <ul className="flex justify-center space-x-6">
                <li>
                  <a
                    href="https://twitter.com/savettsite"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-teal-500 hover:scale-110 transition-all duration-200"
                    aria-label="Twitter"
                  >
                    <FaTwitter size={24} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com/savettsite"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-teal-500 hover:scale-110 transition-all duration-200"
                    aria-label="Instagram"
                  >
                    <FaInstagram size={24} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://facebook.com/savettsite"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-teal-500 hover:scale-110 transition-all duration-200"
                    aria-label="Facebook"
                  >
                    <FaFacebook size={24} />
                  </a>
                </li>
              </ul>
            </nav>
          </section>
        </article>
      </div>
    </section>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'contactus'])),
    },
  };
}

export default ContactUs;