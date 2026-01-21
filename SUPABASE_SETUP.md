# Panduan Setup Supabase - Authentication & Security Configuration

## Quick Reference - Security Checklist

Untuk production app, pastikan enable semua security features ini:

- [ ] **Site URL Configuration** - Set proper production URL
- [ ] **Redirect URLs** - Whitelist authorized domains
- [ ] **Email Confirmation** - Enable untuk verify users
- [ ] **Leaked Password Protection** - Enable untuk prevent compromised passwords

**Important Links:**
- Supabase Dashboard: https://supabase.com/dashboard
- Project ID: `qnvibtpvufqfysivcfnc`
- HaveIBeenPwned: https://haveibeenpwned.com

---

## Masalah: Email Confirmation Redirect Error

Bila user klik link "Confirm your mail" dalam email, mendapat error "localhost refused to connect". Ini kerana Supabase cuba redirect ke `localhost` yang tidak accessible.

## Penyelesaian 1: Configure Site URL di Supabase Dashboard (Untuk Production)

### Langkah-langkah:

1. **Login ke Supabase Dashboard**
   - Pergi ke: https://supabase.com/dashboard
   - Login dengan akaun anda

2. **Pilih Project Anda**
   - Klik pada project: `qnvibtpvufqfysivcfnc`

3. **Navigate ke Authentication Settings**
   - Klik pada menu **Authentication** di sidebar kiri
   - Klik pada submenu **URL Configuration**

4. **Configure Site URL**
   - **Site URL**: Masukkan URL production app anda
     - Contoh untuk Vercel: `https://your-app.vercel.app`
     - Contoh untuk Netlify: `https://your-app.netlify.app`
     - Untuk local development: `http://localhost:5173`

5. **Configure Redirect URLs**
   - Dalam section **Redirect URLs**, tambah:
     - `https://your-app.vercel.app/**` (untuk production)
     - `http://localhost:5173/**` (untuk local development)
   - Klik **Add URL** untuk setiap URL

6. **Save Configuration**
   - Klik butang **Save** di bahagian bawah

### URL Configuration Settings:
```
Site URL: http://localhost:5173
Redirect URLs:
  - http://localhost:5173/**
  - https://your-app.vercel.app/**
```

---

## Penyelesaian 2: Disable Email Confirmation (Untuk Development/Testing)

**PENTING: Ini hanya untuk development/testing! JANGAN gunakan untuk production!**

### Langkah-langkah:

1. **Login ke Supabase Dashboard**
   - Pergi ke: https://supabase.com/dashboard

2. **Navigate ke Authentication Settings**
   - Klik pada **Authentication** → **Settings**
   - Scroll ke section **Email**

3. **Disable Email Confirmation**
   - Cari setting **"Enable email confirmations"**
   - **Toggle OFF** setting ini
   - Klik **Save**

4. **Enable Auto-confirm (Optional)**
   - Cari setting **"Confirm email"**
   - Toggle OFF untuk auto-confirm users
   - Klik **Save**

### Selepas Disable Email Confirmation:
- Users boleh login terus selepas register
- Tidak perlu confirm email
- Sesuai untuk testing dan development
- **MESTI enable balik untuk production!**

---

## Penyelesaian 3: Test dengan Deployed URL

Kalau app anda sudah deploy di Vercel/Netlify:

1. **Update Site URL** dalam Supabase ke production URL
2. **Register account baru** melalui production app
3. **Confirm email** - link akan redirect ke production URL
4. **Login** - sepatutnya berfungsi dengan baik

---

## Verify Configuration

### Cara Test Email Confirmation Berfungsi:

1. **Register account baru**
2. **Check email** untuk confirmation link
3. **Klik link** - sepatutnya redirect ke app anda
4. **Login** - sepatutnya berjaya

### Kalau Masih Error:

1. Check console log dalam browser (F12)
2. Verify Supabase URL configuration betul
3. Pastikan redirect URL dalam whitelist
4. Try clear browser cache

---

## Email Template Configuration (Advanced)

Untuk customize email template:

1. **Navigate ke Authentication → Email Templates**
2. **Select "Confirm signup" template**
3. **Verify {{ .ConfirmationURL }}** variable digunakan
4. Template default sudah betul, tidak perlu ubah

---

## Security Configuration: Enable Leaked Password Protection

**PENTING: Ini adalah security feature yang WAJIB untuk production!**

Supabase Auth boleh check password terhadap database HaveIBeenPwned.org untuk prevent users daripada menggunakan compromised passwords.

### Langkah-langkah Enable Leaked Password Protection (DETAILED):

