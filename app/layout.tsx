import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ByteAI",
  description: "AI-powered Chat with Any Content",
  openGraph: {
    type: "website",
    title: "ByteAI",
    description: "AI-powered Chat with Any Content",
    url: "https://byteai.souryax.tech/",
    siteName: "ByteAI",
    images: [{
      url: "https://res.cloudinary.com/diyxwdtjd/image/upload/v1740058550/projects/byteai.png",
      width: 1200,
      height: 630,
      alt: "ByteAI Preview Image",
    }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ByteAI",
    description: "AI-powered Chat with Any Content",
    site: "https://byteai.souryax.tech/",
    images: [{
      url: "https://res.cloudinary.com/diyxwdtjd/image/upload/v1740058550/projects/byteai.png",
      alt: "ByteAI Preview Image",
    }],
  },
  icons: {
    shortcut: "https://res.cloudinary.com/diyxwdtjd/image/upload/v1740058550/projects/byteai.png",
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
