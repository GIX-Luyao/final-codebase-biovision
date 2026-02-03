"use client";

import { useState } from "react";
import AppHeader from "./AppHeader";
import TabNavigation, { AppTab } from "./TabNavigation";
import WorkspaceTab from "./workspace/WorkspaceTab";
import HistoryTab from "./history/HistoryTab";
import ChatbotTab from "./chatbot/ChatbotTab";

interface MainAppProps {
  onLogout: () => void;
}

const MainApp = ({ onLogout }: MainAppProps) => {
  const [activeTab, setActiveTab] = useState<AppTab>("workspace");

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader onLogout={onLogout} />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1">
        {activeTab === "workspace" && (
          <WorkspaceTab onOpenChatbot={() => setActiveTab("chatbot")} />
        )}
        {activeTab === "history" && (
          <HistoryTab
            onOpenReview={() => setActiveTab("workspace")}
            onOpenChatbot={() => setActiveTab("chatbot")}
          />
        )}
        {activeTab === "chatbot" && <ChatbotTab />}
      </main>
    </div>
  );
};

export default MainApp;
