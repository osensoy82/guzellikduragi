
"use client";

import { useState, useMemo } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  User, 
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  MoreVertical
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, addDoc, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

const appointmentSchema = z.object({
  customerId: z.string().min(1, "Müşteri seçiniz"),
  serviceId: z.string().min(1, "Hizmet seçiniz"),
  beautician: z.string().min(1, "Uzman seçiniz"),
  date: z.string().min(1, "Tarih seçiniz"),
  time: z.string().min(1, "Saat seçiniz"),
});

export default function AppointmentsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const db = useFirestore();
  
  const appointmentsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "appointments"), orderBy("createdAt", "desc"));
  }, [db]);

  const customersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, "customers");
  }, [db]);

  const servicesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, "services");
  }, [db]);

  const beauticiansQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "beauticians"), orderBy("name", "asc"));
  }, [db]);

  const { data: appointments = [] } = useCollection(appointmentsQuery);
  const { data: customers = [] } = useCollection(customersQuery);
  const { data: services = [] } = useCollection(servicesQuery);
  const { data: beauticians = [] } = useCollection(beauticiansQuery);
  
  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { customerId: "", serviceId: "", beautician: "", date: selectedDate, time: "" },
  });

  const onSubmit = async (values: z.infer<typeof appointmentSchema>) => {
    if (!db) return;
    
    const selectedCustomer = customers.find((c: any) => c.id === values.customerId);
    const selectedService = services.find((s: any) => s.id === values.serviceId);

    try {
      const appointmentsRef = collection(db, "appointments");
      await addDoc(appointmentsRef, {
        ...values,
        customerName: selectedCustomer?.name || "Bilinmeyen Müşteri",
        service: selectedService?.name || "Bilinmeyen Hizmet",
        price: Number(selectedService?.price) || 0,
        status: "Bekliyor",
        createdAt: serverTimestamp(),
      });
      setIsOpen(false);
      form.reset({ ...form.getValues(), time: "", customerId: "", serviceId: "" });
    } catch (error) {
      const permissionError = new FirestorePermissionError({
        path: 'appointments',
        operation: 'create',
        requestResourceData: values,
      });
      errorEmitter.emit('permission-error', permissionError);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    if (!db) return;
    try {
      const docRef = doc(db, "appointments", id);
      await updateDoc(docRef, { status: newStatus });
    } catch (error) {
      const permissionError = new FirestorePermissionError({
        path: `appointments/${id}`,
        operation: 'update',
      });
      errorEmitter.emit('permission-error', permissionError);
    }
  };

  const handleDelete = async (id: string) => {
    if (!db || !confirm("Bu randevuyu silmek istediğinize emin misiniz?")) return;
    try {
      const docRef = doc(db, "appointments", id);
      await deleteDoc(docRef);
    } catch (error) {
      const permissionError = new FirestorePermissionError({
        path: `appointments/${id}`,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
    }
  };

  const hours = Array.from({ length: 13 }, (_, i) => {
    const h = i + 9;
    return `${h < 10 ? '0' + h : h}:00`;
  });

  const dailyAppointments = useMemo(() => {
    return appointments.filter((app: any) => app.date === selectedDate);
  }, [appointments, selectedDate]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Tamamlandı": return <Badge className="bg-emerald-500 hover:bg-emerald-600">Tamamlandı</Badge>;
      case "İptal": return <Badge variant="destructive">İptal Edildi</Badge>;
      default: return <Badge variant="secondary">Bekliyor</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">Randevu Takvimi</h1>
          <p className="text-muted-foreground mt-1">Müşteri randevularını yönetin ve durumlarını güncelleyin.</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={18} />
                Yeni Randevu
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Randevu Oluştur</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="customerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Müşteri</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Müşteri Seçin" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {customers.map((c: any) => (
                              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="serviceId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hizmet</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Hizmet Seçin" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {services.map((s: any) => (
                              <SelectItem key={s.id} value={s.id}>{s.name} (₺{s.price})</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="beautician"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Uzman</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Uzman Seçin" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {beauticians.map((b: any) => (
                              <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tarih</FormLabel>
                          <FormControl><Input type="date" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Saat</FormLabel>
                          <FormControl><Input type="time" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit">Randevuyu Kaydet</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-headline uppercase tracking-wider text-muted-foreground">Tarih Seçimi</CardTitle>
            </CardHeader>
            <CardContent>
              <Input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mb-4"
              />
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-xs font-headline uppercase tracking-wider text-muted-foreground mb-4">Uzmanlar</h3>
                {beauticians.length > 0 ? beauticians.map((staff: any) => (
                  <div key={staff.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors border border-transparent hover:border-border">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-primary/60">
                      {staff.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{staff.name}</span>
                  </div>
                )) : (
                  <p className="text-xs text-muted-foreground italic">Henüz uzman eklenmemiş.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-9">
          <Tabs defaultValue="daily" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-card border shadow-sm h-11">
                <TabsTrigger value="daily" className="px-6">Günlük</TabsTrigger>
                <TabsTrigger value="list" className="px-6">Liste Görünümü</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CalendarIcon size={16} />
                {selectedDate}
              </div>
            </div>

            <TabsContent value="daily">
              <Card className="border-none shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 divide-y">
                  {hours.map((hour) => {
                    const hourPrefix = hour.split(':')[0];
                    const appointmentsInThisHour = dailyAppointments.filter((app: any) => 
                      app.time.startsWith(hourPrefix)
                    );

                    return (
                      <div key={hour} className="flex min-h-[100px] group">
                        <div className="w-20 py-4 text-center border-r bg-muted/10">
                          <span className="text-xs font-bold text-muted-foreground">{hour}</span>
                        </div>
                        <div className="flex-1 p-2 relative flex flex-wrap gap-2 content-start bg-background/50">
                          {appointmentsInThisHour.length > 0 ? (
                            appointmentsInThisHour.map((app: any) => (
                              <div 
                                key={app.id} 
                                className={`p-2 rounded shadow-sm min-w-[220px] flex justify-between items-center animate-in fade-in zoom-in-95 duration-300 border-l-4 ${
                                  app.status === 'Tamamlandı' ? 'bg-emerald-50 border-l-emerald-500' : 
                                  app.status === 'İptal' ? 'bg-red-50 border-l-red-500' : 
                                  'bg-primary/10 border-l-primary'
                                }`}
                              >
                                <div>
                                  <p className="text-xs font-bold text-primary">{app.time} - {app.customerName}</p>
                                  <p className="text-[10px] text-muted-foreground">{app.service} | {app.beautician}</p>
                                  <div className="mt-1">
                                    {getStatusBadge(app.status)}
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-7 w-7"><MoreVertical size={14}/></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => updateStatus(app.id, "Tamamlandı")} className="gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-500" /> İşlem Tamamlandı
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => updateStatus(app.id, "İptal")} className="gap-2 text-destructive">
                                        <XCircle size={14} /> İptal Et
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleDelete(app.id)} className="gap-2 text-destructive">
                                        <Trash2 size={14} /> Sil
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="gap-1 text-xs text-muted-foreground"
                                onClick={() => {
                                  form.setValue('time', hour);
                                  form.setValue('date', selectedDate);
                                  setIsOpen(true);
                                }}
                              >
                                <Plus size={14} /> Randevu Ekle
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
                                <CalendarIcon size={12} /> {app.date}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock size={12} /> {app.time}
                              </span>
                              <span className="text-xs text-muted-foreground">• {app.service} ({app.beautician})</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="gap-2">
                                {getStatusBadge(app.status)}
                                <MoreVertical size={14} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => updateStatus(app.id, "Tamamlandı")} className="gap-2 text-emerald-600">
                                <CheckCircle2 size={16} /> İşlem Tamamlandı
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateStatus(app.id, "İptal")} className="gap-2 text-destructive">
                                <XCircle size={16} /> İptal Et
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateStatus(app.id, "Bekliyor")} className="gap-2">
                                <Clock size={16} /> Bekliyor Yap
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(app.id)}
                          >
                            <Trash2 size={16} />
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
