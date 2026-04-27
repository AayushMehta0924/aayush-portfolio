import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/shell/Nav";
import { Footer } from "@/components/shell/Footer";
import { CustomCursor } from "@/components/shell/CustomCursor";
import { SoundManager } from "@/components/shell/SoundManager";
import { KonamiListener } from "@/components/shell/KonamiListener";
import { LenisProvider } from "@/components/shell/LenisProvider";
import { PageTransition } from "@/components/shell/PageTransition";
import { CommandPalette } from "@/components/shell/CommandPalette";
import { RouteWarpFlash } from "@/components/shell/RouteWarpFlash";
import { DepthBackground } from "@/components/shell/DepthBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aayush Mehta — Data + AI + Cloud Engineer",
  description:
    "Personal portfolio of Aayush Mehta — data, AI, and cloud engineer building enterprise data platforms and intelligent agents on GCP.",
  metadataBase: new URL("https://aayushmehta.dev"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-dvh font-sans">
        <DepthBackground />
        <div className="relative z-10 min-h-dvh flex flex-col">
          <LenisProvider>
            <Nav />
            <main className="flex-1 pt-16">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </LenisProvider>
        </div>
        <CustomCursor />
        <SoundManager />
        <KonamiListener />
        <RouteWarpFlash />
        <CommandPalette />
      </body>
    </html>
  );
}
