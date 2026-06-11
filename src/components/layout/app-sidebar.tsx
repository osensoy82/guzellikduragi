
"use client";

import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Sparkles, 
  Package, 
  BarChart3, 
  Settings,
  LogOut,
  Flower2
} from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarGroup,
  SidebarGroupLabel
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "Müşteriler", icon: Users, href: "/customers" },
  { name: "Randevular", icon: Calendar, href: "/appointments" },
  { name: "Hizmetler", icon: Sparkles, href: "/services" },
  { name: "Envanter", icon: Package, href: "/inventory" },
  { name: "Raporlar", icon: BarChart3, href: "/reports" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" className="border-r shadow-sm">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl text-primary-foreground">
            <Flower2 size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-primary font-headline">Güzellik Durağı</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 mb-2">Ana Menü</SidebarGroupLabel>
          <SidebarMenu className="px-2">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.name}>
                  <Link 
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-6 rounded-lg transition-all duration-200",
                      pathname === item.href 
                        ? "bg-primary/10 text-primary font-semibold" 
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon size={20} />
                    <span className="text-base">{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings" className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-primary transition-colors">
                <Settings size={20} />
                <span>Ayarlar</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="flex items-center gap-3 px-4 py-2 text-destructive hover:text-destructive/80 transition-colors">
              <LogOut size={20} />
              <span>Çıkış Yap</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