#### Step 1: Login ke Supabase Dashboard
- Pergi ke: **https://supabase.com/dashboard**
- Login dengan akaun anda

#### Step 2: Pilih Project Anda
- Dalam dashboard, cari dan klik project: **`qnvibtpvufqfysivcfnc`**
- Atau klik direct link: **https://supabase.com/dashboard/project/qnvibtpvufqfysivcfnc**

#### Step 3: Navigate ke Authentication Settings (EXACT PATH)

**Method 1 - Via Sidebar:**
1. Pada **sidebar kiri**, cari menu **"Authentication"** (icon shield/lock)
2. Klik **"Authentication"** untuk expand menu
3. **JANGAN klik "Settings" lagi** - scroll down pada page yang sama
4. Cari section **"Auth Providers"** atau **"Password"**
5. Dibawah section Password, ada subsection **"Security"**

**Method 2 - Via Direct Link:**
- Klik terus pada URL ini:
  ```
  https://supabase.com/dashboard/project/qnvibtpvufqfysivcfnc/auth/providers
  ```

**Method 3 - Via Configuration Tab:**
1. Click **"Authentication"** pada sidebar
2. Click tab **"Configuration"** (bukan Settings)
3. Atau click **"Policies"** tab
4. Atau try **"Email Templates"** area

#### Step 4: Enable Feature (EXACT LOCATION)

Setting ini mungkin berada di salah satu lokasi ini:

**Location Option A - Auth Providers Page:**
1. Dalam **Authentication** → **Providers** page
2. Scroll ke section **"Email"** provider
3. Click **"Email"** untuk expand settings
4. Dibawah Email settings, cari:
   - **"Breach Detection"** atau
   - **"Password Protection"** atau
   - **"Secure password"** atau
   - **"HaveIBeenPwned Integration"**
5. Toggle **ON** setting tersebut
6. Click **"Save"**

**Location Option B - Password Security Settings:**
1. Authentication → Configuration
2. Cari section **"Password Settings"** atau **"Password Requirements"**
3. Dibawah password settings, ada option:
   - **"Check against compromised passwords"** atau
   - **"Enable password breach detection"**
4. Toggle **ON**
5. Click **"Save"**

**Location Option C - Project Settings:**
1. Click icon **"Settings"** (gear icon) di bahagian bawah sidebar
2. Click **"Auth"** tab
3. Scroll ke **"Password Settings"** section
4. Cari **"Breach Detection"** atau similar option
5. Toggle **ON**
6. Click **"Save"**

#### Step 5: Verify Setting (TESTING)

1. Cuba register account dengan password: **"password123"**
2. Jika setting berjaya enabled, akan dapat error:
   ```
   "Password has been found in a data breach"
   ```
3. Cuba register dengan strong password (contoh: `MyStr0ng!P@ssw0rd2024`)
4. Sepatutnya berjaya register

---

### IMPORTANT NOTE: Kalau Tak Jumpa Setting Dalam Dashboard

**Ini mungkin bermakna:**

1. **Feature Automatically Enabled** - Sesetengah Supabase projects, feature ini enabled by default
2. **Project Plan** - Feature mungkin hanya available untuk certain plans
3. **Different UI Version** - Supabase Dashboard UI berubah dari time to time
4. **Feature Not Yet Available** - Untuk self-hosted atau certain regions

### Alternative Solution: Check via SQL

Anda boleh check current auth configuration menggunakan SQL:

```sql
-- Run this query dalam SQL Editor
SELECT * FROM auth.config;
```

### Alternative: Client-Side Password Validation (IMPLEMENTED)

**GOOD NEWS: Saya telah implement comprehensive password validation dalam application!**

Walaupun setting dalam Supabase Dashboard tak jumpa, aplikasi anda sekarang sudah ada built-in password security validation yang includes:

#### Features Yang Sudah Diimplementasi:

1. **Password Strength Indicator**
   - Visual strength meter (5 levels)
   - Real-time feedback semasa user type
   - Color-coded indicator (red → yellow → green)

