# MBank Design System

Extracted from **real MBank app screenshots** (March 2026) + official brand guidelines at https://mbank.kg/en/guide_logo

---

## Colors

### Primary Palette (confirmed from screenshots)
| Token | Hex | Usage |
|---|---|---|
| `green-primary` | `#009C4D` | CTAs, active nav icons+labels, icon backgrounds, income amounts, links |
| `gold` | `#FABF00` | **QR center FAB button** (NOT green — yellow/gold, confirmed in screenshots) |
| `teal` | `#007E8B` | Secondary gradient partner (brand guide, not prominent in UI) |

### Neutral Palette (confirmed from screenshots)
| Token | Hex | Usage |
|---|---|---|
| `bg-page` | `#F2F2F2` | Page/screen background (confirmed in Еще, Профиль, Мой банк screens — slightly lighter than originally documented) |
| `bg-card` | `#FFFFFF` | Card surfaces, list containers |
| `text-primary` | `#111111` | Headings, amounts, names, primary labels (near-black) |
| `text-secondary` | `#999999` | Subtitles, metadata, field labels, inactive nav labels |
| `text-link` | `#009C4D` | Tappable text ("История", "Еще", "Все сервисы", "Изменить фотографию") |
| `divider` | `#E8E8E8` | List item separators inside white cards |
| `icon-inactive` | `#8C8C8C` | Bottom nav inactive icons |
| `income-amount` | `#009C4D` | Positive/incoming transaction amounts |
| `expense-amount` | `#111111` | Outgoing amounts (neutral dark, NOT red) |

### State Colors
| Token | Hex | Usage |
|---|---|---|
| `success-bg` | `rgba(0,156,77,0.1)` | Success chips/badges |
| `warning-bg` | `rgba(250,191,0,0.15)` | Warning states |
| `error-bg` | `rgba(229,62,62,0.1)` | Error/overdue states |

---

## Typography

**Font**: `Inter` only — confirmed across all screens. No other fonts visible.

| Role | Size | Weight | Color | Notes |
|---|---|---|---|---|
| Page title (main tabs) | 28–32px | Bold (700) | `#111111` | "Еще", "Платежи" top-level titles |
| Sub-page title | 18–20px | SemiBold (600) | `#111111` | "Мой банк", "Финансовый анализ", "Профиль" |
| Section header | 17–18px | Bold (700) | `#111111` | "Счета и карты", "Мои продукты", "Популярные" |
| List item title | 15–16px | Regular/Medium (400–500) | `#111111` | Service names, transaction names |
| List item label (field name) | 12–13px | Regular (400) | `#999999` | "Тип банкинга", "Номер телефона" |
| Amount / balance | 20–24px | Bold (700) | `#111111` | Card balances — uses "С" symbol for som |
| Transaction amount | 14–15px | Medium (500) | `#111111` or `#009C4D` | Expenses dark, income green |
| Navigation label | 11px | Regular (400) | `#8C8C8C` inactive / `#009C4D` active | |
| Link text | 14px | Regular (400) | `#009C4D` | "История", "Еще →", "Изменить фотографию" |
| User name (profile) | 16px | SemiBold | `#111111` | ALL CAPS in profile header |
| Section link ("Все сервисы") | 13–14px | Regular | `#009C4D` | Right-aligned next to section header |

---

## Layout — Mobile First

Target width: **390px** (or device width). Centered phone shell on larger screens.

### Screen structure
```
┌─────────────────────────┐
│  Status Bar             │  ← System (time, signal, battery)
│  Page Header (56–64px)  │  ← Left: back arrow OR title / Right: action link
├─────────────────────────┤
│                         │
│  Scrollable Content     │  ← 16px horizontal padding, bg: #F2F2F2
│                         │
├─────────────────────────┤
│  Bottom Nav (60–64px)   │  ← 5 tabs + center QR FAB
└─────────────────────────┘
```

### Spacing tokens (confirmed from screenshots)
| Token | Value |
|---|---|
| Page horizontal padding | `16px` |
| Card padding | `16px` |
| Card border-radius | `16px` |
| Item border-radius (service icons) | `12px` |
| Green icon circle size | `48px` (large) / `40px` (list items) |
| Section gap | `20–24px` |
| List item height | `~64px` (with label + value) |
| Bottom nav height | `60–64px` |
| Between cards gap | `12px` |

---

## Components (confirmed from real screenshots)

### Page Header
Two variants:

**Main tab** (Главная, Платежи, Сервисы, Еще):
```
[Profile avatar]  [Title]           [Notification bell]
```
- Title left-aligned, bold, large (28–32px)
- Avatar is circular, gray placeholder, tappable

**Sub-page** (drill-down screens):
```
[← back arrow]  [Page Title]         [Optional action]
```
- Back arrow in `#009C4D` green
- Title centered or left
- Example: "Финансовый анализ", "Мой банк", "Профиль"

### Cards (white containers)
- Background: `#FFFFFF`
- Border radius: `16px`
- Shadow: very subtle (nearly flat, relies on bg contrast with `#F2F2F2`)
- Padding: `16px`
- No visible border in most cases

### List Items (inside white cards)
**Two patterns observed:**

Pattern A — Label + Value (profile/settings style):
```
[Label in gray 12px]
[Value in dark 15px]             [›]
```
Separated by `1px` divider `#E8E8E8`

