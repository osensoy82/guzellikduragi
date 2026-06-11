
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  Plus
} from "lucide-react";
import { stats, recentAppointments, revenueData } from "@/lib/mock-data";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function DashboardPage() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'calendar': return <Calendar className="text-primary" size={24} />;
      case 'users': return <Users className="text-primary" size={24} />;
      case 'trending-up': return <TrendingUp className="text-primary" size={24} />;
      case 'alert-circle': return <AlertTriangle className="text-destructive" size={24} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">Yönetim Paneli</h1>
          <p className="text-muted-foreground mt-1">Güzellik Durağı günlük performans özeti.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/appointments">Takvimi Gör</Link>
          </Button>
          <Button className="gap-2">
            <Plus size={18} />
            Hızlı Randevu
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-all border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className="bg-primary/5 p-2 rounded-lg">
                {getIcon(stat.icon)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={cn(
                "text-xs mt-1 flex items-center gap-1",
                stat.change.startsWith('+') ? "text-emerald-500" : "text-destructive"
              )}>
                {stat.change.startsWith('+') && <ArrowUpRight size={12} />}
                {stat.change} bu hafta
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="lg:col-span-4 border-none shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="font-headline">Haftalık Gelir Analizi</CardTitle>
            <CardDescription>Son 7 günün finansal dağılımı</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}} tickFormatter={(v) => `₺${v}`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderRadius: '8px', 
                    border: '1px solid hsl(var(--border))',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  itemStyle={{ color: 'hsl(var(--primary))' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Bekleyen Randevular</CardTitle>
            <CardDescription>Bugün gerçekleşecek görüşmeler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentAppointments.map((app) => (
                <div key={app.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="bg-accent h-10 w-10 rounded-full flex items-center justify-center font-bold text-primary">
                      {app.customer.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold group-hover:text-primary transition-colors">{app.customer}</p>
                      <p className="text-xs text-muted-foreground">{app.service} - {app.beautician}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{app.time}</p>
                    <Badge variant={app.status === 'İptal' ? 'destructive' : app.status === 'Onaylandı' ? 'default' : 'secondary'} className="text-[10px] h-5 px-1.5">
                      {app.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-6 text-primary hover:text-primary/80 font-semibold" asChild>
              <Link href="/appointments">Tümünü Gör</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
