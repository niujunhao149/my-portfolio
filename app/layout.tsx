import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "牛俊浩 | Junhao Niu — Portfolio",
  description: "天津大学系统工程硕士在读，Momenta ADAS规划实习生（PPM方向），擅长AI辅助开发（Vibe Coding / Claude Code）与自动化工具设计。",
  keywords: ["ADAS", "PPM", "自动驾驶", "系统工程", "Vibe Coding", "Claude Code", "AI产品经理", "天津大学", "Junhao Niu", "牛俊浩"],
  authors: [{ name: "Junhao Niu" }],
  creator: "Junhao Niu",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://niujunhao149.github.io/my-portfolio",
    title: "牛俊浩 | Junhao Niu — Portfolio",
    description: "天津大学系统工程硕士在读，Momenta ADAS规划实习生（PPM方向），擅长Vibe Coding与自动化工具设计。",
    siteName: "Junhao Niu Portfolio",
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
