
"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User, 
  MoreHorizontal,
  Search,
  Plus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { recentAppointments } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

export default function AppointmentsPage() {
  const [view, setView] = useState("daily");
  
  const hours = Array.from({ length: 11 }, (_, i) => `${i + 9}:00`);

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Randevu Takvimi</h1>
          <p className="text-muted-foreground mt-1">Haftalık ve günlük randevu trafiğini yönetin.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <ChevronLeft size={18} />
          </Button>
          <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-card font-semibold">
            <CalendarIcon size={18} className="text-primary" />
            <span>24 Mayıs 2024</span>
          </div>
          <Button variant="outline" size="icon">
            <ChevronRight size={18} />
          </Button>
          <Button className="gap-2 ml-2">
            <Plus size={18} />
            Yeni Randevu
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-headline uppercase tracking-wider text-muted-foreground">Uzmanlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {['Zeynep K.', 'Elif S.', 'Eda M.'].map((staff) => (
                <div key={staff} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors border border-transparent hover:border-border">
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white",
                    staff === 'Zeynep K.' ? 'bg-indigo-500' : staff === 'Elif S.' ? 'bg-pink-500' : 'bg-purple-500'
                  )}>
                    {staff.split(' ')[0][0]}
                  </div>
                  <span className="text-sm font-medium">{staff}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-primary text-primary-foreground">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold">Günün Özeti</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-primary-foreground/80">
                  <span>Toplam</span>
                  <span>12</span>
                </div>
                <div className="flex justify-between text-sm text-primary-foreground/80">
                  <span>Bekleyen</span>
                  <span>4</span>
                </div>
                <div className="flex justify-between text-sm text-primary-foreground/80">
                  <span>Tamamlanan</span>
                  <span>7</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-9">
          <Tabs defaultValue="list" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-card border shadow-sm h-11">
                <TabsTrigger value="daily" className="px-6">Günlük</TabsTrigger>
                <TabsTrigger value="list" className="px-6">Liste Görünümü</TabsTrigger>
              </TabsList>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input 
                  type="text" 
                  placeholder="Hızlı ara..." 
                  className="pl-9 pr-4 py-2 border rounded-lg text-sm bg-card w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <TabsContent value="daily">
              <Card className="border-none shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 divide-y">
                  {hours.map((hour) => {
                    const appointment = recentAppointments.find(a => a.time.startsWith(hour.split(':')[0]));
                    return (
                      <div key={hour} className="flex min-h-[80px] group">
                        <div className="w-20 py-4 text-center border-r bg-muted/20">
                          <span className="text-xs font-semibold text-muted-foreground">{hour}</span>
                        </div>
                        <div className="flex-1 p-4 relative">
                          {appointment ? (
                            <div className={cn(
                              "absolute inset-x-2 inset-y-1 rounded-xl border p-3 flex items-center justify-between shadow-sm transition-transform hover:scale-[1.01] cursor-pointer",
                              appointment.status === 'Onaylandı' ? 'bg-indigo-50 border-indigo-200' : 'bg-pink-50 border-pink-200'
                            )}>
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-white shadow-sm">
                                  <Clock size={14} className="text-primary" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-slate-800">{appointment.customer}</h4>
                                  <p className="text-xs text-slate-500">{appointment.service} • {appointment.beautician}</p>
                                </div>
                              </div>
                              <Badge variant="outline" className="bg-white/80 border-none shadow-sm text-[10px]">
                                {appointment.status}
                              </Badge>
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground">
                                <Plus size={14} /> Yeni Ekle
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="list">
              <Card className="border-none shadow-sm p-4">
                <div className="space-y-3">
                  {recentAppointments.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 rounded-xl border hover:border-primary/50 transition-colors bg-card">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/5 p-3 rounded-xl">
                          <User size={20} className="text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold">{app.customer}</h4>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock size={12} /> {app.time}
                            </span>
                            <span className="text-xs text-muted-foreground">• {app.service}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                          <p className="text-xs text-muted-foreground">Uzman</p>
                          <p className="text-sm font-medium">{app.beautician}</p>
                        </div>
                        <Badge className="h-8 px-4">{app.status}</Badge>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal size={20} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
