# Mishaps 🧨

**Final Project - Keamanan Jaringan 2024**
> [!Warning]
> *Catatan: Proyek ini tidak diperuntukkan untuk deployment production. Semua eksploitasi dilakukan sebagai simulasi edukatif.*

Mishaps adalah aplikasi web sederhana yang dibuat sebagai target simulasi *penetration testing* untuk mendeteksi dua kerentanan, yaitu **Insecure JWT** dan **Weak Session ID**.

## 👩🏻‍💻 Contributors
### Kelompok 5:
- 2206059383 - [Aisyah Arifatul Alya](https://github.com/arifatalya)
- 2206062926 - [Audrina Cristella Hasibuan](https://github.com/hyde0106)

## ⚠️ Kerentanan yang Disimulasikan
### 1. Insecure JWT
- Algoritma yang digunakan awalnya adalah `"none"`, sehingga JWT tidak tervalidasi secara aman karena tidak memiliki signature.
- Token dapat dimodifikasi bebas dan digunakan kembali.

#### 🔐 Remediasi:
- Mengganti algoritma JWT ke `RS256` (asymmetric crypto) dari `"none"`.
- Menambahkan expired time untuk setiap session ID.

### 2. Weak Session ID
- Session ID bersifat prediktif.
- Tidak ada mekanisme expiry time untuk session ID yang sudah ada.

#### 🔐 Remediasi:
- Generate Session ID dengan 32-byte random value.
- Gunakan Redis untuk menyimpan sesi sementara dengan expired time 15 menit.

## 🚀 Cara Menjalankan

### **A. Pentest-Target (Vulnerable)**
1. **Clone repositori ini:**
   ```
   git clone https://github.com/arifatalya/Mishaps.git
   cd Mishaps
   cd 'Pentest-Target (Vulnerable)'
   ```

2. **Instalasi dependencies:**
   ```
   npm install
   ```

3. **Konfigurasi file `.env` pada frontend:**
   ```env
   VITE_API_URL=http://localhost:4000
   ```
   
4. **Konfigurasi file `.env` pada backend:**
   ```env
   MONGODB_URI=[Your MongoDB URI]
   PRIVATE_KEY="[Your Private Key]"
   PUBLIC_KEY="[Your Public Key]"
   ```

5. **Jalankan server dan client:**
    ```
    npm run server
    ```
    ```
    npm run dev
    ```

6. **Akses web di browser:**
   ```
   http://localhost:5173
   ```
### B. Pentest-Target

1. **Clone repositori ini:**
   ```
   git clone https://github.com/arifatalya/Mishaps.git
   cd Mishaps
   cd Pentest-Target 
   ```

2. **Instalasi dependencies:**
   ```
   npm install
   ```

3. **Konfigurasi file `.env` pada frontend:**
   ```env
   VITE_API_URL=http://localhost:4000
   ```
   
4. **Konfigurasi file `.env` pada backend:**
   ```env
   MONGODB_URI=[Your MongoDB URI]
   NODE_ENV=production
   ```

5. **Jalankan server dan client:**
    ```
    npm run server
    ```
    ```
    npm run dev
    ```

6. **Akses web di browser:**
   ```
   http://localhost:5173
   ```
   
## 📋 Langkah Eksploitasi
### 1. **Session Hijacking via Wireshark**
Eksploitasi dilakukan dengan menangkap lalu lintas jaringan saat proses login berlangsung, kemudian mencuri token dan session ID yang terlihat dalam HTTP request-response.

**Langkah-langkah:**
1. Jalankan Wireshark dengan adapter `loopback traffic`.
2. Akses website Mishaps dan lakukan proses register dan login.
3. Setelah login berhasil, hentikan capture Wireshark.
4. Filter protokol HTTP, lalu cari request dengan metode `POST`.
5. Buka detail paket dan cari token (`JWT`) serta `Session ID` pada header response.
6. Gunakan tools seperti [crackstation.net](https://crackstation.net/) untuk menguji prediktabilitas Session ID.
7. Verifikasi kelemahan JWT melalui [jwt.io](https://jwt.io). Terlihat bahwa algoritma JWT menggunakan `"none"`, yang berarti token tidak memiliki signature dan sangat rentan terhadap modifikasi payload.
8. Berdasarkan token tersebut, attacker bisa menyamar sebagai pengguna yang sah dan dapat mengakses fitur web tanpa login yang valid.

---

### 2. **Fuzzing dan Penghapusan Akun via OWASP ZAP**
Eksploitasi dilakukan dengan teknik directory fuzzing dan replikasi request berbahaya menggunakan token hasil pencurian.

**Langkah-langkah:**
1. Atur proxy browser menggunakan ekstensi seperti SwitchyOmega, arahkan ke port lokal ZAP (misalnya `localhost:8080`).
2. Tambahkan Root CA milik ZAP ke browser agar dapat menganalisis trafik HTTPS.
3. Akses web target dan login sebagai pengguna biasa.
4. Di ZAP, cari entri request login dari tab *History*.
5. Simpan *response* yang berisi JWT dan Session ID dari korban.
6. Gunakan ZAP Fuzzer untuk mencari direktori tersembunyi:
   - Klik kanan pada URL dan pilih “Fuzz…”
   - Tambahkan payload dengan wordlist `.txt`
   - Jalankan proses fuzzing
7. ZAP akan menemukan direktori `/api/delete` dengan status `401 Unauthorized`, yang artinya endpoint tersedia tapi butuh otorisasi.
8. Gunakan *Manual Request Editor* di ZAP untuk mengirim ulang request ke `/api/delete`:
   - Tambahkan Header `Authorization` berisi token korban.
   - Tambahkan body berisi Session ID.
9. Akun dengan email target (misalnya `iniadalahcontoh@gmail.com`) akan berhasil dihapus.
10. Verifikasi bahwa user tersebut tidak bisa login kembali karena akunnya telah dihapus secara ilegal.

## 🎞 Tampilan User Interface:
#### 1. Home Page (Not Logged In)
<img width="2559" height="1512" alt="image" src="https://github.com/user-attachments/assets/06abe892-a79b-4ca5-8d42-905e7f7ad365" />

#### 2. Home Page (Logged In)
<img width="2559" height="1513" alt="image" src="https://github.com/user-attachments/assets/d2d3cf06-4f99-4e03-a9e4-63cd500d40c9" /> \
<img width="2559" height="1511" alt="image" src="https://github.com/user-attachments/assets/aedd8fef-c124-4592-abbe-65c0c2afe094" /> \
<img width="2559" height="1512" alt="image" src="https://github.com/user-attachments/assets/3ebe782f-a70b-4041-85a8-aeb4852e9f53" />

#### 3. User Page
- Editing \
  <img width="1344" height="1505" alt="image" src="https://github.com/user-attachments/assets/6972015e-ea5a-41ae-8328-32f8a4b3110a" />
- Not Editing \
  <img width="1345" height="1510" alt="image" src="https://github.com/user-attachments/assets/c01dd238-d28f-416c-b22a-84550add063c" />
  
#### 4. Login Page
<img width="2559" height="1512" alt="image" src="https://github.com/user-attachments/assets/59b44988-40d5-4af2-af76-3102a06818b6" />

#### 5. Register Page
<img width="2558" height="1511" alt="image" src="https://github.com/user-attachments/assets/bef1513d-9837-4430-997e-dd9c42dbbb68" />



