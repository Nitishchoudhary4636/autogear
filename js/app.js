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
  saveWish(w);
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
      <!-- Brand Section -->
      <div class="f-brand-section">
        <div class="brand" style="margin-bottom:14px">
          <img src="images/logo.png" alt="AutoGear" style="width:42px;height:42px">
          <span style="font-size:20px;font-weight:800;letter-spacing:.5px">Auto<b style="color:var(--primary)">Gear</b></span>
        </div>
        <p style="color:var(--muted);font-size:13.5px;max-width:380px;line-height:1.6">Premium vehicle accessories trusted by 50,000+ drivers worldwide. Quality, performance and style for every ride.</p>
        <div class="f-social" style="display:flex;gap:12px;margin-top:16px">
          <a href="#" title="Facebook" style="width:36px;height:36px;border-radius:50%;background:var(--border);display:flex;align-items:center;justify-content:center;color:#666;text-decoration:none">f</a>
          <a href="#" title="Instagram" style="width:36px;height:36px;border-radius:50%;background:var(--border);display:flex;align-items:center;justify-content:center;color:#666;text-decoration:none">📷</a>
          <a href="#" title="Twitter" style="width:36px;height:36px;border-radius:50%;background:var(--border);display:flex;align-items:center;justify-content:center;color:#666;text-decoration:none">𝕏</a>
        </div>
      </div>

      <!-- Multi-Column Menu Section -->
      <div class="multi-menu-wrapper">
        <!-- Helmets Column -->
        <div class="menu-column">
          <h3 class="menu-heading">Helmets</h3>
          <ul class="menu-links">
            <li><a href="shop.html?cat=Helmets&type=Under1000" class="menu-link">Helmets under ₹1,000</a></li>
            <li><a href="shop.html?cat=Helmets&type=Under2000" class="menu-link">Helmets under ₹2,000</a></li>
            <li><a href="shop.html?cat=Helmets&type=Under3000" class="menu-link">Helmets under ₹3,000</a></li>
            <li><a href="shop.html?cat=Helmets&type=Under5000" class="menu-link">Helmets under ₹5,000</a></li>
            <li><a href="shop.html?cat=Helmets&type=FullFace" class="menu-link">Full Face Helmets</a></li>
            <li><a href="shop.html?cat=Helmets&type=HalfFace" class="menu-link">Half Face Helmets</a></li>
            <li><a href="shop.html?cat=Helmets&type=Modular" class="menu-link">Modular Helmets</a></li>
            <li><a href="shop.html?cat=Helmets&type=Kids" class="menu-link">Kids Helmets</a></li>
          </ul>
        </div>

        <!-- Riding Gear Column -->
        <div class="menu-column">
          <h3 class="menu-heading">Riding Gear</h3>
          <ul class="menu-links">
            <li><a href="shop.html?cat=Gear&type=Jacket" class="menu-link">Riding Jackets</a></li>
            <li><a href="shop.html?cat=Gear&type=Shoes" class="menu-link">Riding Shoes</a></li>
            <li><a href="shop.html?cat=Gear&type=Gloves" class="menu-link">Riding Gloves</a></li>
            <li><a href="shop.html?cat=Gear&type=Armor" class="menu-link">Body Armor & Protection</a></li>
            <li><a href="shop.html?cat=Gear&type=Pants" class="menu-link">Riding Pants</a></li>
            <li><a href="shop.html?cat=Gear&type=Rainwear" class="menu-link">Rainwear & Covers</a></li>
            <li><a href="shop.html?cat=Gear&type=Backpack" class="menu-link">Riding Backpacks</a></li>
          </ul>
        </div>

        <!-- Accessories Column -->
        <div class="menu-column">
          <h3 class="menu-heading">Accessories</h3>
          <ul class="menu-links">
            <li><a href="shop.html?cat=Security&type=Lock" class="menu-link">Helmet Locks</a></li>
            <li><a href="shop.html?cat=Security&type=Guard" class="menu-link">Crash Guards</a></li>
            <li><a href="shop.html?cat=Style&type=Tank" class="menu-link">Tank Pads</a></li>
            <li><a href="shop.html?cat=Utility&type=Stand" class="menu-link">Side Stands</a></li>
            <li><a href="shop.html?cat=Utility&type=Charger" class="menu-link">Mobile Chargers</a></li>
            <li><a href="shop.html?cat=Care&type=Cleaner" class="menu-link">Chain Cleaners</a></li>
            <li><a href="shop.html?cat=Care&type=Oil" class="menu-link">Engine Oil & Fluids</a></li>
            <li><a href="shop.html?cat=Care&type=Polish" class="menu-link">Polish & Wax</a></li>
          </ul>
        </div>

        <!-- Urban Wear Column -->
        <div class="menu-column">
          <h3 class="menu-heading">Urban Wear</h3>
          <ul class="menu-links">
            <li><a href="shop.html?cat=Urban&type=Shirts" class="menu-link">T-Shirts & Shirts</a></li>
            <li><a href="shop.html?cat=Urban&type=Caps" class="menu-link">Caps & Hats</a></li>
            <li><a href="shop.html?cat=Urban&type=Bags" class="menu-link">Bags & Backpacks</a></li>
            <li><a href="shop.html?cat=Urban&type=Sweatshirt" class="menu-link">Sweatshirts & Hoodies</a></li>
            <li><a href="shop.html?cat=Urban&type=Shoes" class="menu-link">Casual Shoes</a></li>
            <li><a href="shop.html?cat=Urban&type=Jacket" class="menu-link">Casual Jackets</a></li>
          </ul>
        </div>

        <!-- Kids Wear Column -->
        <div class="menu-column">
          <h3 class="menu-heading">Kids Wear</h3>
          <ul class="menu-links">
            <li><a href="shop.html?cat=Kids&type=Helmet" class="menu-link">Kids Helmets</a></li>
            <li><a href="shop.html?cat=Kids&type=TShirt" class="menu-link">Kids T-Shirts</a></li>
            <li><a href="shop.html?cat=Kids&type=Jacket" class="menu-link">Kids Jackets</a></li>
            <li><a href="shop.html?cat=Kids&type=Gloves" class="menu-link">Kids Gloves</a></li>
            <li><a href="shop.html?cat=Kids&type=Shoes" class="menu-link">Kids Shoes</a></li>
            <li><a href="shop.html?cat=Kids&type=Belt" class="menu-link">Safety Belts</a></li>
            <li><a href="shop.html?cat=Kids&type=Cap" class="menu-link">Kids Caps</a></li>
          </ul>
        </div>

        <!-- Support Column -->
        <div class="menu-column">
          <h3 class="menu-heading">Support</h3>
          <ul class="menu-links">
            <li><a href="contact.html" class="menu-link">Contact Us</a></li>
            <li><a href="#" class="menu-link">Shipping Info</a></li>
            <li><a href="#" class="menu-link">Returns & Exchange</a></li>
            <li><a href="#" class="menu-link">Warranty</a></li>
            <li><a href="#" class="menu-link">Size Guide</a></li>
            <li><a href="#" class="menu-link">FAQ</a></li>
            <li><a href="index.html" class="menu-link">About AutoGear</a></li>
            <li><a href="#" class="menu-link">Blog</a></li>
          </ul>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="f-bottom">
        <span style="color:var(--muted);font-size:13px">© ${new Date().getFullYear()} AutoGear Industries. All rights reserved.</span>
        <div style="display:flex;gap:20px;color:var(--muted);font-size:13px">
          <a href="#" style="color:var(--muted);text-decoration:none">Privacy Policy</a>
          <a href="#" style="color:var(--muted);text-decoration:none">Terms & Conditions</a>
          <a href="#" style="color:var(--muted);text-decoration:none">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>`;
}

function mountChrome(active){
  document.getElementById("footer").innerHTML = buildFooter();
  updateBadges();
  initMobileMenu();
}

// ============ MOBILE MENU & MEGA MENU INIT ============
function initMobileMenu(){
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  
  if(!hamburger) return;
  
  // Hamburger toggle
  hamburger.addEventListener("click", function(e){
    e.stopPropagation();
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("open");
  });
  
  // Close menu when a link is clicked
  document.querySelectorAll(".mobile-menu-item a").forEach(link => {
    link.addEventListener("click", function(){
      hamburger.classList.remove("active");
      mobileMenu.classList.remove("open");
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener("click", function(e){
    if(!e.target.closest(".hamburger") && !e.target.closest(".mobile-menu")){
      hamburger.classList.remove("active");
      mobileMenu.classList.remove("open");
    }
  });
  
  // Update cart badge
  updateBadges();
}

function updateBadges(){
  const cartCount = getCart().reduce((sum, item) => sum + item.qty, 0);
  const cartBadge = document.getElementById("cartCount");
  if(cartBadge) cartBadge.textContent = cartCount;
}

// ============ HERO CAROUSEL ============
(function(){
  function initHeroCarousel(){
    const slides = document.querySelectorAll('.hero .slide');
    const dotsContainer = document.getElementById('dots');
    const hero = document.querySelector('.hero');
    if(!slides || slides.length === 0) return;

    let current = 0;
    let timer = null;
    const interval = 6000;

    // build dots
    dotsContainer.innerHTML = '';
    slides.forEach((s, i) => {
      const d = document.createElement('button');
      d.className = 'dot' + (i===0? ' active' : '');
      d.setAttribute('aria-label', `Go to slide ${i+1}`);
      d.dataset.index = i;
      d.addEventListener('click', function(){ goTo(parseInt(this.dataset.index,10)); });
      dotsContainer.appendChild(d);
    });

    function update(){
      slides.forEach((s, i) => s.classList.toggle('active', i === current));
      const dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach((d,i) => d.classList.toggle('active', i === current));
    }

    function goTo(i){
      current = (i + slides.length) % slides.length;
      update();
      restart();
    }

    function next(){ goTo(current + 1); }
    function prev(){ goTo(current - 1); }

    function start(){ if(timer) clearInterval(timer); timer = setInterval(next, interval); }
    function stop(){ if(timer) clearInterval(timer); timer = null; }
    function restart(){ stop(); start(); }

    // expose controls for inline onclick handlers
    window.slideNext = next;
    window.slidePrev = prev;

    // pause on hover
    if(hero){
      hero.addEventListener('mouseenter', stop);
      hero.addEventListener('mouseleave', start);
    }

    // keyboard support
    document.addEventListener('keydown', function(e){
      if(e.key === 'ArrowRight') next();
      if(e.key === 'ArrowLeft') prev();
    });

    // start autoplay
    start();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initHeroCarousel);
  else initHeroCarousel();
})();
