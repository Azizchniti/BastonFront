
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, Menu, PanelLeft, PanelRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type NavLinkProps = {
  to: string;
  label: string;
  children?: React.ReactNode;
};

const NavLink: React.FC<NavLinkProps> = ({
  to,
  label,
  children
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return <Link to={to} className={cn("flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-accent hover:text-accent-foreground", isActive && "bg-accent text-accent-foreground font-medium")}>
      {children}
      <span>{label}</span>
    </Link>;
};

const Navbar: React.FC<{
  onMenuToggle?: () => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}> = ({
  onMenuToggle,
  sidebarCollapsed,
  toggleSidebar
}) => {
  const {
    user,
    logout
  } = useAuth();
  
  return <div className="sticky top-0 z-10 glass border-b border-border/40 backdrop-blur-md">
      <div className="container flex items-center justify-between h-16 mx-auto max-w-7xl px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden md:flex">
            {sidebarCollapsed ? <PanelRight className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
          </Button>
          
          {onMenuToggle && <Button variant="ghost" size="icon" onClick={onMenuToggle} className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>}
          
          <Link to="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8 overflow-hidden rounded-lg bg-primary/10">
              <div className="absolute inset-0 flex items-center justify-center text-primary font-bold">
                ES
              </div>
            </div>
            <span className="text-lg font-semibold tracking-tight">EmpowerSquad</span>
          </Link>
        </div>

        <div className="flex items-center gap-4 bg-transparent">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative w-9 h-9 rounded-full">
                <div className="flex items-center justify-center w-full h-full text-sm font-medium bg-primary/10 rounded-full text-primary">
                  {user?.name?.charAt(0) || "U"}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col">
                <span>{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => logout()}>
                <LogOut className="w-4 h-4 mr-2" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>;
};

export default Navbar;
