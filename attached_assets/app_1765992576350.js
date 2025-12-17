/* 🌙 NOCTOON v5.0 - Uygulama Sistemi */
/* Tema, Router, Login, Okuma, Yorum, Favori, Admin, Profil */

const app = {
  currentPage: "home",
  user: JSON.parse(localStorage.getItem("user")) || null,
  theme: localStorage.getItem("theme") || "dark",
  data: [
    { id: 1, title: "Karanlığın Çocuğu", genre: "dark", cover: "https://source.unsplash.com/400x600/?night,anime" },
    { id: 2, title: "Gümüş Ay Efsanesi", genre: "fantasy", cover: "https://source.unsplash.com/400x600/?moon,art" },
    { id: 3, title: "Yıldız Tozu", genre: "space", cover: "https://source.unsplash.com/400x600/?galaxy,light" },
    { id: 4, title: "Demir Şövalye", genre: "warrior", cover: "https://source.unsplash.com/400x600/?knight,anime" }
  ],

  /* 🚀 Başlatma */
  init() {
    this.applyTheme();
    this.initSplash();
    this.bindUI();
    this.renderPage("home");
    console.log("🌙 Noctoon v5.0 başlatıldı.");
  },

  /* 🌗 Tema Yönetimi */
  applyTheme() {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(this.theme);
    const logo = document.getElementById("navLogo");
    logo.src = this.theme === "light" ? "assets/logo_light.svg" : "assets/logo_dark.svg";
    document.getElementById("themeToggle").textContent = this.theme === "light" ? "☀️" : "🌙";
  },
  toggleTheme() {
    this.theme = this.theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", this.theme);
    this.applyTheme();
  },

  /* 🔐 Giriş Yönetimi */
  togglePopup(show = true) {
    document.getElementById("loginPopup").classList.toggle("hidden", !show);
  },
  login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    if (!username || !password) return alert("Lütfen kullanıcı bilgilerini girin.");
    if (username === "admin" && password === "admin123") {
      this.user = { name: "Yönetici", role: "admin" };
    } else {
      this.user = { name: username, role: "user" };
    }
    localStorage.setItem("user", JSON.stringify(this.user));
    alert(`Hoş geldin, ${this.user.name}!`);
    this.togglePopup(false);
    this.updateNavAuth();
    this.renderPage("home");
  },
  logout() {
    localStorage.removeItem("user");
    this.user = null;
    this.updateNavAuth();
    this.renderPage("home");
  },
  updateNavAuth() {
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const adminBtn = document.getElementById("nav-admin");
    if (this.user) {
      loginBtn.classList.add("hidden");
      logoutBtn.classList.remove("hidden");
      adminBtn.style.display = this.user.role === "admin" ? "inline-block" : "none";
    } else {
      loginBtn.classList.remove("hidden");
      logoutBtn.classList.add("hidden");
      adminBtn.style.display = "none";
    }
  },

  /* 🧭 Router */
  renderPage(page) {
    const pages = ["home", "detail", "reader", "profile", "admin"];
    document.querySelectorAll("main section").forEach(p => p.classList.add("hidden"));
    if (pages.includes(page)) {
      document.getElementById(`${page}Page`).classList.remove("hidden");
      this.setActiveNav(page);
      this.currentPage = page;
      if (page === "home") this.renderHome();
      if (page === "profile") this.renderProfile();
      if (page === "admin" && (!this.user || this.user.role !== "admin")) {
        alert("Bu alana erişim izniniz yok.");
        return this.renderPage("home");
      }
      if (page === "admin") this.renderAdmin();
    } else {
      document.getElementById("notFoundPage").classList.remove("hidden");
    }
  },
  setActiveNav(page) {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById(`nav-${page}`);
    if (btn) btn.classList.add("active");
  },

  /* 🏠 Ana Sayfa */
  renderHome() {
    const el = document.getElementById("homePage");
    const q = document.getElementById("searchInput").value.toLowerCase();
    const results = this.data.filter(w => w.title.toLowerCase().includes(q));
    el.innerHTML = `
      <h2 class="text-blue-400 text-xl font-bold mb-4">Son Eklenen Seriler</h2>
      <div class="grid md:grid-cols-3">
        ${results
          .map(
            w => `
          <div class="card" onclick="app.showDetail(${w.id})">
            <img src="${w.cover}" alt="${w.title}">
            <h3>${w.title}</h3>
            <p>${w.genre}</p>
          </div>`
          )
          .join("")}
      </div>
    `;
  },

  /* 🔍 Detay Sayfası */
  showDetail(id) {
    const w = this.data.find(x => x.id === id);
    if (!w) return this.renderPage("notFound");
    const el = document.getElementById("detailPage");
    const comments = JSON.parse(localStorage.getItem("comments") || "{}")[id] || [];
    const likes = JSON.parse(localStorage.getItem("likes") || "[]");
    const isLiked = likes.includes(id);
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    const isFav = favs.includes(id);

    el.innerHTML = `
      <button onclick="app.renderPage('home')" class="text-blue-400 hover:underline mb-4">← Geri</button>
      <div class="flex flex-col md:flex-row gap-6">
        <img src="${w.cover}" class="rounded-lg w-60 h-80 object-cover shadow-md">
        <div>
          <h2 class="text-2xl font-bold text-blue-400 mb-2">${w.title}</h2>
          <p class="text-gray-400 mb-3">Tür: ${w.genre}</p>
          <button class="btn-primary" onclick="app.openReader(${w.id})">📖 Bölümü Oku</button>
          <div class="mt-4">
            <button onclick="app.toggleLike(${w.id})">${isLiked ? "💙 Beğenildi" : "🤍 Beğen"}</button>
            <button onclick="app.toggleFav(${w.id})">${isFav ? "⭐ Favoride" : "☆ Favori Ekle"}</button>
          </div>
        </div>
      </div>
      <div class="mt-6">
        <h3 class="text-xl font-semibold mb-2 text-purple-400">💬 Yorumlar</h3>
        <div id="commentList">
          ${comments.map(c => `<p><strong>${c.user}</strong>: ${c.text}</p>`).join("") || "<p>Henüz yorum yok.</p>"}
        </div>
        ${
          this.user
            ? `<div class="mt-3">
                <input id="commentInput" placeholder="Yorum yaz..." class="nav-search w-full">
                <button class="btn-primary mt-2" onclick="app.addComment(${w.id})">Gönder</button>
              </div>`
            : "<p class='text-gray-500 italic mt-2'>Yorum yapmak için giriş yap.</p>"
        }
      </div>
      <div class="mt-6">
        <h3 class="text-xl font-semibold mb-2 text-yellow-400">✨ Benzer Seriler</h3>
        <div class="grid md:grid-cols-3">
          ${this.data
            .filter(x => x.genre === w.genre && x.id !== w.id)
            .map(x => `<div class='card' onclick='app.showDetail(${x.id})'>
                        <img src='${x.cover}'><h3>${x.title}</h3></div>`)
            .join("") || "<p>Benzer seri yok.</p>"}
        </div>
      </div>
    `;
    this.renderPage("detail");
  },

  /* 💬 Yorum Sistemi */
  addComment(id) {
    const input = document.getElementById("commentInput");
    const text = input.value.trim();
    if (!text) return;
    const comments = JSON.parse(localStorage.getItem("comments") || "{}");
    if (!comments[id]) comments[id] = [];
    comments[id].push({ user: this.user.name, text });
    localStorage.setItem("comments", JSON.stringify(comments));
    input.value = "";
    this.showDetail(id);
  },

  /* ❤️ Beğeni & Favori */
  toggleLike(id) {
    let likes = JSON.parse(localStorage.getItem("likes") || "[]");
    likes.includes(id) ? (likes = likes.filter(x => x !== id)) : likes.push(id);
    localStorage.setItem("likes", JSON.stringify(likes));
    this.showDetail(id);
  },
  toggleFav(id) {
    let favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    favs.includes(id) ? (favs = favs.filter(x => x !== id)) : favs.push(id);
    localStorage.setItem("favorites", JSON.stringify(favs));
    this.showDetail(id);
  },

  /* 📖 Okuma Ekranı */
  openReader(id) {
    const w = this.data.find(x => x.id === id);
    if (!w) return this.renderPage("notFound");
    const el = document.getElementById("readerPage");
    el.innerHTML = `
      <button onclick="app.showDetail(${id})" class="text-blue-400 hover:underline mb-4">← Geri</button>
      <h2 class="text-2xl font-bold text-blue-400 mb-2">${w.title}</h2>
      ${Array.from({ length: 10 }).map((_, i) => `<img src="https://source.unsplash.com/1000x${700 + i*30}/?manga" class="w-full mb-4 rounded-lg">`).join("")}
    `;
    this.renderPage("reader");
    this.bindScrollProgress();
  },
  bindScrollProgress() {
    const bar = document.getElementById("progressBar");
    window.onscroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      bar.style.width = (winScroll / height) * 100 + "%";
    };
  },

  /* 👤 Profil */
  renderProfile() {
    const el = document.getElementById("profilePage");
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    const liked = JSON.parse(localStorage.getItem("likes") || "[]");
    const user = this.user ? this.user.name : "Misafir";
    const favSeries = this.data.filter(w => favs.includes(w.id));
    el.innerHTML = `
      <h2 class="text-2xl font-bold text-blue-400 mb-4">👤 ${user}</h2>
      <p class="text-gray-400 mb-4">Beğenilen: ${liked.length}, Favoriler: ${favs.length}</p>
      <h3 class="text-xl font-semibold mb-3 text-purple-400">⭐ Favoriler</h3>
      <div class="grid md:grid-cols-3">
        ${favSeries.length
          ? favSeries.map(w => `<div class='card' onclick='app.showDetail(${w.id})'><img src='${w.cover}'><h3>${w.title}</h3></div>`).join("")
          : "<p class='text-gray-500 italic'>Henüz favori eklenmemiş.</p>"}
      </div>
    `;
    this.renderPage("profile");
  },

  /* 🧮 Admin Paneli */
  renderAdmin() {
    if (!this.user || this.user.role !== "admin") return this.renderPage("home");
    const el = document.getElementById("adminPage");
    const likes = JSON.parse(localStorage.getItem("likes") || "[]");
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    const comments = JSON.parse(localStorage.getItem("comments") || "{}");
    el.innerHTML = `
      <h2 class="text-2xl font-bold text-blue-400 mb-4">🧮 Admin Paneli</h2>
      <div class="admin-stats">
        <div class="admin-box"><h3>Seri Sayısı</h3><p>${this.data.length}</p></div>
        <div class="admin-box"><h3>Beğeniler</h3><p>${likes.length}</p></div>
        <div class="admin-box"><h3>Favoriler</h3><p>${favs.length}</p></div>
        <div class="admin-box"><h3>Yorumlar</h3><p>${Object.values(comments).flat().length}</p></div>
      </div>
    `;
    this.renderPage("admin");
  },

  /* 🎬 Splash */
  initSplash() {
    const splash = document.getElementById("splashScreen");
    setTimeout(() => splash.classList.remove("active"), 1200);
  },

  /* 🔗 UI Bağlantıları */
  bindUI() {
    document.getElementById("themeToggle").addEventListener("click", () => this.toggleTheme());
    document.getElementById("loginBtn").addEventListener("click", () => this.togglePopup(true));
    document.getElementById("logoutBtn").addEventListener("click", () => this.logout());
    document.getElementById("searchInput").addEventListener("input", () => this.renderHome());
  }
};

window.addEventListener("DOMContentLoaded", () => app.init());
