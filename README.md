# Naga Gold Buyback

> Halaman informasi dan estimasi nilai buyback emas untuk pelanggan.

Project ini adalah frontend React berbasis Vite yang menampilkan detail barang yang pernah dibeli pelanggan, estimasi nilai buyback, status verifikasi transaksi, serta ringkasan yang dapat dicetak atau disimpan sebagai PDF.

## Fitur

- Mengambil data transaksi berdasarkan kode barcode dari URL.
- Menampilkan nama barang, berat, harga beli, dan tanggal pembelian.
- Menampilkan rentang estimasi nilai buyback dalam format Rupiah.
- Menampilkan status transaksi terverifikasi.
- Fallback ketika foto produk tidak tersedia atau gagal dimuat.
- Tampilan responsif untuk desktop, tablet, dan mobile.
- Menyediakan tombol **Unduh Ringkasan** melalui dialog print browser.
- Mendukung format QR lama dengan parameter `kode_toko` yang berisi URL backend.
- Menampilkan state loading dan error ketika data belum tersedia atau request gagal.

## Teknologi

- React 19
- Vite 6
- Lucide React untuk ikon
- CSS responsive tanpa framework UI

## Menjalankan project

### Prasyarat

- Node.js versi 18 atau lebih baru
- npm

### Instalasi

```bash
npm install
```

Salin file environment contoh menjadi `.env`, lalu isi token pusat:

```bash
cp .env.example .env
```

```env
VITE_TOKEN_PUSAT=token-pusat-anda
```

> File `.env` berisi kredensial dan tidak boleh di-commit. File `.env.example` tetap boleh di-commit sebagai template konfigurasi.

### Development

```bash
npm run dev
```

Secara default, Vite menjalankan aplikasi di `http://localhost:5173`.

### Production build

```bash
npm run build
npm run preview
```

## Parameter URL

Aplikasi membaca parameter berikut dari query string:

| Parameter | Wajib | Keterangan |
| --- | --- | --- |
| `kode_barcode` | Ya | Kode barcode barang yang akan dicari. |
| `backend_url` | Ya | URL backend atau URL endpoint `/buyback/check/:barcode`. |
| `kode_toko` | Opsional | Kode toko. Juga mendukung format QR lama. |
| `nama_toko` | Opsional | Nama toko fallback jika API tidak mengirimkan nama toko. |

Contoh:

```text
http://localhost:5173/?kode_barcode=ABC123&backend_url=https%3A%2F%2Fapi.example.com
```

Jika `backend_url` belum berakhiran `/buyback/check/:barcode`, aplikasi akan menambahkan path tersebut secara otomatis.

### Format QR lama

Format lama berikut tetap didukung:

```text
?kode_toko=KODETOKOkurlshttps://api.example.com/buyback/check/ABC123
```

## Kontrak API

Request dikirim menggunakan method `GET` dengan header:

```http
X-Auth-Token: <VITE_TOKEN_PUSAT>
Accept: application/json
```

Respons dapat berupa object langsung atau object yang dibungkus dalam `data`. Struktur data yang digunakan frontend:

```json
{
  "item": {
    "nama_barang": "Cincin Anak",
    "kode_barcode": "ABC123",
    "berat": 2,
    "harga_beli": 2000000,
    "tgl_beli": "2026-09-20",
    "nama_toko": "NAGA GOLD",
    "foto_barang": "https://example.com/product.jpg"
  },
  "buyback_result": {
    "terendah": 1900000,
    "tertinggi": 3900000
  }
}
```

Frontend juga menerima bentuk berikut:

```json
{
  "data": {
    "item": {},
    "buyback_result": {}
  }
}
```

## Struktur project

```text
├── public/              # Asset statis dan background halaman
├── src/
│   ├── data/             # Data statis untuk trust points
│   ├── main.jsx          # Komponen dan alur utama aplikasi
│   └── styles.css        # Styling responsive dan print
├── .env.example          # Template environment variable
├── index.html
├── package.json
└── vite.config.js
```

## Catatan keamanan

`VITE_TOKEN_PUSAT` dipakai di browser dan akan ikut dibundle ke frontend. Karena itu, token tersebut harus diperlakukan sebagai credential yang dapat terlihat oleh client. Untuk lingkungan production dengan kebutuhan keamanan lebih tinggi, request token sebaiknya dipindahkan ke backend/proxy yang aman.
# nagagold-buyback
