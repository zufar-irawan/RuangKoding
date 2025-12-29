# 🔍 Daily Reminder Modal - Troubleshooting Guide

## Quick Check

Jika modal tidak muncul, ikuti langkah-langkah berikut secara berurutan:

### 1. Buka Browser Console

Tekan `F12` atau `Ctrl+Shift+I` (Windows/Linux) atau `Cmd+Option+I` (Mac)

### 2. Cek Log Messages

Cari log messages berikut di console:

```
[Daily Challenge] User: <user-id>
[Daily Challenge] Fetching latest challenge
[Daily Challenge] Latest challenge: { id: '...', created_at: '...' }
[Daily Challenge] User has completed today: false
[Daily Challenge] User streak: 0
[Daily Challenge] Final status: { ... }
[Modal] Component rendered
[Modal] useEffect triggered
[Modal] Setting modal to open
```

## ✅ Checklist Kondisi Modal Muncul

Modal akan muncul **HANYA JIKA** semua kondisi berikut terpenuhi:

- [ ] User sudah login
- [ ] Berada di homepage (`/`)
- [ ] Ada challenge di database
- [ ] User belum complete challenge hari ini
- [ ] Session storage belum ada flag `daily-reminder-shown`

## 🐛 Problem & Solutions

### Problem 1: Log menunjukkan "Not logged in"

**Log:**
```
[Daily Challenge] User: Not logged in
[Daily Challenge] No user logged in, returning null
```

**Solution:**
1. Login ke aplikasi terlebih dahulu
2. Pastikan session/cookie auth masih valid
3. Cek di Supabase Dashboard > Authentication > Users

---

### Problem 2: "No challenges found in database"

**Log:**
```
[Daily Challenge] Latest challenge: null
[Daily Challenge] No challenges found in database
```

**Solution:**

Masuk ke **Supabase Dashboard** > **SQL Editor** dan jalankan:

```sql
-- Insert daily challenge untuk hari ini
INSERT INTO daily_code_challenge (challenge, created_at)
VALUES (
  'Test Challenge: Tulis fungsi untuk membalikkan string',
  NOW()
);

-- Verifikasi data berhasil diinsert
SELECT id, challenge, created_at 
FROM daily_code_challenge 
ORDER BY created_at DESC 
LIMIT 1;
```

Setelah insert, **clear session storage** dan reload:
```javascript
sessionStorage.clear();
location.reload();
```

---

### Problem 3: User sudah complete challenge hari ini

**Log:**
```
[Daily Challenge] User has completed today: true
```

**Solution:**

Modal memang tidak akan muncul karena user sudah menyelesaikan challenge.

Untuk testing, Anda bisa:
1. Hapus row di `daily_code_user` untuk user tersebut
2. Atau gunakan user lain yang belum complete

```sql
-- Lihat data completion user
SELECT * FROM daily_code_user 
WHERE user_id = '<your-user-id>'
ORDER BY created_at DESC;

-- Hapus completion untuk testing (HATI-HATI!)
DELETE FROM daily_code_user 
WHERE user_id = '<your-user-id>' 
AND challenge_id = '<today-challenge-id>';
```

---

### Problem 4: Modal sudah pernah muncul (session storage)

**Log:**
```
[Modal] Has shown modal in session: true
[Modal] Modal already shown in this session
```

**Solution:**

Modal menggunakan `sessionStorage` untuk tracking, jadi hanya muncul sekali per session browser.

Reset dengan cara:
```javascript
sessionStorage.removeItem('daily-reminder-shown');
location.reload();
```

Atau clear semua session storage:
```javascript
sessionStorage.clear();
location.reload();
```

---

### Problem 5: Tidak ada log sama sekali

**Kemungkinan Penyebab:**
- Component tidak ter-render
- Error saat build/compile
- JavaScript error yang menghentikan execution

**Solution:**
1. Cek apakah ada error di console (warna merah)
2. Restart development server:
   ```bash
   npm run dev
   # atau
   yarn dev
   ```
3. Hard refresh browser: `Ctrl+Shift+R` (Windows) atau `Cmd+Shift+R` (Mac)
4. Clear browser cache dan cookies

---

### Problem 6: Bukan di homepage

**Log:**
```
[Modal] Not on homepage, exiting
```

**Solution:**

Modal memang hanya muncul di homepage (`/`). Pastikan Anda berada di URL root:
- ✅ `http://localhost:3000/`
- ❌ `http://localhost:3000/question`
- ❌ `http://localhost:3000/protected`

---

## 🧪 Testing Step-by-Step

### Test 1: Fresh User (Streak 0, Belum Complete)

1. **Setup:**
   ```sql
   -- Pastikan ada challenge
   INSERT INTO daily_code_challenge (challenge, created_at)
   VALUES ('Test Challenge', NOW());
   
   -- Pastikan user belum complete
   DELETE FROM daily_code_user 
   WHERE user_id = '<your-user-id>';
   ```

2. **Clear browser:**
   ```javascript
   sessionStorage.clear();
   localStorage.clear();
   ```

3. **Login dan buka homepage**

4. **Expected Result:**
   - Modal muncul
   - Fire icon abu-abu
   - Streak: 0

