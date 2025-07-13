'use client';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';

const Footer: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <footer className="bg-gray-50 text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-bold text-teal-600 mb-4 ">
              {t('legal', 'Legal')}
            </h3>
            <nav aria-label="Legal navigation">
              <ul className="space-y-3 text-gray-600">
                <li>
                  <Link
                    href="/privacypolicy"
                    className="text-base font-semibold hover:text-teal-500 hover:underline hover:scale-105 transition-all duration-200"
                    rel="nofollow"
                  >
                    {t('privacyPolicy', 'Privacy Policy')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/termofuse"
                    className="text-base font-semibold hover:text-teal-500 hover:underline hover:scale-105 transition-all duration-200"
                    rel="nofollow"
                  >
                    {t('termsOfUse', 'Terms of Use')}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-teal-600 mb-4">
              {t('support', 'Support')}
            </h3>
            <nav aria-label="Support navigation">
              <ul className="space-y-3 text-gray-600">
                <li>
                  <Link
                    href="/contactus"
                    className="text-base font-semibold hover:text-teal-500 hover:underline hover:scale-105 transition-all duration-200"
                  >
                    {t('contactUs', 'Contact Us')}
                  </Link>
                </li>
                
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-teal-600 mb-4">
              {t('connect', 'Connect With Us')}
            </h3>
            <nav aria-label="Social media navigation">
              <ul className="flex justify-center md:justify-start space-x-4">
                <li>
                  <a
                    href="https://twitter.com/tmatesite"
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
                    href="https://instagram.com/tmatesite"
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
                    href="https://facebook.com/tmatesite"
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
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm mt-12 text-gray-500 border-t border-gray-200 pt-6">
          © 2025 Tmate.cc — {t('poweredBy', 'Powered by Tmate')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;