# Güzellik Durağı - Yönetim Paneli

Bu uygulama, güzellik merkezleri için geliştirilmiş, Next.js 15 ve Firebase tabanlı profesyonel bir yönetim sistemidir.

## 🚀 GitHub'a Yükleme ve Yayına Alma Rehberi

Uygulamanızı ücretsiz olarak internette yayınlamak için aşağıdaki adımları sırasıyla takip edin:

### 1. GitHub Deposu (Repository) Oluşturma
- [GitHub](https://github.com/) hesabınıza giriş yapın.
- Sağ üstteki **"+"** simgesine tıklayıp **"New repository"** deyin.
- Deponuza bir isim verin (örneğin: `guzellik-merkezi-yonetim`) ve **"Create repository"** butonuna basın.

### 2. Kodları GitHub'a Gönderme
Firebase Studio altındaki terminale şu komutları sırasıyla yazın (GitHub'ın size verdiği bağlantıyı kullanın):

```bash
git init
git add .
git commit -m "İlk kurulum"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/DEPO_ISMINIZ.git
git push -u origin main
```

### 3. Firebase App Hosting Kurulumu
- [Firebase Console](https://console.firebase.google.com/)'a gidin.
- Projenizi seçin ve soldaki menüden **App Hosting**'e tıklayın.
- **"Get Started"** butonuna basın.
- GitHub hesabınızı bağlayın ve az önce oluşturduğunuz depoyu seçin.
- **"Finish and Deploy"** dediğinizde Firebase kodlarınızı derleyecek ve size özel bir `web.app` uzantılı adres verecektir.

## Özellikler

- **Dashboard:** Günlük randevular ve anlık gelir takibi.
- **Müşteri Yönetimi:** Detaylı müşteri profilleri, onam formu takibi ve notlar.
- **Randevu Takvimi:** Saatlik bazda randevu takibi ve seans numarası gösterimi.
- **Çoklu Seans Paketi:** Tek tıkla haftalık/aylık periyotlarla otomatik seans oluşturma.
- **Uzman Yönetimi:** Çalışanların uzmanlık alanlarına göre takibi ve randevulara atanması.
- **Envanter Takibi:** Kritik stok uyarıları ve ürün yönetimi.
- **Raporlar:** Başarılı işlemler üzerinden net gelir ve hizmet analizi.

## Teknolojiler

- **Frontend:** Next.js 15, React 19, Tailwind CSS.
- **UI Bileşenleri:** Shadcn/UI, Lucide Icons.
- **Backend:** Firebase Firestore (Veritabanı), Firebase Auth (Kimlik Doğrulama).
- **Grafikler:** Recharts.
