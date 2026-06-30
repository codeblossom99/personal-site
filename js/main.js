/* ===================================================================
   Theme + language switching + 左側時間碼軌的即時跳動。
   Vanilla JS,沒有框架。localStorage 只存「使用者偏好」這種非敏感小東西,
   是真實靜態網站,不是 claude.ai 的 artifact,所以可以放心用。
   =================================================================== */

(function () {
  "use strict";

  const translations = {
    "zh-Hant": {
      "nav.lang": "EN",
      "nav.theme": "LIGHT",
      "hero.eyebrow": "SEI · 00:00:00:00 — FULL STACK / VIDEO ENGINEER",
      "hero.title1": "Hello",
      "hero.sub": "我專注於串流播放器、即時通訊協定與系統可觀測性。目前在 IKG Studio 打造 CrystalPlayer，一款基於 libmedia 的網頁直播播放器。",
      "hero.cta1": "查看作品",
      "hero.cta2": "聯絡",
      "hero.cta3": "Resume",
      "focus.label": "PIPELINE — 一幀畫面背後的三層工作",
      "focus.card1.title": "串流協定",
      "focus.card1.body": "RTMP、HTTP-FLV、WHEP / WebRTC，從低延遲播放路徑到多 CDN 自動切換。",
      "focus.card1.tag": "INGEST",
      "focus.card2.title": "解碼管線",
      "focus.card2.body": "WebCodecs 硬體解碼與 WASM 軟體解碼雙路徑，涵蓋 SEI 時間碼解析與自適應位元率切換。",
      "focus.card2.tag": "DECODE",
      "focus.card3.title": "可觀測性",
      "focus.card3.body": "Prometheus / Grafana 監控堆疊，透過 EventBus 讓播放器行為與指標回報解耦。",
      "focus.card3.tag": "OBSERVE",
      "work.label": "REEL — 作品與專案",
      "work.p1.tag": "IKG STUDIO",
      "work.p1.title": "CrystalPlayer",
      "work.p1.body": "基於開源 libmedia 的網頁直播播放器。我負責串流協定支援、WebCodecs / WASM 解碼路徑、SEI 時間碼解析、自適應位元率切換與觀測堆疊。",
      "work.p2.tag": "SIDE PROJECT",
      "work.p2.title": "Limit Order Book Visualizer",
      "work.p2.body": "市場結構方向的 side project，即時呈現限價委託簿動態，長期目標是加入以 C++ 撰寫並編譯成 WASM 的撮合引擎。",
      "work.p3.tag": "INTEL",
      "work.p3.title": "AIMT — 內部驗證工具",
      "work.p3.body": "擔任 Network Validation Engineer 期間，以 React、Express.js 與 PostgreSQL 打造內部工具，讓驗證流程更容易追蹤與重複執行。",
      "about.label": "ABOUT",
      "about.body": "我在台灣工作，主要做串流媒體、瀏覽器影音與系統工程。也長期關注 GPU / ML systems、電子 maker 專案，以及那些能把模糊想法變成可運作成果的小工具。",
      "footer.text": "© 2026 HERA — END OF REEL"
    },
    "en": {
      "nav.lang": "中",
      "nav.theme": "LIGHT",
      "hero.eyebrow": "SEI · 00:00:00:00 — FULL STACK / VIDEO ENGINEER",
      "hero.title1": "Hello",
      "hero.sub": "Full-stack engineer working on streaming players, real-time protocols, and observability. Currently building CrystalPlayer at IKG Studio, a web live player based on libmedia.",
      "hero.cta1": "View work",
      "hero.cta2": "Contact",
      "hero.cta3": "Resume",
      "focus.label": "PIPELINE — three practical layers behind a frame",
      "focus.card1.title": "Streaming protocols",
      "focus.card1.body": "RTMP, HTTP-FLV, WHEP / WebRTC, from low-latency playback paths to multi-CDN failover.",
      "focus.card1.tag": "INGEST",
      "focus.card2.title": "Decode pipelines",
      "focus.card2.body": "WebCodecs hardware decode and WASM software decode paths, with SEI timecode parsing and adaptive bitrate switching.",
      "focus.card2.tag": "DECODE",
      "focus.card3.title": "Observability",
      "focus.card3.body": "Prometheus / Grafana monitoring, plus an EventBus boundary between player behavior and metrics reporting.",
      "focus.card3.tag": "OBSERVE",
      "work.label": "REEL — work & projects",
      "work.p1.tag": "IKG STUDIO",
      "work.p1.title": "CrystalPlayer",
      "work.p1.body": "A web-based live streaming player built on the open-source libmedia project. I work on protocol support, WebCodecs / WASM decode paths, SEI timecode parsing, adaptive bitrate switching, and observability.",
      "work.p2.tag": "SIDE PROJECT",
      "work.p2.title": "Limit Order Book Visualizer",
      "work.p2.body": "A market-structure side project that visualizes limit order book dynamics in real time, with a longer-term path toward a C++ matching engine compiled to WASM.",
      "work.p3.tag": "INTEL",
      "work.p3.title": "AIMT — internal validation tool",
      "work.p3.body": "As a Network Validation Engineer, I built an internal React, Express.js, and PostgreSQL tool to make validation work easier to trace and repeat.",
      "about.label": "ABOUT",
      "about.body": "I am based in Taiwan and work around streaming media, browser video, and systems engineering. I also keep a long-running interest in GPU / ML systems, electronics projects, and small tools that turn fuzzy ideas into working things.",
      "footer.text": "© 2026 HERA — END OF REEL"
    }
  };

  const STORAGE_THEME = "site-theme";
  const STORAGE_LANG = "site-lang-v2";

  /* ---------------- Theme ---------------- */
  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_THEME);
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_THEME, theme);
    const btn = document.querySelector('#theme-toggle span');
    if (btn) btn.textContent = theme === "dark" ? "LIGHT" : "DARK";
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  }

  /* ---------------- Language ---------------- */
  function getPreferredLang() {
    return localStorage.getItem(STORAGE_LANG) || "en";
  }

  function applyLang(lang) {
    const dict = translations[lang] || translations.en;
    document.documentElement.setAttribute("lang", lang === "en" ? "en" : "zh-Hant");
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });
    // theme button label is managed separately by applyTheme, keep it in sync
    const themeBtn = document.querySelector('#theme-toggle span');
    if (themeBtn) {
      const theme = document.documentElement.getAttribute("data-theme");
      themeBtn.textContent = theme === "dark" ? "LIGHT" : "DARK";
    }
    localStorage.setItem(STORAGE_LANG, lang);
  }

  function toggleLang() {
    const current = document.documentElement.getAttribute("lang") === "en" ? "en" : "zh-Hant";
    applyLang(current === "en" ? "zh-Hant" : "en");
  }

  /* ---------------- Copy email ---------------- */
  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  function setupCopyEmail() {
    const button = document.querySelector(".copy-email");
    if (!button) return;

    const defaultLabel = button.textContent;
    button.addEventListener("click", async () => {
      const email = button.getAttribute("data-copy");
      if (!email) return;

      try {
        await copyText(email);
        button.textContent = "COPIED";
        button.classList.add("is-copied");
        window.setTimeout(() => {
          button.textContent = defaultLabel;
          button.classList.remove("is-copied");
        }, 1400);
      } catch (_) {
        button.textContent = "FAILED";
        window.setTimeout(() => {
          button.textContent = defaultLabel;
        }, 1400);
      }
    });
  }

  /* ---------------- Running timecode (簽名元素) ---------------- */
  function startClock() {
    const el = document.getElementById("tc-clock");
    if (!el) return;
    const start = performance.now();
    function tick() {
      const elapsed = performance.now() - start;
      const totalFrames = Math.floor(elapsed / (1000 / 30)); // 30fps
      const frames = totalFrames % 30;
      const totalSeconds = Math.floor(totalFrames / 30);
      const seconds = totalSeconds % 60;
      const totalMinutes = Math.floor(totalSeconds / 60);
      const minutes = totalMinutes % 60;
      const hours = Math.floor(totalMinutes / 60);
      const pad = (n) => String(n).padStart(2, "0");
      el.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------------- Init ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(getPreferredTheme());
    applyLang(getPreferredLang());
    setupCopyEmail();
    startClock();

    document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
    document.getElementById("lang-toggle").addEventListener("click", toggleLang);
  });
})();
