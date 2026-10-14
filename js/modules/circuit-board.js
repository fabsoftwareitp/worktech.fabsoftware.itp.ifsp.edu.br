// Circuit Board Module
// Desenha trilhas de circuito no estilo da logo (retas com dobras de 45° e
// terminais em bolinha ou quadradinho) no fundo do header, com pulsos de luz
// correndo por elas. As cores e animacoes ficam no CSS (.header-circuits).
window.WorktechApp = window.WorktechApp || {};

window.WorktechApp.CircuitBoard = {
  SVG_NS: "http://www.w3.org/2000/svg",
  // Mesmo tamanho do viewBox definido no index.html
  WIDTH: 1440,
  HEIGHT: 900,
  // Espaco entre trilhas vizinhas; cada dobra desloca menos que isso, entao
  // trilhas paralelas nunca se cruzam
  LANE: 60,
  BEND: 26,
  // Parte das trilhas que recebe um pulso de luz
  PULSE_CHANCE: 0.5,

  init: function () {
    var svg = document.querySelector(".header-circuits");
    if (!svg) return;

    // Semente fixa: o desenho e sempre o mesmo a cada visita
    this.random = this.createRandom(2026);

    var traces = [];
    traces = traces.concat(this.buildSideZone(false)); // esquerda
    traces = traces.concat(this.buildSideZone(true)); // direita
    traces = traces.concat(this.buildEdgeZone(false)); // topo
    traces = traces.concat(this.buildEdgeZone(true)); // base

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

  // Trilhas que saem da borda esquerda (ou direita, espelhado) em direcao ao
  // centro e param antes da area da logo. As trilhas mais afastadas do centro
  // dobram primeiro e todas dobram para longe do centro, como na logo.
  buildSideZone: function (mirror) {
    var traces = [];
    var centerY = this.HEIGHT / 2;
    var maxReach = 360; // limite horizontal: a logo comeca depois disso

    for (var y = 70; y <= this.HEIGHT - 70; y += this.LANE) {
      if (this.random() < 0.25) continue; // falhas deixam o desenho organico

      var away = y < centerY ? -1 : 1;
      var closeness = 1 - Math.abs(y - centerY) / centerY;
      var first = 30 + closeness * 140 + this.between(0, 14);
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

      traces.push(mirror ? this.mirrorX(points) : points);
    }
    return traces;
  },

  // Trilhas que descem do topo (ou sobem da base) na faixa central; sao as
  // que aparecem no celular, onde as laterais ficam cortadas
  buildEdgeZone: function (fromBottom) {
    var traces = [];
    var centerX = this.WIDTH / 2;

    for (var x = 480; x <= 960; x += this.LANE) {
      if (this.random() < 0.3) continue;

      var away = x < centerX ? -1 : 1;
      var closeness = 1 - Math.abs(x - centerX) / 240;
      var first = 20 + closeness * 50 + this.between(0, 10);
      var last = this.between(15, 50);

      var points = [[x, -10]];
      points.push([x, first]);
      points.push([x + away * this.BEND, first + this.BEND]);
      points.push([x + away * this.BEND, first + this.BEND + last]);

      traces.push(fromBottom ? this.mirrorY(points) : points);
    }
    return traces;
  },

  mirrorX: function (points) {
    var width = this.WIDTH;
    return points.map(function (p) {
      return [width - p[0], p[1]];
    });
  },

  mirrorY: function (points) {
    var height = this.HEIGHT;
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
      tracksGroup.appendChild(self.createElement("path", { d: d, class: "circuit-track" }));

      // Pulso: um trecho curto de luz que percorre a trilha da borda ao terminal
      if (self.random() < self.PULSE_CHANCE) {
        var pulse = self.createElement("path", {
          d: d,
          class: "circuit-pulse",
          pathLength: "1000",
        });
        pulse.style.setProperty("--pulse-duration", self.between(3.5, 7).toFixed(2) + "s");
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
