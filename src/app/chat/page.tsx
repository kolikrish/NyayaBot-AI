"use client";

import React from 'react';
import ChatInterface from '../components/ChatInterface';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pt-16 h-screen">
        <ChatInterface />
      </div>
    </div>
  );
}
