// Fundo em ladrilho da Programacao
// O desenho tem altura fixa (proporcao do viewBox) e se repete para baixo, entao
// nada se move quando a secao muda de altura na troca de dias. O primeiro
// ladrilho tem o desenho de verdade, animado pelo GSAP; as copias usam <use>,
// que espelha o original ao vivo, e se animam junto sem duplicar animacoes.
window.WorktechApp = window.WorktechApp || {};

window.WorktechApp.TiledBackground = {
  // Grupos do primeiro ladrilho que cada copia repete, com as classes que
  // dao cor (currentColor) e opacidade no celular
  ARTS: [
    { href: "#prog-floating-art", className: "svg-floating-triangles svg-theme-adaptive" },
    { href: "#prog-decoration-art", className: "svg-decoration-programacao svg-theme-adaptive" },
  ],

  init: function () {
    var root = document.querySelector(".prog-bg");
    if (!root) return;

    var self = this;
    this.root = root;
    this.tile = root.querySelector(".prog-bg__tile");

    var fill = function () {
      self.fill();
    };
    if ("ResizeObserver" in window) new ResizeObserver(fill).observe(root);
    else window.addEventListener("resize", fill);
    fill();
  },

  // Garante ladrilhos suficientes para cobrir a altura atual da secao; os que
  // sobram quando ela encolhe ficam escondidos pelo overflow
  fill: function () {
    var tileHeight = this.tile.offsetHeight;
    if (!tileHeight) return;

    var needed = Math.ceil(this.root.offsetHeight / tileHeight);
    for (var count = this.root.children.length; count < needed; count++) {
      this.root.appendChild(this.createCopy(count));
    }
  },

  // Ladrilhos alternados sao espelhados para disfarcar a repeticao
  createCopy: function (index) {
    var NS = "http://www.w3.org/2000/svg";
    var copy = document.createElement("div");
    copy.className = "prog-bg__tile" + (index % 2 ? " is-mirrored" : "");

    this.ARTS.forEach(function (art) {
      var svg = document.createElementNS(NS, "svg");
      var use = document.createElementNS(NS, "use");
      svg.setAttribute("viewBox", "0 0 1200 800");
      svg.setAttribute("class", art.className);
      use.setAttribute("href", art.href);
      svg.appendChild(use);
      copy.appendChild(svg);
    });

    return copy;
  },
};
