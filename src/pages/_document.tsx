// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document'; // Document import'ını kaldırdık veya kullanmıyoruz

export default function MyDocument() { // Fonksiyon adını MyDocument olarak değiştirdik
  return (
    <Html lang="en">
      <Head>
        {/* Favicon ve apple-touch-icon, public klasörüne kopyalandığı için direkt "/" ile erişilir */}
        <link rel="icon" type="image/png" sizes="64x64" href="/assets/logo/pacific_mma_logo_circle.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/assets/logo/pacific_mma_logo_circle.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/logo/pacific_mma_logo_circle.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/logo/pacific_mma_logo_circle.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/logo/pacific_mma_logo_circle.png" />
        <link rel="shortcut icon" href="/assets/logo/pacific_mma_logo_circle.png" />

        {/* Mevcut index.html'den taşınan meta etiketleri */}
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
        {/* Manifest dosyasını bağlama */}
        <link rel="manifest" href="/manifest.json" />

        {/* DİKKAT: <title> etiketi buraya GELMEZ. Her sayfanın kendi <title> etiketi Next.js'in 'next/head' bileşeni ile sayfa içinde tanımlanır. */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}