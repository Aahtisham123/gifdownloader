import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope, Syne } from "next/font/google";
import { Suspense } from "react";
import { site } from "@/config/site";
import { themeBootScript } from "@/lib/theme";
import { Footer } from "@/components/layout/footer";
import { Header, HeaderShell } from "@/components/layout/header";
import { ThemeSync } from "@/components/layout/theme-toggle";
import "./globals.css";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const display = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    title: site.title,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f6fb" },
    { media: "(prefers-color-scheme: dark)", color: "#070a0f" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${sans.variable} ${display.variable} ${mono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        <ThemeSync />
        <Suspense fallback={<HeaderShell />}>
          <Header />
        </Suspense>
        <main id="content" className="flex flex-1 flex-col pt-[4.25rem]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
