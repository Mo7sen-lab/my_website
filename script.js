/* BiteSpot — تفاعلات الموقع
   قبل النشر: غيّر رقم واتساب في WHATSAPP_NUMBER إلى رقم المطعم بصيغة دولية بدون + أو مسافات.
*/
const WHATSAPP_NUMBER = "01020904097"; // مثال فقط: استبدله برقم المطعم الحقيقي
const CURRENCY = "ج.م";

const products = [
  { id: 1, name: "Big Bite Burger", arName: "بيج بايت برجر", category: "burger", price: 249, emoji: "🍔", badge: "الأكثر طلبًا", rating: "4.9", desc: "برجر لحم، جبنة شيدر، خس، طماطم وصوص البيت المميز." },
  { id: 2, name: "Crispy Chicken", arName: "كريسبي تشيكن", category: "burger", price: 189, emoji: "🍗", badge: "مقرمش", rating: "4.8", desc: "فراخ مقرمشة، خس طازة، ومايونيز في عيش بريوش." },
  { id: 3, name: "Double Cheese", arName: "دبل تشيز برجر", category: "burger", price: 279, emoji: "🍔", badge: "لعشاق الجبنة", rating: "4.9", desc: "قطعتين برجر مع شريحتين جبنة وصوص خاص." },
  { id: 4, name: "Margherita Pizza", arName: "بيتزا مارجريتا", category: "pizza", price: 179, emoji: "🍕", badge: "كلاسيك", rating: "4.7", desc: "صلصة طماطم، موتزاريلا، ريحان ولمسة زيت زيتون." },
  { id: 5, name: "Chicken Ranch", arName: "بيتزا تشيكن رانش", category: "pizza", price: 239, emoji: "🍕", badge: "اختيار مميز", rating: "4.9", desc: "فراخ، موتزاريلا، فلفل ألوان وصوص رانش." },
  { id: 6, name: "Alfredo Pasta", arName: "مكرونة ألفريدو", category: "pasta", price: 199, emoji: "🍝", badge: "", rating: "4.8", desc: "مكرونة بصوص كريمي وفراخ وجبنة بارميزان." },
  { id: 7, name: "Spicy Pasta", arName: "مكرونة سبايسي", category: "pasta", price: 179, emoji: "🍝", badge: "حارة", rating: "4.7", desc: "مكرونة بصلصة الطماطم والفلفل والتوابل." },
  { id: 8, name: "Loaded Fries", arName: "لودد فرايز", category: "sides", price: 99, emoji: "🍟", badge: "مفضلة", rating: "4.8", desc: "بطاطس مقرمشة مع جبنة وصوص البيت." },
  { id: 9, name: "Onion Rings", arName: "أونيون رينجز", category: "sides", price: 79, emoji: "🧅", badge: "", rating: "4.6", desc: "حلقات بصل ذهبية ومقرمشة." },
  { id: 10, name: "Lemon Mint", arName: "ليمون بالنعناع", category: "drinks", price: 59, emoji: "🍋", badge: "منعش", rating: "4.8", desc: "ليمون طازة ونعناع وثلج." },
  { id: 11, name: "Iced Coffee", arName:"Ice coffee", category: "drinks", price: 89, emoji: "🧋", badge: "", rating: "4.7", desc: "قهوة باردة بطعم غني ولمسة حليب." },
  { id: 12, name: "Cola", arName: "Cola", category: "drinks", price: 35, emoji: "🥤", badge: "", rating: "4.5", desc: "مشروب غازي بارد." }
];

let activeCategory = "all";
let searchTerm = "";
let cart = [];
let toastTimer;

const menuGrid = document.getElementById("menuGrid");
const noResults = document.getElementById("noResults");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartSummary = document.getElementById("cartSummary");

function money(amount) {
  return `${amount.toLocaleString("en-US")} ${CURRENCY}`;
}

