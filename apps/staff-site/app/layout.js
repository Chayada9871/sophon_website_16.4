import "@sophon/shared/styles/globals.css";
import { LanguageProvider } from "@sophon/shared/components/site/language-provider";

export const metadata = {
  title: "Sophon Staff Site",
  description: "Staff content management site for Sophon promotions and brochure content.",
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
