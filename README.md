# Güzellik Durağı - Yönetim Paneli

Bu uygulama, güzellik merkezleri için geliştirilmiş, Next.js 15 ve Firebase tabanlı profesyonel bir yönetim sistemidir.

## Özellikler

- **Dashboard:** Günlük randevular ve anlık gelir takibi.
- **Müşteri Yönetimi:** Detaylı müşteri profilleri, onam formu takibi ve notlar.
- **Randevu Takvimi:** Saatlik bazda randevu takibi ve sürükle-bırak kolaylığı.
- **Çoklu Seans Paketi:** Tek tıkla haftalık/aylık periyotlarla seans oluşturma.
- **Uzman Yönetimi:** Çalışanların uzmanlık alanlarına göre takibi.
- **Envanter Takibi:** Kritik stok uyarıları ve ürün yönetimi.
- **Raporlar:** Başarılı işlemler üzerinden net gelir analizi.

## Ücretsiz Yayınlama (Deployment)

Uygulamayı internette canlıya almak için şu adımları izleyin:

1. **GitHub:** Kodlarınızı bir GitHub deposuna yükleyin.
2. **Firebase App Hosting:**
   - [Firebase Console](https://console.firebase.google.com/)'a gidin.
   - Projenizi seçin ve soldaki menüden **App Hosting**'e tıklayın.
   - "Get Started" butonuna basın ve GitHub deponuzu bağlayın.
   - Ayarları varsayılanda bırakarak "Finish" deyin.
3. **Firestore Kurulumu:**
   - Console üzerinden **Firestore Database**'e gidin.
   - "Rules" (Kurallar) sekmesinde kuralların yayınlandığından emin olun (Firebase Studio bunu sizin yerinize yaptı, ancak kontrol etmekte fayda var).

## Teknolojiler

- **Frontend:** Next.js 15, React 19, Tailwind CSS.
- **UI Bileşenleri:** Shadcn/UI, Lucide Icons.
- **Backend:** Firebase Firestore (Veritabanı), Firebase Auth (Kimlik Doğrulama).
- **Grafikler:** Recharts.
