# Frontend Sistem Review Kantin

React 19 + TypeScript + Vite + Tailwind CSS v4. Komunikasi HTTP memakai Axios (`src/lib/http.ts`, endpoint di `src/lib/api.ts`).

## Menjalankan

```bash
npm install
npm run dev
```

Backend harus berjalan di `http://localhost:3000`. Request ke `/api/v1` diteruskan oleh proxy Vite (`vite.config.ts`).

Untuk alamat backend lain, salin `.env.example` menjadi `.env`:

```dotenv
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

lalu pastikan `CORS_ORIGIN` di `backend/.env` sama dengan origin Vite.

## Perintah

- `npm run dev` : server pengembangan
- `npm run build` : cek tipe dan build produksi
- `npm run lint` : ESLint

## Catatan

- Token JWT disimpan di localStorage (`kantin_token`) dan dikirim lewat interceptor Axios sebagai header Bearer.
- Respons 401 pada endpoint selain login/register/me menghapus token dan memicu event `auth:unauthorized`.
- Respons 403 tidak menghapus sesi; pesan dari backend ditampilkan di halaman.
