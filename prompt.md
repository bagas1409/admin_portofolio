

> **ROLE**
>
> Kamu adalah **Senior Frontend Engineer + UI Motion Designer** yang membangun **Admin Panel Production-Ready** untuk Website Portfolio Developer.
>
> Fokus utama:
>
> * **UI modern**
> * **UX profesional**
> * **Motion & transition halus**
> * **Maintainable architecture**
>
> Jangan bertanya balik.
> Langsung implementasi.

---

## 🎯 TUJUAN APLIKASI

Membangun **Admin Panel** untuk mengelola konten Portfolio:

* Login Admin
* CRUD Project (mobile & web)
* Upload image ke backend API
* Input YouTube video URL
* Publish / Draft project
* Semua interaksi **halus & animatif**

---

## 🧱 STACK (WAJIB)

* **Next.js (App Router)**
* **TypeScript**
* **Tailwind CSS v4**
* **Framer Motion** → animasi masuk / keluar
* **Axios / Fetch**
* **JWT Authentication**
* **No Vite (Next.js native bundler)**

---

## 🎨 DESIGN SYSTEM (WAJIB PATUH)

### 🎨 Warna (HARUS TERPUSAT / CENTRALIZED)

Gunakan **CSS Variables / Theme File**, JANGAN hardcode di component.

**Primary Color**

```
--color-primary: #FE7F2D;
```

**Background**

```
--color-bg: #F5F2F2;
```

**Text Primary**

```
--color-text: #132440;
```

**Soft Accent / Surface**

```
--color-surface: #FCF9EA;
```

📌 Semua komponen **HARUS menggunakan variable ini**,
agar warna bisa diganti **1 tempat saja**.

---

## ✨ UI & UX RULES (PENTING)

### ❌ DILARANG

* `alert()`
* UI kasar / instant
* Warna hardcode di JSX
* Animasi berlebihan yang mengganggu

### ✅ WAJIB

* Toast / notification system yang **indah & smooth**
* Loading state (skeleton / spinner)
* Hover effect
* Page transition
* Modal transition (scale + fade)
* Micro-interaction (button, input, card)

---

## 🧭 STRUKTUR HALAMAN (WAJIB ADA)

### 1️⃣ Login Page

* Centered card
* Animasi masuk (fade + scale)
* Error login → toast notification
* Success → smooth redirect

---

### 2️⃣ Dashboard

* Sidebar modern (collapse / expand)
* Active menu indicator (animated)
* Overview (jumlah project, web, mobile)

---

### 3️⃣ Project List

* Card / table modern
* Filter:

  * All
  * Mobile
  * Web
* Hover effect
* Action menu (edit / delete)
* Delete → confirm modal (NO alert)

---

### 4️⃣ Create / Edit Project

Form dengan:

* Title
* Type (mobile / web)
* Short description
* Features (dynamic input)
* Tech stack (chips / tags)
* Upload image (preview sebelum submit)
* YouTube video URL input
* Status (draft / published)

Semua submit:

* Loading state
* Success toast
* Error toast

---

### 5️⃣ Image Upload

* Upload ke **Backend API**
* Preview image
* Progress indicator
* Reject non-image file

---

## 🔐 AUTH & STATE

* Token disimpan di memory / cookie (aman)
* Protected routes (dashboard tidak bisa diakses tanpa login)
* Auto logout jika token invalid
* Interceptor untuk handle error API → toast

---

## 🎥 ANIMATION GUIDELINE

Gunakan **Framer Motion** untuk:

* Page enter / exit
* Modal open / close
* Sidebar toggle
* Card hover subtle motion

Animasi:

* Halus
* Konsisten
* Profesional
* Tidak “alay”

---

## 🔌 API INTEGRATION (SUDAH ADA)

Base URL dari ENV:

```
NEXT_PUBLIC_API_URL
```

Endpoint:

* `POST /auth/login`
* `GET /projects`
* `POST /projects`
* `PUT /projects/:id`
* `DELETE /projects/:id`
* `POST /upload/image`

---

## 🧩 CODE QUALITY RULES

* Component reusable
* Separation of concern
* Tidak semua logic di page
* Naming jelas
* Clean & readable

---

## 📦 OUTPUT YANG DIHARAPKAN

1. Admin panel **langsung bisa dijalankan**
2. Tampilan **modern & profesional**
3. Semua animasi smooth
4. Warna terpusat & mudah diubah
5. Siap dipakai produksi
6. Tidak ada alert native browser

---

## ❌ LARANGAN TAMBAHAN

* Jangan pakai UI library berat (MUI, AntD)
* Jangan pakai inline style untuk warna utama
* Jangan bikin desain polos / basic

---

> **Mulai implementasi sekarang.
> Bangun admin panel seolah ini akan dipakai client enterprise.
> Fokus pada kualitas, bukan kecepatan.**

