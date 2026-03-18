import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

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
      </body>
    </html>
  );
}