---

### Test 2: User dengan Streak (Belum Complete Hari Ini)

1. **Setup:**
   ```sql
   -- Insert beberapa completion sebelumnya
   INSERT INTO daily_code_user (user_id, challenge_id, answer)
   VALUES 
     ('<your-user-id>', '<old-challenge-id-1>', 'test answer'),
     ('<your-user-id>', '<old-challenge-id-2>', 'test answer');
   
   -- Pastikan challenge hari ini ada tapi belum dicomplete
   INSERT INTO daily_code_challenge (challenge, created_at)
   VALUES ('Today Challenge', NOW());
   ```

2. **Clear browser dan reload**

3. **Expected Result:**
   - Modal muncul
   - Fire icon orange
   - Streak: 2 (atau sesuai jumlah completion)

---

### Test 3: User Sudah Complete Hari Ini

1. **Setup:**
   ```sql
   -- User sudah complete challenge hari ini
   INSERT INTO daily_code_user (user_id, challenge_id, answer)
   VALUES ('<your-user-id>', '<today-challenge-id>', 'completed');
   ```

2. **Clear browser dan reload**

3. **Expected Result:**
   - Modal TIDAK muncul
   - Log menunjukkan "User has completed today: true"

---

## 🔧 Debug Info Component

Di **development mode**, akan ada **card debug** di pojok kanan bawah dengan informasi:

```
Daily Challenge Debug Info
━━━━━━━━━━━━━━━━━━━━━━
User Status: ✅ Logged In
Streak: 0 days
Completed Today: ❌ No
Today's Challenge ID: abc123...
Should Show Modal: ✅ Yes
Session Storage: ❌ Not Shown

[Reset & Reload]
```

**Cara menggunakan:**
1. Lihat setiap field untuk understand status
2. Click "Reset & Reload" untuk clear session dan test lagi
3. Component ini hanya muncul di `NODE_ENV=development`

---

## 📊 Useful SQL Queries

### Lihat semua challenges
```sql
SELECT id, 
       challenge, 
       created_at,
       created_at::date as challenge_date
FROM daily_code_challenge
ORDER BY created_at DESC
LIMIT 10;
```

### Lihat completion user tertentu
```sql
SELECT dcu.id,
       dcu.created_at as completed_at,
       dcu.is_correct,
       dcc.challenge
FROM daily_code_user dcu
JOIN daily_code_challenge dcc ON dcu.challenge_id = dcc.id
WHERE dcu.user_id = '<your-user-id>'
ORDER BY dcu.created_at DESC;
```

### Hitung streak user
```sql
SELECT user_id, 
       COUNT(*) as total_completions
FROM daily_code_user
WHERE user_id = '<your-user-id>'
GROUP BY user_id;
```

### Cek apakah user sudah complete challenge tertentu
```sql
SELECT EXISTS (
  SELECT 1 
  FROM daily_code_user 
  WHERE user_id = '<your-user-id>' 
    AND challenge_id = '<challenge-id>'
) as has_completed;
```

---

## 🚨 Common Errors

### Error: "Failed to fetch"
- **Cause:** Supabase connection issue
- **Fix:** Check `.env.local` file contains valid Supabase credentials

### Error: "Cannot read property 'id' of undefined"
- **Cause:** Challenge data structure issue
- **Fix:** Check database schema matches `types.ts`

### TypeScript Error in Console
- **Cause:** Type mismatch
- **Fix:** Restart development server

---

## 📝 Manual Testing Checklist

Sebelum deploy, test semua scenario:

- [ ] Modal muncul untuk new user (streak 0)
- [ ] Modal muncul untuk user dengan streak
- [ ] Modal TIDAK muncul setelah user complete challenge
- [ ] Modal TIDAK muncul setelah reload (same session)
- [ ] Modal TIDAK muncul di page selain homepage
- [ ] Modal TIDAK muncul untuk user yang belum login
- [ ] Fire icon abu-abu untuk streak 0
- [ ] Fire icon orange untuk streak > 0
- [ ] Button "Mulai Challenge" redirect ke `/daily-challenge`
- [ ] Button "Nanti Saja" close modal
- [ ] Streak number ditampilkan dengan benar

---

## 🆘 Still Not Working?

Jika sudah mengikuti semua langkah di atas dan modal masih tidak muncul:

1. **Copy semua log dari browser console** dan simpan
2. **Screenshot debug info component** (card di pojok kanan bawah)
3. **Jalankan query berikut dan screenshot hasilnya:**
   ```sql
   -- Challenge data
   SELECT * FROM daily_code_challenge 
   ORDER BY created_at DESC LIMIT 1;
   
   -- User completion data
   SELECT * FROM daily_code_user 
   WHERE user_id = '<your-user-id>';
   ```
4. **Cek versi dependencies:**
   ```bash
   npm list next react @supabase/ssr
   ```

Dengan informasi ini, akan lebih mudah untuk debug masalahnya.

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Radix UI Dialog](https://www.radix-ui.com/primitives/docs/components/dialog)
- [Session Storage MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)

---

**Last Updated:** 2024
**Component Version:** 1.0.0