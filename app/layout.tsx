import type {Metadata} from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/lib/AuthContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Electronics Gyan - Engineering Projects & Tutorials',
  description: 'A comprehensive, scalable, content-rich engineering community and resource platform.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <footer className="w-full bg-panel py-8 border-t border-panel-border mt-auto">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
              Copyright © {new Date().getFullYear()} Nandini Enterprises. All rights reserved.
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}

