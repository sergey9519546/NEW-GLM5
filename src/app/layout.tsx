import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "alti.tune Desktop",
  description: "A productionizing Windows 95-inspired desktop for music, visuals, news, and notes.",
  keywords: ["alti.tune", "retro desktop", "Next.js", "Prisma", "media desktop", "Windows 95 UI"],
  authors: [{ name: "alti.tune" }],
  icons: {
    icon: "/icons/w98/windows.png",
  },
  openGraph: {
    title: "alti.tune Desktop",
    description: "A retro desktop experience with real content, notes, and media playback.",
    url: "https://alti.tune.desktop",
    siteName: "alti.tune Desktop",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "alti.tune Desktop",
    description: "Retro desktop UI with real media and content management.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
