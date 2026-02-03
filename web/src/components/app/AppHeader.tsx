import { LogOut, User } from "lucide-react";

interface AppHeaderProps {
  onLogout: () => void;
}

const AppHeader = ({ onLogout }: AppHeaderProps) => {
  return (
    <header className="h-16 border-b border-border px-6 flex items-center justify-between bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold">
          <span className="text-foreground">DFW </span>
          <span className="text-gradient-green">Beaver ID</span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <span className="text-sm text-muted-foreground hidden sm:inline">Biologist</span>
        </div>
        <button
          onClick={onLogout}
          className="btn-ghost flex items-center gap-2 text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
