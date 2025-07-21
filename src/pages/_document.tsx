// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document'; // Document import'ını kaldırdık veya kullanmıyoruz

export default function MyDocument() { // Fonksiyon adını MyDocument olarak değiştirdik
  return (
    <Html lang="en">
      <Head>
        {/* Favicon ve apple-touch-icon, public klasörüne kopyalandığı için direkt "/" ile erişilir */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" /> {/* Eğer logo192.png public'e kopyalandıysa */}

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