import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Your Name | Portfolio",
  description: "Personal portfolio — Finance student specializing in quantitative analysis, LLM research, and financial data analytics.",
  keywords: ["Finance", "Quantitative Analysis", "LLM", "Python", "CPA", "Portfolio", "金融分析", "量化研究", "数据分析"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-username.github.io",
    title: "Your Name | Portfolio",
    description: "Finance student with expertise in quantitative analysis, LLM research, and financial data analytics.",
    siteName: "Your Name Portfolio",
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
    <html lang="en">
      <body className="antialiased min-h-screen bg-white">
        {children}
      </body>
    </html>
  );
}
