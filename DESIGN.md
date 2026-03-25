# MBank Design System

Extracted from official MBank app screenshots + brand guidelines at https://mbank.kg/en/guide_logo

---

## Colors

### Primary Palette (exact brand values)
| Token | Hex | Usage |
|---|---|---|
| `green-primary` | `#009C4D` | CTAs, active nav, icons, links, badges |
| `teal` | `#007E8B` | Secondary actions, gradient partner |
| `yellow` | `#FFF100` | Accent highlights |
| `gold` | `#FABF00` | M logo icon, premium indicators |

### Neutral Palette
| Token | Hex | Usage |
|---|---|---|
| `bg-page` | `#EDEDED` | Page/screen background |
| `bg-card` | `#FFFFFF` | Card surfaces |
| `text-primary` | `#1A1A1A` | Headings, amounts, primary labels |
| `text-secondary` | `#888888` | Subtitles, metadata, inactive nav |
| `text-link` | `#009C4D` | Tappable text actions ("Еще", "История") |
| `divider` | `#E8E8E8` | List item separators |
| `icon-inactive` | `#8C8C8C` | Bottom nav inactive icons |
| `destructive` | `#E53E3E` | Error states, overdue indicators |

### State Colors
| Token | Hex | Usage |
|---|---|---|
| `success-bg` | `rgba(0,156,77,0.1)` | Success chips/badges |
| `warning-bg` | `rgba(250,191,0,0.15)` | Warning states |
| `error-bg` | `rgba(229,62,62,0.1)` | Error/overdue states |

---

## Typography

**Font**: `Inter` (all weights) — the only brand-approved typeface.

| Role | Size | Weight | Color |
|---|---|---|---|
| Page title | 22–24px | Bold (700) | `#1A1A1A` |
| Section header | 17–18px | SemiBold (600) | `#1A1A1A` |
| Card title | 15–16px | SemiBold (600) | `#1A1A1A` |
| Body / list item | 14–15px | Regular (400) | `#1A1A1A` |
| Subtitle / metadata | 12–13px | Regular (400) | `#888888` |
| Amount | 15–16px | Bold (700) | `#1A1A1A` (or green for income) |
| Navigation label | 10–11px | Regular (400) | `#8C8C8C` (inactive) / `#009C4D` (active) |
| Small label / badge | 10–11px | Medium (500) | varies |

---

## Layout — Mobile First

The app is a **mobile-only interface**. Target width: 390px. Always render as a centered phone shell on larger screens.

### Screen structure
```
┌─────────────────────────┐
│  Page Header (56px)     │  ← title left + optional right action
├─────────────────────────┤
│                         │
│  Scrollable Content     │  ← 16px horizontal padding
│  bg: #EDEDED            │
│                         │
├─────────────────────────┤
│  Bottom Nav (60px)      │  ← 5 tabs + center FAB
└─────────────────────────┘
```

### Spacing tokens
| Token | Value |
|---|---|
| Page horizontal padding | `16px` |
| Card padding | `16px` |
| Card border-radius | `16px` |
| Item border-radius | `12px` |
| Icon container size | `48px` (large) / `40px` (small) |
| Section gap | `20px` |
| List item height | `~60px` |
| Bottom nav height | `60px` |

---

## Components

### Cards
- Background: `#FFFFFF`
- Border radius: `16px`
- Shadow: `0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)`
- Padding: `16px`
- No visible border

### Section Headers
```
[Section Title]          [Еще →]
```
- Title: Inter SemiBold 17px, `#1A1A1A`
- Action link: Inter Regular 14px, `#009C4D`
- Bottom margin before content: `12px`

### List Items (inside cards)
```
[Icon 40px] [Title + Subtitle]      [Amount / Chevron]
```
- Separated by `1px` divider `#E8E8E8` (NOT full-width — inset from icon)
- Chevron `>` in gray `#C0C0C0` for navigable items
- Tappable area: full width, `60px` min height

### Icon Containers (service/action icons)
- Shape: Circle
- Size: `48px`
- Background: `#009C4D`
- Icon color: white
- Shadow: `0 2px 8px rgba(0,156,77,0.25)`

### Bottom Navigation
```
[Главная] [Платежи] [  QR FAB  ] [Сервисы] [Еще]
```
- Background: `#FFFFFF`
- Top border: `1px solid #E8E8E8`
- Active: icon + label in `#009C4D`
- Inactive: icon + label in `#8C8C8C`
- Center QR button: `56px` circle, `#009C4D`, elevated (shadow), floats above nav bar
- Label size: `10px`

### Buttons
- **Primary**: `#009C4D` fill, white text, `border-radius: 12px`, height `48px`
- **Secondary/Ghost**: white fill, `#009C4D` text + border
- **Text link**: `#009C4D` text, no decoration

### Search Bar
- Background: `#FFFFFF` or `#F5F5F5`
- Border-radius: `12px`
- Height: `44px`
- Icon: magnifier in `#8C8C8C`
- Placeholder: `#AAAAAA`

### Amount display (financial data)
- Positive / income: `#009C4D` green
- Negative / expense: `#1A1A1A` (neutral, not red — MBank convention)
- Large balance: Inter Bold, 24–28px
- Transaction amount: Inter Bold, 15px

### Status Badges
```
[● Label]
```
- Overdue: red bg `rgba(229,62,62,0.1)`, red text
- Due soon: gold bg `rgba(250,191,0,0.12)`, dark text
- Paid: green bg `rgba(0,156,77,0.1)`, green text

---

## Navigation Pattern

5-tab bottom navigation (no sidebar):
| Tab | Icon | Label |
|---|---|---|
| 1 | House/home | Главная |
| 2 | Arrow/transfer | Платежи |
| 3 | QR (FAB center) | — |
| 4 | Grid | Сервисы |
| 5 | More dots | Еще |

Sub-pages use a **back arrow** (`←`) top-left + page title centered/left.

---

## Do's and Don'ts

**Do:**
- Use `#009C4D` as the dominant action color
- Keep backgrounds light (page `#EDEDED`, cards white)
- Use Inter for all text — no other fonts
- Group related items in white cards
- Show financial amounts in Inter Bold
- Use green circular icons for services/actions

**Don't:**
- Dark/navy backgrounds (that's not MBank)
- Fancy display fonts (Playfair, etc.) — Inter only
- Sidebar navigation — mobile uses bottom tabs only
- Flat/borderless buttons without the green fill
- Purple, blue, or custom palettes not in the brand guide
