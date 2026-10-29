# Template King

Static shop site for Template King spreadsheet templates — plain HTML/CSS/JS, no build step, hosted on GitHub Pages:
https://russian1987.github.io/template-king/

## Add a new template
1. Put images (WebP/JPG, ~1600px wide, 4:3) in `assets/products/<slug>/`. Optional muted video `listing-video.mp4`.
2. Add an object to `products.json`:
```json
{
  "slug": "my-new-template",
  "title": "My New Template",
  "tagline": "One-line pitch",
  "category": "Budgeting",
  "featured": false,
  "price": "",
  "etsy_url": "https://www.etsy.com/listing/...",
  "description": ["Bullet 1", "Bullet 2"],
  "images": ["assets/products/my-new-template/01.webp"],
  "video": "",
  "tags": ["tag1", "tag2"],
  "note": ""
}
```
3. Commit and push to `main`. The product appears on the home page grid (with a category filter button for any new category) and at `product.html?slug=my-new-template`.

Notes: always use relative paths (the site lives under `/template-king/`). Leave `price` empty to let Etsy show the live price.
