import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import { ReactQueryProvider } from "@/tanstack/provider/tanstackQueryProvider";
import { Toaster } from "@/components/ui/sonner";
import { SocketProvider } from "@/providers/socket-provider";
import { AuthProvider } from "@/providers/auth-providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

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
      <body className={`${poppins.className} bg-background`}>
        <AuthProvider>
          <SocketProvider>
            <ReactQueryProvider>{children}</ReactQueryProvider>
            <Toaster position="top-center" />{" "}
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
