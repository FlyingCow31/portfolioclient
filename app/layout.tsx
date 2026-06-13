import type { Metadata } from "next";
import "./globals.css";
import { Public_Sans, Open_Sans } from "next/font/google"
import React from "react";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
})


export const metadata: Metadata = {
  title: "Espace Client - Gaël TOURNIER",
  description: "Développeur web fullstack spécialisé en Next.JS, react et Typescript. Création de software et sites-web " +
      "sur mesure.",
  openGraph: {
    title: "Espace Client - Gaël TOURNIER",
    description: "Développeur Full Stack spécialisé en Next.js, React et Typescript.",
    url: "https://panel.gaeltournier.dev",
    siteName: "Gaël Tournier",
    images: [
      {
        url: "https://gaeltournier.dev/LogoGaelPortfolio.png", // image affichée dans l'embed
        width: 1200,
        height: 630,
      }
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${openSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">{children}</body>
    </html>
  );
}
