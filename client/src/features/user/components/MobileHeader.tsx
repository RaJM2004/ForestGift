import { Bell, TreePine } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../../../shared/components/ui/avatar";
import { Badge } from "../../../shared/components/ui/badge";

interface MobileHeaderProps {
  userName: string;
  userAvatar?: string;
  notificationCount?: number;
  currentSection?: string;
  onProfileClick: () => void;
}

export function MobileHeader({ userName, userAvatar, notificationCount = 0, currentSection, onProfileClick }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 md:hidden">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex flex-col">
           <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{currentSection}</span>
           <span className="text-sm font-bold text-gray-900 leading-none mt-1 uppercase tracking-tighter">ForestGift Portal</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-6 h-6 text-gray-600" />
            {notificationCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive"
              >
                {notificationCount}
              </Badge>
            )}
          </button>
          
          <button onClick={onProfileClick}>
            <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback className="bg-primary text-white text-sm">
                {userName.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>
    </header>
  );
}

function TreeLogo() {
  return (
    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5 text-white"
      >
        <path d="M12 3v18M8 6l4-3 4 3M6 11l6-4 6 4M4 16l8-6 8 6" />
      </svg>
    </div>
  );
}
