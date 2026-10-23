// Fundo de dados da Programacao
// Duas camadas que conversam: colunas de bytes em hexadecimal subindo devagar
// nas laterais (fora da coluna dos cards) e uma rede esparsa de nos. De vez em
// quando um byte acende e sai como pacote: entra na rede pelo no mais proximo,
// salta de no em no e, ao terminar, volta para uma coluna e acende outro byte.
// Tudo e desenhado num canvas do tamanho da tela, que para fora da secao e fica
// parado para quem pede menos movimento.
window.WorktechApp = window.WorktechApp || {};

window.WorktechApp.DataBackground = {
  COL_WIDTH: 62, // largura de cada coluna de bytes
  ROW_HEIGHT: 18,
  CONTENT_GAP: 24, // folga entre os bytes e a coluna dos cards
  LINK_DISTANCE: 160, // nos mais proximos que isso ficam ligados
  NODE_AREA: 46000, // px² de tela por no: controla a densidade da rede
  MAX_PACKETS: 4,
  PACKET_SPEED: 150, // px/s
  FRAME_TIME: 1 / 30, // 30 quadros/s bastam para movimentos lentos

  init: function () {
    var canvas = document.querySelector(".data-bg__canvas");
    if (!canvas) return;

    var self = this;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.section = document.getElementById("programacao");
    this.content = document.querySelector("#programacao .schedule");
    this.mountain = document.getElementById("svg-programacao-triangles");
    this.reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.visible = true;
    this.time = 0;

    this.readColor();
    this.pin();
    this.layout();

    window.addEventListener("scroll", () => this.pin(), { passive: true });

    // Tema claro/escuro troca a classe do body
    new MutationObserver(function () {
      self.readColor();
      if (self.reduceMotion) self.draw();
    }).observe(document.body, { attributes: true, attributeFilter: ["class"] });

    var relayout = function () {
      self.pin();
      self.layout();
      if (self.reduceMotion) self.draw();
    };
    if ("ResizeObserver" in window) new ResizeObserver(relayout).observe(canvas);
    else window.addEventListener("resize", relayout);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        self.visible = entries[0].isIntersecting;
      }).observe(this.section);
    }

    if (this.reduceMotion) {
      this.time = 4;
      this.draw();
      return;
    }

    var last = performance.now();
    var pending = 0;
    var loop = function (now) {
      pending += Math.min(0.1, (now - last) / 1000);
      last = now;
      if (self.visible && pending >= self.FRAME_TIME) {
        // A secao muda de altura na troca de dias sem disparar scroll
        self.pin();
        self.step(pending);
        self.draw();
        pending = 0;
      }
      window.requestAnimationFrame(loop);
    };
    window.requestAnimationFrame(loop);
  },

  // Mantem o canvas na tela enquanto a secao passa, sem sair dos limites dela
  pin: function () {
    var area = this.canvas.parentElement.getBoundingClientRect();
    var offset = Math.max(0, Math.min(-area.top, area.height - this.canvas.offsetHeight));
    this.canvas.style.transform = "translateY(" + Math.round(offset) + "px)";
  },

  // Cor de destaque do tema atual (--accent) em "r, g, b"
  readColor: function () {
    var hex = getComputedStyle(document.body).getPropertyValue("--accent").trim();
    var match = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
    this.rgb = match
      ? [1, 2, 3].map((i) => parseInt(match[i], 16)).join(", ")
      : "6, 251, 126";
  },

  // Recalcula tamanho, colunas de bytes (so nas laterais) e nos da rede
  layout: function () {
    var dpr = Math.min(1.5, window.devicePixelRatio || 1);
    var w = this.canvas.clientWidth;
    var h = this.canvas.clientHeight;
    if (!w || !h) return;

    this.width = w;
    this.height = h;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Laterais livres a esquerda e a direita da coluna dos cards
    var canvasLeft = this.canvas.getBoundingClientRect().left;
    var rect = this.content ? this.content.getBoundingClientRect() : null;
    var leftEdge = rect ? rect.left - canvasLeft - this.CONTENT_GAP : 0;
    var rightEdge = rect ? rect.right - canvasLeft + this.CONTENT_GAP : w;

    this.columns = [];
    this.addColumns(0, leftEdge, 1);
    this.addColumns(rightEdge, w, -1);

    // Celular: sem laterais, as colunas ocupam a largura toda, bem mais fracas
    this.narrow = this.columns.length === 0;
    if (this.narrow) this.addColumns(0, w, 1);

    var count = Math.max(8, Math.min(26, Math.round((w * h) / this.NODE_AREA)));
    this.nodes = [];
    for (var i = 0; i < count; i++) {
      this.nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        hub: Math.random() < 0.2,
        flash: 0,
      });
    }

    this.contentLeft = leftEdge + this.CONTENT_GAP;
    this.contentRight = rightEdge - this.CONTENT_GAP;
    this.flashes = [];
    this.packets = [];
    this.nextSpawn = 1;
  },

  // Preenche uma lateral com colunas; "fromEdge" diz de que lado fica a borda
  // da tela, onde os bytes sao mais fortes (somem perto dos cards)
  addColumns: function (start, end, fromEdge) {
    var space = end - start;
    var total = Math.floor(space / this.COL_WIDTH);
    for (var i = 0; i < total; i++) {
      var x = fromEdge > 0 ? start + i * this.COL_WIDTH : end - (i + 1) * this.COL_WIDTH;
      this.columns.push({
        x: x + 6,
        speed: 8 + Math.random() * 10,
        seed: Math.random() * 1000,
        fade: total > 1 ? 1 - (0.65 * i) / (total - 1) : 1,
        offset: Math.random() * 400,
      });
    }
  },

  // Texto do byte de uma celula: fixo para cada (coluna, linha)
  byteAt: function (column, id) {
    var hash = Math.abs(Math.sin(column.seed + id * 47.3) * 43758.5) % 1;
    var value = Math.floor(hash * 65536).toString(16).toUpperCase().padStart(4, "0");
    return "0x" + value.slice(0, 2) + " " + value.slice(2);
  },

  // Centro de uma celula na tela (as linhas sobem com o tempo)
  cellCenter: function (column, id) {
    return { x: column.x + 22, y: id * this.ROW_HEIGHT - column.offset + this.ROW_HEIGHT / 2 };
  },

  linkedNodes: function (node) {
    var max = this.LINK_DISTANCE;
    return this.nodes.filter((other) => other !== node && Math.hypot(other.x - node.x, other.y - node.y) < max);
  },

  nearestNode: function (x, y) {
    var best = null;
    var bestDistance = Infinity;
    this.nodes.forEach((node) => {
      var distance = Math.hypot(node.x - x, node.y - y);
      if (distance < bestDistance) {
        best = node;
        bestDistance = distance;
      }
    });
    return best;
  },

  // Um byte visivel acende e sai como pacote rumo ao no mais proximo
  spawnPacket: function () {
    if (this.packets.length >= this.MAX_PACKETS || !this.columns.length) return;

    var column = this.columns[Math.floor(Math.random() * this.columns.length)];
    var y = this.height * (0.15 + Math.random() * 0.7);
    var id = Math.round((y + column.offset) / this.ROW_HEIGHT);
    var start = this.cellCenter(column, id);
    this.flashes.push({ column: column, id: id, life: 1 });

    this.packets.push({
      x: start.x,
      y: start.y,
      trail: [],
      target: this.nearestNode(start.x, start.y),
      previous: null,
      hops: 2 + Math.floor(Math.random() * 3),
      landing: null,
    });
  },

  step: function (dt) {
    var self = this;
    this.time += dt;

    this.columns.forEach((column) => {
      column.offset += column.speed * dt;
    });

    this.nodes.forEach((node) => {
      node.x += node.vx * dt;
      node.y += node.vy * dt;
      if (node.x < 0 || node.x > this.width) node.vx *= -1;
      if (node.y < 0 || node.y > this.height) node.vy *= -1;
      node.flash = Math.max(0, node.flash - dt * 1.5);
    });

    this.flashes = this.flashes.filter((flash) => (flash.life -= dt * 0.9) > 0);

    this.nextSpawn -= dt;
    if (this.nextSpawn <= 0) {
      this.spawnPacket();
      this.nextSpawn = 0.9 + Math.random() * 1.4;
    }

    this.packets = this.packets.filter(function (packet) {
      var goal = packet.landing
        ? self.cellCenter(packet.landing.column, packet.landing.id)
        : packet.target;
      if (!goal) return false;

      var dx = goal.x - packet.x;
      var dy = goal.y - packet.y;
      var distance = Math.hypot(dx, dy);
      var move = self.PACKET_SPEED * dt;

      packet.trail.unshift({ x: packet.x, y: packet.y });
      if (packet.trail.length > 7) packet.trail.pop();

      if (distance > move) {
        packet.x += (dx / distance) * move;
        packet.y += (dy / distance) * move;
        return true;
      }

      packet.x = goal.x;
      packet.y = goal.y;

      // Chegou de volta numa coluna: acende o byte e encerra o ciclo
      if (packet.landing) {
        self.flashes.push({ column: packet.landing.column, id: packet.landing.id, life: 1 });
        return false;
      }

      // Chegou num no: pisca e segue para um vizinho, ou volta para os bytes
      var node = packet.target;
      node.flash = 1;
      var options = self.linkedNodes(node).filter((other) => other !== packet.previous);
      if (packet.hops > 0 && options.length) {
        packet.hops -= 1;
        packet.previous = node;
        packet.target = options[Math.floor(Math.random() * options.length)];
      } else {
        var column = self.nearestColumn(node.x);
        if (!column) return false;
        packet.landing = { column: column, id: Math.round((node.y + column.offset) / self.ROW_HEIGHT) };
      }
      return true;
    });
  },

  nearestColumn: function (x) {
    var best = null;
    this.columns.forEach((column) => {
      if (!best || Math.abs(column.x - x) < Math.abs(best.x - x)) best = column;
    });
    return best;
  },

  draw: function () {
    var ctx = this.ctx;
    var rgb = this.rgb;
    var w = this.width;
    var h = this.height;
    if (!w) return;

    ctx.clearRect(0, 0, w, h);

    // Area da montanha de triangulos, onde os bytes quase somem
    var canvasRect = this.canvas.getBoundingClientRect();
    var mountain = this.mountain ? this.mountain.getBoundingClientRect() : null;
    var inMountain = function (x, y) {
      return (
        mountain &&
        x > mountain.left - canvasRect.left &&
        x < mountain.right - canvasRect.left &&
        y > mountain.top - canvasRect.top &&
        y < mountain.bottom - canvasRect.top
      );
    };

    // Camada 1: bytes subindo
    var rowHeight = this.ROW_HEIGHT;
    var base = this.narrow ? 0.045 : 0.1;
    ctx.font = '12px "Share Tech Mono", ui-monospace, monospace';
    ctx.textBaseline = "top";
    this.columns.forEach((column) => {
      var first = Math.floor(column.offset / rowHeight);
      for (var row = 0; row * rowHeight < h + rowHeight; row++) {
        var id = first + row;
        var y = id * rowHeight - column.offset;
        var alpha = base * column.fade * (inMountain(column.x, y) ? 0.3 : 1);
        ctx.fillStyle = "rgba(" + rgb + "," + alpha + ")";
        ctx.fillText(this.byteAt(column, id), column.x, y + 3);
      }
    });

    // Bytes acesos (saida e chegada de pacotes)
    this.flashes.forEach((flash) => {
      var y = flash.id * rowHeight - flash.column.offset;
      ctx.fillStyle = "rgba(" + rgb + "," + 0.95 * flash.life + ")";
      ctx.fillText(this.byteAt(flash.column, flash.id), flash.column.x, y + 3);
    });

    // Camada 2: rede. Atras dos cards ela fica mais fraca
    var dim = (x) => (x > this.contentLeft && x < this.contentRight ? 0.55 : 1);
    var nodes = this.nodes;
    ctx.lineWidth = 1;
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var a = nodes[i];
        var b = nodes[j];
        var distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance >= this.LINK_DISTANCE) continue;
        var strength = 0.24 * (1 - distance / this.LINK_DISTANCE) * dim((a.x + b.x) / 2);
        ctx.strokeStyle = "rgba(" + rgb + "," + strength + ")";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    // Pacotes com rastro curto
    this.packets.forEach((packet) => {
      packet.trail.forEach((point, k) => {
        var fade = 1 - k / packet.trail.length;
        ctx.fillStyle = "rgba(" + rgb + "," + 0.5 * fade + ")";
        ctx.fillRect(point.x - 1.5, point.y - 1.5, 3, 3);
      });
      ctx.fillStyle = "rgba(" + rgb + ",0.95)";
      ctx.fillRect(packet.x - 2, packet.y - 2, 4, 4);
    });

    // Nos: quadradinhos, os principais com moldura; piscam quando um pacote passa
    nodes.forEach((node) => {
      var strength = dim(node.x);
      var size = node.hub ? 5 : 3;
      ctx.fillStyle = "rgba(" + rgb + "," + (node.hub ? 0.5 : 0.3) * strength + node.flash * 0.5 + ")";
      ctx.fillRect(node.x - size / 2, node.y - size / 2, size, size);
      if (node.hub || node.flash > 0) {
        var ring = 6 + node.flash * 6;
        ctx.strokeStyle = "rgba(" + rgb + "," + (0.22 * strength + node.flash * 0.5) + ")";
        ctx.strokeRect(node.x - ring, node.y - ring, ring * 2, ring * 2);
      }
    });
  },
};
