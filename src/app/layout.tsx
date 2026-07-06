import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Rethink_Sans, Poppins, Space_Mono, Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";
import { Footer, Navbar } from "./components/layout";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { getNewsletters } from "@/lib/ghost/admin";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rethinkSans = Rethink_Sans({
  variable: "--font-rethink-sans",
  subsets: ["latin"],
  weight: ["400"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vinteum.org"),
  title: "Vinteum",
  description: "Vinteum - Open Source Bitcoin Development",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Vinteum",
    description: "Vinteum - Open Source Bitcoin Development",
    url: "https://vinteum.org",
    siteName: "Vinteum",
    type: "website",
    locale: "en_US",
    images: [{ url: "/assets/images/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vinteum",
    description: "Vinteum - Open Source Bitcoin Development",
    site: "@vinteum_org",
    creator: "@vinteum_org",
    images: ["/assets/images/og-image.png"],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Vinteum",
  url: "https://vinteum.org",
  logo: "https://vinteum.org/assets/logos/vinteum.svg",
  description: "Vinteum - Open Source Bitcoin Development",
  sameAs: [
    "https://twitter.com/vinteum_org",
    "https://instagram.com/vinteum_org",
    "https://www.linkedin.com/company/vinteum-org/",
    "https://discord.gg/vinteum",
    "https://njump.me/npub13s0kzccx2g7pnwwt5mjuwttl3m74t9qxyr6q7f9978e98tyjrw3qvx5g70",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Vinteum",
  url: "https://vinteum.org",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const newsletters = await getNewsletters().catch(() => []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${rethinkSans.variable} ${poppins.variable} ${spaceMono.variable} ${barlowCondensed.variable} ${inter.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Script
          defer
          src="https://analytics.seven.sx/script.js"
          data-website-id="466bc9e9-a42f-4148-982e-a86342049f79"
          strategy="afterInteractive"
        />
        <LanguageProvider>
          <Navbar />
          <main className="overflow-x-hidden">{children}</main>
          <Footer newsletters={newsletters} />
        </LanguageProvider>
      </body>
    </html>
  );
}
