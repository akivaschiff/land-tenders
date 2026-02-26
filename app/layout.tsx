import type { Metadata } from "next";
import "./globals.css";
import PostHogProvider from "./posthog-provider";

export const metadata: Metadata = {
  title: "מכרזי קרקעות רמ״י - Land Tenders",
  description: "פלטפורמה מתקדמת לעיון במכרזי קרקעות ממשלתיות ברחבי ישראל",
  keywords: "מכרזי קרקעות, מגרשים, רמ״י, קרקעות ממשלתיות, נדל״ן",
  authors: [{ name: "Land Tenders" }],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body dir="rtl">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
