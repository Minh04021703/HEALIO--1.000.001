import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Brain,
  Calendar,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/health-records", label: "Health Records", icon: FileText },
  { href: "/ai-assistant", label: "AI Assistant", icon: Brain },
  { href: "/appointments", label: "Appointments", icon: Calendar },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  return (
    <div className="border-r bg-background w-64 h-screen flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-primary">Healio</h1>
        <p className="text-sm text-muted-foreground">Personal Health Platform</p>
      </div>

      <nav className="flex-1 px-4 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  "hover:bg-accent/80 hover:text-accent-foreground hover:shadow-sm",
                  location === item.href 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </a>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t bg-accent/5">
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium">{user?.fullName}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => logoutMutation.mutate()}
          className="flex items-center gap-3 px-4 py-2 w-full text-destructive hover:bg-destructive/10 rounded-lg transition-colors mt-4"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}