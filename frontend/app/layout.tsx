
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getLandingPageData } from "../lib/serverFetch";
import DocNavigation from "./common/doc";
import Drawer from "./common/drawer";
import ThemeController from "./common/themeController";
import { WebsocketProvider } from "./utils/websocketprovider";
import { AuthProvider } from "./utils/authProvider";
import { getCurrentUser } from "../lib/serverFetch";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AlertComponent from "./common/alert";
import LoadingIndicator from "./common/loadingIndication";
import "react-datepicker/dist/react-datepicker.css";
import { NotificationProvider } from "./common/NotificationProvider";
const baseurl = process.env.BASESERVERURL
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://biselco.com"),

  // Basic SEO
  title: {
    default: "BISELCO",
    template: "%s | BISELCO",
  },
  description: "App for BISELCO - Manage services, complaints, and updates بسهولة.",

  keywords: [
    "BISELCO",
    "electric cooperative",
    "complaints system",
    "utilities",
    "Philippines",
  ],

  authors: [{ name: "Richard Rojo" }],
  creator: "Richard Rojo Jr.",
  publisher: "BISELCO",

  // Canonical URL
  alternates: {
    canonical: "/",
  },

  // Open Graph (Facebook, Messenger, LinkedIn, etc.)
  openGraph: {
    title: "BISELCO",
    description: "App for BISELCO - Manage services and complaints بسهولة.",
    url: "https://biselco.com",
    siteName: "BISELCO",
    images: [
      {
        url: "/og-image.png", // will resolve to https://biselco.com/og-image.png
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
    description: "Manage BISELCO services and complaints بسهولة.",
    images: ["/og-image.png"],
    creator: "@biselco", // optional
  },

  // Icons (favicon, apple touch, etc.)
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png" },
    ],
  },

  // PWA / Mobile
  // manifest: "/site.webmanifest",

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
    google: "your-google-verification-code",
  },

  // App links (optional, for mobile deep linking)
  appLinks: {
    web: {
      url: "https://biselco.com",
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getLandingPageData()
  const user = await getCurrentUser()
  const googleClient = process.env.GOOGLE_CLIENT_ID
  return (
    <html lang="en" data-scroll-behavior="smooth" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased `}>
      <AuthProvider initialUser={user.status === 200 ?   user.detail : null}>
        <GoogleOAuthProvider clientId={googleClient ?? ""}>
          <WebsocketProvider>
            <AlertComponent>
              <LoadingIndicator>
              <ThemeController />
              <NotificationProvider>
                <Drawer baseurl={baseurl} title={data.hero.title}>
                  {children}
                  <DocNavigation />
                </Drawer>
              </NotificationProvider>
              </LoadingIndicator>
            </AlertComponent>
          </WebsocketProvider>
        </GoogleOAuthProvider>
      </AuthProvider>
      </body>
    </html>
  );
}
