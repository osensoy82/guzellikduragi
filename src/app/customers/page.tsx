
"use client";

import { useState, useMemo } from "react";
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
  History,
  FileText
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useCollection, useFirestore } from "@/firebase";
import { collection } from "firebase/firestore";

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const db = useFirestore();

  const customersQuery = useMemo(() => {
    if (!db) return null;
    return collection(db, "customers");
  }, [db]);

  const { data: customers = [], loading } = useCollection(customersQuery);

  const filteredCustomers = customers.filter((c: any) => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Müşteri Yönetimi</h1>
          <p className="text-muted-foreground mt-1">Müşteri verileri temizlendi, yeni müşteri ekleyebilirsiniz.</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <UserPlus size={18} />
          Yeni Müşteri
        </Button>
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
                  <TableHead>Son Ziyaret</TableHead>
                  <TableHead>Harcama</TableHead>
                  <TableHead>Durum</TableHead>
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
                          <span className="font-medium">{customer.name}</span>
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
                      <TableCell className="text-sm">{customer.lastVisit || "Ziyaret yok"}</TableCell>
                      <TableCell className="font-semibold text-primary">₺{customer.totalSpend || 0}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-emerald-600 bg-emerald-50">Aktif</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical size={18} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem className="gap-2">
                              <FileText size={16} /> Profili Görüntüle
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-primary">
                              <History size={16} /> İşlem Geçmişi
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
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
