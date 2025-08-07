# Pacific MMA Project Knowledge

## Project Overview
Pacific MMA is a martial arts gym management system built with Next.js 15 and Firebase.

## Tech Stack
- **Frontend**: Next.js 15.4.2, React 19, TypeScript
- **UI**: Material-UI (MUI), Framer Motion, GSAP
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Styling**: CSS Modules, Emotion

## Project Structure
```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
├── hooks/           # Custom React hooks
├── lib/             # Core libraries
│   ├── api/         # API middleware & handlers
│   ├── config/      # Configuration (env validation)
│   ├── errors/      # Error handling
│   ├── firebase/    # Firebase setup
│   └── security/    # Security middleware
├── modals/          # Modal components
├── providers/       # Context providers
├── services/        # Business logic & Firebase operations
├── styles/          # Global styles
└── utils/           # Utility functions
```

## Security Architecture
- **Authentication**: Firebase Auth with custom claims for roles
- **Authorization**: Role-based (admin, instructor, member)
- **Database Security**: Firestore Security Rules
- **API Protection**: Custom middleware with rate limiting
- **Input Validation**: Zod schemas + sanitization

## Key Features (Planned)
1. **User Management**: Registration, login, profile management
2. **Class Scheduling**: Create, manage, enroll in classes
3. **Membership System**: Different membership tiers
4. **Payment Integration**: Subscription and one-time payments
5. **Admin Dashboard**: User management, analytics
6. **Instructor Portal**: Class management, student tracking

## Database Collections
- `users`: User profiles and settings
- `classes`: MMA class schedules
- `enrollments`: Class enrollments
- `memberships`: Membership subscriptions
- `payments`: Payment records
- `products`: Services and products
- `audit_logs`: Security audit trail

## Environment Variables Required
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

## Development Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
```

## Security Best Practices
1. All sensitive operations through server-side API routes
2. Input sanitization on all user inputs
3. Rate limiting on all endpoints
4. Audit logging for sensitive operations
5. Environment variables for all secrets
6. CORS validation in production

## Current Status
- ✅ Basic Firebase setup
- ✅ Security architecture implemented
- ✅ Environment validation# 🧠 Claude.md

## 🎯 Projenin Amacı

Bu proje, **seyahat eden kullanıcıların spor yapma alışkanlıklarını sürdürebilmelerini sağlamak** amacıyla geliştirilmiştir. Kullanıcılar, sistemimiz üzerinden hazır spor turu paketleri satın alabilir veya tamamen kendilerine özel bir tur oluşturabilirler.

Ayrıca uygulama bünyesinde, kendi dövüş akademimize (MMA, BJJ gibi branşlar içeren) ait ayrı bir **academy** sayfası bulunur. Kullanıcılar bu alanda, spor salonumuzun ders programlarını ve içeriklerini görebilir. Bu içerikler, bizim için ayrı olarak geliştirdiğimiz bir **admin panel** üzerinden yönetilir.

---

## 🔧 Kullanılan Teknolojiler

- **Frontend**: Next.js (TypeScript ile)
- **Backend**: Firebase (Authentication, Firestore, Storage, Functions)
- **Design System**: MUI + Custom reusable components

---

## ✅ Genel Kurallar (Mutlaka Uyunması Gerekenler)

### 🔒 Güvenlik En Üst Önceliktir

- Uygulamamızın **250.000 kullanıcıya kadar sorunsuz şekilde çalışması** beklenmektedir.
- Kod, performans ve güvenlik bakımından **crash etmeyecek** şekilde yazılmalıdır.
- **Gereksiz veri yükü**, **açık endpoint**, **unprotected UI state** gibi konularda en iyi güvenlik yaklaşımları uygulanmalıdır.

### 🧠 Claude’tan Beklentilerimiz

1. **Kesinlikle senior bir developer gibi davran.**
2. **TypeScript hatası yapma.**  
   - Tüm tipler doğru ve kapsamlı tanımlanmalı.
   - `any` kullanımından kesinlikle kaçınılmalı.
3. **Kafana göre kod yazma.**
   - Koray’ın talimatları dışında **özellik E-K-L-E-M-E.**
   - Var olan özellikleri **S-İ-L-M-E veya değiştirme.**
4. **Gereksiz satır ve tekrar eden kod yazma.**
   - Kod minimal, temiz ve sade olmalı.
5. **Kod yazarken mutlaka frontend best practice'lere sadık kal.**
   - Dosya yapısı, component hiyerarşisi ve kod standardı önemli.
   - Reusable ve test edilebilir componentler yaz.
6. **Sürekli soru sorma.**
   - Talimatlar net verildiğinde, onları uygulamakla yetin.
   - Yalnızca **belirsizlik** varsa sor.

---

## 🧩 Uygulamanın Bölümleri

### 1. Kullanıcı Arayüzü (Main Website)
- **Paket Sayfası**: Hazır spor turlarını listeler.
- **Custom Paket Oluşturma**: Kullanıcılar kendi tarihlerini, spor tercihlerine göre özel bir deneyim oluşturabilir.
- **Academy Sayfası**: Kendi spor salonumuza ait dersler, eğitmen bilgileri ve içeriklerin bulunduğu sayfa.

### 2. Admin Panel
- Sadece yetkili kullanıcılar erişebilir.
- Takvim üzerinden ders eklenebilir (academy).
- Membership paketleri oluşturulabilir.
- Eğitmen ve içerik yönetimi yapılabilir.

---

## 🧱 Component Mimarisi

Tüm componentler:

- **Yeniden kullanılabilir**
- **Props ile yönetilebilir**
- **Kapsamına uygun modüler tasarlanmış**
- **MUI ve custom stil uyumlu**
- **Kod tekrarından uzak** olmalıdır.

---

## 🛡️ Ekstra Güvenlik Kuralları

- Firebase Security Rules **aktif ve katı** olmalı.
- API istekleri authenticated kullanıcılarla sınırlı olmalı.
- Admin panel işlemleri sadece admin yetkisine sahip kullanıcılarla yapılmalı.
- Form inputları ve dış veri kaynakları mutlaka **sanitize** edilmeli.

---

## 📌 Özetle

- Proje, **spor ve seyahat temelli bir kullanıcı platformudur.**
- Claude, **dediğimizin dışına çıkmadan**, **TypeScript ve best practice kurallarına bağlı**, **senior seviye temiz kod** yazmalıdır.
- Claude'un görevi **uygulamayı sağlam, hızlı, güvenli ve sürdürülebilir şekilde inşa etmek**tir.

- ✅ Error handling system
- ✅ API middleware
- 🔄 User authentication flows
- 📋 Class management system
- 📋 Payment integration

## Notes for AI Assistant
- Always prioritize security in implementations
- Use TypeScript strict mode
- Follow existing code patterns and conventions
- Validate all user inputs
- Use existing security middleware for API routes
- Don't create admin.ts files unless specifically needed for server-side operations