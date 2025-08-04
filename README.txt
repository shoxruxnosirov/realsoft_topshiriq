# REALSOFT_TOPSHIRIQ

---

## Loyihaning qisqacha tavsifi

**REALSOFT_TOPSHIRIQ** — bu NestJS (Node.js) va PostgreSQL asosida yozilgan RESTful API bo‘lib, foydalanuvchilar (admin/user) va mijozlar (customers) bilan ishlash, autentifikatsiya, rollar, CRUD amallari va paginatsiya imkoniyatlarini taqdim etadi. Loyihada JWT orqali xavfsiz autentifikatsiya, Swagger orqali API hujjatlari va Postman kolleksiya fayli orqali test qilish imkoniyati mavjud.

---

## Loyihaning to‘liq tuzilmasi

```
realsoft-topshiriq/
│
├── src/
│   ├── main.ts                         # Dastur kirish nuqtasi
│   ├── app.module.ts                   # Asosiy modul
│   ├── database/
│   │   ├── database.module.ts          # DB modul konfiguratsiyasi
│   │   ├── database.providers.ts       # DB providerlari
│   │   └── migrations/                 # Migratsiya fayllari
│   ├── modules/
│   │   ├── roles/
│   │   │   ├── roles.controller.ts     # Foydalanuvchilar uchun controller
│   │   │   ├── roles.service.ts        # Foydalanuvchilar uchun servis
│   │   │   ├── roles.module.ts         # Modul fayli
│   │   │   ├── dto/                    # DTO fayllar (ma'lumotlar transfer obyektlari)
│   │   │   └── entities/               # Entity fayllar (ORM uchun)
│   │   └── customers/
│   │       ├── customers.controller.ts   # Mijozlar uchun controller
│   │       ├── customers.service.ts      # Mijozlar uchun servis
│   │       ├── customers.module.ts       # Modul fayli
│   │       ├── dto/                      # DTO fayllar
│   │       └── entities/                 # Entity fayllar
│   └── common/                             # Umumiy util, guard, decorator va boshqalar
│
├── test/                                   # Test fayllari (unit va e2e)
│
├── .env                                        # Muhit o‘zgaruvchilari (DB, JWT va boshqalar)
├── package.json                                # Loyihaning konfiguratsiyasi va skriptlari
├── tsconfig.json                               # TypeScript konfiguratsiyasi
├── README.txt                                  # Loyihaning qisqacha yo‘riqnomasi (shu fayl)
├── realsoft_topshiriq.postman_collection.json  # Postman kolleksiya fayli (API test uchun)
│
└── ... (boshqa yordamchi fayllar: .gitignore, .prettierrc va boshqalar)
```

---

## Loyihada ishlatilgan texnologiyalar va kutubxonalar

- **Node.js** — server platformasi
- **NestJS** — asosiy backend framework
- **TypeScript** — zamonaviy va xavfsiz dasturlash tili
- **TypeORM** — ORM (ma’lumotlar bazasi bilan ishlash uchun)
- **PostgreSQL** — ma’lumotlar bazasi
- **JWT (jsonwebtoken)** — autentifikatsiya va avtorizatsiya
- **bcrypt** — parollarni xesh qilish
- **Swagger** — API hujjatlari (http://localhost:3000/api)
- **Postman** — API test va hujjatlash uchun (loyihada .postman_collection.json fayli mavjud)

---

## Ishga tushirish bo‘yicha batafsil yo‘riqnoma

### 1. Talablar

- Node.js (v18 yoki undan yuqori)
- PostgreSQL

### 2. Ma’lumotlar bazasini sozlash

```bash
sudo -i -u postgres
psql
CREATE USER realsoft_user WITH PASSWORD 'password123';
CREATE DATABASE realsoft_db OWNER realsoft_user;
\q
exit
```

### 3. Muhit o‘zgaruvchilarini sozlash

Loyiha papkasida `.env` faylini yarating va quyidagicha to‘ldiring:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=realsoft_user
DB_PASSWORD=password123
DB_DATABASE=realsoft_db
```

### 4. Loyihani o‘rnatish

```bash
npm install
```

### 5. Migratsiyalar va boshlang‘ich ma’lumotlar

```bash
npm run build
npopm run migration:generate
npm run migration:run
npm run seed
```

### 6. Loyihani ishga tushirish

```bash
npm run start:dev
# yoki
npm run start
```

### 7. Swagger API hujjatlari

Brauzerda oching:  
http://localhost:3000/api


### 8. Testlar

```bash
npm run test
npm run test:e2e
```

### 9. Postman kolleksiyasi

- `realsoft_topshiriq.postman_collection.json` faylini Postman'ga import qilib, barcha API endpointlarini test qilishingiz mumkin.

---

## API imkoniyatlari va endpointlar

### Roles (foydalanuvchilar)
- **POST /roles/login** — login, JWT olish
- **POST /roles** — yangi user yaratish (admin)
- **GET /roles** — barcha userlarni olish (admin)
- **GET /roles/search** — userlarni izlash (admin)
- **GET /roles/:id** — userni ID bo‘yicha olish (admin)
- **PUT /roles/:id** — userni yangilash (admin)
- **DELETE /roles/:id** — userni o‘chirish (admin)
- **PATCH /roles/me** — profilni yangilash (admin yoki user)
- **POST /roles/refreshtoken** — tokenni yangilash

### Customers (mijozlar)
- **POST /customers** — yangi mijoz yaratish (user)
- **GET /customers** — mijozlar ro‘yxati (user va admin)
- **GET /customers/search** — mijozlarni izlash
- **GET /customers/:id** — mijozni ID bo‘yicha olish
- **PATCH /customers/:id** — mijozni yangilash (user)
- **DELETE /customers/:id** — mijozni o‘chirish (user)

---

## Rollar va imkoniyatlar

- **Admin**: barcha foydalanuvchilar va mijozlarni boshqaradi
- **User**: faqat o‘z mijozlari bilan ishlaydi

**Default admin login (seedingdan so‘ng):**
```
username: admin
password: admin
```

---

## Muhim eslatmalar

- Har bir modul uchun alohida papka va fayllar mavjud.
- DTO va Entity fayllari orqali ma'lumotlar validatsiyasi va ORM ishlaydi.
- Guard va Decoratorlar orqali ruxsatlar va autentifikatsiya amalga oshiriladi.
- Swagger orqali barcha endpointlarni ko‘rib chiqish va test qilish mumkin.
- Postman kolleksiyasi orqali barcha endpointlarni tezda test qilish mumkin.

---
