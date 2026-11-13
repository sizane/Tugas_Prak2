## Tugas Prak RSI :'v

## Prasyarat

- Node.js 20 atau lebih baru
- SQL Server yang dapat diakses lewat SQL Authentication

## Instalasi dan menjalankan

### 1. Database

Jalankan secara berurutan di SQL Server:

1. `sql/01-create-database-and-user.sql` (ganti password pada script terlebih dahulu)
2. `sql/Script-5.sql` (membuat tabel)
3. `sql/Script-6.sql` (data awal)

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env     # lalu isi nilainya
npx tsx src/db/seed-passwords.ts   # mengisi hash password akun contoh
npm run dev
```

Konfigurasi `backend/.env` format seperti di `backend/.env.example` :

| Variabel | Keterangan |
|---|---|
| `PORT` | Port API (default 3000) |
| `CORS_ORIGIN` | Origin frontend, default `http://localhost:1433`  |
| `DB_SERVER`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Koneksi SQL Server |
| `DB_ENCRYPT`, `DB_TRUST_SERVER_CERTIFICATE` | Opsi koneksi |
| `JWT_SECRET` | String acak panjang (wajib) |
| `JWT_EXPIRES_IN` | Masa berlaku token, mis. `1d` |

API berjalan di `http://localhost:3000`, dokumentasi Swagger di `http://localhost:3000/docs`, cek koneksi di `/health`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend berjalan di `http://localhost:5173`. Secara default request ke `/api/v1` diteruskan oleh proxy Vite ke `http://localhost:3000`. Untuk memakai alamat backend lain, salin `frontend/.env.example` menjadi `frontend/.env` dan ubah `VITE_API_BASE_URL` (mis. `http://localhost:3000/api/v1`); pastikan `CORS_ORIGIN` backend sesuai.

## Endpoint yang dipakai frontend (prefix `/api/v1`)

| Method | Path | Akses |
|---|---|---|
| GET | `/stalls`, `/stalls/:id` | Publik (query: `search`, `category`, `page`, `limit`) |
| POST | `/stalls` | Owner, Admin (pemilik diambil dari token) |
| PUT | `/stalls/:id` | Admin, atau Owner pemilik warung (selain itu 403) |
| DELETE | `/stalls/:id` | Admin |
| POST | `/auth/register` | Publik (role customer) |
| POST | `/auth/login` | Publik |
| GET | `/auth/me` | Login |

## Fitur frontend per role

| Role | Yang tersedia |
|---|---|
| Publik | Daftar warung (cari, filter, pagination), detail warung, registrasi, login |
| Customer | Sama seperti publik, tanpa akses halaman kelola warung |
| Owner | Halaman Kelola Warung: tambah warung, ubah warung (milik sendiri diterima, milik owner lain ditolak backend dengan 403) |
| Admin | Halaman Kelola Warung: tambah, ubah, dan hapus semua warung |

- Halaman kelola warung ada di `/manage`

- pengguna dengan role lain diarahkan ke `/forbidden`, dan pengguna yang belum login diarahkan ke `/login`.