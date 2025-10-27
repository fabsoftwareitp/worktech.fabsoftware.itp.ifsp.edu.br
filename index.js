document.addEventListener("DOMContentLoaded", () => {
  // Register GSAP plugins
  if (window.gsap) {
    const { gsap } = window;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
    if (window.ScrollToPlugin) gsap.registerPlugin(window.ScrollToPlugin);
    if (window.SplitText) gsap.registerPlugin(window.SplitText);

    // Imagem da seção de inscrições
const inscricoesImg = document.getElementById("inscricoesImg");
if (inscricoesImg && window.gsap) {
  inscricoesImg.style.maxWidth = "400px"; 
  inscricoesImg.style.transition = "transform 0.3s ease";

  gsap.to(inscricoesImg, {
    y: 15,
    duration: 3,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  });

  gsap.to(inscricoesImg, {
    rotation: 2,
    duration: 4,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  });
}

  }

  const brandLogo = document.getElementById("brandLogo");
  const footerLogo = document.getElementById("footerLogo");
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const scrollTopBtn = document.getElementById("scrollTop");

  // Theme handling
  const THEMES = { DARK: "dark", LIGHT: "light" };
  function setTheme(theme) {
    const root = document.documentElement;
    const isDark = theme === THEMES.DARK;
    root.classList.toggle("dark", isDark);
    document.body.classList.toggle("bg-black", isDark);
    document.body.classList.toggle("bg-white", !isDark);
    document.body.classList.toggle("text-gray-900", !isDark);

     if (brandLogo) {
       brandLogo.src = "img/bg-start.png"; // <-- coloque a extensão correta
    }

   
    if (footerLogo) {
      footerLogo.src = isDark ? "img/LogoIF.png" : "img/LogoIF.png"; // mesmo logo no footer
    }

    if (themeIcon) {
      themeIcon.innerHTML = isDark
        ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21.752 15.002A9 9 0 1 1 12.998 2.248 7 7 0 0 0 21.752 15Z"/>'
        : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364-.707-.707M6.343 6.343l-.707-.707m12.728 0-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/>';
    }
    localStorage.setItem("worktech-theme", theme);
  }

  const preferred = localStorage.getItem("worktech-theme") || THEMES.DARK;
  setTheme(preferred);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = document.documentElement.classList.contains("dark")
        ? THEMES.LIGHT
        : THEMES.DARK;
      setTheme(nextTheme);
    });
  }

  // Smooth scroll for internal anchors
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (
      target.tagName === "A" &&
      target.getAttribute("href")?.startsWith("#")
    ) {
      const id = target.getAttribute("href");
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        if (window.gsap && window.ScrollToPlugin) {
          window.gsap.to(window, {
            duration: 0.7,
            scrollTo: el,
            ease: "power2",
          });
        } else {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  });

  // Smooth wheel scroll with slight inertia
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (window.gsap && window.ScrollToPlugin && !prefersReduced) {
    let target = window.scrollY;
    const onWheel = (e) => {
      if (e.defaultPrevented) return;
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      const tn = (e.target && e.target.tagName) || "";
      if (
        ["INPUT", "TEXTAREA", "SELECT", "IFRAME", "VIDEO", "AUDIO"].includes(tn)
      )
        return;
      e.preventDefault();
      target += e.deltaY * 0.9;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (target < 0) target = 0;
      if (target > max) target = max;
      window.gsap.to(window, {
        scrollTo: target,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });
    };
    window.addEventListener("wheel", onWheel, { passive: false });
  }

  // Scroll top button
  function updateScrollButton() {
    if (!scrollTopBtn) return;
    const show = window.scrollY > window.innerHeight * 0.5;
    scrollTopBtn.classList.toggle("hidden", !show);
  }
  window.addEventListener("scroll", updateScrollButton, { passive: true });
  updateScrollButton();
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      if (window.gsap && window.ScrollToPlugin) {
        window.gsap.to(window, { duration: 0.7, scrollTo: 0, ease: "power2" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  // GSAP Animations
  if (window.gsap) {
    const { gsap } = window;

    // Hero entrance
    gsap.from("#heroTitle", {
      y: 30,
      autoAlpha: 0,
      duration: 0.8,
      ease: "power2.out",
    });
    gsap.from("#heroSubtitle", {
      y: 30,
      autoAlpha: 0,
      duration: 0.8,
      ease: "power2.out",
      delay: 0.1,
    });
    gsap.from("#hero a", {
      y: 20,
      autoAlpha: 0,
      duration: 0.6,
      ease: "power2.out",
      delay: 0.2,
      stagger: 0.08,
    });

    // Parallax hero
    if (window.ScrollTrigger) {
      gsap.to("#heroMedia", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to("#heroBgGlow", {
        yPercent: -12,
        opacity: 0.9,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    // Subtitle SplitText
    const subtitle = document.getElementById("heroSubtitle");
    if (subtitle && window.SplitText) {
      const split = new window.SplitText(subtitle, { type: "words,chars" });
      gsap.set(subtitle, { perspective: 400 });
      gsap.from(split.chars, {
        duration: 0.7,
        y: 20,
        rotationX: -15,
        autoAlpha: 0,
        ease: "power2.out",
        stagger: 0.015,
        delay: 0.15,
      });
    }

    // Underline draw
    const underline = document.getElementById("underlinePath");
    if (underline) {
      const length = underline.getTotalLength();
      underline.style.strokeDasharray = `${length}`;
      underline.style.strokeDashoffset = `${length}`;
      gsap.to(underline, {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: "power2.out",
        delay: 0.2,
      });
    }

    // Orbs float and subtle parallax
    const orbs = ["#orb1", "#orb2", "#orb3"];
    orbs.forEach((sel, idx) => {
      const amp = 6 + idx * 2;
      gsap.to(sel, {
        y: `+=${amp}`,
        duration: 3 + idx,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
      if (window.ScrollTrigger) {
        gsap.to(sel, {
          yPercent: -5 - idx * 2,
          ease: "none",
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    });

    // Reveal items on scroll
    const revealItems = document.querySelectorAll("[data-reveal]");
    revealItems.forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 85%" },
        y: 24,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    });

    // Title reveals
    const titleItems = document.querySelectorAll("[data-reveal-title]");
    titleItems.forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 85%" },
        y: 40,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
      });
    });
  }

  // Render timeline from old JSON
  async function renderTimeline() {
    const container = document.getElementById("timelineItems");
    if (!container) return;
    try {
      const response = await fetch(
        "old/worktech.fabsoftware.itp.ifsp.edu.br/jsons/workshops.json",
        { cache: "no-store" }
      );
      const data = await response.json();

      const dayKey = Object.keys(data)[0];
      const blocks = data[dayKey][0];

      const fragment = document.createDocumentFragment();
      Object.keys(blocks).forEach((time) => {
        const entries = blocks[time];

        const item = document.createElement("div");
        item.className =
          "group relative rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition transform-gpu transition-transform duration-300 hover:-translate-y-0.5";
        item.setAttribute("data-reveal", "");

        const marker = document.createElement("div");
        marker.className =
          "absolute left-3 top-5 h-2 w-2 -translate-x-1/2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20";
        item.appendChild(marker);

        const timeEl = document.createElement("div");
        timeEl.className = "pl-1 text-sm font-medium text-emerald-400";
        timeEl.textContent = time;
        item.appendChild(timeEl);

        entries.forEach((entry) => {
          const title = document.createElement("h3");
          title.className = "mt-1 text-lg font-semibold text-white";
          title.textContent = entry.titulo;
          item.appendChild(title);

          if (entry.palestrante) {
            const speaker = document.createElement("p");
            speaker.className = "mt-0.5 text-sm text-white/70";
            speaker.textContent = entry.palestrante;
            item.appendChild(speaker);
          }

          if (entry.descricao) {
            const desc = document.createElement("p");
            desc.className = "mt-2 text-sm text-white/60";
            desc.textContent = entry.descricao;
            item.appendChild(desc);
          }

          if (entry.Curriculo) {
            const link = document.createElement("a");
            link.href = entry.Curriculo;
            link.target = "_blank";
            link.rel = "noopener";
            link.className =
              "mt-3 inline-flex text-xs font-medium text-emerald-400 underline decoration-dotted hover:text-emerald-300";
            link.textContent = "Currículo";
            item.appendChild(link);
          }
        });

        fragment.appendChild(item);
      });

      container.appendChild(fragment);

      if (window.gsap) {
        const { gsap } = window;
        gsap.utils.toArray("#timelineItems > div").forEach((el) => {
          gsap.from(el, {
            scrollTrigger: { trigger: el, start: "top 85%" },
            y: 24,
            autoAlpha: 0,
            duration: 0.6,
            ease: "power2.out",
          });
        });
      }
    } catch (err) {
      // Silently fail in production UI
    }
  }

  renderTimeline();
});
