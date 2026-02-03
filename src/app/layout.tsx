import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import PageTracker from "@/components/analytics/PageTracker";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

import { getProfile } from "@/lib/data";

const defaultTitle = "Lakshan De Silva | DevOps & Cloud Engineer";
const defaultDescription =
  "DevOps Engineer & Cloud Architect focused on reliable infrastructure, automation, and scalable systems.";

function getBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envUrl) {
    return envUrl.endsWith("/") ? envUrl.slice(0, -1) : envUrl;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

function toAbsoluteUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getBaseUrl()}${normalized}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const baseUrl = getBaseUrl();
  const title = profile ? `${profile.name} | ${profile.title}` : defaultTitle;
  const description = profile?.bio ?? defaultDescription;
  const imageUrl = toAbsoluteUrl(profile?.profileImage ?? "/myself.jpeg");

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title,
      description,
      url: baseUrl,
      siteName: profile?.name ?? "Portfolio",
      locale: "en_US",
      type: "website",
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: profile?.name ?? "Portfolio",
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <Suspense fallback={null}>
          <PageTracker />
        </Suspense>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
