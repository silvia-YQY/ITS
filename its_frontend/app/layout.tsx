'use client';
import React, { useMemo } from 'react';
import localFont from 'next/font/local';
import './globals.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginOrRegister = useMemo(() => pathname === '/login' || pathname === '/register', [pathname]);

  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}>
        <div className='flex h-full'>
          {isLoginOrRegister ? (
            <section className='flex-1 p-10'>{children}</section>
          ) : (
            <>
              {/* Left-side Menu */}
              <nav>
                <div className='w-60 h-[100vh] bg-gray-200 p-5 border-r border-gray-300 '>
                  <ul className='space-y-4'>
                    <li>
                      <Link href='/plate'>Car Plate</Link>
                    </li>
                    <li>
                      <Link href='/order'>Order</Link>
                    </li>
                    <li>
                      <Link href='/dashboard'>Dashboard</Link>
                    </li>
                    <li>
                      <Link href='/entry'>Entry</Link>
                    </li>
                  </ul>
                </div>
              </nav>
              {/* Main Content */}
              <main>
                <div className='flex-1 p-10'>{children}</div>
              </main>
            </>
          )}
        </div>
      </body>
    </html>
  );
}
