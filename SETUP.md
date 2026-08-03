# Sticky Add to Cart — Setup Guide

Sellable Shopify app starter: sticky Add to cart bar (Theme App Embed) + embedded admin.

## What you already need

- [x] Shopify Partner account
- [ ] Development store (Partner Dashboard → Stores → Add store → Development store)
- [ ] Node.js 20.19+ or 22.12+ (you have Node on this machine)

## 1. Link this project to your Partner app

In a terminal:

```bash
cd D:/apex/sticky-atc
npm install
npx prisma migrate dev --name shop_settings
shopify app config link
```

When prompted:

1. Log in to Shopify
2. Choose your Partner organization
3. **Create a new app** named `Sticky Add to Cart` (or link an existing one)

## 2. Run locally

```bash
npm run dev
```

Then:

1. Press **P** to open the app URL (or follow the CLI install link)
2. Install on your **development store**
3. In the app admin, follow **Enable on your storefront**
4. Theme Editor → App embeds → enable **Sticky Add to Cart** → Save
5. Open a product page, scroll down — the sticky bar appears

## 3. Customize the bar

In Theme Editor → App embeds → Sticky Add to Cart:

- Button text / colors
- Show title, price, image
- Desktop on/off
- Hide when native ATC is visible

## 4. Free vs Pro (demo)

In the app admin Home page:

- **Free** → shows “Powered by Sticky ATC”
- **Upgrade to Pro (demo)** → hides branding via shop metafield

Replace the demo buttons with [Shopify Billing API](https://shopify.dev/docs/apps/launch/billing) before App Store launch.

## 5. Deploy (when ready to sell)

1. Create a GitHub repo and push this folder
2. Deploy to Fly.io or Railway (Postgres recommended for production)
3. Set env vars: `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, `SCOPES`, `SHOPIFY_APP_URL`, `DATABASE_URL`
4. Run `npm run setup` then `npm run start`
5. `npm run deploy` to push the theme extension
6. Partner Dashboard → Distribution → Shopify App Store ($19 registration)

## Project map

```
sticky-atc/
├── app/routes/app._index.tsx          ← Admin home / plan demo
├── app/models/settings.server.ts      ← Free/Pro + metafield sync
├── extensions/sticky-atc/             ← Theme App Embed
│   ├── blocks/sticky-atc.liquid
│   └── assets/sticky-atc.{css,js}
├── prisma/schema.prisma               ← Sessions + ShopSettings
└── shopify.app.toml                   ← App config + GDPR webhooks
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| CLI asks to login | Run `shopify auth login` |
| Embed missing in theme | Run `npm run dev` or `npm run deploy`, then refresh Theme Editor |
| Bar never appears | Enable embed, save theme, open a **product** page, scroll |
| Branding still shows after Pro | Click **Sync storefront settings**, hard-refresh the storefront |
