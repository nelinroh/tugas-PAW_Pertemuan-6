# Taskly — Pengelola Tugas Kuliah

Aplikasi web sederhana untuk mencatat, mengedit, menghapus, dan memantau status tugas kuliah. Dibuat menggunakan **TypeScript** dan **Vite**.

## Fitur
- Menampilkan daftar tugas kuliah.
- Menambah, mengedit, dan menghapus tugas.
- Mengubah status tugas menjadi selesai/belum selesai.
- Filter semua, belum selesai, dan selesai.
- Data tersimpan di `localStorage` browser.
- Tampilan responsif untuk desktop dan ponsel.

## Menjalankan proyek
Pastikan Node.js dan npm sudah terpasang.

```bash
npm install
```

Salin `.env.example` menjadi `.env`, lalu sesuaikan nilainya:

```env
VITE_APP_NAME=Taskly
VITE_APP_VERSION=1.0.0
```

Jalankan server pengembangan:

```bash
npm run dev
```

Buat versi produksi:

```bash
npm run build
```

Pratinjau hasil build:

```bash
npm run preview
```

Hasil build berada di folder `dist/`.

## Penjelasan teknologi

### Git dan GitHub
Git adalah version control system untuk mencatat perubahan kode. GitHub adalah layanan untuk menyimpan repository Git secara online dan berkolaborasi. Branch memungkinkan pengembangan fitur secara terpisah, merge menggabungkan perubahan, Pull Request (PR) mengajukan perubahan untuk ditinjau, sedangkan push mengirim commit ke remote dan pull mengambil serta menggabungkan perubahan dari remote.

### npm
npm adalah package manager Node.js untuk memasang dan mengelola package. `package.json` menyimpan informasi proyek, dependencies, dan scripts. `dependencies` berisi package yang dibutuhkan aplikasi saat berjalan, sedangkan `devDependencies` berisi alat bantu pengembangan/build seperti TypeScript dan Vite. npm scripts seperti `dev`, `build`, dan `preview` menjalankan perintah yang sudah didefinisikan.

### Semantic Versioning
Format versi umumnya `MAJOR.MINOR.PATCH`. MAJOR menandakan perubahan besar yang tidak kompatibel, MINOR menambahkan fitur yang kompatibel, dan PATCH memperbaiki bug tanpa merusak kompatibilitas. Contoh `1.2.3`.

### TypeScript
TypeScript menambahkan sistem tipe pada JavaScript. Di proyek ini terdapat primitive type (`string`, `number`, `boolean`), array (`Task[]`), interface (`Task`), type alias dan union type (`TaskStatus`), serta generic sederhana (`getFromStorage<T>` dan `saveToStorage<T>`).

### Vite, compiler, transpiler, dan bundler
Vite menyediakan server pengembangan yang cepat dan proses build untuk aplikasi web. TypeScript bertindak sebagai bahasa yang diperiksa dan ditransformasikan agar dapat dijalankan sebagai JavaScript. **Compiler** menerjemahkan atau memeriksa kode dari satu bentuk/bahasa ke bentuk lain. **Transpiler** adalah jenis compiler yang menerjemahkan kode ke bahasa dengan tingkat abstraksi serupa, misalnya TypeScript ke JavaScript. **Bundler** menggabungkan dan mengoptimalkan modul serta aset menjadi file produksi yang siap dipublikasikan. Pada script build proyek ini, `tsc -b` memeriksa TypeScript dan Vite membangun aset produksi.

### Environment Variables
File `.env` menyimpan konfigurasi lokal seperti nama dan versi aplikasi. Variabel yang ingin diakses oleh kode browser Vite harus diawali `VITE_`. File `.env` dimasukkan ke `.gitignore`, sedangkan `.env.example` menjadi contoh konfigurasi yang aman untuk dibagikan. Jangan pernah menaruh password, token, atau API key rahasia pada variabel `VITE_`, karena nilainya dapat terlihat oleh pengguna di browser.

## Alur Git yang dapat dipraktikkan

Jalankan perintah berikut di terminal pada folder proyek. Ganti URL remote dengan URL repository GitHub milik sendiri.

```bash
git init
git add .
git commit -m "chore: initial Taskly project"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main

git checkout -b feature/task-filter
# Ubah atau kembangkan fitur filter, lalu:
git add .
git commit -m "feat: add task filters"
git push -u origin feature/task-filter
```

Buat Pull Request dari branch `feature/task-filter` ke `main` melalui GitHub, lalu lakukan merge setelah ditinjau.

Buat branch kedua dan lakukan commit tambahan:

```bash
git checkout main
git pull origin main
git checkout -b feature/task-empty-state
# Ubah tampilan empty state, lalu:
git add .
git commit -m "feat: improve empty state"
git push -u origin feature/task-empty-state
```

### Latihan merge conflict (simulasi)
Untuk mencoba conflict, buat dua branch dari commit yang sama. Ubah baris yang sama pada file yang sama di kedua branch, lalu commit masing-masing. Saat merge branch kedua, Git akan memberi tanda conflict. Buka file tersebut, pilih/gabungkan perubahan yang benar, hapus penanda `<<<<<<<`, `=======`, dan `>>>>>>>`, lalu:

```bash
git add .
git commit -m "fix: resolve merge conflict"
```

**Catatan:** bukti 5 commit, 2 branch, merge, Pull Request, push/pull, dan penyelesaian conflict harus dibuat pada repository GitHub milik mahasiswa. ZIP ini menyediakan source code dan panduan, bukan riwayat Git/PR palsu.

## Deploy ke website pribadi
Jalankan `npm run build`, lalu unggah isi folder `dist/` ke hosting website pribadi. Jika menggunakan GitHub Pages, atur sumber deploy sesuai panduan GitHub Pages dan pastikan konfigurasi `base` Vite sesuai alamat subfolder repository bila diperlukan.
