"use client";

import { Suspense } from "react";
import ChatBox from "@/components/user/Chatbox";

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Suspense fallback={<div>Loading messages...</div>}>
        <ChatBox />
      </Suspense>
    </div>
  );
}
