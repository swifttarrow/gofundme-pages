import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { MeerkatMascot } from "@/components/meerkat-mascot";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GoSupportMe - Fundraise for What Matters",
  description:
    "Start a fundraiser or donate to causes that matter. GoSupportMe connects people who need support with those who want to give.",
  openGraph: {
    title: "GoSupportMe",
    description: "Fundraise for what matters",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-bg-white font-sans">
        <Navbar />
        <main>{children}</main>
        <div className="fixed right-4 bottom-4 z-40 flex items-center gap-2 pointer-events-none">
          <span className="hidden md:inline-flex rounded-full border border-border-light bg-white/95 px-3 py-1 text-xs text-text-secondary shadow-sm">
            Your meerkat mascot is on watch
          </span>
          <MeerkatMascot
            size="md"
            className="border border-border-light bg-white/95 shadow-md"
          />
        </div>
      </body>
    </html>
  );
}
