import { Briefcase, History, MessageSquare } from "lucide-react";

export type AppTab = "workspace" | "history" | "chatbot";

interface TabNavigationProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const tabs = [
  { id: "workspace" as AppTab, label: "Workspace", icon: Briefcase },
  { id: "history" as AppTab, label: "History", icon: History },
  { id: "chatbot" as AppTab, label: "AI Chatbot", icon: MessageSquare },
];

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <nav className="border-b border-border px-6">
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default TabNavigation;
