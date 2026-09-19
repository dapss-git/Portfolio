# Portfolio Muhammad Dafa Pratama

Portfolio pribadi Muhammad Dafa Pratama — Siswa SMK Kelas XI AKL.

## Tech Stack
- **Next.js 14** (App Router)
- **TypeScript** (100% TS)
- **Tailwind CSS**
- **Telegram Bot API** (untuk form pesan)

## Fitur
- ✅ Loading screen animasi keren
- ✅ Navbar responsive + burger menu animasi
- ✅ Hero section dengan typing effect
- ✅ About section dengan data JSON-style
- ✅ Skills section dengan animated progress bar
- ✅ Contact section dengan **drag-to-verify slider** sebelum kirim pesan
- ✅ Payment section (Gopay, OVO, Dana, QRIS)
- ✅ Dark anime theme (biru/ungu/cyan)
- ✅ Fully deployable ke Vercel, Netlify, GitHub Pages

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Setup environment variables
Buat file `.env.local` di root project:
```
TELEGRAM_BOT_TOKEN=8860804193:AAFbpvZGiIC-mtMMx1ugfZtJYVWbQXKROAA
TELEGRAM_CHAT_ID=8136654727
```

### 3. Tambahkan foto profil
- Letakkan foto profil kamu di `public/avatar.png`
- Letakkan gambar QRIS di `public/qris.jpeg`

### 4. Jalankan lokal
```bash
npm run dev
```
Buka http://localhost:3000

### 5. Deploy ke Vercel
1. Push project ke GitHub
2. Import di https://vercel.com
3. Tambah environment variables:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
4. Deploy! 🚀

### Deploy ke Netlify
1. Push ke GitHub
2. Import di https://netlify.com
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Tambah env vars yang sama

## Struktur Project
```
portfolio/
├── app/
│   ├── api/
│   │   └── send-message/
│   │       └── route.ts        ← Telegram API
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx                ← Halaman utama
│   ├── LoadingScreen.tsx
│   ├── Navbar.tsx
│   ├── SliderVerify.tsx        ← Drag-to-verify
│   └── ContactSection.tsx
├── public/
│   ├── avatar.png              ← Foto kamu (tambahkan manual)
│   └── qris.jpeg               ← QRIS kamu
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
├── vercel.json
└── .env.local                  ← Jangan di-push ke GitHub!
```
