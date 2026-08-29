import type { Metadata, Viewport } from "next";
import { Instrument_Serif } from "next/font/google";

import TabBar from "@/components/TabBar";
import "./globals.css";

// The wordmark only — a high-contrast editorial serif, loaded for the one
// element that earns it.
const display = Instrument_Serif({
  variable: "--font-display",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kyrie Cai",
  description: "build something people want",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfd" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} h-full`}>
      {/* one screen, no page scroll — each view manages its own overflow */}
      <body className="h-dvh overflow-hidden">
        {children}
        <TabBar />
      </body>
    </html>
  );
}
