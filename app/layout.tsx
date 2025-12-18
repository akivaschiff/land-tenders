import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "תמי - מוצאים את המגרש המושלם",
  description: "אנחנו עוזרים לכם למצוא את חלקת הקרקע המושלמת לבית הראשון שלכם",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
