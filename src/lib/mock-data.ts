
export const stats = [
  { label: "Bugünkü Randevular", value: "12", change: "+2", icon: "calendar" },
  { label: "Toplam Müşteri", value: "842", change: "+15", icon: "users" },
  { label: "Aylık Gelir", value: "₺45.200", change: "+8%", icon: "trending-up" },
  { label: "Stok Uyarısı", value: "3 Ürün", change: "Kritik", icon: "alert-circle" },
];

export const recentAppointments = [
  { id: 1, customer: "Ayşe Yılmaz", service: "Lazer Epilasyon", time: "10:30", status: "Bekliyor", beautician: "Zeynep K." },
  { id: 2, customer: "Fatma Demir", service: "Cilt Bakımı", time: "11:15", status: "Onaylandı", beautician: "Elif S." },
  { id: 3, customer: "Mehmet Can", service: "Manikür & Pedikür", time: "12:00", status: "Tamamlandı", beautician: "Zeynep K." },
  { id: 4, customer: "Selin Ak", service: "Microblading", time: "14:30", status: "İptal", beautician: "Eda M." },
];

export const revenueData = [
  { name: 'Pzt', revenue: 4000 },
  { name: 'Sal', revenue: 3000 },
  { name: 'Çar', revenue: 2000 },
  { name: 'Per', revenue: 2780 },
  { name: 'Cum', revenue: 1890 },
  { name: 'Cmt', revenue: 5390 },
  { name: 'Paz', revenue: 3490 },
];

export const customers = [
  { id: 1, name: "Ayşe Yılmaz", phone: "0532 111 2233", email: "ayse@mail.com", totalSpend: "₺2.400", debt: "₺0", lastVisit: "2 gün önce" },
  { id: 2, name: "Fatma Demir", phone: "0544 222 3344", email: "fatma@mail.com", totalSpend: "₺1.200", debt: "₺400", lastVisit: "Dün" },
  { id: 3, name: "Mehmet Can", phone: "0555 333 4455", email: "mehmet@mail.com", totalSpend: "₺850", debt: "₺0", lastVisit: "Geçen hafta" },
  { id: 4, name: "Selin Ak", phone: "0533 444 5566", email: "selin@mail.com", totalSpend: "₺3.600", debt: "₺1.100", lastVisit: "3 hafta önce" },
];

export const inventory = [
  { id: 1, name: "Güneş Kremi 50 SPF", category: "Cilt Bakımı", stock: 5, price: "₺450", minLevel: 10 },
  { id: 2, name: "Argan Yağı", category: "Saç Bakımı", stock: 25, price: "₺320", minLevel: 5 },
  { id: 3, name: "Nemlendirici Losyon", category: "Cilt Bakımı", stock: 12, price: "₺280", minLevel: 8 },
  { id: 4, name: "Kaş Boyası Siyah", category: "Microblading", stock: 2, price: "₺150", minLevel: 5 },
];

export const services = [
  { id: 1, name: "Lazer Epilasyon (Tüm Vücut)", price: "₺800", duration: "60 dk" },
  { id: 2, name: "Hydrafacial Cilt Bakımı", price: "₺450", duration: "45 dk" },
  { id: 3, name: "Manikür & Pedikür", price: "₺300", duration: "40 dk" },
  { id: 4, name: "Microblading", price: "₺1.500", duration: "120 dk" },
];
