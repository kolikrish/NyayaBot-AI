"use client";

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ClientSideFooter() {
  const pathname = usePathname();
  const isChatRoute = pathname === '/chat';
  
  if (isChatRoute) {
    return null;
  }
  
  return <Footer />;
}
