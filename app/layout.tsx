import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ByteUrl",
  description: "Smart URL Shortener with AI-Powered Features",
  openGraph: {
    type: "website",
    title: "ByteUrl",
    description: "Smart URL Shortener with AI-Powered Features",
    url: "https://byteurl-eight.vercel.app/",
    siteName: "ByteUrl",
    images: [{
      url: "https://res.cloudinary.com/diyxwdtjd/image/upload/v1739300258/projects/byte_url.png",
      width: 1200,
      height: 630,
      alt: "ByteUrl Preview Image",
    }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ByteUrl",
    description: "Smart URL Shortener with AI-Powered Features",
    site: "https://byteurl-eight.vercel.app/",
    images: [{
      url: "https://res.cloudinary.com/diyxwdtjd/image/upload/v1739300258/projects/byte_url.png",
      alt: "ByteUrl Preview Image",
    }],
  },
  icons: {
    shortcut: "https://res.cloudinary.com/diyxwdtjd/image/upload/v1739300258/projects/byte_url.png",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen">
              {children}
              <Toaster />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
