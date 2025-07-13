import { appWithTranslation } from 'next-i18next';
import '../styles/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main >
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}

export default appWithTranslation(MyApp);