// Template King — renders products from products.json. No build step.
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const load = () => fetch("products.json", {cache: "no-cache"}).then(r => r.json());

function card(p) {
  return `<article class="card"><a href="product.html?slug=${encodeURIComponent(p.slug)}" tabindex="-1" aria-hidden="true"><img src="${esc(p.images[0])}" alt="" loading="lazy" width="800" height="600"></a>
  <div class="body"><span class="cat">${esc(p.category)}</span><h3><a href="product.html?slug=${encodeURIComponent(p.slug)}">${esc(p.title)}</a></h3><p>${esc(p.tagline)}</p>
  ${p.price ? `<p><strong>${esc(p.price)}</strong></p>` : ""}
  <div class="actions"><a class="btn teal" href="product.html?slug=${encodeURIComponent(p.slug)}">Details</a><a class="btn" href="${esc(p.etsy_url)}" rel="noopener">Buy on Etsy</a></div></div></article>`;
}
const soon = `<article class="card soon"><h3>More templates coming soon</h3><p>New spreadsheets for budgeting, small business and more are on the way.</p><a href="https://www.pinterest.com/russian1987/template-king-small-business-templates/" rel="noopener">Follow on Pinterest for updates</a></article>`;

function home(products) {
  const grid = document.getElementById("grid"), filters = document.getElementById("filters");
  const sorted = [...products].sort((a, b) => (b.featured === true) - (a.featured === true));
  const cats = ["All", ...new Set(products.map(p => p.category))];
  const draw = cat => {
    grid.innerHTML = sorted.filter(p => cat === "All" || p.category === cat).map(card).join("") + soon;
    filters.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b.dataset.cat === cat));
  };
  filters.innerHTML = cats.map(c => `<button type="button" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
  filters.addEventListener("click", e => { if (e.target.dataset.cat) draw(e.target.dataset.cat); });
  draw("All");
}

function setMeta(sel, attr, val) { let m = document.head.querySelector(sel); if (m) m.setAttribute(attr, val); else { m = document.createElement("meta"); const [k, v] = sel.match(/\[(\w+(?::\w+)?)="([^"]+)"\]/).slice(1); m.setAttribute(k.replace(/^(name|property)$/, "$1"), v); m.setAttribute(attr, val); document.head.appendChild(m); } }

function product(products) {
  const el = document.getElementById("product");
  const slug = new URLSearchParams(location.search).get("slug");
  const p = products.find(x => x.slug === slug);
  if (!p) { el.innerHTML = `<h1>Template not found</h1><p><a href="./">Back to all templates</a></p>`; return; }
  document.title = `${p.title} | Template King`;
  document.querySelector('meta[name="description"]').setAttribute("content", p.tagline);
  setMeta('meta[property="og:title"]', "content", p.title);
  const media = [...(p.video ? [{v: p.video}] : []), ...p.images.map(i => ({i}))];
  const show = m => m.v
    ? `<video src="${esc(m.v)}" autoplay muted loop playsinline poster="${esc(p.images[0])}" aria-label="${esc(p.title)} preview video"></video>`
    : `<img src="${esc(m.i)}" alt="${esc(p.title)} preview" width="1600" height="1200">`;
  el.innerHTML = `<p><a href="./#products">← All templates</a></p><div class="pgrid"><div><div class="main-media" id="mm">${show(media[0])}</div>
  <div class="thumbs" aria-label="Product images">${media.map((m, k) => `<button type="button" data-k="${k}" aria-label="Show ${m.v ? "video" : "image " + k}" aria-current="${k === 0}"><img src="${esc(m.v ? p.images[0] : m.i)}" alt="" loading="lazy" width="160" height="120"></button>`).join("")}</div></div>
  <div class="pinfo"><span class="cat" style="color:var(--teal);font-weight:800;text-transform:uppercase">${esc(p.category)}</span><h1>${esc(p.title)}</h1><p class="lead" style="color:inherit">${esc(p.tagline)}</p>
  ${p.price ? `<p><strong>${esc(p.price)}</strong></p>` : ""}
  <p><a class="btn" href="${esc(p.etsy_url)}" rel="noopener">Buy on Etsy</a></p>
  <h2 style="font-size:1.3rem">What's included</h2><ul>${p.description.map(d => `<li>${esc(d)}</li>`).join("")}</ul>
  <div class="tags">${(p.tags || []).map(t => `<span>${esc(t)}</span>`).join("")}</div>
  ${p.note ? `<p class="note">${esc(p.note)}</p>` : ""}<p><a class="btn" href="${esc(p.etsy_url)}" rel="noopener">Buy on Etsy</a></p></div></div>`;
  el.querySelector(".thumbs").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    document.getElementById("mm").innerHTML = show(media[+b.dataset.k]);
    el.querySelectorAll(".thumbs button").forEach(x => x.setAttribute("aria-current", x === b));
  });
}

load().then(ps => document.getElementById("grid") ? home(ps) : product(ps))
  .catch(() => { const t = document.getElementById("grid") || document.getElementById("product"); t.innerHTML = "<p>Could not load templates. Please refresh.</p>"; });
