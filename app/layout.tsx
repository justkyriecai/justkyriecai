import type { Metadata, Viewport } from "next";

import TabBar from "@/components/TabBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kyrie Cai",
  description: "make something people want",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfd" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      {/* one screen, no page scroll — each view manages its own overflow */}
      <body className="h-dvh overflow-hidden">
        {children}
        <TabBar />
      </body>
    </html>
  );
}
