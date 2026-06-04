# TVS Motors — Official Online Store

A complete, production-ready multi-page e-commerce website built with pure HTML, CSS, and vanilla JavaScript. No build step, no dependencies.

## Pages
- `index.html` - Home with hero carousel, categories, featured products, new arrivals carousel
- `shop.html` - Product Listing Page (PLP) with category/price/rating filters & sorting
- `pdp.html?id=N` - Product Detail Page with gallery, qty, specs, related items
- `cart.html` - Shopping cart with quantity controls & order summary
- `checkout.html` - Shipping address and delivery details step
- `payment.html` - Payment method step with UPI, card, and COD demo flow
- `thankyou.html` - Purchase confirmation with order summary
- `wishlist.html` - Saved items
- `login.html` / `signup.html` - Auth (localStorage for users, session/localStorage for session)
- `contact.html` - Contact form & company info

## Features
- Auto-rotating hero carousel with dots & arrows
- Horizontal product carousel (new arrivals)
- Add to cart / wishlist with live header badges
- LocalStorage for users, cart, wishlist
- SessionStorage / LocalStorage for login session (remember me toggle)
- Fully responsive (mobile, tablet, desktop)
- Toast notifications

## Deploy
Upload the entire folder to any static host: Netlify, Vercel, GitHub Pages, Cloudflare Pages, S3, Nginx, Apache. No backend required.

```
netlify deploy --dir=. --prod
```

or just drag the folder into Netlify Drop.

## Analytics (Salesforce MCP / Styler)

Load your **Salesforce Interactions (Evergage) SDK** before `js/styler-sitemap.js` on every page:

```html
<script>window.dataLayer=window.dataLayer||[];</script>
<script src="js/mcp-datalayer.js"></script>
<!-- YOUR_EVERGAGE_BEACON_SCRIPT_HERE -->
<script src="js/data.js"></script>
<script src="js/app.js"></script>
<script src="js/styler-sitemap.js" defer></script>
```

`js/mcp-datalayer.js` pushes `MCP` objects to `dataLayer` (Home, Category, Product, Cart, Checkout, Login, Contact, Purchase). `js/styler-sitemap.js` maps them to Salesforce page types and content zones.
