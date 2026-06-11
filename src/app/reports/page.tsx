
"use client";

import { useMemo } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Download, 
  Filter, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore } from "@/firebase";
import { collection } from "firebase/firestore";
import { cn } from "@/lib/utils";

const COLORS = ['#5229A3', '#6680FF', '#FF66B2', '#66FFB2'];

export default function ReportsPage() {
  const db = useFirestore();

  const appointmentsQuery = useMemo(() => {
    if (!db) return null;
    return collection(db, "appointments");
  }, [db]);

  const customersQuery = useMemo(() => {
    if (!db) return null;
    return collection(db, "customers");
  }, [db]);

  const { data: appointments = [] } = useCollection(appointmentsQuery);
  const { data: customers = [] } = useCollection(customersQuery);

  // Veri özeti hesaplamaları (Sadece Tamamlandı olanlar gelir sayılır)
  const totalRevenue = useMemo(() => {
    return appointments
      .filter((a: any) => a.status === "Tamamlandı")
      .reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
  }, [appointments]);

  const completedCount = appointments.filter((a: any) => a.status === "Tamamlandı").length;
  const cancelledCount = appointments.filter((a: any) => a.status === "İptal").length;

  const stats = [
    { label: "Net Gelir", value: `₺${totalRevenue.toLocaleString('tr-TR')}`, trend: "Canlı", positive: true },
    { label: "Toplam Müşteri", value: customers.length.toString(), trend: "Canlı", positive: true },
    { label: "Başarılı İşlem", value: completedCount.toString(), trend: "Canlı", positive: true },
    { label: "İptal Oranı", value: appointments.length > 0 
        ? `%${((cancelledCount / appointments.length) * 100).toFixed(1)}` 
        : "%0", trend: "Stabil", positive: true },
  ];

  // Hizmet dağılımı verisi
  const serviceDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    appointments.filter((a: any) => a.status === "Tamamlandı").forEach((a: any) => {
      counts[a.service] = (counts[a.service] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [appointments]);

  // Randevu Durum Dağılımı
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    appointments.forEach((a: any) => {
      counts[a.status || 'Bekliyor'] = (counts[a.status || 'Bekliyor'] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [appointments]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Analitik Raporlar</h1>
          <p className="text-muted-foreground mt-1">Sadece tamamlanan işlemlerden elde edilen net gelir analizi.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter size={18} /> Filtrele
          </Button>
          <Button className="gap-2">
            <Download size={18} /> Rapor İndir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((item, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-2xl font-bold">{item.value}</span>
                <span className={cn(
                  "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
                  item.positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                )}>
                  {item.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {item.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <BarChart3 size={20} className="text-primary" />
              Popüler Hizmetler (Başarılı)
            </CardTitle>
            <CardDescription>Tamamlanan randevuların hizmet bazlı dağılımı.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {serviceDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serviceDistribution}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(0,0,0,0.05)'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground italic border-2 border-dashed rounded-xl">
                <BarChart3 size={40} className="mb-2 opacity-20" />
                Henüz tamamlanmış hizmet verisi bulunmuyor.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <PieChartIcon size={20} className="text-primary" />
              Randevu Durum Dağılımı
            </CardTitle>
            <CardDescription>Tüm randevuların genel durum özeti.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {statusData.length > 0 ? (
              <div className="h-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="hidden sm:block space-y-2 ml-4">
                  {statusData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-xs font-medium text-muted-foreground">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground italic border-2 border-dashed rounded-xl">
                <PieChartIcon size={40} className="mb-2 opacity-20" />
                Veri bulunmuyor.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
