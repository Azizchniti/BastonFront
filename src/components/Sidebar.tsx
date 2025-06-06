
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart3,
  Users,
  Phone,
  UserCircle,
  Crown,
  DollarSign,
  ChevronRight,
  X,
  LineChart,
  Trophy,
  Award,
  PlusCircle,
  PanelLeft,
  PanelRight,
  FileText,
  GraduationCap,
  Megaphone
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
  toggleCollapse 
}) => {
  
  const { user } = useAuth();
  
  console.log("Final user object for API calls:", user);

  const location = useLocation();
  
  const isAdmin = user?.role === "admin";

  const adminLinks = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: BarChart3,
    },
    {
      title: "Membros",
      href: "/admin/members",
      icon: Users,
    },
    {
      title: "Leads",
      href: "/admin/leads",
      icon: Phone,
    },
    {
      title: "Squads",
      href: "/admin/squads",
      icon: Crown,
    },
    {
      title: "Comissões",
      href: "/admin/commissions",
      icon: DollarSign,
    },
    {
      title: "Graduação",
      href: "/admin/graduation",
      icon: GraduationCap,
    },
    {
      title: "Mural",
      href: "/admin/mural",
      icon: Megaphone,
    },
    {
      title: "Relatórios",
      href: "/admin/reports",
      icon: LineChart,
    },
  ];

  const memberLinks = [
    {
      title: "Dashboard",
      href: "/member",
      icon: BarChart3,
    },
    {
      title: "Meu Perfil",
      href: "/member/profile",
      icon: UserCircle,
    },
    {
      title: "Meus Leads",
      href: "/member/leads",
      icon: Phone,
    },
    // {
    //   title: "Adicionar Lead",
    //   href: "/member/leads/new",
    //   icon: PlusCircle,
    // },
    {
      title: "Meu Squad",
      href: "/member/squad",
      icon: Users,
    },
    // {
    //   title: "Adicionar Membro",
    //   href: "/member/member/new",
    //   icon: PlusCircle,
    // },
    {
      title: "Comissões",
      href: "/member/commissions",
      icon: DollarSign,
    },
    {
      title: "Ranking",
      href: "/member/ranking",
      icon: Trophy,
    },
    {
      title: "Mural",
      href: "/member/mural",
      icon: Megaphone,
    },
    {
      title: "Graduação",
      href: "/member/grade",
      icon: GraduationCap,
    },
  ];

  const links = isAdmin ? adminLinks : memberLinks;

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col w-64 md:w-72 neo border-r border-r-border/30 transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        isCollapsed ? "md:w-20" : "md:w-72"
      )}
    >
      <div className="flex items-center justify-between h-16 p-4 border-b border-border/30">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleCollapse} 
            className="mr-2"
          >
            {isCollapsed ? <PanelRight className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
          </Button>
          
          {!isCollapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="relative w-8 h-8 overflow-hidden rounded-lg bg-primary/10">
                <div className="absolute inset-0 flex items-center justify-center text-primary font-bold">
                  ES
                </div>
              </div>
              <span className="text-lg font-semibold tracking-tight">EmpowerSquad</span>
            </Link>
          )}
          
          {isCollapsed && (
            <div className="flex justify-center w-full">
              <div className="relative w-8 h-8 overflow-hidden rounded-lg bg-primary/10">
                <div className="absolute inset-0 flex items-center justify-center text-primary font-bold">
                  ES
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
          <X className="w-5 h-5" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg group transition-all hover:bg-accent hover:text-accent-foreground",
                location.pathname === link.href && "bg-accent text-accent-foreground font-medium"
              )}
            >
              <div className={cn(
                "flex items-center gap-3",
                isCollapsed && "justify-center w-full"
              )}>
                <link.icon className="w-5 h-5" />
                {!isCollapsed && <span>{link.title}</span>}
              </div>
              {!isCollapsed && (
                <ChevronRight className="w-4 h-4 opacity-0 transition-opacity group-hover:opacity-70" />
              )}
            </Link>
          ))}
        </nav>

        {!isCollapsed && isAdmin && (
          <div className="mt-6">
            <Separator className="my-2" />
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-muted-foreground">Relatórios rápidos</p>
              <div className="mt-3 space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <LineChart className="w-4 h-4 mr-2" />
                  Comissões mensais
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Trophy className="w-4 h-4 mr-2" />
                  Top 10 membros
                </Button>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
      
      {!isCollapsed && (
        <div className="p-4 border-t border-border/30">
          <div className="flex items-center gap-3 py-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">{user?.name}</span>
              <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
            </div>
          </div>
        </div>
      )}
      
      {isCollapsed && (
        <div className="p-4 border-t border-border/30 flex justify-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold">
            {user?.name?.charAt(0) || "U"}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
