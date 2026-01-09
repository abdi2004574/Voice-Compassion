import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  Mic, 
  MessageSquare, 
  LayoutDashboard, 
  Activity, 
  LogOut, 
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/voice-samples", label: "My Voices", icon: Mic },
    { href: "/chat", label: "Therapy Chat", icon: MessageSquare },
    { href: "/psychologist", label: "Psychologist View", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-border">
        <h1 className="text-xl font-bold font-display text-primary">Loved One PsyCare</h1>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen flex flex-col shadow-xl md:shadow-none",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 md:p-8 border-b border-border/50">
          <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Loved One PsyCare
          </h1>
          <p className="text-xs text-muted-foreground mt-2 font-medium tracking-wide uppercase">
            Emotional Wellness<br/>Founder: Sanam Anjum
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon className={cn("w-5 h-5", isActive ? "stroke-2" : "stroke-[1.5]")} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50 bg-slate-50/50">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {user?.firstName?.[0] || user?.email?.[0] || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-foreground">
                {user?.firstName || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-destructive transition-colors"
              onClick={() => logout()}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen bg-slate-50/30">
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 animate-in fade-in duration-500">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
