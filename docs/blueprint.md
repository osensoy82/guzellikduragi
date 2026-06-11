# **App Name**: Güzellik Durağı

## Core Features:

- Veritabanı ve Kimlik Doğrulama Yapılandırması: Supabase üzerinde PostgreSQL tablolarının oluşturulması ve Supabase Auth ile 'ADMIN' ve 'STAFF' rolleri için güvenli giriş mekanizmasının kurulması.
- Müşteri Yönetimi ve Profil Sayfası: Müşteri kayıtlarının CRUD işlemleri, telefon/isim ile arama ve her müşteriye özel satın alınan hizmetler, seans takibi ve borç durumunu gösteren yazdırılabilir profil sayfası.
- Dinamik Hizmet ve Ürün Katalog Yönetimi: Güzellik merkezinde sunulan seans bazlı hizmetlerin ve satılan ürünlerin fiyat, süre ve stok verileriyle birlikte yönetildiği merkezi veri giriş sistemi.
- Gelişmiş Randevu Takvimi: FullCalendar entegrasyonu ile günlük, haftalık ve aylık görünüm. Uzmanların mesai saatlerine göre çakışmaları engelleyen ve gerçek zamanlı güncellenen planlama modülü.
- Akıllı Stok ve Envanter Takibi: Ürünlerin stok hareketlerinin (Giriş/Çıkış) izlenmesi ve stok seviyesi belirlenen minimum seviyenin altına düştüğünde sistemin otomatik uyarı vermesi.
- İşletme Gösterge Paneli ve Analitik Raporlama: Günlük randevular, toplam gelir, personel verimliliği ve alacak takibi gibi kritik verilerin grafiklerle görselleştirildiği merkezi yönetim paneli.
- Entegre Dosya ve Görsel Depolama: Müşteri onam formları ile uygulama öncesi/sonrası fotoğraflarının Supabase Storage üzerinden klasörlenmiş şekilde güvenli olarak saklanması.

## Style Guidelines:

- Profesyonellik ve zarafet için zengin menekşe (#5229A3) ana renk, açık lavanta (#F1EFF3) arka plan ve vurgular için canlı mavi-mor (#6680FF) renk paleti. Karanlık ve aydınlık mod desteği.
- Dashboard üzerindeki yoğun veri takibini kolaylaştıran, modern ve sıcak bir görünüm sunan 'PT Sans' yazı tipi.
- Hızlı navigasyon ve kullanım kolaylığı sağlayan, temiz hatlı ve minimal tasarıma sahip Lucide React tabanlı çizgi ikonlar.
- Masaüstü ve mobil uyumlu (responsive), yan menü navigasyonlu, veri tabloları ve özet kartları ile organize edilmiş temiz arayüz düzeni.
- Form geçişleri, randevu durumu güncellemeleri ve buton etkileşimleri için kullanıcıyı yormayan akıcı ve profesyonel mikro etkileşimler.