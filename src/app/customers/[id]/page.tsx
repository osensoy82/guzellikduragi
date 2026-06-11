
"use client";

import { use, useState, useMemo } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  FileText, 
  Plus, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Scissors
} from "lucide-react";
import { useDoc, useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { 
  doc, 
  collection, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { format, addWeeks } from "date-fns";
import { Textarea } from "@/components/ui/textarea";

const sessionPackageSchema = z.object({
  serviceId: z.string().min(1, "Hizmet seçiniz"),
  beauticianId: z.string().min(1, "Uzman seçiniz"),
  sessionCount: z.coerce.number().min(1).max(20),
  startDate: z.string().min(1, "Başlangıç tarihi seçiniz"),
  startTime: z.string().min(1, "Saat seçiniz"),
  intervalWeeks: z.coerce.number().min(1).max(8),
});

export default function CustomerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const db = useFirestore();
  const [isPackageOpen, setIsPackageOpen] = useState(false);

  const customerRef = useMemoFirebase(() => id ? doc(db, "customers", id) : null, [db, id]);
  const { data: customer, loading: customerLoading } = useDoc(customerRef);

  const appointmentsQuery = useMemoFirebase(() => {
    if (!db || !id) return null;
    return query(
      collection(db, "appointments"), 
      where("customerId", "==", id),
      orderBy("date", "desc")
    );
  }, [db, id]);

  const { data: appointments = [] } = useCollection(appointmentsQuery);

  const servicesQuery = useMemoFirebase(() => collection(db, "services"), [db]);
  const { data: services = [] } = useCollection(servicesQuery);

  const beauticiansQuery = useMemoFirebase(() => collection(db, "beauticians"), [db]);
  const { data: beauticians = [] } = useCollection(beauticiansQuery);

  const packageForm = useForm<z.infer<typeof sessionPackageSchema>>({
    resolver: zodResolver(sessionPackageSchema),
    defaultValues: {
      sessionCount: 4,
      intervalWeeks: 1,
      startDate: format(new Date(), "yyyy-MM-dd"),
      startTime: "10:00"
    }
  });

  const handleCreatePackage = async (values: z.infer<typeof sessionPackageSchema>) => {
    if (!db || !customer) return;

    const selectedService = services.find((s: any) => s.id === values.serviceId);
    const selectedBeautician = beauticians.find((b: any) => b.id === values.beauticianId);

    try {
      const appointmentsRef = collection(db, "appointments");
      let currentDate = new Date(values.startDate);

      for (let i = 1; i <= values.sessionCount; i++) {
        addDoc(appointmentsRef, {
          customerId: id,
          customerName: customer.name,
          service: selectedService?.name || "Hizmet",
          serviceId: values.serviceId,
          beautician: selectedBeautician?.name || "Uzman",
          date: format(currentDate, "yyyy-MM-dd"),
          time: values.startTime,
          status: "Bekliyor",
          price: Number(selectedService?.price) || 0,
          sessionNumber: i,
          totalSessions: values.sessionCount,
          createdAt: serverTimestamp(),
        });
        
        // Bir sonraki seansın tarihini hesapla
        currentDate = addWeeks(currentDate, values.intervalWeeks);
      }

      setIsPackageOpen(false);
      packageForm.reset();
    } catch (error) {
      const permissionError = new FirestorePermissionError({
        path: 'appointments',
        operation: 'create',
      });
      errorEmitter.emit('permission-error', permissionError);
    }
  };

  const updateOnamStatus = async (status: string) => {
    if (!customerRef) return;
    updateDoc(customerRef, { consentFormUrl: status });
  };

  const updateNotes = async (notes: string) => {
    if (!customerRef) return;
    updateDoc(customerRef, { notes });
  };

  if (customerLoading) return <div className="p-8 text-center">Yükleniyor...</div>;
  if (!customer) return <div className="p-8 text-center">Müşteri bulunamadı.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">Müşteri Profili</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Sütun: Kişisel Bilgiler */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <div className="h-24 bg-primary/10 relative">
              <div className="absolute -bottom-10 left-6">
                <div className="h-20 w-20 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl font-bold text-primary border-4 border-white">
                  {customer.name.charAt(0)}
                </div>
              </div>
            </div>
            <CardContent className="pt-14">
              <h2 className="text-2xl font-bold">{customer.name}</h2>
              <p className="text-muted-foreground text-sm">Kayıt: {customer.createdAt?.toDate().toLocaleDateString('tr-TR')}</p>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-muted-foreground" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-muted-foreground" />
                  <span>{customer.email || "E-posta girilmemiş"}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">Onam Formu Durumu</span>
                  {customer.consentFormUrl === "Yüklendi" ? (
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 gap-1">
                      <CheckCircle2 size={12} /> Onaylı
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-amber-500 border-amber-500 gap-1">
                      <AlertCircle size={12} /> Bekliyor
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => updateOnamStatus("Yüklendi")}>Onaylandı İşaretle</Button>
                  <Button variant="ghost" size="sm" onClick={() => updateOnamStatus("")}>Sıfırla</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-headline uppercase tracking-wider text-muted-foreground">Müşteri Notları</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Cilt hassasiyeti, alerjiler veya özel tercihler..."
                className="min-h-[150px] text-sm resize-none"
                defaultValue={customer.notes}
                onBlur={(e) => updateNotes(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground mt-2 italic">* Notlar alandan çıkıldığında otomatik kaydedilir.</p>
            </CardContent>
          </Card>
        </div>

        {/* Sağ Sütun: Randevular ve Seanslar */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-headline">İşlem ve Randevu Geçmişi</h3>
            <Dialog open={isPackageOpen} onOpenChange={setIsPackageOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus size={18} /> Paket Tanımla
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Çoklu Seans Paketi Oluştur</DialogTitle>
                </DialogHeader>
                <Form {...packageForm}>
                  <form onSubmit={packageForm.handleSubmit(handleCreatePackage)} className="space-y-4">
                    <FormField
                      control={packageForm.control}
                      name="serviceId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hizmet</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Hizmet Seçin" /></SelectTrigger></FormControl>
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
                      control={packageForm.control}
                      name="beauticianId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Uzman</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Uzman Seçin" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {beauticians.map((b: any) => (
                                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={packageForm.control}
                        name="sessionCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Seans Sayısı</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={packageForm.control}
                        name="intervalWeeks"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Aralık (Hafta)</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={packageForm.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>İlk Seans Tarihi</FormLabel>
                            <FormControl><Input type="date" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={packageForm.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Seans Saati</FormLabel>
                            <FormControl><Input type="time" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <DialogFooter className="pt-4">
                      <Button type="submit" className="w-full">Seansları Takvime İşle</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">Tüm Randevular</TabsTrigger>
              <TabsTrigger value="active">Gelecek Seanslar</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="space-y-3">
                {appointments.length > 0 ? (
                  appointments.map((app: any) => (
                    <Card key={app.id} className="border-none shadow-sm group hover:ring-1 ring-primary/20 transition-all">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            app.status === 'Tamamlandı' ? 'bg-emerald-50 text-emerald-600' : 'bg-primary/5 text-primary'
                          }`}>
                            <Scissors size={18} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{app.service}</span>
                              {app.sessionNumber && (
                                <Badge variant="secondary" className="text-[10px] h-4">Seans {app.sessionNumber}/{app.totalSessions}</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center gap-1"><Calendar size={12} /> {app.date}</span>
                              <span className="flex items-center gap-1"><Clock size={12} /> {app.time}</span>
                              <span>• {app.beautician}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={app.status === 'Tamamlandı' ? 'default' : 'outline'} className={
                          app.status === 'Tamamlandı' ? 'bg-emerald-500' : ''
                        }>
                          {app.status}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl italic">
                    Kayıtlı randevu bulunmuyor.
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="active" className="mt-4">
               <div className="space-y-3">
                {appointments.filter((a: any) => a.status === 'Bekliyor').map((app: any) => (
                  <Card key={app.id} className="border-none shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/5 text-primary flex items-center justify-center">
                          <Calendar size={18} />
                        </div>
                        <div>
                          <p className="font-bold">{app.service}</p>
                          <p className="text-xs text-muted-foreground">{app.date} @ {app.time}</p>
                        </div>
                      </div>
                      <Badge>Bekliyor</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
