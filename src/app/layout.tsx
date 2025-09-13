import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Accord-AI",
  description: "Topic based Chat app with AI summarization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-background`}>{children}</body>
    </html>
  );
}
