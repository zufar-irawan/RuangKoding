# Transformasi Halaman Settings

## Overview
Halaman settings telah ditransformasi dari arsitektur multi-halaman dengan tabs menjadi single-page dengan sidebar navigasi yang menampilkan semua section dalam satu halaman.

**Update (Refactoring):** Components telah dipisahkan ke dalam modular, reusable components untuk maintainability yang lebih baik.

## Perubahan Utama

### 1. Struktur Baru
- **Single Page Layout**: Semua settings sekarang dalam satu halaman (`/protected/settings`)
- **Sidebar Navigation**: Navigasi sticky di sisi kiri untuk berpindah antar section
- **Smooth Scrolling**: Animasi smooth scroll saat berpindah section
- **Auto-Active Section**: Section aktif terdeteksi otomatis saat user scroll

### 2. Sections yang Tersedia
1. **Pengaturan Akun** (`#account`)
   - Profil kamu (link ke `/protected/edit`)
   - Halaman About (link ke `/protected/about/edit`)
   - Informasi Kontak (Email dengan EditEmailModal)

2. **Keamanan** (`#security`)
   - Coming soon: Password, autentikasi, pengaturan keamanan

3. **Tampilan** (`#appearance`)
   - Coming soon: Personalisasi tema dan tampilan

4. **Notifikasi** (`#notifications`)
   - Coming soon: Preferensi notifikasi

### 3. Fitur-Fitur

#### Sidebar Navigation
- Profile card dengan avatar dan status online
- Menu navigasi dengan icon dan warna sesuai kategori
- Highlight otomatis pada section yang aktif
- Sticky positioning untuk kemudahan akses

#### Intersection Observer
- Menggunakan IntersectionObserver API
- Auto-update active section berdasarkan viewport
- Root margin: `-20% 0px -60% 0px` untuk smooth transition

#### Hash Navigation
- Support URL hash (`#account`, `#security`, dll)
- Auto-scroll ke section saat page load dengan hash
- Update URL hash saat scroll tanpa reload

#### Responsive Design
- Desktop: Sidebar di kiri, content di kanan
- Mobile: Sidebar di atas, content di bawah (stack vertical)
- Smooth transitions untuk semua breakpoints

### 4. Perubahan File

#### `/app/protected/settings/page.tsx`
- **Sebelum**: Menu grid dengan card yang link ke halaman terpisah
- **Sesudah**: Single page dengan sidebar + all sections inline
- **Refactored**: Menggunakan modular components (SettingsSidebar, AccountSection, PlaceholderSection)
- **Fitur Baru**:
  - Intersection Observer untuk active section tracking
  - Hash navigation handling
  - Smooth scroll function
  - Clean component composition

#### `/app/protected/settings/account/page.tsx`
- **Sebelum**: Halaman terpisah untuk account settings
- **Sesudah**: Redirect ke `/protected/settings#account`
- **Alasan**: Semua content sudah ada di main settings page

#### `/app/protected/settings/account/edit-email/page.tsx`
- **Update**: Semua redirect URL diubah ke hash navigation
- **Contoh**: 
  - `router.push("/protected/settings/account")` → `router.push("/protected/settings#account")`
  - `router.push("/protected/settings?success=email_updated")` → `router.push("/protected/settings?success=email_updated#account")`

### 5. Komponen yang Digunakan

#### New Modular Components (Refactored)
- `SettingsSidebar`: Sidebar navigation dengan profile card dan menu
- `AccountSection`: Complete account settings section
- `PlaceholderSection`: Reusable placeholder untuk coming soon sections

#### Existing Components
- `UserAvatar`: Profile picture dengan status indicator
- `EditEmailModal`: Modal untuk verifikasi dan update email
- `ContactInfoForm`: Contact information form (deprecated, inline di AccountSection)
- `ProfileInfoForm`: Profile information form (deprecated, inline di AccountSection)
- `Card`, `CardContent`, `CardHeader`, `CardTitle`, `CardDescription`: UI components
- `Button`, `Label`: Form components

#### Utilities
- `cn()`: Tailwind merge untuk conditional classes
- `createClient()`: Supabase client
- `GetUserProps()`: Fetch user profile data

### 6. User Flow

#### Normal Navigation
1. User membuka `/protected/settings`
2. Halaman load dengan section "account" aktif
3. User klik menu di sidebar
4. Smooth scroll ke section yang dipilih
5. URL hash update (contoh: `/protected/settings#security`)
6. Active section highlight update

