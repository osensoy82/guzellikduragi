
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
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  XAxis,
  YAxis
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useMemo } from "react";

export default function DashboardPage() {
  const db = useFirestore();

  const appointmentsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "appointments"), orderBy("date", "desc"), limit(5));
  }, [db]);

  const customersQuery = useMemo(() => {
    if (!db) return null;
    return collection(db, "customers");
  }, [db]);

  const { data: appointments = [] } = useCollection(appointmentsQuery);
  const { data: allCustomers = [] } = useCollection(customersQuery);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'calendar': return <Calendar className="text-primary" size={24} />;
      case 'users': return <Users className="text-primary" size={24} />;
      case 'trending-up': return <TrendingUp className="text-primary" size={24} />;
      case 'alert-circle': return <AlertTriangle className="text-destructive" size={24} />;
      default: return null;
    }
  };

  const dashboardStats = [
    { label: "Toplam Randevu", value: appointments.length.toString(), change: "Canlı", icon: "calendar" },
    { label: "Toplam Müşteri", value: allCustomers.length.toString(), change: "Canlı", icon: "users" },
    { label: "Aylık Gelir", value: "₺0", change: "+0%", icon: "trending-up" },
    { label: "Stok Uyarısı", value: "0 Ürün", change: "Stabil", icon: "alert-circle" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">Yönetim Paneli</h1>
          <p className="text-muted-foreground mt-1">İşletme performans özeti (Veriler temizlendi).</p>
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
        {dashboardStats.map((stat, i) => (
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
              <p className="text-xs mt-1 text-emerald-500 font-medium flex items-center gap-1">
                <ArrowUpRight size={12} /> {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="lg:col-span-4 border-none shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="font-headline">Gelir Analizi</CardTitle>
            <CardDescription>Veri girişi yapıldığında grafik güncellenecektir.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center text-muted-foreground italic">
            Henüz finansal veri bulunmamaktadır.
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Son Randevular</CardTitle>
            <CardDescription>En son eklenen 5 randevu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {appointments.length > 0 ? (
                appointments.map((app: any) => (
                  <div key={app.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="bg-accent h-10 w-10 rounded-full flex items-center justify-center font-bold text-primary">
                        {app.customerName?.charAt(0) || "R"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold group-hover:text-primary transition-colors">{app.customerName}</p>
                        <p className="text-xs text-muted-foreground">{app.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{app.time}</p>
                      <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                        {app.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Kayıtlı randevu bulunmuyor.
                </div>
              )}
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
