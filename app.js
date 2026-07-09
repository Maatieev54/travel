// ============================================================
// WOOX Travel — interactions
// ============================================================

// ===== Nav background on scroll =====
const nav = document.getElementById("nav");
const toTop = document.getElementById("toTop");
function onScroll() {
  const scrolled = window.scrollY > 40;
  nav.classList.toggle("bg-[#0d2b30]", scrolled);
  nav.classList.toggle("shadow-lg", scrolled);
  nav.classList.toggle("backdrop-blur", scrolled);
  toTop.classList.toggle("opacity-0", window.scrollY < 500);
  toTop.classList.toggle("invisible", window.scrollY < 500);
  toTop.classList.toggle("translate-y-3", window.scrollY < 500);
}
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// ===== Mobile drawer =====
const drawer = document.getElementById("drawer");
const drawerPanel = document.getElementById("drawerPanel");
const menuToggle = document.getElementById("menuToggle");
const drawerClose = document.getElementById("drawerClose");
const drawerOverlay = document.getElementById("drawerOverlay");

function openDrawer() {
  drawer.classList.remove("hidden");
  requestAnimationFrame(() => drawerPanel.classList.remove("translate-x-full"));
  menuToggle.setAttribute("aria-expanded", "true");
}
function closeDrawer() {
  drawerPanel.classList.add("translate-x-full");
  menuToggle.setAttribute("aria-expanded", "false");
  setTimeout(() => drawer.classList.add("hidden"), 300);
}
menuToggle.addEventListener("click", openDrawer);
drawerClose.addEventListener("click", closeDrawer);
drawerOverlay.addEventListener("click", closeDrawer);
document.querySelectorAll(".drawer-link").forEach((l) => l.addEventListener("click", closeDrawer));

// ===== Hero swiper + stats bar =====
const statPop = document.getElementById("statPop");
const statArea = document.getElementById("statArea");
const statPrice = document.getElementById("statPrice");
const slides = document.querySelectorAll(".hero-swiper .swiper-slide");

function updateStats(index) {
  const el = slides[index]?.querySelector(".hero-stats");
  if (!el) return;
  statPop.textContent = el.dataset.pop;
  statArea.textContent = el.dataset.area;
  statPrice.textContent = el.dataset.price;
}

const progressCircle = document.querySelector(".autoplay-progress svg");
const progressContent = document.querySelector(".autoplay-progress span");

const swiper = new Swiper(".hero-swiper", {
  loop: true,
  effect: "slide",
  autoplay: { delay: 6000, disableOnInteraction: false },
  pagination: { el: ".swiper-pagination", clickable: true },
  on: {
    init(s) { updateStats(s.realIndex); },
    slideChange(s) { updateStats(s.realIndex); },
    autoplayTimeLeft(s, time, progress) {
      if (progressCircle) progressCircle.style.setProperty("--progress", 1 - progress);
      if (progressContent) progressContent.textContent = `${Math.ceil(time / 1000)}s`;
    },
  },
});
updateStats(0);

// ===== Scroll reveal =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ===== Animated counters =====
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const duration = 1500;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));

// ===== Newsletter / contact form =====
const form = document.getElementById("newsletter");
const nName = document.getElementById("nName");
const nEmail = document.getElementById("nEmail");
const formMsg = document.getElementById("formMsg");
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (nName.value.trim().length < 2) {
    formMsg.textContent = "Please enter your name.";
    formMsg.className = "text-sm mt-3 text-red-500";
    nName.focus();
    return;
  }
  if (!isValidEmail(nEmail.value.trim())) {
    formMsg.textContent = "Please enter a valid email address.";
    formMsg.className = "text-sm mt-3 text-red-500";
    nEmail.focus();
    return;
  }
  formMsg.textContent = `Thanks, ${nName.value.trim()}! Our travel team will be in touch soon. ✈️`;
  formMsg.className = "text-sm mt-3 text-[var(--brand)] font-medium";
  form.reset();
});

// ===== Footer year =====
document.getElementById("year").textContent = new Date().getFullYear();
