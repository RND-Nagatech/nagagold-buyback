# Buyback Information Page — Design Specification

## 1. Purpose

Customer-facing web page for a jewelry store that displays a purchased item's buyback information and lets the customer begin a buyback request. The experience must feel **premium, transparent, trustworthy, and easy to understand**—not like an internal dashboard.

Primary user goal: quickly understand the item details and current estimated buyback value, then tap **Ajukan Buyback**.

## 2. Scope

This specification covers one item-detail page in two responsive layouts:

- **Desktop:** information is presented in a two-column detail card.
- **Mobile:** information is presented in one scrollable column, with a persistent bottom CTA.

Do not add charts, admin controls, analytics widgets, customer-service chat widgets, sidebars, or unrelated dashboard elements.

## 3. Example Data

Use this content for the first implementation/demo. The UI must accept dynamic values from the API.

| Field | Example value |
|---|---|
| Brand/store | MAS ITALY |
| Item name | Cincin Anak |
| Weight | 2 gram |
| Purchase price | Rp 2.000.000 |
| Purchase date | 20 September 2026 |
| Minimum buyback estimate | Rp 1.900.000 |
| Maximum buyback estimate | Rp 3.900.000 |
| Estimate status | Update hari ini |
| Verification status | Item Terverifikasi |

Currency formatting must use Indonesian Rupiah grouping, for example `Rp 1.900.000` (no decimals unless business rules require them).

## 4. Visual Direction

The look should be contemporary luxury retail, with the visual discipline of an enterprise product.

- **Mood:** calm, polished, secure, premium; never overly ornate.
- **Background:** warm ivory/off-white with subtle thin gold line motifs at the outer edges only.
- **Surface:** white cards, soft borders, restrained shadows.
- **Color:** champagne gold is an accent, not the dominant page background. Deep olive is reserved for primary actions.
- **Photography:** a clear, high-quality product image. Keep the full jewelry item visible; never crop the core product.
- **Typography:** modern sans-serif for UI and data. A refined display serif may be used only for hero and item headings if it remains highly legible.

### Suggested Design Tokens

```css
:root {
  --color-page: #FCFAF6;
  --color-surface: #FFFFFF;
  --color-text: #171713;
  --color-muted: #6F706A;
  --color-border: #E9E4DA;
  --color-gold-50: #FBF4E4;
  --color-gold-100: #F3E1B9;
  --color-gold-500: #B58B42;
  --color-olive-700: #39411E;
  --color-olive-800: #2D3519;
  --color-success: #52623B;
  --radius-sm: 12px;
  --radius-md: 20px;
  --radius-lg: 28px;
  --shadow-card: 0 12px 32px rgba(32, 27, 18, 0.07);
}
```

Use an 8px spacing system. Minimum touch target: **44 × 44px**.

## 5. Information Architecture

```text
Page
├── Header
│   ├── Brand logo / wordmark
│   ├── Desktop navigation (desktop only)
│   └── Back button (mobile only)
├── Page introduction
│   ├── Eyebrow: "LAYANAN BUYBACK EMAS"
│   ├── Title: "Informasi Buyback Anda"
│   └── Supporting text
├── Main item card
│   ├── Product media and verification badge
│   ├── Item details
│   └── Buyback estimate card
├── Trust points (desktop) / optional compact section (mobile)
└── Primary action: "Ajukan Buyback"
```

## 6. Desktop Layout

### Viewport and Container

- Design target: 1440px wide viewport.
- Main content max-width: **1280px**.
- Horizontal page padding: 40px at desktop, 24px on tablet.
- Header height: 96px.
- Main card uses a 38% / 62% grid with a 32px gap.

### Header

- Left: gold monogram + `MAS ITALY` wordmark.
- Center: `Beranda`, `Koleksi`, `Buyback`, `Hubungi Kami`.
- Highlight `Buyback` with an olive/gold underline.
- Right: outlined `Masuk` button with user icon.
- Header background should be opaque or have a subtle blur on scroll; retain a thin bottom border.

