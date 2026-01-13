# Panduan Deployment ke Hostinger (rumahadvisor.com)

## Langkah 1: Sediakan File untuk Upload

Build project sudah siap di folder `dist/`. Folder ini mengandungi semua file yang perlu diupload.

## Langkah 2: Upload ke Hostinger

### Cara Upload Melalui File Manager Hostinger:

1. **Log masuk ke Hostinger Control Panel** (hPanel)
   - Pergi ke https://hpanel.hostinger.com
   - Log masuk dengan akaun awak

2. **Buka File Manager**
   - Di dashboard, cari dan klik "File Manager"
   - Atau pergi ke Website → File Manager

3. **Pergi ke Public HTML Folder**
   - Klik folder `public_html` (ini adalah folder utama untuk domain awak)
   - Kalau ada file lama, delete semua dahulu (backup dulu kalau perlu)

4. **Upload Files**
   - Klik butang "Upload" di atas
   - Drag & drop SEMUA file dari folder `dist/` ke sini
   - Pastikan upload file `.htaccess` juga (file tersembunyi)
   - Tunggu sehingga semua file selesai upload

### Struktur File yang Betul di public_html:

```
public_html/
├── .htaccess
├── index.html
├── favicon.svg
└── assets/
    ├── index-[hash].css
    └── index-[hash].js
```

## Langkah 3: Configure Domain

### Kalau Domain Belum Point ke Hosting:

1. **Di Hostinger, pergi ke Domains**
2. **Pilih rumahadvisor.com**
3. **Pastikan DNS point ke Hostinger nameservers**:
   - ns1.dns-parking.com
   - ns2.dns-parking.com

4. **Tunggu DNS propagation** (biasanya 1-24 jam)

### Kalau Domain Sudah Active:

- Domain awak patut dah automatically point ke folder `public_html`
- Cuba akses https://rumahadvisor.com

## Langkah 4: Setup SSL (HTTPS)

1. **Pergi ke hPanel → SSL**
2. **Pilih domain rumahadvisor.com**
3. **Install Free Let's Encrypt SSL Certificate**
4. **Tunggu beberapa minit untuk activation**

## Langkah 5: Configure Supabase untuk Production

### Update Allowed URLs di Supabase:

1. **Log masuk ke Supabase Dashboard**
   - Pergi ke https://supabase.com/dashboard

2. **Pilih Project anda**

3. **Pergi ke Authentication → URL Configuration**

4. **Tambah URLs berikut**:
   - Site URL: `https://rumahadvisor.com`
   - Redirect URLs:
     ```
     https://rumahadvisor.com
     https://rumahadvisor.com/**
     https://www.rumahadvisor.com
     https://www.rumahadvisor.com/**
     ```

5. **Save changes**

## Langkah 6: Test Website

### Semak perkara berikut:

1. ✅ Website boleh diakses di https://rumahadvisor.com
2. ✅ SSL certificate active (ada padlock hijau)
3. ✅ Calculator berfungsi dengan betul
4. ✅ Sign in/Sign up berfungsi
5. ✅ Semua page accessible (tidak ada 404 error)
6. ✅ Mobile responsive

## Langkah 7: Setup Google Analytics (Optional)

Kalau nak track visitors:

1. **Create Google Analytics Account**
   - Pergi ke https://analytics.google.com
   - Setup property untuk rumahadvisor.com

2. **Get Measurement ID** (contoh: G-XXXXXXXXXX)

3. **Tambah code di index.html** (dalam folder dist sebelum upload):
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

## Troubleshooting

### Problem: 404 Error bila refresh page
**Solution**: Pastikan file `.htaccess` sudah upload dan berada di folder `public_html`

### Problem: Website tak boleh access
**Solution**:
- Tunggu DNS propagation (sehingga 24 jam)
- Semak domain pointing ke nameservers yang betul
- Clear browser cache

### Problem: Login tidak berfungsi
**Solution**:
- Pastikan URLs sudah ditambah di Supabase Authentication settings
- Semak browser console untuk error messages

### Problem: CSS tidak load
**Solution**:
- Clear browser cache
- Semak file struktur betul di public_html
- Pastikan folder `assets/` ada dan berisi file CSS dan JS

## Update Website di Masa Hadapan

Bila nak update website:

1. Run `npm run build` di local
2. Delete semua file dalam `public_html` (kecuali `.htaccess`)
3. Upload semua file baru dari folder `dist/`
4. Clear browser cache untuk tengok changes

## Performance Tips

1. **Enable Cloudflare** (jika Hostinger support):
   - Tambah CDN untuk faster loading
   - Automatic caching

2. **Optimize Images**:
   - Compress images sebelum upload
   - Use modern formats (WebP)

3. **Monitor Performance**:
   - Guna Google PageSpeed Insights
   - Target score 90+ untuk mobile dan desktop

---

## Maklumat Penting

- **Domain**: rumahadvisor.com
- **Hosting**: Hostinger
- **Database**: Supabase
- **Build Tool**: Vite
- **Framework**: React + TypeScript

## Support

Kalau ada masalah:
1. Check Hostinger knowledge base
2. Contact Hostinger support (24/7 live chat)
3. Check Supabase documentation untuk database issues

---

✅ **Deployment Complete! Website awak dah live di rumahadvisor.com**
