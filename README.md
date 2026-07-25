# Өзгөн базары — Premium Investor Presentation

Hansoft IT Company va Альянс Инвест Групп uchun tayyorlangan full-screen investor taqdimoti.

**Bu veb-sayt emas** — bu 75" ekranda jonli ko'rsatiladigan premium storytelling prezentatsiyasi.

---

## Tez boshlash

Brauzerda `index.html` faylini oching. Server shart emas — hamma narsa lokal ishlaydi.

```
index.html ni ikki marta bosing yoki brauzerda oching
```

---

## Prezentatsiya boshqaruvi

| Harakat | Klaviatura |
|---------|------------|
| Keyingi slayd | `↓` `→` `Page Down` `Space` |
| Oldingi slayd | `↑` `←` `Page Up` |
| Birinchi slayd | `Home` |
| Oxirgi slayd | `End` |
| Slayd tanlash | O'ng tomondagi nuqtalar |

**Til almashtirish:** Yuqori o'ng burchak — 🇰🇬 Кыргызча | 🇷🇺 Русский

**Navbar:** 2.5 soniyadan keyin avtomatik yashirinadi. Qayta ko'rinish uchun sichqonchani ekranning yuqori qismiga olib boring yoki klaviatura tugmasini bosing.

---

## Fayl tuzilmasi

```
bazar_presentation/
├── index.html          # 12 ta full-screen slayd
├── css/
│   ├── style.css       # Asosiy stillar
│   ├── animations.css  # Animatsiyalar
│   └── fullpage.min.css
├── js/
│   ├── fullpage.min.js # Fullpage.js v4 (GPLv3)
│   ├── language.js     # KG/RU tarjimalar
│   └── script.js       # Prezentatsiya logikasi
└── assets/
    ├── logos/          # Hansoft + AIG logolar
    └── images/         # Placeholder rasmlar (SVG)
```

---

## Rasmlarni almashtirish

Barcha AI promptlar: **[AI_PROMPTS.md](AI_PROMPTS.md)** — har bir slayd uchun illustratsiya, ikon va animatsiya promptlari.

Har bir rasm ustida qisqa comment ham bor. Haqiqiy rasmlarni `assets/images/` papkasiga qo'ying:

| Fayl | Tavsif |
|------|--------|
| `hero-market.svg` → `.jpg` | Aerial drone view, O'zgen bozori |
| `parking.svg` → `.jpg` | Tartibli avtoturargoh |
| `advertising.svg` → `.jpg` | LED ekranlar |
| `future.svg` → `.jpg` | Futuristik bozor konsepti |

`index.html` dagi `src` yo'lini yangilang.

---

## Tarjimalarni tahrirlash

Barcha matnlar `js/language.js` faylida:

```javascript
const translations = {
  kg: { hero_title: "...", ... },
  ru: { hero_title: "...", ... }
};
```

HTML elementlarida `data-lang="hero_title"` atributi ishlatiladi.

---

## Kontakt ma'lumotlarini yangilash

`language.js` ichida:
- `cta_phone` — telefon raqami
- `cta_website` — veb-sayt (hozir `hansoft.kg`)

---

## Dizayn

- **Palitra:** Oq `#FFFFFF`, krem `#F5F5F7`, qora `#111111`, oltin `#D4AF37`, navy `#0B2D5B`
- **Fontlar:** Inter + Manrope (Google Fonts)
- **12 slayd:** Light/dark alternatsiya
- **CTA tugmalar yo'q** — faqat taqdimot

---

## Litsenziya

- Fullpage.js — [GPLv3](https://github.com/alvarotrigo/fullPage.js)
- Loyiha — Hansoft IT Company
