import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Agents",
  description: "AI Agents",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          
          {/* ヘッダー */}
          <header className="sticky top-0 border-b bg-white z-0">
          </header>

          {/* トースト */}
          <Toaster />

          <main className="container mx-auto max-w-screen-md flex-1 px-5">
            {children}
          </main>

          {/* フッター */}
          <footer className="py-5 fixed bottom-0 inset-x-0 bg-white">
          <div className="flex items-center justify-center lg:items-center">
          <span>Built by AI-Agents</span>
          <Image
            className="rounded-xl"
            src="/ai-agent.png"
            alt="AI-Agent Logo"
            width={30}
            height={30}
            priority
          />
          </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
