import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { CardRefProvider } from "@/lib/card-ref-context";
import { DownloadButton } from "@/components/download-button";
import MobileBlocker from "@/components/mobile-blocker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ktv-card-edit",
  description: "Éditeur de cartes pour KTV, simple et rapide.",
  applicationName: "ktv-card-edit",
  authors: [{ name: "Félicio DSA dev (Joyboy-dy)", url: "mailto:feliciodsa.dev@gmail.com" }],
  keywords: ["éditeur", "cartes", "KTV"],
  creator: "Félicio DSA dev (Joyboy-dy)",
  generator: "Next.js",
  icons: [
    { rel: "icon", url: "/favicon.ico" }
  ],
  openGraph: {
    title: "ktv-card-edit",
    description: "Éditeur de cartes pour KTV, simple et rapide.",
    url: "https://github.com/Joyboy-dy/ktv-card-edit",
    siteName: "ktv-card-edit",
    locale: "fr_FR",
    type: "website"
  },
  category: "application web"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MobileBlocker />
          <CardRefProvider>
            {children}
            <div className="fixed top-4 right-4 z-[9999] pointer-events-auto flex gap-2">
              <DownloadButton />
              <ModeToggle />
            </div>
          </CardRefProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