Pattern B — Icon + Title + Subtitle + Amount/Chevron (transaction style):
```
[Logo/Icon 40px]  [Title]          [Amount]
                  [Subtitle gray]
```
- Divider is inset from icon (not full width)
- Tappable: full width, min 60px height

### Service Icons (Платежи, Сервисы)
- Shape: Rounded square (NOT circle for service grid)
- Size: `48×48px`
- Background: `#009C4D` green
- Icon: white
- Label below: 11px Inter, `#111111`
- Shadow: `0 2px 8px rgba(0,156,77,0.2)`

### Bottom Navigation (confirmed from 4 screenshots)
```
[Главная]  [Платежи]  [QR FAB]  [Сервисы]  [Еще]
```
- Background: `#FFFFFF`
- Top border: `1px solid #E8E8E8`
- Active: icon + label in `#009C4D` green — icon appears FILLED
- Inactive: icon + label in `#8C8C8C` gray
- **Center QR FAB**: `56px` rounded square (NOT circle), color `#FABF00` (YELLOW-GOLD), white "M" icon + contactless/wifi symbol, elevated above nav bar
- Label size: `11px`

### Buttons
- **Primary**: `#009C4D` fill, white text, `border-radius: 12px`, height `48px`
- **Text link**: `#009C4D` color, no underline, no border
- **Ghost/secondary**: white fill, `#009C4D` text + `1px` border

### Search Bar (Платежи, Сервисы)
- Background: `#FFFFFF` or `#F5F5F5`
- Border-radius: `12px`
- Height: `44px`
- Left icon: magnifier in `#999999`
- Placeholder: `#AAAAAA`
- No visible border

### Amount Display (financial data)
- Currency symbol: **`С`** (Kyrgyzstani Som) — placed AFTER the number: `3 409,53 С`
- Decimal separator: comma (`,`)
- Thousands separator: space
- Income/positive: `#009C4D` green
- Expense/neutral: `#111111` dark
- Large balance: Inter Bold 20–24px

### Transaction List (Финансовый анализ screen)
- Grouped by date: "Сегодня", "Вчера" — section label in gray above group
- Each item: merchant logo avatar (rounded square, 40px) + merchant name + category + amount right-aligned
- White card container with internal dividers
- Income amounts in green, expenses in dark

### Spending Visualization (Финансовый анализ screen)
**NOT a pie/donut chart** — MBank uses a **horizontal segmented bar**:
```
[████████████░░░░░░░░░░░░]  35 409,83 С >
 blue  green  yellow  red
```
- Full-width bar under the period total
- Multiple colored segments representing categories
- Blue, green, yellow, red/pink segments (proportional to spend)
- Tappable: "35 409,83 С >" opens detail

### Profile Header (Профиль screen)
- Large avatar circle, gray placeholder, centered
- Full name in ALL CAPS below avatar
- Green link below name: "Изменить фотографию"

### Currency Strip (Еще screen)
- Inline: `KZT 0.19   USD 87.5   EUR 102.4   RUB 1.112`
- Small, gray secondary text, no card background

---

## Navigation Pattern

5-tab bottom navigation:
| Tab | Icon style | Label | Route |
|---|---|---|---|
| 1 | House — filled when active | Главная | / (home) |
| 2 | Arrow — filled when active | Платежи | /payments |
| 3 | **QR — YELLOW rounded square FAB** | (no label) | QR scanner |
| 4 | Grid dots — filled when active | Сервисы | /services |
| 5 | More dots — filled when active | Еще | /more |

Sub-pages always use **back arrow** (`←`) in `#009C4D` top-left + page title.

---

## For the AI Advisor Feature

Based on the real app, the AI Advisor would integrate as:
- Entry point: a card on Главная ("Финансовый советник" → tap to open)
- Or as a new tab replacing one of the 5 (e.g., under Сервисы → AI Advisor card)
- The "Финансовый анализ" section already exists — AI advisor extends it with proactive insights
- Tone of Voice onboarding: full-screen modal on first open
- Chat UI: sub-page with back arrow header, white background, green message bubbles for AI

### AI Advisor Color Usage
- AI message bubbles: white card, `#111111` text
- User message bubbles: `#009C4D` green background, white text
- AI avatar icon: green circle with white sparkle/star icon
- Typing indicator: 3 dots in `#009C4D`
- Send button: `#009C4D` filled rounded square

---

## Do's and Don'ts (updated from real screenshots)

**Do:**
- Use `#009C4D` as the dominant action color
- Use `#FABF00` yellow ONLY for the center QR FAB button
- Keep backgrounds light: page `#F2F2F2`, cards `#FFFFFF`
- Use Inter for all text — confirmed, no exceptions
- Group settings/list items in white cards with internal dividers
- Show amounts as `3 409,53 С` (space separator, comma decimal, С at end)
- Use horizontal segmented bar for spending breakdown (not pie chart)
- Use rounded square icons (not circles) for service grid items
- Use filled icon style for active nav tab

**Don't:**
- Dark/navy backgrounds anywhere
- Donut/pie charts — MBank uses horizontal bars for spending
- Sidebar navigation — bottom tabs only
- Gold/amber as a general accent color — it's ONLY for the QR FAB
- Purple, blue, or any palette not in the brand guide
- `transition-all` in CSS animations
- Emoji as transaction icons — use rounded square containers with color fills
