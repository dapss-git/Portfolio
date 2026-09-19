import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// Resolve site URL dynamically for Vercel production or fallback
const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.VERCEL_URL ||
  "portfolio-daps.vercel.app";

const siteUrl = rawSiteUrl.startsWith("http")
  ? rawSiteUrl
  : `https://${rawSiteUrl}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Muhammad Dafa Pratama | Portfolio",
  description:
    "Portfolio resmi Muhammad Dafa Pratama — Siswa SMK Kelas XI AKL, Social Media Enthusiast & Digital Creator.",
  keywords: [
    "Muhammad Dafa Pratama",
    "Portfolio Dafa",
    "SMK XI AKL",
    "Digital Creator",
    "Akuntansi Keuangan Lembaga",
  ],
  authors: [{ name: "Muhammad Dafa Pratama" }],
  creator: "Muhammad Dafa Pratama",
  icons: {
    icon: "/hero-banner.jpg",
    apple: "/hero-banner.jpg",
  },
  openGraph: {
    title: "Muhammad Dafa Pratama | Portfolio",
    description:
      "Portfolio resmi Muhammad Dafa Pratama — Siswa SMK Kelas XI AKL, Social Media Enthusiast & Digital Creator.",
    url: siteUrl,
    siteName: "Muhammad Dafa Pratama Portfolio",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/hero-banner.jpg",
        width: 468,
        height: 509,
        alt: "Muhammad Dafa Pratama Portfolio Preview",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Dafa Pratama | Portfolio",
    description:
      "Portfolio resmi Muhammad Dafa Pratama — Siswa SMK Kelas XI AKL, Social Media Enthusiast & Digital Creator.",
    images: ["/hero-banner.jpg"],
    creator: "@dafaaaaa11111",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.className} bg-[#0a0a0f] text-gray-100`}>
        {children}
      </body>
    </html>
  );
}
