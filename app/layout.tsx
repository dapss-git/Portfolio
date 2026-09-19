import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Muhammad Dafa Pratama | Portfolio",
  description:
    "Portfolio Muhammad Dafa Pratama — Siswa SMK Kelas XI AKL, Social Media Enthusiast & Digital Creator.",
  keywords: ["Muhammad Dafa Pratama", "portfolio", "SMK", "AKL", "digital creator"],
  authors: [{ name: "Muhammad Dafa Pratama" }],
  openGraph: {
    title: "Muhammad Dafa Pratama | Portfolio",
    description: "Siswa SMK Kelas XI AKL, Social Media Enthusiast & Digital Creator.",
    type: "website",
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
