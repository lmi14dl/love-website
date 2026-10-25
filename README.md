# One Little Question ❤️  
### یه درخواست کوچولوی عاشقانه

A cute, playful, fully interactive romantic website.  
Create a personalized "Will you...?" request, generate a unique shareable link, and watch the YES button grow every time they click NO.

---

## Features

- 🎨 Beautiful romantic themes (Pink Romance, Cute Cats, Love Letter, Red Velvet)
- 🖼️ Custom sad & happy GIFs (via URL)
- 📈 Progressive YES button growth with playful Persian messages
- 🎉 Celebration screen with confetti & floating hearts
- 🔗 Unique unguessable shareable links + QR code
- 📱 Mobile-first, RTL-first design with excellent Persian typography
- 💾 Persistent storage (Supabase or local JSON fallback)
- ♿ Reduced-motion support & accessible controls
- 📊 Optional YES/NO response counters

---

## Quick Start (Local)

```bash
# 1. Clone / enter the project
cd love-question

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env.local

# 4. (Optional) Edit .env.local — leave USE_LOCAL_STORAGE=true for zero-config local use

# 5. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Local mode stores requests in `.data/love_requests.json` (git-ignored).  
No Supabase needed for development.

---

## Production Setup with Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → run the contents of `supabase-schema.sql`
3. Go to **Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)
4. Set environment variables on your host:

```env
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
USE_LOCAL_STORAGE=false
```

5. Deploy (Vercel recommended):

```bash
npm run build
# or push to GitHub and import into Vercel
```

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Creator homepage
│   ├── love/[id]/page.tsx      # Recipient interactive page
│   ├── api/love/                # Create + track endpoints
│   ├── not-found.tsx
│   └── globals.css
├── components/
│   ├── CreatorForm.tsx          # Full customization form
│   ├── RecipientView.tsx        # YES/NO interactive experience
│   ├── FloatingHearts.tsx
│   └── HeartCursor.tsx
├── lib/
│   ├── storage.ts               # Supabase + local fallback
│   └── supabase.ts
└── types/index.ts
```

---

## How the Magic Works

1. Creator fills the form → clicks **ساخت لینک اختصاصی من 💌**
2. Server generates a short unguessable ID and saves the request
3. Shareable URL: `https://yoursite.com/love/abc123xyz`
4. Recipient opens the link → sees the custom question + sad GIF
5. Every **نه** click makes the **بله** button bigger + shows a cute message
6. Clicking **بله** triggers confetti, happy GIF, and the success message

The YES button never covers essential content and respects mobile viewports.

---

## Customization Tips

- GIFs: Use any public direct GIF URL (Giphy, Tenor, etc.)
- Themes change background, cards, and button styles
- All text fields support Persian + emoji freely
- Optional sender name appears at the bottom

---

## Security Notes

- Service role key is **never** exposed to the browser
- Recipients can only read a single request by ID (no listing)
- Edit tokens exist for future “edit my request” feature
- No personal data of the recipient is collected beyond optional counters

---

## License

MIT — made with love ❤️  
Feel free to fork, customize, and send more love into the world.
