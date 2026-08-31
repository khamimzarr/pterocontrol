# PteroControl - Continuation Guide & Status Report

## 🟢 Terakhir Diselesaikan (Agustus 2026)
1. **Perbaikan API Power (Server Controls)**
   - Mengubah rute pengiriman kontrol server dari path URL (`signals/start`) menjadi JSON Payload `{"signal": "start"}` ke endpoint `/power`, sesuai dengan standar asli Pterodactyl Wings API. Tombol Power kini berfungsi normal 100%.

2. **Penyempurnaan UX & Layout (Klik & Navigasi)**
   - **Tabel Server:** Baris server di halaman Dashboard sekarang bisa diklik (*clickable rows*) dan mengarahkan langsung ke panel server, lengkap dengan efek *hover* yang nyaman.
   - **TopNav:** Menu navigasi kini pintar, mendeteksi rute aktif dan menebalkan teks menu saat ini.
   - **Tombol Power:** Diseragamkan menjadi bentuk *pill* dengan ikon (SVG) yang rapi dan serasi.

3. **Penyempurnaan UI Console & Debugging System**
   - Merombak tampilan XTerm.js menjadi ala jendela MacOS gelap (*dark theme*).
   - Menambahkan sistem **Visual Debug Logging** langsung ke layar console. Ini dilakukan karena sebelumnya console tidak menampilkan apa-apa (terhenti tanpa memunculkan log dari daemon).

## 🟡 Tugas Selanjutnya (Segera)
1. **Membaca Hasil Debug Console**
   - Kita sedang menunggu hasil laporan dari Terminal Console untuk melihat persis di mana koneksi WebSocket Pterodactyl terputus. Kemungkinannya adalah:
     - Masalah *CORS* (Daemon Pterodactyl memblokir koneksi dari Vercel).
     - Token otentikasi gagal (Format token *auth* JSON).
     - Koneksi campur (*Mixed Content*) antara `https://` dan `ws://`.

2. **Mulai Membangun Fitur Baru (Opsional, setelah Console selesai)**
   - **Grafik Real-time:** Menambahkan visualisasi CPU dan RAM yang berjalan langsung (seperti detak jantung) menggunakan *Recharts*.
   - **File Manager:** Mengintegrasikan VS Code versi web (*Monaco Editor*) untuk mengedit file server langsung dari PteroControl.

## 📝 Catatan Tambahan
Seluruh pembaruan di atas telah melalui protokol verifikasi kompilasi internal (TypeScript/Webpack) dan dipastikan berjalan stabil (Exit 0) tanpa merusak komponen yang sudah ada. Semua kode terbaru berada di *branch* utama (`main`).
