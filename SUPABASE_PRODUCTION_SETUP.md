# Setup Supabase untuk Production Domain

## Penting: Konfigurasi ini MESTI dilakukan sebelum authentication boleh berfungsi di rumahadvisor.com

## Langkah 1: Update Authentication URLs

1. **Log masuk ke Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Pilih project anda: qnvibtpvufqfysivcfnc

2. **Pergi ke Authentication Settings**
   - Sidebar kiri: Authentication → URL Configuration

3. **Update Site URL**
   ```
   Site URL: https://rumahadvisor.com
   ```

4. **Tambah Redirect URLs**

   Tambah SEMUA URLs berikut dalam "Redirect URLs" field:
   ```
   https://rumahadvisor.com
   https://rumahadvisor.com/**
   https://www.rumahadvisor.com
   https://www.rumahadvisor.com/**
   http://localhost:5173
   http://localhost:5173/**
   ```

   **Note**: URLs dengan `localhost` untuk development, URLs dengan domain untuk production

5. **Save Changes** - Klik butang Save

## Langkah 2: Verify Configuration

### Test Authentication Flow:

1. Buka https://rumahadvisor.com
2. Cuba Sign Up dengan email baru
3. Check email untuk verification (jika email confirmation enabled)
4. Cuba Sign In dengan credentials
5. Check browser console - tidak sepatutnya ada CORS errors

### Jika Ada Error:

**Error: "Invalid Redirect URL"**
- Solution: Double check Redirect URLs di Supabase
- Pastikan format betul (dengan https://)
- Pastikan ada `/**` untuk wildcard paths

**Error: CORS Policy**
- Solution: Tunggu beberapa minit untuk Supabase update settings
- Clear browser cache dan cuba lagi
- Verify URLs betul-betul sama dengan domain awak

## Langkah 3: Email Configuration (Optional)

Kalau nak customize email templates:

1. **Pergi ke Authentication → Email Templates**

2. **Customize templates**:
   - Confirm signup
   - Magic Link
   - Change Email Address
   - Reset Password

3. **Update email sender**:
   - Pergi ke Project Settings → Auth
   - Boleh guna custom SMTP atau Supabase's default

## Current Environment Variables

File `.env` sudah configured dengan:

```env
VITE_SUPABASE_URL=https://qnvibtpvufqfysivcfnc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**PENTING**: Credentials ini sudah embedded dalam build. Tak perlu setup environment variables di Hostinger.

## Security Checklist

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Proper authentication policies in place
- ✅ Anon key used (safe for client-side)
- ✅ Service role key NEVER exposed to client
- ✅ HTTPS enforced on production domain

## Database Tables

Current tables dengan RLS:
- `user_profiles` - User profile data
- `user_calculations` - Saved calculations

Semua tables sudah ada proper RLS policies yang check `auth.uid()`.

## Testing Production Setup

1. **Test Sign Up Flow**:
   ```
   1. Navigate to https://rumahadvisor.com
   2. Click Sign Up
   3. Enter email & password
   4. Verify email (if enabled)
   5. Confirm successful registration
   ```

2. **Test Sign In Flow**:
   ```
   1. Use registered credentials
   2. Verify successful login
   3. Check user state persists on refresh
   ```

3. **Test Data Persistence**:
   ```
   1. Login as user
   2. Enter calculation data
   3. Save calculation
   4. Logout and login again
   5. Verify data still there
   ```

## Monitoring

### Check Database Activity:

1. **Pergi ke Supabase Dashboard**
2. **Database → Logs** untuk tengok queries
3. **Authentication → Users** untuk tengok registered users

### Check Errors:

1. **Logs → Error Logs** untuk application errors
2. Monitor bila launch untuk spot issues early

## Important Notes

- Authentication URLs MESTI match exactly dengan production domain
- Wildcard `/**` perlu untuk SPA routing
- Changes kat Supabase take effect immediately (no caching)
- Test thoroughly sebelum announce launch

---

## Quick Reference

**Supabase Dashboard**: https://supabase.com/dashboard
**Project ID**: qnvibtpvufqfysivcfnc
**Production Domain**: https://rumahadvisor.com
**Database URL**: https://qnvibtpvufqfysivcfnc.supabase.co

---

✅ **Selepas setup ini, authentication akan berfungsi dengan sempurna di production!**
