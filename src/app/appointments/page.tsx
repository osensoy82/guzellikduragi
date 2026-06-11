
"use client";

import { useMemo } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
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
import { cn } from "@/lib/utils";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";

export default function AppointmentsPage() {
  const db = useFirestore();
  
  const appointmentsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "appointments"), orderBy("date", "desc"));
  }, [db]);

  const { data: appointments = [] } = useCollection(appointmentsQuery);
  
  const hours = Array.from({ length: 11 }, (_, i) => `${i + 9}:00`);

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Randevu Takvimi</h1>
          <p className="text-muted-foreground mt-1">Tüm veriler temizlendi, yeni kayıt ekleyebilirsiniz.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <ChevronLeft size={18} />
          </Button>
          <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-card font-semibold">
            <CalendarIcon size={18} className="text-primary" />
            <span>Bugün</span>
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
              {['Serdar', 'Elif', 'Fethiye'].map((staff) => (
                <div key={staff} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors border border-transparent hover:border-border">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-primary/60">
                    {staff.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">{staff}</span>
                </div>
              ))}
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
                  placeholder="Randevu ara..." 
                  className="pl-9 pr-4 py-2 border rounded-lg text-sm bg-card w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <TabsContent value="daily">
              <Card className="border-none shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 divide-y">
                  {hours.map((hour) => (
                    <div key={hour} className="flex min-h-[80px] group">
                      <div className="w-20 py-4 text-center border-r bg-muted/20">
                        <span className="text-xs font-semibold text-muted-foreground">{hour}</span>
                      </div>
                      <div className="flex-1 p-4 relative flex items-center justify-center">
                        <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus size={14} /> Yeni Randevu
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="list">
              <Card className="border-none shadow-sm p-4">
                <div className="space-y-3">
                  {appointments.length > 0 ? (
                    appointments.map((app: any) => (
                      <div key={app.id} className="flex items-center justify-between p-4 rounded-xl border hover:border-primary/50 transition-colors bg-card">
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/5 p-3 rounded-xl">
                            <User size={20} className="text-primary" />
                          </div>
                          <div>
                            <h4 className="font-bold">{app.customerName}</h4>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock size={12} /> {app.time}
                              </span>
                              <span className="text-xs text-muted-foreground">• {app.service}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className="h-8 px-4">{app.status}</Badge>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal size={20} />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 text-muted-foreground">
                      Kayıtlı randevu bulunmuyor.
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
