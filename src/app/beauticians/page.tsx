
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
  UserCheck, 
  Plus, 
  Trash2,
  Pencil,
  Award
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter as UiDialogFooter
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
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy, updateDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const beauticianSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  specialty: z.string().min(2, "Uzmanlık alanı en az 2 karakter olmalıdır"),
});

export default function BeauticiansPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const db = useFirestore();

  const beauticiansQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "beauticians"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: beauticianList = [] } = useCollection(beauticiansQuery);

  const form = useForm<z.infer<typeof beauticianSchema>>({
    resolver: zodResolver(beauticianSchema),
    defaultValues: { name: "", specialty: "" },
  });

  const onSubmit = async (values: z.infer<typeof beauticianSchema>) => {
    if (!db) return;
    
    try {
      if (editingId) {
        const docRef = doc(db, "beauticians", editingId);
        await updateDoc(docRef, values);
      } else {
        const beauticiansRef = collection(db, "beauticians");
        await addDoc(beauticiansRef, {
          ...values,
          createdAt: serverTimestamp(),
        });
      }
      setIsOpen(false);
      setEditingId(null);
      form.reset();
    } catch (error) {
      const permissionError = new FirestorePermissionError({
        path: 'beauticians',
        operation: editingId ? 'update' : 'create',
        requestResourceData: values,
      });
      errorEmitter.emit('permission-error', permissionError);
    }
  };

  const handleEdit = (beautician: any) => {
    setEditingId(beautician.id);
    form.reset({
      name: beautician.name,
      specialty: beautician.specialty,
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!db || !confirm("Bu uzmanı silmek istediğinize emin misiniz?")) return;
    try {
      const docRef = doc(db, "beauticians", id);
      await deleteDoc(docRef);
    } catch (error) {
      const permissionError = new FirestorePermissionError({
        path: `beauticians/${id}`,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">Uzman Yönetimi</h1>
          <p className="text-muted-foreground mt-1">Ekibinizi buradan yönetebilirsiniz.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setEditingId(null);
            form.reset();
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={18} />
              Yeni Uzman Ekle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Uzman Düzenle" : "Yeni Uzman Ekle"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ad Soyad</FormLabel>
                      <FormControl><Input placeholder="Zeynep Kaya" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Uzmanlık / Unvan</FormLabel>
                      <FormControl><Input placeholder="Cilt Bakımı Uzmanı" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <UiDialogFooter>
                  <Button type="submit">{editingId ? "Güncelle" : "Kaydet"}</Button>
                </UiDialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {beauticianList.length > 0 ? (
          beauticianList.map((beautician: any) => (
            <Card key={beautician.id} className="group hover:shadow-lg transition-all border-none shadow-sm overflow-hidden bg-card">
              <div className="h-2 bg-secondary w-full opacity-70 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center font-bold text-primary text-xl">
                    {beautician.name?.charAt(0)}
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-primary h-8 w-8"
                      onClick={() => handleEdit(beautician)}
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive h-8 w-8"
                      onClick={() => handleDelete(beautician.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                <CardTitle className="mt-4 font-headline">{beautician.name}</CardTitle>
                <CardDescription className="flex items-center gap-1.5 mt-1">
                  <Award size={14} className="text-secondary" />
                  {beautician.specialty}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="pt-2 border-t border-dashed">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Kayıtlı Uzman</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-2xl text-muted-foreground">
            Henüz tanımlanmış bir uzman bulunmuyor.
          </div>
        )}
      </div>
    </div>
  );
}
