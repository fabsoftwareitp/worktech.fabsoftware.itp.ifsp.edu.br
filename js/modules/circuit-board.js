// Circuit Board Module
// Desenha trilhas de circuito no estilo da logo (retas com dobras de 45° e
// terminais em bolinha ou quadradinho), com pulsos de luz correndo por elas.
// Usado no header e no canto direito de Inscricoes. As cores e animacoes
// ficam no CSS (.circuit-*).
window.WorktechApp = window.WorktechApp || {};

window.WorktechApp.CircuitBoard = {
  SVG_NS: "http://www.w3.org/2000/svg",
  // Espaco entre trilhas vizinhas; cada dobra desloca menos que isso, entao
  // trilhas paralelas nunca se cruzam
  LANE: 60,
  BEND: 26,
  // Parte das trilhas que recebe um pulso de luz
  PULSE_CHANCE: 0.45,
  // Intensidade minima: algumas trilhas ficam bem esvaecidas, ao fundo
  MIN_OPACITY: 0.3,

  // Abaixo desta largura (px) o header usa o layout de celular
  MOBILE_BREAKPOINT: 768,

  init: function () {
    var self = this;
    this.drawHeader();
    this.drawInscricoes();

    // Ao girar o celular ou redimensionar a janela, redesenha so se o
    // layout do header mudar (desktop <-> celular)
    var resizeTimer = null;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        self.drawHeader();
      }, 200);
    });
  },

  // Header, nada no topo. Dois layouts:
  // - desktop (1440x900): trilhas nas laterais (a logo comeca depois de 360
  //   unidades de cada lado) e algumas subindo da base
  // - celular (400x860, tela em pe): a logo ocupa quase toda a largura, entao
  //   as trilhas ficam na metade de baixo, abaixo do texto, e na base
  drawHeader: function () {
    var svg = document.querySelector(".header-circuits");
    if (!svg) return;

    var layout = svg.clientWidth < this.MOBILE_BREAKPOINT ? "mobile" : "desktop";
    var band = layout === "mobile" ? this.bandBelowText(svg, 400, 860) : null;
    // So redesenha se o layout (ou a faixa livre no celular) mudou
    var key = layout + (band ? ":" + band.yStart : "");
    if (svg.getAttribute("data-layout-key") === key) return;

    // Semente fixa: o desenho e sempre o mesmo a cada visita
    this.random = this.createRandom(2026);
    var area, traces;

    if (layout === "mobile") {
      area = { width: 400, height: 860 };
      traces = []
        .concat(this.buildSideZone(area, Object.assign({ mirror: false, maxReach: 150, skip: 0.3 }, band)))
        .concat(this.buildSideZone(area, Object.assign({ mirror: true, maxReach: 150, skip: 0.3 }, band)))
        .concat(this.buildBottomZone(area, { from: 140, to: 260, skip: 0.4 }));
    } else {
      area = { width: 1440, height: 900 };
      traces = []
        .concat(this.buildSideZone(area, { mirror: false, maxReach: 360, skip: 0.5 }))
        .concat(this.buildSideZone(area, { mirror: true, maxReach: 360, skip: 0.5 }))
        .concat(this.buildBottomZone(area, { from: 480, to: 960, skip: 0.55 }));
    }

    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.setAttribute("viewBox", "0 0 " + area.width + " " + area.height);
    svg.setAttribute("data-layout", layout);
    svg.setAttribute("data-layout-key", key);
    this.render(svg, traces);
  },

  // Faixa vertical livre abaixo do texto do header ("De 26 a 30..."), em
  // unidades do viewBox. Mede a posicao real do texto, entao funciona em
  // qualquer altura de tela; o SVG usa "slice" (escala e centraliza).
  bandBelowText: function (svg, vbWidth, vbHeight) {
    var text = document.querySelector(".header h4");
    var box = svg.getBoundingClientRect();
    var scale = Math.max(box.width / vbWidth, box.height / vbHeight);
    var offsetY = (box.height - vbHeight * scale) / 2;
    var textBottom = text ? text.getBoundingClientRect().bottom - box.top : box.height * 0.65;

    var yStart = Math.round((textBottom - offsetY) / scale + 40);
    var yEnd = Math.round((box.height - offsetY) / scale - 40);
    return { yStart: yStart, yEnd: Math.max(yStart, yEnd) };
  },

  // Canto direito de Inscricoes (viewBox 320x760 em inscricoes.html):
  // trilhas saindo da borda direita, curtas para caber na faixa livre a
  // direita do texto (~220px no desktop)
  drawInscricoes: function () {
    var svg = document.querySelector(".inscricoes-circuits");
    if (!svg) return;

    this.random = this.createRandom(2027);
    var area = { width: 320, height: 760 };
    var traces = this.buildSideZone(area, { mirror: true, maxReach: 230, skip: 0.4 });

    this.render(svg, traces);
  },

  // Gerador pseudoaleatorio simples (mulberry32), reproduzivel pela semente
  createRandom: function (seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  },

  between: function (min, max) {
    return min + this.random() * (max - min);
  },

  // Trilhas que saem da borda esquerda (ou direita, com mirror) e param
  // antes de maxReach. As trilhas mais afastadas do centro da faixa dobram
  // primeiro e todas dobram para longe dele, como na logo.
  // skip: chance de pular uma faixa (quanto maior, menos trilhas)
  // yStart/yEnd: faixa vertical ocupada (padrao: altura toda)
  buildSideZone: function (area, options) {
    var traces = [];
    var yStart = options.yStart || 70;
    var yEnd = options.yEnd || area.height - 70;
    var centerY = (yStart + yEnd) / 2;
    // Sem faixa definida, usa metade da altura (mantem o desenho do desktop)
    var halfBand = options.yStart ? Math.max((yEnd - yStart) / 2, 1) : centerY;
    var maxReach = options.maxReach;

    for (var y = yStart; y <= yEnd; y += this.LANE) {
      if (this.random() < options.skip) continue; // falhas deixam o desenho organico

      var away = y < centerY ? -1 : 1;
      var closeness = 1 - Math.abs(y - centerY) / halfBand;
      var first = 30 + closeness * maxReach * 0.39 + this.between(0, 14);
      var middle = this.between(30, 70);
      var last = this.between(20, maxReach - first - middle - this.BEND * 2);

      var points = [[-10, y]];
      var x = first;
      points.push([x, y]);
      points.push([x + this.BEND, y + away * this.BEND]);
      x += this.BEND + middle;
      points.push([x, y + away * this.BEND]);

      if (last > 20) {
        points.push([x + this.BEND, y + away * this.BEND * 2]);
        x += this.BEND + last;
        points.push([x, y + away * this.BEND * 2]);
      }

      traces.push(options.mirror ? this.mirrorX(points, area.width) : points);
    }
    return traces;
  },

  // Trilhas que sobem da base entre "from" e "to"; no header sao as que
  // aparecem no celular, onde as laterais ficam cortadas
  buildBottomZone: function (area, options) {
    var traces = [];
    var centerX = (options.from + options.to) / 2;
    var halfSpan = (options.to - options.from) / 2;

    for (var x = options.from; x <= options.to; x += this.LANE) {
      if (this.random() < options.skip) continue;

      var away = x < centerX ? -1 : 1;
      var closeness = 1 - Math.abs(x - centerX) / halfSpan;
      var first = 20 + closeness * 50 + this.between(0, 10);
      var last = this.between(15, 50);

      var points = [[x, -10]];
      points.push([x, first]);
      points.push([x + away * this.BEND, first + this.BEND]);
      points.push([x + away * this.BEND, first + this.BEND + last]);

      traces.push(this.mirrorY(points, area.height));
    }
    return traces;
  },

  mirrorX: function (points, width) {
    return points.map(function (p) {
      return [width - p[0], p[1]];
    });
  },

  mirrorY: function (points, height) {
    return points.map(function (p) {
      return [p[0], height - p[1]];
    });
  },

  toPath: function (points) {
    return points
      .map(function (p, i) {
        return (i === 0 ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1);
      })
      .join(" ");
  },

  createElement: function (tag, attrs) {
    var el = document.createElementNS(this.SVG_NS, tag);
    Object.keys(attrs).forEach(function (key) {
      el.setAttribute(key, attrs[key]);
    });
    return el;
  },

  render: function (svg, traces) {
    var self = this;
    var tracksGroup = this.createElement("g", { class: "circuit-tracks" });
    var pulsesGroup = this.createElement("g", { class: "circuit-pulses" });
    var nodesGroup = this.createElement("g", { class: "circuit-nodes" });

    traces.forEach(function (points) {
      var d = self.toPath(points);
      // Mesma intensidade para trilha, pulso e terminal: cada circuito
      // parece estar numa profundidade diferente
      var opacity = self.between(self.MIN_OPACITY, 1).toFixed(2);
      tracksGroup.appendChild(
        self.createElement("path", { d: d, class: "circuit-track", opacity: opacity })
      );

      // Pulso: um trecho curto de luz que percorre a trilha da borda ao terminal
      if (self.random() < self.PULSE_CHANCE) {
        var pulse = self.createElement("path", {
          d: d,
          class: "circuit-pulse",
          pathLength: "1000",
          opacity: opacity,
        });
        pulse.style.setProperty("--pulse-duration", self.between(5, 10).toFixed(2) + "s");
        pulse.style.setProperty("--pulse-delay", self.between(0, 7).toFixed(2) + "s");
        pulsesGroup.appendChild(pulse);
      }

      // Terminal: bolinha vazada (como na logo) ou quadradinho cheio
      var end = points[points.length - 1];
      var node;
      if (self.random() < 0.75) {
        node = self.createElement("circle", {
          cx: end[0].toFixed(1),
          cy: end[1].toFixed(1),
          r: 5,
          class: "circuit-node",
        });
      } else {
        node = self.createElement("rect", {
          x: (end[0] - 4).toFixed(1),
          y: (end[1] - 4).toFixed(1),
          width: 8,
          height: 8,
          class: "circuit-pad",
        });
      }
      node.setAttribute("opacity", opacity);
      if (self.random() < 0.35) {
        node.classList.add("is-blinking");
        node.style.setProperty("--blink-delay", self.between(0, 5).toFixed(2) + "s");
      }
      nodesGroup.appendChild(node);
    });

    svg.appendChild(tracksGroup);
    svg.appendChild(pulsesGroup);
    svg.appendChild(nodesGroup);
  },
};
