// pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Layout } from '../src/components/layout/Layout';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
