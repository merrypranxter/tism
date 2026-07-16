import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MY AUTISM — Merry's Field Guide to Her Own Nervous System",
  description:
    "A living, artistic self-assessment atlas of Merry's masking, pattern hunger, sensory world, burnout, ADHD overlap, and gloriously nonstandard operating system.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-site="merrys-autism">
      <body>{children}</body>
    </html>
  );
}
