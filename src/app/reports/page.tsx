
"use client";

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
  Cell,
  LineChart,
  Line
} from "recharts";
import { revenueData } from "@/lib/mock-data";
import { 
  Calendar, 
  Download, 
  Filter, 
  TrendingUp, 
  ArrowUpRight,
  TrendingDown,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";

const COLORS = ['#5229A3', '#6680FF', '#FF66B2', '#66FFB2'];

const serviceDistribution = [
  { name: 'Cilt Bakımı', value: 400 },
  { name: 'Lazer', value: 300 },
  { name: 'Tırnak', value: 300 },
  { name: 'Kalıcı Makyaj', value: 200 },
];

export default function ReportsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Analitik Raporlar</h1>
          <p className="text-muted-foreground mt-1">İşletme büyümesini ve verimliliği izleyin.</p>
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
        {[
          { label: "Brüt Gelir", value: "₺142.500", trend: "+12.5%", positive: true },
          { label: "Yeni Müşteriler", value: "48", trend: "+8%", positive: true },
          { label: "Geri Dönen Oranı", value: "64%", trend: "-2.4%", positive: false },
          { label: "İptal Oranı", value: "4.2%", trend: "-1%", positive: true },
        ].map((item, i) => (
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
            <CardTitle className="font-headline">Aylık Gelir Karşılaştırması</CardTitle>
            <CardDescription>Geçen yıl ve bu yıl karşılaştırmalı veriler.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `₺${v}`} />
                <Tooltip 
                   cursor={{fill: 'rgba(0,0,0,0.05)'}}
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Hizmet Dağılımı</CardTitle>
            <CardDescription>En çok tercih edilen işlemler.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {serviceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="hidden sm:block space-y-2">
              {serviceDistribution.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-xs font-medium text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
