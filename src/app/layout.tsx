import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Earth Events Dashboard",
  description:
    "Real-time visualization of natural events worldwide using NASA EONET data. Track wildfires, storms, volcanic activity, and more on an interactive globe.",
  openGraph: {
    title: "Earth Events Dashboard",
    description:
      "Real-time visualization of natural events worldwide using NASA EONET data.",
    type: "website",
    siteName: "Earth Events Dashboard",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground overflow-hidden">
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
