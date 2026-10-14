// Carrossel de dias da programacao
// A rolagem e nativa (toque, trackpad e scroll-snap no CSS); este modulo so
// controla as setas, o esmaecimento das bordas, a acessibilidade das abas
// e centraliza o dia escolhido. A troca de conteudo fica em gsap-animations.js.
window.WorktechApp = window.WorktechApp || {};

window.WorktechApp.DayCarousel = {
  // Distancia minima (px) para considerar que ainda ha conteudo para o lado
  EDGE_TOLERANCE: 4,

  init: function () {
    var root = document.querySelector("[data-day-carousel]");
    if (!root) return;

    this.root = root;
    this.track = root.querySelector(".day-carousel__track");
    this.prev = root.querySelector(".day-carousel__nav--prev");
    this.next = root.querySelector(".day-carousel__nav--next");
    this.tabs = Array.prototype.slice.call(
      this.track.querySelectorAll("[role='tab']")
    );

    this.bindEvents();
    this.syncSelection(this.track.querySelector(".active") || this.tabs[0], false);
    this.updateNav();
  },

  bindEvents: function () {
    var self = this;
    var ticking = false;

    [this.prev, this.next].forEach(function (button) {
      button.addEventListener("click", function () {
        var dir = Number(button.getAttribute("data-dir"));
        self.track.scrollBy({ left: dir * self.track.clientWidth * 0.8 });
      });
    });

    // Atualiza setas/bordas no maximo uma vez por frame durante a rolagem
    this.track.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          self.updateNav();
          ticking = false;
        });
      },
      { passive: true }
    );

    if ("ResizeObserver" in window) {
      new ResizeObserver(function () {
        self.updateNav();
      }).observe(this.track);
    } else {
      window.addEventListener("resize", function () {
        self.updateNav();
      });
    }

    this.track.addEventListener("click", function (e) {
      var tab = e.target.closest("[role='tab']");
      if (tab) self.syncSelection(tab, true);
    });

    // Navegacao por teclado no padrao WAI-ARIA de abas
    this.track.addEventListener("keydown", function (e) {
      var current = self.tabs.indexOf(document.activeElement);
      if (current === -1) return;

      var target = null;
      if (e.key === "ArrowRight") target = self.tabs[(current + 1) % self.tabs.length];
      else if (e.key === "ArrowLeft")
        target = self.tabs[(current - 1 + self.tabs.length) % self.tabs.length];
      else if (e.key === "Home") target = self.tabs[0];
      else if (e.key === "End") target = self.tabs[self.tabs.length - 1];
      if (!target) return;

      e.preventDefault();
      target.focus();
      target.click();
    });
  },

  // Marca a aba escolhida para leitores de tela e a traz para o centro
  syncSelection: function (selected, center) {
    if (!selected) return;

    this.tabs.forEach(function (tab) {
      var isSelected = tab === selected;
      tab.setAttribute("aria-selected", String(isSelected));
      tab.setAttribute("tabindex", isSelected ? "0" : "-1");
    });

    if (center) {
      var left =
        selected.offsetLeft - (this.track.clientWidth - selected.offsetWidth) / 2;
      this.track.scrollTo({ left: Math.max(0, left) });
    }
  },

  updateNav: function () {
    var track = this.track;
    var tolerance = this.EDGE_TOLERANCE;
    var overflows = track.scrollWidth > track.clientWidth + 1;
    var canPrev = overflows && track.scrollLeft > tolerance;
    var canNext =
      overflows &&
      track.scrollLeft + track.clientWidth < track.scrollWidth - tolerance;

    this.root.classList.toggle("is-static", !overflows);
    this.root.classList.toggle("can-prev", canPrev);
    this.root.classList.toggle("can-next", canNext);
    this.prev.disabled = !canPrev;
    this.next.disabled = !canNext;
  },
};
