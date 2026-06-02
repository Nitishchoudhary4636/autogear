// ============ AUTH ============
const AUTH_KEY = "ag_users";
const SESSION_KEY = "ag_session";

function getUsers(){ return JSON.parse(localStorage.getItem(AUTH_KEY) || "[]"); }
function saveUsers(u){ localStorage.setItem(AUTH_KEY, JSON.stringify(u)); }
function currentUser(){
  const s = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
  return s ? JSON.parse(s) : null;
}
function logout(){
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
  toast("Logged out successfully");
  setTimeout(()=>location.href="index.html", 600);
}

// ============ CART / WISHLIST ============
const USD_TO_INR = 83;

function toINR(amount){ return amount * USD_TO_INR; }
function formatINR(amount){
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

function getCart(){ return JSON.parse(localStorage.getItem("ag_cart") || "[]"); }
function saveCart(c){ localStorage.setItem("ag_cart", JSON.stringify(c)); updateBadges(); }
function getWish(){ return JSON.parse(localStorage.getItem("ag_wish") || "[]"); }
function saveWish(w){ localStorage.setItem("ag_wish", JSON.stringify(w)); updateBadges(); }

function addToCart(id, qty=1){
  const cart = getCart();
  const ex = cart.find(i=>i.id===id);
  if(ex) ex.qty += qty; else cart.push({id, qty});
  saveCart(cart);
  toast("Added to cart");
}
function removeFromCart(id){
  saveCart(getCart().filter(i=>i.id!==id));
}
function updateCartQty(id, qty){
  const cart = getCart();
  const it = cart.find(i=>i.id===id);
  if(it){ it.qty = Math.max(1, qty); saveCart(cart); }
}
function toggleWish(id){
  let w = getWish();
  if(w.includes(id)){ w = w.filter(x=>x!==id); toast("Removed from wishlist"); }
  else { w.push(id); toast("Added to wishlist"); }
  return `
  <div class="top-announcement">Get Upto 20% OFF Site-Wide</div>
  <header class="site">
    <div class="container nav">
      <a href="index.html" class="brand">
        <img src="images/logo.png" alt="AutoGear">
        <span>Auto<b>Gear</b></span>
      </a>

      <div class="search-box">
        <input type="search" placeholder="Search for articles" aria-label="Search">
      </div>

      <nav class="nav-links" id="navLinks">
        ${links.map(l=>`<a href="${l.h}" class="${active===l.k?'active':''}">${l.t}</a>`).join("")}
      </nav>

      <div class="nav-actions">
        <a href="wishlist.html" class="icon-btn" title="Wishlist">
          <svg viewBox='0 0 24 24'><path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/></svg>
          <span class="badge" data-wish-count>0</span>
        </a>
        <a href="cart.html" class="icon-btn" title="Cart">
          <svg viewBox='0 0 24 24'><circle cx='9' cy='21' r='1'/><circle cx='20' cy='21' r='1'/><path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'/></svg>
          <span class="badge" data-cart-count>0</span>
        </a>
        ${userLink}
        <button class="icon-btn hamburger" onclick="document.getElementById('navLinks').classList.toggle('open')">
          <svg viewBox='0 0 24 24'><path d='M3 12h18M3 6h18M3 18h18'/></svg>
        </button>
      </div>
    </div>
  </header>

  <div class="sub-nav">
    <div class="container">
      <nav class="mini-links">
        <a href="#">Merchandise</a>
        <a href="#">Accessories</a>
        <a href="#">Offer Zone</a>
        <a href="#">Kids Wear</a>
        <a href="#">Shop By Model</a>
        <a href="#" class="highlight">New Launches</a>
      </nav>
    </div>
  </div>`;
        <a href="pdp.html?id=${p.id}"><h3>${p.name}</h3></a>
        <div class="rating">${stars}<span>(${p.reviews})</span></div>
        <div class="price-row">
          <div class="price">${formatINR(toINR(p.price))}${p.old?`<del>${formatINR(toINR(p.old))}</del>`:""}</div>
          <button class="add" onclick="addToCart(${p.id})">Add</button>
        </div>
      </div>
    </div>`;
}

// ============ HEADER INJECTION ============
function buildHeader(active){
  const user = currentUser();
  const userLink = user
    ? `<div class="icon-btn" title="${user.name}" onclick="if(confirm('Log out?'))logout()"><svg viewBox='0 0 24 24'><path d='M16 17l5-5-5-5M21 12H9M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/></svg></div>`
    : `<a href="login.html" class="icon-btn" title="Login"><svg viewBox='0 0 24 24'><path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg></a>`;
  const nav = ["home","shop","contact"];
  const links = [
    {h:"index.html",t:"Home",k:"home"},
    {h:"shop.html",t:"Shop",k:"shop"},
    {h:"shop.html?cat=Interior",t:"Interior",k:"interior"},
    {h:"shop.html?cat=Exterior",t:"Exterior",k:"exterior"},
    {h:"shop.html?cat=Electronics",t:"Electronics",k:"electronics"},
    {h:"contact.html",t:"Contact",k:"contact"}
  ];
  return `
  <div class="top-announcement">Get Upto 20% OFF Site-Wide</div>
  <header class="site">
    <div class="container nav">
      <a href="index.html" class="brand">
        <img src="images/logo.png" alt="AutoGear">
        <span>Auto<b>Gear</b></span>
      </a>

      <div class="search-box">
        <input type="search" placeholder="Search for articles" aria-label="Search">
      </div>

      <nav class="nav-links" id="navLinks">
        ${links.map(l=>`<a href="${l.h}" class="${active===l.k?'active':''}">${l.t}</a>`).join("")}
      </nav>

      <div class="nav-actions">
        <a href="wishlist.html" class="icon-btn" title="Wishlist">
          <svg viewBox='0 0 24 24'><path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/></svg>
          <span class="badge" data-wish-count>0</span>
        </a>
        <a href="cart.html" class="icon-btn" title="Cart">
          <svg viewBox='0 0 24 24'><circle cx='9' cy='21' r='1'/><circle cx='20' cy='21' r='1'/><path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'/></svg>
          <span class="badge" data-cart-count>0</span>
        </a>
        ${userLink}
        <button class="icon-btn hamburger" onclick="document.getElementById('navLinks').classList.toggle('open')">
          <svg viewBox='0 0 24 24'><path d='M3 12h18M3 6h18M3 18h18'/></svg>
        </button>
      </div>
    </div>
  </header>`;
  
  
}

function buildFooter(){
  return `
  <footer class="site">
    <div class="container">
      <div class="f-grid">
        <div>
          <div class="brand" style="margin-bottom:14px">
            <img src="images/logo.png" alt="AutoGear" style="width:38px;height:38px">
            <span>Auto<b style="color:var(--primary)">Gear</b></span>
          </div>
          <p style="color:var(--muted);font-size:13.5px;max-width:320px">Premium vehicle accessories trusted by 50,000+ drivers worldwide. Quality, performance and style for every ride.</p>
        </div>
        <div>
          <h5>Shop</h5>
          <a href="shop.html?cat=Interior">Interior</a>
          <a href="shop.html?cat=Exterior">Exterior</a>
          <a href="shop.html?cat=Lighting">Lighting</a>
          <a href="shop.html?cat=Electronics">Electronics</a>
        </div>
        <div>
          <h5>Company</h5>
          <a href="index.html">About AutoGear</a>
          <a href="contact.html">Contact</a>
          <a href="#">Careers</a>
          <a href="#">Blog</a>
        </div>
        <div>
          <h5>Support</h5>
          <a href="#">Shipping</a>
          <a href="#">Returns</a>
          <a href="#">Warranty</a>
          <a href="#">FAQ</a>
        </div>
      </div>
      <div class="f-bottom">
        <span>© ${new Date().getFullYear()} AutoGear Industries. All rights reserved.</span>
        <span>Privacy · Terms · Cookies</span>
      </div>
    </div>
  </footer>`;
}

function mountChrome(active){
  document.getElementById("header").innerHTML = buildHeader(active);
  document.getElementById("footer").innerHTML = buildFooter();
  updateBadges();
}