### Intro

- Center aligned.
- Eyebrow in uppercase, letter spaced, champagne gold.
- H1: `Informasi Buyback Anda`.
- Subtitle: `Berikut adalah detail barang dan estimasi nilai buyback berdasarkan data pembelian Anda.`
- Keep the title area generous but compact: 40–56px above the content card.

### Main Item Card

- White background, 1px `--color-border` border, 28px corner radius, `--shadow-card`.
- 24px inner padding.
- Left media panel: fixed aspect ratio around 4:3, 20px radius.
- Place `Item Terverifikasi` as an overlay chip near the media panel's top-left corner.
- Use photo `object-fit: cover`; include a neutral fallback placeholder if no photo is available.

### Details Panel

1. Large heading: item name.
2. Three detail rows with a small leading icon:
   - Berat
   - Harga Beli
   - Tanggal Beli
3. Each row is separated by a low-contrast divider. Labels are muted; values are bold/high contrast and right-aligned where appropriate.
4. Below the details, display the estimate card.

### Estimate Card

- Background: gentle champagne-gold gradient from `#F6E5BD` to `#E7C879`.
- 20px radius; 24–32px padding.
- Top line: `Estimasi Nilai Buyback` and a light `Update hari ini` status pill.
- Main range must be the strongest visual element in the content area.
- Desktop value format: `Rp 1.900.000 – Rp 3.900.000` in one line where available.
- Full-width dark olive button: `Ajukan Buyback` with right arrow icon.
- Add a helper note immediately below or above the action: `Nilai final setelah pemeriksaan barang.`

### Trust Row

Below the main card, show three evenly spaced trust points:

| Icon | Title | Description |
|---|---|---|
| Shield check | Harga transparan | Nilai buyback berdasarkan harga pasar terkini. |
| Diamond / inspection | Pemeriksaan profesional | Setiap barang diperiksa oleh tenaga ahli kami. |
| Wallet / payment | Pembayaran aman | Proses cepat dan aman langsung ke rekening Anda. |

Use small circular pale-gold icon containers and thin vertical dividers between columns.

## 7. Mobile Layout

### Breakpoints

| Range | Layout |
|---|---|
| `>= 1024px` | Desktop two-column card |
| `768px–1023px` | Tablet: reduce spacing; card may remain two columns if comfortable |
| `< 768px` | Mobile single-column layout |

### Mobile Header and Intro

- Page horizontal padding: 16px.
- Sticky top header, white/ivory surface.
- Left: 44px back button. Center: compact wordmark. Do not show desktop navigation.
- Display title below the header, left aligned or visually centered. Keep it to a maximum of two lines.
- Subtitle must be short: `Cek estimasi nilai buyback perhiasan Anda dengan aman dan transparan.`

### Mobile Item Content

- Use one white card with 16px radius, or separate stacked surfaces with consistent gaps.
- Product image appears first, full card width, aspect ratio **4:3**.
- Verification chip sits below the photo or floats inside its lower-left edge if contrast is guaranteed.
- Item heading follows, then 3 concise detail rows.
- Each data row: label at left, value at right; values should wrap cleanly without clipping.
- Product data must remain readable at 320px content width.

### Mobile Estimate and CTA

- Place the estimate card directly after item details, with 16–20px padding.
- Range may wrap to two lines; never reduce its font below 28px.
- Show `Update hari ini` below the estimate title on small screens if horizontal space is limited.
- Show note: `Nilai final setelah pemeriksaan barang.`
- Use a **sticky bottom action bar** with a 16px horizontal inset and safe-area bottom padding.
- Button text: `Ajukan Buyback` plus arrow-right icon.
- Account for the sticky CTA by adding at least 104px bottom padding to scrollable content.

## 8. Components and Behaviour

### `BuybackPageHeader`

