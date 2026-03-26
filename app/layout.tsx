import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ryyan Safar | Engineer & Innovator",
  description:
    "Ryyan Safar – Electronics & Communication Engineer. Building the future with robotics, embedded systems, and intelligent automation.",
  openGraph: {
    title: "Ryyan Safar | Portfolio",
    description: "Projects in robotics, embedded systems, automation, and leadership.",
    type: "website",
    url: "https://ryyansafar.site/",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

import Script from "next/script";

import { TransitionProvider } from "@/components/TransitionProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barrio&family=Bebas+Neue&family=Anton&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Q20DD4YFJJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Q20DD4YFJJ');
          `}
        </Script>

        <TransitionProvider>
          {children}
        </TransitionProvider>
        <Script src="/script.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