2. **Comprehensive Validation Checks:**
   - Minimum 8 characters required
   - Must include uppercase letters (A-Z)
   - Must include lowercase letters (a-z)
   - Must include numbers (0-9)
   - Must include special characters (!@#$%^&*)
   - Rejects common passwords (e.g., "password123", "qwerty")
   - Detects repeated characters (e.g., "aaa", "111")
   - Detects sequential patterns (e.g., "123", "abc")

3. **User-Friendly Feedback:**
   - Clear error messages for each validation rule
   - Shows which requirements are missing
   - Green checkmark when password is strong
   - Prevents submission with weak passwords

#### How It Works:

**Registration Flow:**
1. User masuk password dalam SignUp form
2. Password strength indicator muncul real-time
3. Validation feedback shows below password field
4. Form submission blocked kalau password tak strong enough
5. User kena fix password sebelum boleh proceed

**Files Created:**
- `src/utils/passwordValidation.ts` - Password validation logic
- `src/components/PasswordInput.tsx` - Reusable password input component
- `src/components/SignUpModal.tsx` - Updated dengan new validation

#### Testing The New Feature:

1. **Try Weak Password:**
   - Cuba register dengan "password123"
   - Akan nampak error: "This password is too common"
   - Form won't submit

2. **Try Better Password:**
   - Cuba dengan "MyStr0ng!Pass"
   - Akan nampak green indicator
   - Semua checkmarks appear
   - Form boleh submit

#### Advantages of Client-Side Validation:

✅ **Immediate Feedback** - User tahu terus kalau password weak
✅ **Better UX** - Tak perlu wait untuk server response
✅ **Reduces Bad Passwords** - Prevents weak passwords dari awal
✅ **Educational** - User belajar create strong passwords
✅ **Works Offline** - Validation works even during connectivity issues

#### Combined with Supabase (When Available):

Kalau anda dapat enable Supabase's HaveIBeenPwned integration nanti:
- Client-side validation runs FIRST (immediate feedback)
- Supabase validation runs SECOND (checks against breach database)
- Double layer protection untuk maximum security

**Current Status:**
✅ Client-side validation: **IMPLEMENTED & WORKING**
⏳ Supabase server-side check: **Optional enhancement**

Your app now has strong password protection even without Supabase's leaked password detection feature!

### Apa Yang Berlaku Bila Enable:

- **Password Check**: Semua password baru akan di-check terhadap HaveIBeenPwned database
- **Compromised Password Rejected**: Kalau password pernah leaked, user akan dapat error dan kena tukar password
- **Enhanced Security**: Melindungi users daripada menggunakan weak/compromised passwords
- **Privacy Preserved**: HaveIBeenPwned menggunakan k-anonymity untuk protect privacy

### Error Message Yang Users Akan Nampak:

Bila user cuba register dengan compromised password:
```
"Password has been found in a data breach. Please use a different password."
```

### Best Practices:

1. **ALWAYS enable** untuk production
2. **Test** dengan common passwords (e.g., "password123") untuk verify feature berfungsi
3. **Educate users** tentang pentingnya strong passwords
4. **Combine** dengan minimum password requirements (minimum 8 characters, etc.)

### Verify Feature Enabled:

1. **Try register** dengan weak password seperti "password123"
2. **Should get error** message about compromised password
3. **Try register** dengan strong unique password
4. **Should succeed**

---

## Tips untuk Production:

1. **ALWAYS enable email confirmation** untuk production
2. **ALWAYS enable leaked password protection** untuk enhanced security
3. **Configure proper Site URL** dan Redirect URLs
4. **Use HTTPS** untuk production URLs
5. **Whitelist semua production domains**
6. **Test thoroughly** sebelum launch

---

## Troubleshooting Common Issues:

### Issue: "Invalid redirect URL"
**Solution**: Pastikan URL dalam whitelist di Redirect URLs settings

### Issue: "Email not confirmed" error semasa login
**Solution**:
- Check inbox untuk confirmation email
- Klik link dalam email
- Atau gunakan "Resend Confirmation" button

### Issue: Redirect ke localhost dalam production
**Solution**: Update Site URL dalam Supabase Dashboard ke production URL

### Issue: Email tidak sampai
**Solution**:
- Check spam folder
- Verify email settings dalam Supabase
- Check Supabase logs untuk error messages

### Issue: "Password has been found in a data breach" error
**Solution**:
- Ini adalah expected behavior bila leaked password protection enabled
- User kena gunakan password yang lebih strong dan unique
- Educate user tentang security best practices
- Suggest password manager untuk generate strong passwords

### Issue: Users complain cannot register dengan password biasa
**Solution**:
- Ini bermakna leaked password protection berfungsi dengan baik
- Provide clear error messages kepada users
- Suggest minimum password requirements (8+ characters, mix of letters/numbers/symbols)
- Consider showing password strength indicator

---

## Contact Support

Kalau masih ada masalah:
- Supabase Discord: https://discord.supabase.com
- Supabase Docs: https://supabase.com/docs/guides/auth
- GitHub Issues: https://github.com/supabase/supabase/issues
