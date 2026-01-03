import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { SocketProvider } from '@/contexts/SocketContext';

// Use system fonts with CSS variables to avoid Turbo font loading issues
// Fonts will be loaded via CSS @import in globals.css for better Turbo compatibility

export const metadata: Metadata = {
  title: "Apostolic Army Global Church | Home of the Supernatural",
  description: "A beautiful digital home for worship, community, and admin at AAGC.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
         <AuthProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
         </AuthProvider>
      </body>
    </html>
  );
}
