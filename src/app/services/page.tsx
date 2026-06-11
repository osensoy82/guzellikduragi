
"use client";

import { useMemo } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Clock, 
  Tag, 
  Plus, 
  MoreHorizontal,
  ChevronRight
} from "lucide-react";
import { useCollection, useFirestore } from "@/firebase";
import { collection } from "firebase/firestore";

export default function ServicesPage() {
  const db = useFirestore();

  const servicesQuery = useMemo(() => {
    if (!db) return null;
    return collection(db, "services");
  }, [db]);

  const { data: serviceList = [] } = useCollection(servicesQuery);

  return (
    <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Hizmet Kataloğu</h1>
          <p className="text-muted-foreground mt-1">Veriler sıfırlandı, hizmetleri yeniden tanımlayabilirsiniz.</p>
        </div>
        <Button className="gap-2">
          <Plus size={18} />
          Yeni Hizmet Ekle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviceList.length > 0 ? (
          serviceList.map((service: any) => (
            <Card key={service.id} className="group hover:shadow-lg transition-all border-none shadow-sm overflow-hidden bg-card">
              <div className="h-2 bg-primary w-full opacity-70 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="bg-primary/5 p-2 rounded-lg">
                    <Sparkles className="text-primary" size={24} />
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal size={18} />
                  </Button>
                </div>
                <CardTitle className="mt-4 font-headline">{service.name}</CardTitle>
                <CardDescription>Profesyonel uygulama kataloğu.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between py-2 border-y border-dashed mt-2">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock size={14} /> {service.duration} dk
                  </div>
                  <div className="flex items-center gap-1.5 text-lg font-bold text-primary">
                    <Tag size={18} className="text-secondary" /> ₺{service.price}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 p-4">
                <Button variant="ghost" className="w-full justify-between hover:bg-white group">
                  Düzenle
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-2xl text-muted-foreground">
            Henüz tanımlanmış bir hizmet bulunmuyor.
          </div>
        )}
      </div>
    </div>
  );
}
