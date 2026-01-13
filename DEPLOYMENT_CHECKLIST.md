# Checklist Deployment rumahadvisor.com

Gunakan checklist ini untuk pastikan semua step selesai.

## Pre-Deployment

- [x] Build production version (`npm run build`)
- [x] File `.htaccess` created untuk React Router
- [x] Deployment guide siap
- [x] Supabase configuration guide siap

## Hostinger Setup

- [ ] Log masuk ke Hostinger hPanel
- [ ] Buka File Manager
- [ ] Navigate ke folder `public_html`
- [ ] Backup (jika ada) file lama
- [ ] Delete file lama dalam `public_html`
- [ ] Upload SEMUA file dari folder `dist/`
- [ ] Verify `.htaccess` file uploaded
- [ ] Verify structure folder betul

## Domain Configuration

- [ ] Domain rumahadvisor.com point ke Hostinger nameservers
- [ ] DNS propagation selesai (check: https://dnschecker.org)
- [ ] Website accessible via https://rumahadvisor.com
- [ ] Install SSL certificate (Let's Encrypt)
- [ ] HTTPS berfungsi (padlock hijau)
- [ ] WWW redirect works (www.rumahadvisor.com → rumahadvisor.com)

## Supabase Configuration

- [ ] Log masuk ke Supabase Dashboard
- [ ] Update Site URL: `https://rumahadvisor.com`
- [ ] Tambah Redirect URLs:
  - [ ] `https://rumahadvisor.com`
  - [ ] `https://rumahadvisor.com/**`
  - [ ] `https://www.rumahadvisor.com`
  - [ ] `https://www.rumahadvisor.com/**`
- [ ] Save changes di Supabase
- [ ] Verify no CORS errors

## Testing

### Functionality Tests
- [ ] Homepage loads successfully
- [ ] Calculator berfungsi
- [ ] Calculations accurate
- [ ] Sign Up form works
- [ ] Email validation works
- [ ] Sign In form works
- [ ] User session persists on refresh
- [ ] Logout works
- [ ] Password reset works
- [ ] Save calculation works (for logged in users)
- [ ] Load saved calculations works

### Browser Tests
- [ ] Chrome/Edge - Desktop
- [ ] Firefox - Desktop
- [ ] Safari - Desktop
- [ ] Chrome - Mobile
- [ ] Safari - iOS
- [ ] Samsung Internet - Android

### Performance Tests
- [ ] Google PageSpeed Insights score > 80
- [ ] Images load quickly
- [ ] No console errors
- [ ] SSL certificate valid

### Responsive Design
- [ ] Mobile phones (320px - 480px)
- [ ] Tablets (768px - 1024px)
- [ ] Desktop (1200px+)
- [ ] Large screens (1920px+)

## Post-Launch

- [ ] Monitor Supabase logs for errors
- [ ] Check user registrations working
- [ ] Verify database queries executing properly
- [ ] Setup monitoring/alerts (optional)
- [ ] Setup Google Analytics (optional)
- [ ] Submit to Google Search Console (optional)
- [ ] Create sitemap.xml (optional)

## Marketing/SEO (Optional)

- [ ] Verify meta tags loaded correctly
- [ ] Check Open Graph tags (Facebook sharing)
- [ ] Test Twitter Card preview
- [ ] Submit to Google Search Console
- [ ] Add to Google Analytics
- [ ] Share di social media

## Support Contacts

**Hostinger Support**: 24/7 live chat di hPanel
**Supabase Support**: https://supabase.com/support
**DNS Checker**: https://dnschecker.org
**SSL Checker**: https://www.sslshopper.com/ssl-checker.html

---

## Files untuk Upload

Folder: `dist/`

Struktur yang betul di Hostinger `public_html`:
```
public_html/
├── .htaccess          ← PENTING!
├── index.html
├── favicon.svg
└── assets/
    ├── index-[hash].css
    └── index-[hash].js
```

---

## Quick Commands

Rebuild kalau ada changes:
```bash
npm run build
```

Check for linting errors:
```bash
npm run lint
```

Type check:
```bash
npm run typecheck
```

---

✅ **Semua tasks completed? Website siap untuk launch!**

🚀 **URL Live**: https://rumahadvisor.com
