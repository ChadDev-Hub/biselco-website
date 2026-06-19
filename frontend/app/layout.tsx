import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DocNavigation from "./common/navigations/doc";
import Drawer from "./common/navigations/drawer";
import ThemeController from "./common/themeController";
import { WebsocketProvider } from "./utils/websocketprovider";
import { AuthProvider } from "./utils/authProvider";
import AlertComponent from "./common/alert";
import LoadingIndicator from "./common/loadingIndication";
import "react-datepicker/dist/react-datepicker.css";
import { NotificationProvider } from "./common/NotificationProvider";
import { getCurrentUser } from "@/lib/serverFetch";
import type { Viewport } from "next";
import "maplibre-gl/dist/maplibre-gl.css";
import PullToRefresh from "./common/PulltoRefresh";
import "@geoman-io/maplibre-geoman-free/dist/maplibre-geoman.css";

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
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://biselco79.com"),

  // Basic SEO
  title: "BISELCO",
  description: "Electric service updates and complaints system",

  keywords: [
    "BISELCO",
    "Busuanga",
    "Culion",
    "Linapacan",
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
    "Consumer",
    "General Membership Assembly Meeting",
    "AGMA",
    "Busuanga Island Electric Cooperative",
  ],

  authors: [{ name: "Richard Rojo Jr." }],
  creator: "Richard Rojo Jr.",
  publisher: "Busuanga Island Electric Cooperative",

  // Canonical URL
  alternates: {
    canonical: "/",
  },

  // Open Graph (Facebook, Messenger, LinkedIn, etc.)
  openGraph: {
    title: "BISELCO",
    description: "Electric service updates and complaints system",
    url: "https://biselco79.com",
    siteName: "BISELCO",
    images: [
      {
        url: "https://biselco79.com/preview.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "BISELCO",
    description: "Manage services and complaints",
    images: ["https://biselco79.com/preview.png"],
  },

  // Icons (favicon, apple touch, etc.)

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
  verification: {
    google: "2z-_wr556xHUKfue5FKHEcGNi-q7yY2AG-QPnfonPz4",
  },

  // App links (optional, for mobile deep linking)
  appLinks: {
    web: {
      url: "https://biselco79.com",
    },
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();
  return (
    <html lang="en" data-scroll-behavior="smooth" className="scroll-smooth">
      <head>
        <meta name="apple-mobile-web-app-title" content="BISELCO" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  `}
      >
        <AuthProvider initialUser={currentUser.detail}>
          <WebsocketProvider>
            <AlertComponent>
              <LoadingIndicator>
                <ThemeController />
                <NotificationProvider>
                  <Drawer baseurl={baseurl}>
                    <PullToRefresh>{children}</PullToRefresh>
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