- Props: `brandName`, `logo`, `isAuthenticated`.
- Desktop shows navigation and login/account action.
- Mobile shows back button and centered compact brand mark.

### `ProductMedia`

- Props: `imageUrl`, `itemName`, `verificationStatus`.
- Use descriptive `alt`: `Foto {itemName}`.
- Render a polished neutral fallback with an image icon if `imageUrl` is absent or fails.

### `VerificationBadge`

- Green/olive check icon and text `Item Terverifikasi`.
- Do not claim verified status if it is false. When unavailable, omit it rather than displaying an error-like badge.

### `ItemDetails`

- Props: `name`, `weightLabel`, `purchasePriceFormatted`, `purchaseDateFormatted`.
- Icons are decorative only when the text label remains visible; set `aria-hidden="true"` on those icons.

### `BuybackEstimateCard`

- Props: `minFormatted`, `maxFormatted`, `updatedAtLabel`, `isEstimateAvailable`.
- If a range is supplied, render: `{min} – {max}`.
- If a single estimate is supplied, render that amount and label it `Estimasi Nilai Buyback`.
- If unavailable, render a neutral empty state: `Estimasi belum tersedia. Silakan hubungi toko kami.` and hide/disable application action according to business rules.

### `ApplyBuybackButton`

- Opens the buyback application flow; do not submit directly without a confirmation/review step.
- While processing, use `Memproses…` and prevent duplicate submissions.
- Keep the final server-side eligibility validation; UI display never replaces backend validation.

## 9. Interaction States

| Area | State | Expected UI |
|---|---|---|
| Product image | Loading | Soft skeleton with same aspect ratio |
| Product image | Failed | Neutral placeholder + accessible alt text |
| Estimate | Loading | Skeleton lines; CTA disabled |
| Estimate | Unavailable | Clear neutral message; follow business rule for CTA |
| CTA | Default | Dark olive, white text, arrow icon |
| CTA | Hover/focus | Slightly darker (`--color-olive-800`), visible 2px focus ring |
| CTA | Processing | Spinner + `Memproses…`, disabled |
| CTA | Ineligible | Explain reason and offer contact/support path |

## 10. Accessibility and Quality Bar

- Minimum normal text contrast: WCAG AA (4.5:1). Verify gold-on-white labels carefully.
- Never rely on color alone for verification or status.
- Keyboard focus order: header controls → page content → primary CTA.
- Visible `:focus-visible` outline on interactive elements.
- Buttons must have accessible labels; icon-only back button needs `aria-label="Kembali"`.
- Use semantic structure: `header`, `main`, `section`, `h1`, `h2`, `dl` or labelled rows for details, `button` for action.
- Respect reduced motion preferences. Keep visual transitions under 200ms and non-essential.
- Avoid content layout shift by reserving media and estimate areas during load.

## 11. Implementation Notes

- Build responsive-first, starting from the mobile layout.
- Use SVG icons from a consistent icon set (for example Lucide), never emoji as production icons.
- Keep all data supplied by a typed API model; do not hard-code demo strings inside presentational components.
- Separate formatting functions for currency and dates; the server should provide canonical values, while the frontend localizes display.
- Product image URLs should be optimized and lazy-loaded, but fetch the primary image eagerly if it is above the fold.
- The `Ajukan Buyback` action must pass an item identifier—not prices or eligibility decisions trusted from the client.

## 12. Acceptance Criteria

- Desktop at 1440px matches the premium two-column hierarchy: photo left, details and estimate right.
- Mobile at 390px displays a single-column flow without horizontal scrolling or clipped values.
- The estimate range and `Ajukan Buyback` action are visible without ambiguity.
- Long item names, dates, and currency values wrap gracefully.
- Loading, unavailable, error, and disabled states are implemented.
- CTA remains easy to reach on mobile through a sticky bottom bar.
- Page has no dashboard-style widgets or unrelated controls.
- Accessibility checks pass for keyboard access, labels, focus, and text contrast.