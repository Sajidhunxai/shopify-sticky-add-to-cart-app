# Sticky Add to Cart

Shopify app you can sell on the App Store: a **sticky Add to cart** bar for product pages.

**Full setup:** see [SETUP.md](SETUP.md)

## Quick start

```bash
cd D:/apex/sticky-atc
npm install
npx prisma migrate dev
shopify app config link
npm run dev
```

1. Install on your development store  
2. Theme Editor → **App embeds** → enable **Sticky Add to Cart** → Save  
3. Open a product page and scroll  

## Stack

- Shopify React Router app template  
- Theme App Extension (embed)  
- Prisma + SQLite (local)  
- Free / Pro demo (branding metafield)  
