import { Geist, Geist_Mono } from "next/font/google";
import { Permanent_Marker, Pangolin } from "next/font/google";
import "./globals.css";
import portfolioData from "@/data/portfolio.json";
import Script from "next/script";

// Configure the fonts with proper weights and subsets
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Fixed Google Font imports
const permanentMarker = Permanent_Marker({
  weight: "400",
  variable: "--font-permanent-marker",
  subsets: ["latin"],
  display: "swap",
});

const pangolin = Pangolin({
  weight: "400",
  variable: "--font-pangolin",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: `${portfolioData.about.name} - Portfolio`,
  description: portfolioData.about.tagline,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💫</text></svg>" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${permanentMarker.variable} ${pangolin.variable} antialiased`}
      >
        {children}
        {/* Add the animation script */}
        <Script src="/js/scribble-animation.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