function renderMenu() {
  const filtered = products.filter(product => {
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    const searchable = `${product.name} ${product.arName} ${product.desc}`.toLowerCase();
    return matchesCategory && searchable.includes(searchTerm.toLowerCase());
  });

  menuGrid.innerHTML = filtered.map(product => `
    <article class="menu-card">
      <div class="menu-card-image">
        <!-- لاستبدال الإيموجي بصورة: ضع img هنا واستخدم مسار صورتك -->
        <div class="image-placeholder" role="img" aria-label="مكان صورة ${product.arName}">
          <span class="placeholder-icon">${product.emoji}</span>
          <strong>صورة ${product.arName}</strong>
          <small>أضف صورة الصنف هنا</small>
        </div>
        ${product.badge ? `<span class="menu-badge">${product.badge}</span>` : ""}
      </div>
      <div class="menu-card-content">
        <div class="menu-card-top">
          <h3>${product.arName}</h3>
          <span class="menu-rating">★ ${product.rating} <span>(${product.name})</span></span>
        </div>
        <p>${product.desc}</p>
        <div class="menu-card-bottom">
          <span class="price">${money(product.price)}</span>
          <button class="add-button" data-add="${product.id}" aria-label="أضف ${product.arName} للسلة">+</button>
        </div>
      </div>
    </article>
  `).join("");

  noResults.classList.toggle("hidden", filtered.length > 0);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function addToCart(productId) {
  const product = products.find(item => item.id === Number(productId));
  if (!product) return;
  const existing = cart.find(item => item.id === product.id);
  if (existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  renderCart();
  showToast(`اتضاف ${product.arName} لسلتك 🛒`);
}

function changeQuantity(productId, amount) {
  const item = cart.find(entry => entry.id === Number(productId));
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) cart = cart.filter(entry => entry.id !== item.id);
  renderCart();
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("drawerCount").textContent = `(${count})`;
  document.getElementById("cartTotal").textContent = money(total);

  cartEmpty.classList.toggle("hidden", cart.length > 0);
  cartSummary.classList.toggle("hidden", cart.length === 0);

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-line">
      <div class="cart-line-emoji">${item.emoji}</div>
      <div class="cart-line-info">
        <strong>${item.arName}</strong>
        <small>${money(item.price)} للواحد</small>
        <div class="quantity-controls">
          <button data-quantity="${item.id}" data-change="-1" aria-label="تقليل الكمية">−</button>
          <span>${item.quantity}</span>
          <button data-quantity="${item.id}" data-change="1" aria-label="زيادة الكمية">+</button>
        </div>
      </div>
      <span class="cart-line-total">${money(item.price * item.quantity)}</span>
    </div>
  `).join("");
}

function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  document.getElementById("closeCart").focus();
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

function openWhatsApp(message) {
  if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER) || WHATSAPP_NUMBER === "201000000000") {
    showToast("عدّل رقم واتساب المطعم في ملف script.js أولًا.");
    return;
  }
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

document.getElementById("filterRow").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("active", chip === button));
  renderMenu();
});

document.getElementById("menuSearch").addEventListener("input", event => {
  searchTerm = event.target.value.trim();
  renderMenu();
});

document.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) addToCart(addButton.dataset.add);

  const quantityButton = event.target.closest("[data-quantity]");
  if (quantityButton) changeQuantity(quantityButton.dataset.quantity, Number(quantityButton.dataset.change));
});

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
document.getElementById("browseMenu").addEventListener("click", () => {
  closeCart();
  document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
});
document.getElementById("clearCart").addEventListener("click", () => {
  cart = [];
  renderCart();
  showToast("تم تفريغ السلة.");
});

document.getElementById("checkoutButton").addEventListener("click", () => {
  if (!cart.length) return;
  const lines = cart.map(item => `• ${item.arName} × ${item.quantity} = ${money(item.price * item.quantity)}`);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const message = `أهلًا BiteSpot، عايز أطلب:\n\n${lines.join("\n")}\n\nالإجمالي: ${money(total)}\n\nمن فضلك أكدوا التوفر وتكلفة التوصيل.`;
  openWhatsApp(message);
});

document.getElementById("contactWhatsApp").addEventListener("click", event => {
  event.preventDefault();
  openWhatsApp("أهلًا BiteSpot، عايز أعرف تفاصيل المنيو والطلب.");
});

document.getElementById("reservationForm").addEventListener("submit", event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const name = String(form.get("guestName") || "").trim();
  const phone = String(form.get("guestPhone") || "").trim();
  const guests = String(form.get("guestCount") || "");
  const date = String(form.get("bookingDate") || "");
  const time = String(form.get("bookingTime") || "");
  const notes = String(form.get("bookingNotes") || "").trim();

  if (!name || !phone || !date) {
    showToast("من فضلك املأ الاسم ورقم الموبايل والتاريخ.");
    return;
  }
  const message = `أهلًا BiteSpot، عايز أطلب حجز طاولة.\nالاسم: ${name}\nرقم الموبايل: ${phone}\nعدد الأفراد: ${guests}\nالتاريخ: ${date}\nالوقت: ${time}${notes ? `\nملاحظات: ${notes}` : ""}\n\nمن فضلك أكدوا توفر الحجز.`;
  openWhatsApp(message);
});

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "إغلاق القائمة" : "فتح القائمة");
  menuToggle.textContent = isOpen ? "✕" : "☰";
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "فتح القائمة");
  menuToggle.textContent = "☰";
}));

const bookingDate = document.getElementById("bookingDate");
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
bookingDate.min = localToday;
document.getElementById("year").textContent = new Date().getFullYear();

renderMenu();
renderCart();
