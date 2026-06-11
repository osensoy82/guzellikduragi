
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  Plus,
  CheckCircle2
} from "lucide-react";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useMemo } from "react";

export default function DashboardPage() {
  const db = useFirestore();

  const appointmentsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "appointments"), orderBy("createdAt", "desc"), limit(5));
  }, [db]);

  const allAppointmentsQuery = useMemo(() => {
    if (!db) return null;
    return collection(db, "appointments");
  }, [db]);

  const customersQuery = useMemo(() => {
    if (!db) return null;
    return collection(db, "customers");
  }, [db]);

  const inventoryQuery = useMemo(() => {
    if (!db) return null;
    return collection(db, "inventory");
  }, [db]);

  const { data: recentAppointments = [] } = useCollection(appointmentsQuery);
  const { data: allAppointments = [] } = useCollection(allAppointmentsQuery);
  const { data: allCustomers = [] } = useCollection(customersQuery);
  const { data: inventoryItems = [] } = useCollection(inventoryQuery);

  // Gelir Hesaplama (Sadece Tamamlandı)
  const totalRevenue = useMemo(() => {
    return allAppointments
      .filter((a: any) => a.status === "Tamamlandı")
      .reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
  }, [allAppointments]);

  // Kritik Stok Sayısı
  const criticalStockCount = useMemo(() => {
    return inventoryItems.filter((item: any) => (item.stock || 0) <= (item.minLevel || 0)).length;
  }, [inventoryItems]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'calendar': return <Calendar className="text-primary" size={24} />;
      case 'users': return <Users className="text-primary" size={24} />;
      case 'trending-up': return <TrendingUp className="text-emerald-500" size={24} />;
      case 'alert-circle': return <AlertTriangle className="text-destructive" size={24} />;
      default: return null;
    }
  };

  const dashboardStats = [
    { label: "Toplam Randevu", value: allAppointments.length.toString(), change: "Genel", icon: "calendar" },
    { label: "Toplam Müşteri", value: allCustomers.length.toString(), change: "Kayıtlı", icon: "users" },
    { label: "Toplam Gelir", value: `₺${totalRevenue.toLocaleString('tr-TR')}`, change: "Net Kazanç", icon: "trending-up" },
    { label: "Stok Uyarısı", value: `${criticalStockCount} Ürün`, change: criticalStockCount > 0 ? "Kritik" : "Stabil", icon: "alert-circle" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">Yönetim Paneli</h1>
          <p className="text-muted-foreground mt-1">İşletme performans özeti ve canlı gelir takibi.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/appointments">Takvimi Gör</Link>
          </Button>
          <Button className="gap-2" asChild>
            <Link href="/appointments">
              <Plus size={18} />
              Yeni Randevu
            </Link>
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
              <p className={`text-xs mt-1 font-medium flex items-center gap-1 ${
                stat.icon === 'alert-circle' && criticalStockCount > 0 ? 'text-destructive' : 'text-emerald-500'
              }`}>
                {stat.icon === 'trending-up' && <CheckCircle2 size={12} />}
                {stat.icon !== 'trending-up' && <ArrowUpRight size={12} />} 
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="lg:col-span-4 border-none shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="font-headline">İşletme Özeti</CardTitle>
            <CardDescription>Gelirler sadece "Tamamlandı" olarak işaretlenen işlemlerden hesaplanır.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-transparent to-primary/5">
            <TrendingUp size={64} className="text-primary/20 mb-4" />
            <h3 className="text-xl font-bold text-primary">₺{totalRevenue.toLocaleString('tr-TR')}</h3>
            <p className="text-muted-foreground max-w-xs mt-2">
              Bugüne kadar tamamlanan işlemlerden elde edilen net cironuz.
            </p>
            <Button variant="outline" className="mt-6" asChild>
              <Link href="/reports">Detaylı Raporları Gör</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Son Randevular</CardTitle>
            <CardDescription>En son eklenen 5 randevu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentAppointments.length > 0 ? (
                recentAppointments.map((app: any) => (
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
                      <Badge variant={app.status === 'Tamamlandı' ? 'default' : 'outline'} className={`text-[10px] h-5 px-1.5 ${
                        app.status === 'Tamamlandı' ? 'bg-emerald-500' : ''
                      }`}>
                        {app.status || 'Bekliyor'}
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