#### Hash Navigation
1. User membuka URL dengan hash (contoh: `/protected/settings#security`)
2. Page load dan langsung scroll ke section security
3. Active section di sidebar highlight otomatis

#### Email Update Flow
1. User klik "Ubah Email" di section account
2. Modal muncul dengan form verifikasi
3. System kirim magic link ke email lama
4. User klik link di email
5. Redirect ke `/protected/settings/account/edit-email?verified=true`
6. User input email baru
7. Submit dan redirect ke `/protected/settings?success=email_updated#account`
8. Toast notification muncul
9. Auto-scroll ke section account

### 7. Styling & UX

#### Colors & Icons
- Account: Blue (`text-blue-500`, `bg-blue-500/10`)
- Security: Green (`text-green-500`, `bg-green-500/10`)
- Appearance: Purple (`text-purple-500`, `bg-purple-500/10`)
- Notifications: Orange (`text-orange-500`, `bg-orange-500/10`)

#### Animations
- Smooth scroll dengan `behavior: "smooth"`
- Hover effects pada sidebar menu
- Scale transition pada hover
- Fade in/out untuk active states

#### Accessibility
- Semantic HTML dengan proper heading hierarchy
- ARIA attributes untuk navigation
- Keyboard navigation support
- Focus visible states

### 8. Future Enhancements

#### Security Section
- Change password form
- Two-factor authentication
- Active sessions management
- Login history

#### Appearance Section
- Theme switcher (light/dark/system)
- Font size adjustment
- Color scheme customization
- Layout preferences

#### Notifications Section
- Email notifications toggle
- Push notifications settings
- Notification frequency
- Categories preferences

## Migration Notes

### Breaking Changes
- URL `/protected/settings/account` sekarang redirect ke `#account`
- Components `ProfileInfoForm` dan `ContactInfoForm` tidak lagi digunakan langsung (inline di AccountSection)

### Refactoring Changes (v2)
- Main settings page sekarang menggunakan modular components
- `SettingsSidebar` component terpisah untuk sidebar navigation
- `AccountSection` component terpisah untuk account settings
- `PlaceholderSection` component reusable untuk coming soon sections
- Barrel export di `/components/Settings/index.tsx` untuk cleaner imports

### Non-Breaking Changes
- `EditEmailModal` tetap berfungsi sama
- `/protected/settings/account/edit-email` masih accessible (untuk magic link)
- Toast notifications tetap bekerja
- All existing API calls unchanged
- Component API backward compatible

## Testing Checklist

- [ ] Navigation ke `/protected/settings` works
- [ ] Sidebar menu klik scroll ke correct section
- [ ] Active section highlight update on scroll
- [ ] Hash navigation works (contoh: `/protected/settings#security`)
- [ ] Edit email flow complete tanpa error
- [ ] Toast notification muncul setelah email update
- [ ] Profile card shows correct user data
- [ ] Responsive layout works di mobile
- [ ] Smooth scroll animation works
- [ ] Back navigation preserve scroll position

## Performance Considerations

- **Intersection Observer**: Efficient scroll tracking tanpa event listeners
- **Lazy State Updates**: State hanya update saat section benar-benar visible
- **CSS Transitions**: Hardware-accelerated untuk smooth animations
- **Single Page Load**: Semua sections load sekaligus (bisa dioptimasi dengan lazy loading nanti)

## Component Structure (After Refactoring)

```
/app/protected/settings/page.tsx (Main Page - Simplified)
├── Import modular components
├── State management & hooks
├── Scroll & navigation logic
└── JSX rendering
    ├── <SettingsSidebar />
    └── <main>
        ├── <AccountSection />
        ├── <PlaceholderSection id="security" />
        ├── <PlaceholderSection id="appearance" />
        └── <PlaceholderSection id="notifications" />

/components/Settings/ (Modular Components)
├── index.tsx (Barrel export)
├── SettingsSidebar.tsx
│   ├── Profile card
│   ├── Navigation menu
│   └── Support link
├── AccountSection.tsx
│   ├── Profile settings card
│   └── Contact info card (with EditEmailModal)
├── PlaceholderSection.tsx
│   └── Reusable coming soon template
├── EditEmailModal.tsx
├── ContactInfoForm.tsx (Legacy)
└── ProfileInfoForm.tsx (Legacy)
```

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS 12.2+)
- IE11: ❌ Not supported (IntersectionObserver requires polyfill)

## Additional Resources

- 📖 **Component Documentation**: `/components/Settings/README.md`
- 📝 **Quick Reference**: `/app/protected/settings/README.md`
- 🔗 **Main Page**: `/app/protected/settings/page.tsx`