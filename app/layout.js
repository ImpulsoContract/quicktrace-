import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Script from "next/script";
import UTMTracker from "@/components/UTMTracker";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "QuickTrace - Gestión Inteligente de Trazabilidad e Higiene Alimentaria",
  description: "Digitaliza tus registros de APPCC: Trazabilidad, Temperaturas, Limpieza y Calidad del Agua. Todo en una plataforma premium y fácil de usar.",
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <UTMTracker />
        <Providers>
          {children}
        </Providers>

        
        {/* Meta Pixel */}
        {process.env.META_PIXEL_ID && (
          <>
            <Script id="fb-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${process.env.META_PIXEL_ID}');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              <img height="1" width="1" style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${process.env.META_PIXEL_ID}&ev=PageView&noscript=1`}
              />
            </noscript>
          </>
        )}
        {/* Google Ads Tag */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18129247983"
          strategy="afterInteractive"
        />
        <Script id="google-ads-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18129247983', {
              'allow_enhanced_conversions': true
            });
          `}
        </Script>

        <Script 
          src="https://api.clientify.net/web-marketing/chatbots/script/294157.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
