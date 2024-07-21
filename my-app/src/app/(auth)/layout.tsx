import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { Poppins } from 'next/font/google';
import '../globals.css';

export const metadata = {
    title: 'Real Estate Manager',
    description: 'A Next.js 13 Meta Real Estate Manager'
};

const poppins = Poppins({
    subsets: ['latin'],
    weight: '100'
});

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={'${poppins.className} #1A1A1A'}>
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}
