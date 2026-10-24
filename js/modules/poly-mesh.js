// Malha poligonal
// As montanhas de triangulos (Programacao e Inscricoes) e a faixa do rodape sao
// uma malha de triangulos ligados, como um modelo 3D em wireframe: arestas
// finas, vertices em ponto e algumas faces preenchidas, com pulsos de luz
// correndo pelas arestas. Cada <canvas data-mesh> diz de que borda a malha
// nasce ("right", "left" ou "bottom"); ela se revela a partir dessa borda
// quando chega na tela.
window.WorktechApp = window.WorktechApp || {};

window.WorktechApp.PolyMesh = {
  FRAME_TIME: 1 / 30,
  ENTRANCE: 1.6, // segundos para a malha se revelar a partir da borda
  PULSE_SPEED: 3.2, // arestas por segundo

  // Ajustes por formato: espaco entre vertices, parte das faces preenchidas,
  // quantos pulsos correm ao mesmo tempo
  SHAPES: {
    right: { spacing: 26, faces: 0.3, pulses: 4 },
    left: { spacing: 26, faces: 0.3, pulses: 4 },
    bottom: { spacing: 30, faces: 0.4, pulses: 2 },
  },

  init: function () {
    var self = this;
    this.reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.meshes = Array.prototype.map.call(document.querySelectorAll("canvas[data-mesh]"), (canvas) =>
      this.create(canvas)
    );
    if (!this.meshes.length) return;

    this.readColors();

    // Tema claro/escuro troca a classe do body
    new MutationObserver(function () {
      self.readColors();
      self.meshes.forEach((mesh) => self.draw(mesh));
    }).observe(document.body, { attributes: true, attributeFilter: ["class"] });

    var find = (target) => this.meshes.filter((mesh) => mesh.canvas === target)[0];

    if ("ResizeObserver" in window) {
      var resize = new ResizeObserver(function (entries) {
        entries.forEach(function (entry) {
          var mesh = find(entry.target);
          self.layout(mesh);
          self.draw(mesh);
        });
      });
      this.meshes.forEach((mesh) => resize.observe(mesh.canvas));
    }

    // A malha so comeca a se revelar quando chega na tela
    if ("IntersectionObserver" in window) {
      var watch = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            var mesh = find(entry.target);
            mesh.visible = entry.isIntersecting;
            if (entry.isIntersecting) mesh.started = true;
          });
        },
        { threshold: 0.15 }
      );
      this.meshes.forEach((mesh) => watch.observe(mesh.canvas));
    } else {
      this.meshes.forEach((mesh) => (mesh.visible = mesh.started = true));
    }

    if (this.reduceMotion) {
      this.meshes.forEach((mesh) => {
        mesh.entrance = 1;
        self.draw(mesh);
      });
      return;
    }

    var last = performance.now();
    var pending = 0;
    var loop = function (now) {
      pending += Math.min(0.1, (now - last) / 1000);
      last = now;
      if (pending >= self.FRAME_TIME) {
        self.meshes.forEach(function (mesh) {
          if (!mesh.visible || !mesh.started) return;
          mesh.time += pending;
          mesh.entrance = Math.min(1, mesh.entrance + pending / self.ENTRANCE);
          self.step(mesh, pending);
          self.draw(mesh);
        });
        pending = 0;
      }
      window.requestAnimationFrame(loop);
    };
    window.requestAnimationFrame(loop);
  },

  create: function (canvas) {
    var mesh = {
      canvas: canvas,
      ctx: canvas.getContext("2d"),
      side: canvas.getAttribute("data-mesh"),
      visible: false,
      started: false,
      time: 0,
      entrance: 0,
      pulses: [],
    };
    mesh.shape = this.SHAPES[mesh.side] || this.SHAPES.right;
    this.layout(mesh);
    return mesh;
  },

  // Cores do tema: degrade do verde escuro (--tri-dark) ao menta (--tri-light)
  // e o verde de destaque (--accent) para os pulsos
  readColors: function () {
    var styles = getComputedStyle(document.body);
    var rgb = function (name, fallback) {
      var match = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(styles.getPropertyValue(name).trim());
      return match ? [1, 2, 3].map((i) => parseInt(match[i], 16)) : fallback;
    };
    this.dark = rgb("--tri-dark", [1, 61, 25]);
    this.light = rgb("--tri-light", [175, 254, 210]);
    this.accent = rgb("--accent", [6, 251, 126]).join(", ");
  },

  color: function (depth, alpha) {
    var dark = this.dark;
    var light = this.light;
    var mix = (i) => Math.round(dark[i] + (light[i] - dark[i]) * depth);
    return "rgba(" + mix(0) + ", " + mix(1) + ", " + mix(2) + ", " + alpha + ")";
  },

  // Numero fixo entre 0 e 1 para cada posicao da grade
  hash: function (a, b) {
    return Math.abs(Math.sin(a * 127.1 + b * 311.7) * 43758.5453) % 1;
  },

  // Silhueta: quanto a malha avanca a partir da borda em cada ponto
  reach: function (mesh, x, y) {
    var w = mesh.width;
    var h = mesh.height;
    if (mesh.side === "bottom") {
      return h * (0.45 + 0.14 * Math.sin(x * 0.0045 + 1.3) + 0.08 * Math.sin(x * 0.017));
    }
    var base = Math.pow(Math.sin((y / h) * Math.PI), 0.8) * w * 0.88;
    return Math.max(0, base + Math.sin(y * 0.05) * 10 + Math.sin(y * 0.013 + 1) * 18);
  },

  inside: function (mesh, x, y) {
    if (mesh.side === "bottom") return y > mesh.height - this.reach(mesh, x, y);
    if (mesh.side === "left") return x < this.reach(mesh, x, y);
    return x > mesh.width - this.reach(mesh, x, y);
  },

  // Distancia (0 a 1) da borda de onde a malha nasce, usada na entrada
  fromEdge: function (mesh, x, y) {
    if (mesh.side === "bottom") return (mesh.height - y) / mesh.height;
    if (mesh.side === "left") return x / mesh.width;
    return (mesh.width - x) / mesh.width;
  },

  // Monta a grade triangular dentro da silhueta: vertices, arestas e faces
  layout: function (mesh) {
    var dpr = Math.min(1.5, window.devicePixelRatio || 1);
    var w = mesh.canvas.clientWidth;
    var h = mesh.canvas.clientHeight;
    if (!w || !h) return;

    mesh.width = w;
    mesh.height = h;
    mesh.canvas.width = Math.round(w * dpr);
    mesh.canvas.height = Math.round(h * dpr);
    mesh.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var spacing = mesh.shape.spacing;
    var rowHeight = spacing * 0.866;
    var seed = mesh.side.length * 17;
    var byKey = {};
    var points = [];

    for (var r = -1; r * rowHeight < h + rowHeight; r++) {
      for (var q = -1; q * spacing < w + spacing; q++) {
        var x = q * spacing + (r % 2 ? spacing / 2 : 0) + (this.hash(q + seed, r) - 0.5) * spacing * 0.35;
        var y = r * rowHeight + (this.hash(r, q + seed) - 0.5) * spacing * 0.35;
        if (!this.inside(mesh, x, y)) continue;

        var point = {
          q: q,
          r: r,
          x: x,
          y: y,
          phase: this.hash(q * 3, r * 7) * 6.28,
          depth: (mesh.side === "bottom" ? 1 - y / h : y / h) * 0.6,
          edge: this.fromEdge(mesh, x, y),
          neighbors: [],
        };
        byKey[q + "," + r] = point;
        points.push(point);
      }
    }

    var edges = [];
    var faces = [];
    points.forEach((point) => {
      var odd = point.r % 2 ? 1 : 0;
      var right = byKey[point.q + 1 + "," + point.r];
      var down = byKey[point.q + odd + "," + (point.r + 1)];
      var downLeft = byKey[point.q + odd - 1 + "," + (point.r + 1)];

      [right, down, downLeft].forEach(function (other) {
        if (!other) return;
        edges.push([point, other]);
        point.neighbors.push(other);
        other.neighbors.push(point);
      });

      if (right && down && this.hash(point.q, point.r * 2 + seed) < mesh.shape.faces) {
        faces.push({ points: [point, right, down], alpha: 0.12 + this.hash(point.r, point.q) * 0.22 });
      }
    });

    mesh.points = points;
    mesh.edges = edges;
    mesh.faces = faces;
    mesh.pulses = [];
  },

  // Pulsos de luz andando de vertice em vertice
  step: function (mesh, dt) {
    if (mesh.entrance < 1 || !mesh.points.length) return;

    while (mesh.pulses.length < mesh.shape.pulses) {
      var start = mesh.points[Math.floor(Math.random() * mesh.points.length)];
      mesh.pulses.push({ from: start, to: null, progress: 1, hops: 6 + Math.floor(Math.random() * 6) });
    }

    mesh.pulses = mesh.pulses.filter((pulse) => {
      if (pulse.progress >= 1) {
        if (pulse.to) pulse.from = pulse.to;
        var options = pulse.from.neighbors;
        if (!options.length || pulse.hops-- <= 0) return false;
        pulse.to = options[Math.floor(Math.random() * options.length)];
        pulse.progress = 0;
      }
      pulse.progress += dt * this.PULSE_SPEED;
      return true;
    });
  },

  draw: function (mesh) {
    var ctx = mesh.ctx;
    if (!mesh.width) return;
    ctx.clearRect(0, 0, mesh.width, mesh.height);
    if (!mesh.entrance) return;

    var time = mesh.time;
    var still = this.reduceMotion;
    var entrance = mesh.entrance;
    var smooth = (v) => {
      v = Math.min(1, Math.max(0, v));
      return v * v * (3 - 2 * v);
    };

    // Posicao do quadro (vertices "respiram" de leve) e quanto ja apareceu
    mesh.points.forEach((point) => {
      point.px = still ? point.x : point.x + Math.sin(time * 0.8 + point.phase) * 1.5;
      point.py = still ? point.y : point.y + Math.cos(time * 0.7 + point.phase) * 1.5;
      point.shown = smooth(entrance * 1.6 - point.edge);
    });

    mesh.faces.forEach((face) => {
      var a = face.points[0];
      var b = face.points[1];
      var c = face.points[2];
      var shown = Math.min(a.shown, b.shown, c.shown);
      if (!shown) return;
      ctx.fillStyle = this.color(a.depth, face.alpha * shown);
      ctx.beginPath();
      ctx.moveTo(a.px, a.py);
      ctx.lineTo(b.px, b.py);
      ctx.lineTo(c.px, c.py);
      ctx.closePath();
      ctx.fill();
    });

    // Arestas agrupadas por tom, para desenhar poucos caminhos por quadro
    var groups = {};
    mesh.edges.forEach(function (edge) {
      var a = edge[0];
      var b = edge[1];
      var shown = Math.min(a.shown, b.shown);
      if (!shown) return;
      var key = Math.round(a.depth * 10) + "|" + Math.round(shown * 5);
      (groups[key] = groups[key] || []).push(edge);
    });
    ctx.lineWidth = 1;
    Object.keys(groups).forEach((key) => {
      var parts = key.split("|");
      ctx.strokeStyle = this.color(parts[0] / 10, 0.38 * (parts[1] / 5));
      ctx.beginPath();
      groups[key].forEach(function (edge) {
        ctx.moveTo(edge[0].px, edge[0].py);
        ctx.lineTo(edge[1].px, edge[1].py);
      });
      ctx.stroke();
    });

    mesh.points.forEach((point) => {
      if (!point.shown) return;
      ctx.fillStyle = this.color(point.depth + 0.2, 0.7 * point.shown);
      ctx.fillRect(point.px - 1.2, point.py - 1.2, 2.4, 2.4);
    });

    // Pulsos: um brilho largo e fraco com um ponto forte no centro
    var accent = this.accent;
    mesh.pulses.forEach(function (pulse) {
      if (!pulse.to) return;
      var x = pulse.from.px + (pulse.to.px - pulse.from.px) * pulse.progress;
      var y = pulse.from.py + (pulse.to.py - pulse.from.py) * pulse.progress;
      ctx.fillStyle = "rgba(" + accent + ", 0.25)";
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(" + accent + ", 0.95)";
      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    });
  },
};
