import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CuelumeBind } from "@/components/CuelumeBind";
import { MotionProvider } from "@/components/MotionProvider";
import { CtfPanel } from "@/components/ctf/CtfPanel";
import { SignalProvider } from "@/components/signal/SignalProvider";
import { site } from "@/data/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  metadataBase: new URL(site.url),
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    images: [
      {
        url: "/og-social-preview.jpg",
        width: 1200,
        height: 630,
        alt: site.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/og-social-preview.jpg"],
  },
};

const themeInitScript = `(()=>{try{var k="gd-theme";var a=["mono","signal"];var t=localStorage.getItem(k);document.documentElement.dataset.theme=(t&&a.indexOf(t)>=0)?t:"mono";}catch(e){document.documentElement.dataset.theme="mono";}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="mono"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-background text-description">
        <div
          hidden
          dangerouslySetInnerHTML={{
            __html:
              "<!-- flag{read_the_source} · four more. press the radio icon. -->",
          }}
        />
        <MotionProvider>
          <SignalProvider>
            <CuelumeBind />
            <CtfPanel />
            <div id="app-root" className="flex min-h-full flex-col">
              {children}
            </div>
          </SignalProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
