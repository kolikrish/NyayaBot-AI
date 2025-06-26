"use client";

import Navbar from './Navbar';
import ClientSideFooter from './ClientSideFooter';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>
        {children}
      </main>
      <ClientSideFooter />
    </>
  );
}
