# Portfolio Editing Guide

## Quick Edit Instructions

Your portfolio is built with Next.js and stored in this folder. Here's how to make changes:

### 📁 File Structure

```
personal-portfolio/
├── app/
│   ├── page.tsx          # Main page content (all text and data)
│   └── layout.tsx        # Page layout and metadata
├── public/
│   ├── images/
│   │   └── profile.jpg  # Your profile photo
│   └── favicon.svg      # Favicon
└── ...config files
```

### ✏️ How to Edit Text

1. **Open `app/page.tsx`** in a text editor (VS Code, Notepad++, etc.)
2. **Find the section** you want to edit (use Ctrl+F to search)
3. **Edit the text** inside quotation marks or arrays
4. **Save the file**
5. **Push to GitHub** to deploy changes:

```bash
cd /path/to/personal-portfolio
git add .
git commit -m "Your change description"
git push
```

GitHub Actions will automatically rebuild and deploy (1-2 minutes).

---

## 📝 Content Sections in `page.tsx`

### 1. Navigation Labels (Line ~15-25)
```typescript
nav: { about: '关于我', experience: '实习经历', ... }
```

### 2. Hero Section (Line ~30-40)
```typescript
hero: { title: '你的名字', subtitle: '金融 + 技术 | ...', description: '...' }
```

### 3. About Section (Line ~45-60)
```typescript
about: { title: '关于我', intro: '...', strengths: '...' }
```

### 4. Experience (Line ~65-180)
Each experience object has:
- `company`, `companyEn` (bilingual names)
- `role`, `roleEn` (positions)
- `period`, `periodEn` (date ranges)
- `highlights`, `highlightsEn` (bullet points)
- `highlightsBold` (array of indices to emphasize, e.g., [0, 1])

**Order matters** - internships are displayed in array order. Reorder the array for timeline.

### 5. Projects (Line ~185-320)
Each project has bilingual fields:
- `title`, `titleEn`
- `subtitle`, `subtitleEn`
- `tech` (array of tech stack)
- `objective`, `objectiveEn`
- `methodology`, `methodologyEn`
- `findings`, `findingsEn`
- `status`, `statusEn`

### 6. Skills (Line ~325-380)
Skills organized by category:
- `programming` (array)
- `dataTools` (array)
- `finance` (array)
- `certifications` (array)
- `languages` (array)

### 7. Contact (Line ~385-420)
Contact information displayed at bottom.

---

## 🌐 Bilingual Setup

Currently the site uses **inline translation objects** (not i18next). Each text appears twice:

- Chinese version: used when `lang === 'zh'`
- English version: used when `lang === 'en'`

**To modify text**, edit both versions to keep them in sync (or leave English as-is if you only need Chinese changes).

---

## 🎨 Styling

All styles are inline with Tailwind CSS classes in `page.tsx`. To change colors, spacing, fonts:

- **Colors**: Search for `bg-primary-`, `text-gray-`, etc.
- **Spacing**: `p-6` (padding), `gap-4` (gap), `m-4` (margin)
- **Fonts**: `font-bold`, `text-lg`, `text-5xl`
- **Colors available in** `tailwind.config.js` (primary: blue gradient, gray scale)

---

## 🔄 After Editing

1. **Save** the file
2. **Test locally** (optional but recommended):
   ```bash
   npm run dev
   ```
   Then open http://localhost:3000
3. **Commit and push**:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
4. **Wait for deployment** (~2 minutes)
5. **Visit**: https://your-username.github.io

---

## ⚠️ Important Notes

- Always keep TypeScript happy: check for red squiggles in your editor
- If you break the build, GitHub Actions will show errors. Fix and push again.
- Back up your changes before major edits
- The `highlightsBold` array controls which bullet points are bolded. Format: `[0, 1]` makes first and second bullets bold.

---

## 📸 Updating Your Photo

Replace `public/images/profile.jpg`:
1. Copy your new photo to that location (overwrite)
2. Commit and push
3. Done!

---

Need to add new sections or major changes? Let me know and I'll help structure the code first.
