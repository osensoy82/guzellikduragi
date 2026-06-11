
"use client";

import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  MoreVertical, 
  UserPlus, 
  Phone, 
  Mail,
  Trash2,
  User,
  ExternalLink
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
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
import { Badge } from "@/components/ui/badge";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import Link from "next/link";

const customerSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  phone: z.string().min(10, "Geçerli bir telefon giriniz"),
  email: z.string().email("Geçerli bir e-posta giriniz").optional().or(z.literal("")),
});

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const db = useFirestore();

  const customersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "customers"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: customers = [], loading } = useCollection(customersQuery);

  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: "", phone: "", email: "" },
  });

  const onSubmit = async (values: z.infer<typeof customerSchema>) => {
    if (!db) return;
    
    try {
      const customersRef = collection(db, "customers");
      addDoc(customersRef, {
        ...values,
        totalSpend: 0,
        debt: 0,
        lastVisit: null,
        notes: "",
        consentFormUrl: "",
        createdAt: serverTimestamp(),
      });
      setIsOpen(false);
      form.reset();
    } catch (error) {
      const permissionError = new FirestorePermissionError({
        path: 'customers',
        operation: 'create',
        requestResourceData: values,
      });
      errorEmitter.emit('permission-error', permissionError);
    }
  };

  const handleDelete = async (id: string) => {
    if (!db || !confirm("Bu müşteriyi silmek istediğinize emin misiniz?")) return;
    
    try {
      const docRef = doc(db, "customers", id);
      deleteDoc(docRef);
    } catch (error) {
      const permissionError = new FirestorePermissionError({
        path: `customers/${id}`,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
    }
  };

  const filteredCustomers = customers.filter((c: any) => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">Müşteri Yönetimi</h1>
          <p className="text-muted-foreground mt-1">Müşteri kayıtlarını ve detaylı profilleri buradan yönetebilirsiniz.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <UserPlus size={18} />
              Yeni Müşteri
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Müşteri Ekle</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ad Soyad</FormLabel>
                      <FormControl><Input placeholder="Ahmet Yılmaz" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefon</FormLabel>
                      <FormControl><Input placeholder="0555..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-posta (Opsiyonel)</FormLabel>
                      <FormControl><Input placeholder="ahmet@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Kaydet</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="İsim veya telefon ile ara..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-3 py-1 border-primary/20 text-primary">
                Toplam {customers.length} Müşteri
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[250px]">Müşteri</TableHead>
                  <TableHead>İletişim</TableHead>
                  <TableHead>Kayıt Tarihi</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer: any) => (
                    <TableRow key={customer.id} className="hover:bg-accent/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 h-9 w-9 rounded-full flex items-center justify-center font-bold text-primary">
                            {customer.name?.charAt(0)}
                          </div>
                          <Link href={`/customers/${customer.id}`} className="font-medium hover:text-primary hover:underline transition-all">
                            {customer.name}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone size={12} /> {customer.phone}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail size={12} /> {customer.email || "-"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {customer.createdAt?.toDate ? customer.createdAt.toDate().toLocaleDateString('tr-TR') : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                           <Button variant="outline" size="sm" className="gap-2" asChild>
                            <Link href={`/customers/${customer.id}`}>
                              <ExternalLink size={14} /> Profil
                            </Link>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical size={18} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem className="gap-2" asChild>
                                <Link href={`/customers/${customer.id}`}>
                                  <User size={16} /> Profili Görüntüle
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="gap-2 text-destructive focus:text-destructive"
                                onClick={() => handleDelete(customer.id)}
                              >
                                <Trash2 size={16} /> Müşteriyi Sil
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                      {loading ? "Yükleniyor..." : "Müşteri kaydı bulunamadı."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
