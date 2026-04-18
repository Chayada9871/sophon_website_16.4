import "./globals.css";

import { LanguageProvider } from "@/components/site/language-provider";

export const metadata = {
  title: "Sophon Market",
  description:
    "Sophon Market storefront built with Next.js, featuring brochure, promotions, product categories, and contact information.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
