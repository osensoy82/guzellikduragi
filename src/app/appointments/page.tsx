
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
  Plus
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
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Input } from "@/components/ui/input";

const appointmentSchema = z.object({
  customerId: z.string().min(1, "Müşteri seçiniz"),
  serviceId: z.string().min(1, "Hizmet seçiniz"),
  beautician: z.string().min(1, "Uzman seçiniz"),
  date: z.string().min(1, "Tarih seçiniz"),
  time: z.string().min(1, "Saat seçiniz"),
});

export default function AppointmentsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const db = useFirestore();
  
  const appointmentsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "appointments"), orderBy("date", "desc"));
  }, [db]);

  const customersQuery = useMemo(() => {
    if (!db) return null;
    return collection(db, "customers");
  }, [db]);

  const servicesQuery = useMemo(() => {
    if (!db) return null;
    return collection(db, "services");
  }, [db]);

  const { data: appointments = [] } = useCollection(appointmentsQuery);
  const { data: customers = [] } = useCollection(customersQuery);
  const { data: services = [] } = useCollection(servicesQuery);
  
  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { customerId: "", serviceId: "", beautician: "", date: "", time: "" },
  });

  const onSubmit = (values: z.infer<typeof appointmentSchema>) => {
    if (!db) return;
    
    const selectedCustomer = customers.find((c: any) => c.id === values.customerId);
    const selectedService = services.find((s: any) => s.id === values.serviceId);

    const appointmentsRef = collection(db, "appointments");
    addDoc(appointmentsRef, {
      ...values,
      customerName: selectedCustomer?.name || "Bilinmeyen Müşteri",
      service: selectedService?.name || "Bilinmeyen Hizmet",
      price: selectedService?.price || 0,
      status: "Bekliyor",
      createdAt: serverTimestamp(),
    }).catch(async (error) => {
      const permissionError = new FirestorePermissionError({
        path: 'appointments',
        operation: 'create',
        requestResourceData: values,
      });
      errorEmitter.emit('permission-error', permissionError);
    });
    
    setIsOpen(false);
    form.reset();
  };

  const hours = Array.from({ length: 11 }, (_, i) => `${i + 9}:00`);
  const beauticians = ['Serdar', 'Elif', 'Fethiye'];

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">Randevu Takvimi</h1>
          <p className="text-muted-foreground mt-1">Müşterilerinize yeni randevular oluşturun.</p>
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
                            {beauticians.map((b) => (
                              <SelectItem key={b} value={b}>{b}</SelectItem>
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
              <CardTitle className="text-sm font-headline uppercase tracking-wider text-muted-foreground">Uzmanlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {beauticians.map((staff) => (
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
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-1 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            form.setValue('time', hour);
                            setIsOpen(true);
                          }}
                        >
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
                                <Clock size={12} /> {app.date} {app.time}
                              </span>
                              <span className="text-xs text-muted-foreground">• {app.service} ({app.beautician})</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className="h-8 px-4">{app.status}</Badge>
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
