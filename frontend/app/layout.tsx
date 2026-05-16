import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DocNavigation from "./common/doc";
import Drawer from "./common/drawer";
import ThemeController from "./common/themeController";
import { WebsocketProvider } from "./utils/websocketprovider";
import { AuthProvider } from "./utils/authProvider";
import AlertComponent from "./common/alert";
import LoadingIndicator from "./common/loadingIndication";
import "react-datepicker/dist/react-datepicker.css";
import { NotificationProvider } from "./common/NotificationProvider";
import { getCurrentUser } from '@/lib/serverFetch';
import type { Viewport } from "next"


const baseurl = process.env.BASESERVERURL;
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
  userScalable: false
}

export const metadata: Metadata = {
  metadataBase: new URL("https://biselco.calamianes.cloud"),

  // Basic SEO
  title: "BISELCO",
  description:
    "App for BISELCO - Manage services, complaints, and updates بسهولة.",

  keywords: [
    "BISELCO",
    "Coron",
    "Palawan",
    "electricity",
    "electricity services",
    "electricity service",
    "electricity service provider",
    "electric cooperative",
    "complaints system",
    "utilities",
    "Philippines",
  ],

  authors: [{ name: "Richard Rojo" }],
  creator: "Richard Rojo Jr.",
  publisher: "Busuanga Island Electric Cooperative",

  // Canonical URL
  alternates: {
    canonical: "/",
  },

  // Open Graph (Facebook, Messenger, LinkedIn, etc.)
  openGraph: {
    title: "BISELCO",
    description: "App for BISELCO - Manage services and complaints",
    url: "https://biselco.calamianes.cloud",
    siteName: "BISELCO",
    images: [
      {
        url: "https://biselco.calamianes.cloud/biselco-icon.png",
        width: 1200,
        height: 630,
        alt: "BISELCO App Preview",
      },
    ],
    locale: "en_PH",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "BISELCO",
    description: "Manage services and complaints",
    images: ["https://biselco.calamianes.cloud/biselco-icon.png"],
  },

  // Icons (favicon, apple touch, etc.)
  icons: {
    icon: [{ url: "/biselco-icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png" }],
  },

  // PWA / Mobile
  manifest: "/manifest.webmanifest",

  // Robots (SEO indexing rules)
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification (Google Search Console, etc.)
  // verification: {
  //   google: "your-google-verification-code",
  // },

  // App links (optional, for mobile deep linking)
  appLinks: {
    web: {
      url: "https://biselco.calamianes.cloud",
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUSER = await getCurrentUser();
  return (
    <html lang="en" data-scroll-behavior="smooth" className="scroll-smooth">
      <head>
        <meta name="apple-mobile-web-app-title" content="BISELCO" />

      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >

        <AuthProvider initialUser={currentUSER?.detail}>
          <WebsocketProvider>
            <AlertComponent>
              <LoadingIndicator>
                <ThemeController />
                <NotificationProvider>
                  <Drawer baseurl={baseurl}>
                    {children}
                    <DocNavigation />
                  </Drawer>
                </NotificationProvider>
              </LoadingIndicator>
            </AlertComponent>
          </WebsocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
