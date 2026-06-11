
"use client";

import { useState, useMemo } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  ArrowUpCircle, 
  AlertTriangle,
  Plus,
  MoreVertical,
  Filter
} from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { useCollection, useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const inventorySchema = z.object({
  name: z.string().min(2, "Ürün adı en az 2 karakter olmalıdır"),
  category: z.string().min(1, "Kategori seçiniz"),
  stock: z.coerce.number().min(0, "Geçerli stok giriniz"),
  price: z.coerce.number().min(0, "Geçerli fiyat giriniz"),
  minLevel: z.coerce.number().min(1, "Minimum seviye giriniz"),
});

export default function InventoryPage() {
  const [isOpen, setIsOpen] = useState(false);
  const db = useFirestore();

  const inventoryQuery = useMemo(() => {
    if (!db) return null;
    return collection(db, "inventory");
  }, [db]);

  const { data: inventoryItems = [] } = useCollection(inventoryQuery);

  const criticalItems = inventoryItems.filter((item: any) => (item.stock || 0) <= (item.minLevel || 0));

  const form = useForm<z.infer<typeof inventorySchema>>({
    resolver: zodResolver(inventorySchema),
    defaultValues: { name: "", category: "", stock: 0, price: 0, minLevel: 5 },
  });

  const onSubmit = (values: z.infer<typeof inventorySchema>) => {
    if (!db) return;
    
    const inventoryRef = collection(db, "inventory");
    addDoc(inventoryRef, {
      ...values,
      createdAt: serverTimestamp(),
    }).catch(async (error) => {
      const permissionError = new FirestorePermissionError({
        path: 'inventory',
        operation: 'create',
        requestResourceData: values,
      });
      errorEmitter.emit('permission-error', permissionError);
    });
    
    setIsOpen(false);
    form.reset();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Stok ve Envanter</h1>
          <p className="text-muted-foreground mt-1">Ürün stoklarını buradan takip edin.</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={18} />
                Yeni Ürün
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Ürün Ekle</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ürün Adı</FormLabel>
                        <FormControl><Input placeholder="Nemlendirici Krem" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategori</FormLabel>
                        <FormControl><Input placeholder="Cilt Bakımı" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mevcut Stok</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="minLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kritik Seviye</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Birim Fiyat</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit">Kaydet</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-primary flex items-center gap-2">
              <Package size={16} /> Toplam Çeşit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryItems.length} Ürün</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-amber-600 flex items-center gap-2">
              <AlertTriangle size={16} /> Kritik Stok
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalItems.length} Ürün</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-headline">Ürün Listesi</CardTitle>
              <CardDescription>Mevcut ürün kataloğu.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Ürün Adı</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Birim Fiyat</TableHead>
                  <TableHead className="w-[200px]">Stok Seviyesi</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryItems.length > 0 ? (
                  inventoryItems.map((item: any) => {
                    const maxPossible = (item.minLevel * 2 || 20);
                    const stockPercentage = Math.min((item.stock / maxPossible) * 100, 100);
                    const isCritical = item.stock <= item.minLevel;
                    
                    return (
                      <TableRow key={item.id} className="hover:bg-accent/30">
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-primary">₺{item.price}</TableCell>
                        <TableCell>
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                              <span>{item.stock} Adet</span>
                              <span>Min: {item.minLevel}</span>
                            </div>
                            <Progress value={stockPercentage} className={isCritical ? "bg-red-100" : "bg-primary/10"} />
                          </div>
                        </TableCell>
                        <TableCell>
                          {isCritical ? (
                            <Badge variant="destructive">Kritik</Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-600">Yeterli</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <MoreVertical size={18} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      Stokta ürün bulunmuyor.
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
