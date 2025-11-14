"use client";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home,
  MessageSquare,
  PlusCircle,
  User,
  Users,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed,
  toggleCollapse,
}) => {
  const { user } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role === "admin";

  // ✅ Role-based links
  const baseLinks = [
    // { title: "Home", href: "/home", icon: Home },
    {
      title: isAdmin ? "Chamados" : "Meus Chamados",
      href: isAdmin ? "/admin/chamados" : "/user/chamados",
      icon: MessageSquare,
    },
    // { title: "Novo Chamado", href: "/novo-chamado", icon: PlusCircle },
    { title: "Perfil", href: "/user/profile", icon: User },

    { title: "Eu criei", href: "/user/meuschamados", icon: MessageSquare },
  ];

  const adminLinks = [
    // { title: "Painel Administrativo", href: "/admin/painel", icon: LayoutDashboard },
    { title: "Gerenciar Usuários", href: "/admin/members", icon: Users },
  ];

  const links = isAdmin ? [...baseLinks, ...adminLinks] : baseLinks;

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col bg-background shadow-xl border-r border-border/30 transition-all duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border/30">
        {!isCollapsed && (
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Company Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-lg font-semibold text-primary">Chamados</span>
          </Link>
        )}
        <Button variant="ghost" size="icon" onClick={toggleCollapse}>
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onClose}
        >
          <X />
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <link.icon
                  className={cn("w-5 h-5", isActive && "text-primary-foreground")}
                />
                {!isCollapsed && (
                  <span className="flex-1 text-sm font-medium tracking-wide">
                    {link.title}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-border/30 p-4 flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold">
          {user?.first_name?.[0]?.toUpperCase() || "U"}
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
