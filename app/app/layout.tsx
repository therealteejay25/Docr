"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ChatInput } from "@/components/chat/ChatInput";
import { AIStatus } from "@/components/ai/AIStatus";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { useAIStore } from "@/store/useAIStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { confirmation } = useAIStore();

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push("/auth");
  //   }
  // }, [isAuthenticated, router]);

  // if (!isAuthenticated) {
  //   return null;
  // }

  return (
    <div className="flex h-screen bg-dark text-white overflow-hidden">
      <ToastProvider />
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto relative">{children}
        <AIStatus />
        <ChatInput />
        {confirmation && (
          <ConfirmationModal
            isOpen={!!confirmation}
            onClose={() => useAIStore.getState().reset()}
          />
        )}
        </main>
      </div>
    </div>
  );
}

