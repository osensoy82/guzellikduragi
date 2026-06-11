
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
import { Progress } from "@/components/ui/progress";
import { useCollection, useFirestore } from "@/firebase";
import { collection } from "firebase/firestore";

export default function InventoryPage() {
  const db = useFirestore();

  const inventoryQuery = useMemo(() => {
    if (!db) return null;
    return collection(db, "inventory");
  }, [db]);

  const { data: inventoryItems = [] } = useCollection(inventoryQuery);

  const criticalItems = inventoryItems.filter((item: any) => (item.stock || 0) <= (item.minLevel || 0));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Stok ve Envanter</h1>
          <p className="text-muted-foreground mt-1">Stok verileri sıfırlandı, yeni ürün tanımlayabilirsiniz.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <ArrowUpCircle size={18} />
            Stok Girişi
          </Button>
          <Button className="gap-2">
            <Plus size={18} />
            Yeni Ürün
          </Button>
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
        <Card className="border-none shadow-sm bg-emerald-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-emerald-600 flex items-center gap-2">
              <TrendingUp size={16} /> Aylık Hareket
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺0</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-headline">Ürün Listesi</CardTitle>
              <CardDescription>Mevcut ürün kataloğu (Sıfırlandı).</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1">
              <Filter size={16} /> Filtrele
            </Button>
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
                    const stockPercentage = Math.min((item.stock / (item.minLevel * 2 || 20)) * 100, 100);
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

function TrendingUp(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
