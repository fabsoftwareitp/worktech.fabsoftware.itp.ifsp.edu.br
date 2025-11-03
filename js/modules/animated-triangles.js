// Animated Triangles Module
window.WorktechApp = window.WorktechApp || {};

window.WorktechApp.AnimatedTriangles = {
  // Gera um triângulo preenchendo toda a área da montanha
  generateMountainTriangle: function (
    index,
    total,
    maxWidth,
    maxHeight,
    fromLeft = false
  ) {
    const size = Math.random() * 50 + 15; // Tamanho entre 15 e 65

    // Progresso vertical (0 a 1)
    const progress = index / total;

    // Distribuição em formato de montanha (mais estreito no topo, mais largo na base)
    let mountainFactor = Math.sin(progress * Math.PI); // Curva em forma de sino
    
    // Adiciona aleatoriedade em TODA a montanha (não só na ponta)
    // Mais aleatoriedade próximo ao topo, menos na base
    const distanceFromPeak = Math.abs(progress - 0.5);
    const randomnessFactor = 1 - (distanceFromPeak * 1.5); // Maior no topo, menor na base
    
    if (randomnessFactor > 0) {
      // Variação de ±50% da largura base, proporcional à altura
      mountainFactor += (Math.random() - 0.5) * 0.6 * randomnessFactor;
      // Garante que não fique negativo
      mountainFactor = Math.max(0.1, mountainFactor);
    }

    // Posição Y distribuída ao longo da altura com pequena variação
    const y = progress * maxHeight + (Math.random() - 0.5) * 30;

    // Largura máxima da montanha nesta altura
    const mountainWidth = mountainFactor * maxWidth * 0.85;

    // Posição X aleatória DENTRO da largura da montanha nesta altura
    let x;
    if (fromLeft) {
      // Montanha saindo da esquerda - preenche de 0 até mountainWidth
      x = Math.random() * mountainWidth;
    } else {
      // Montanha saindo da direita - preenche de (maxWidth - mountainWidth) até maxWidth
      x = maxWidth - Math.random() * mountainWidth;
    }

    // Diferentes orientações de triângulos
    const orientations = [
      `${x},${y} ${x + size},${y + size / 2} ${x},${y + size}`, // Apontando direita
      `${x},${y} ${x + size},${y} ${x + size / 2},${y + size}`, // Apontando baixo
      `${x},${y} ${x - size},${y + size / 2} ${x},${y + size}`, // Apontando esquerda
      `${x},${y + size} ${x + size},${y} ${x + size},${y + size}`, // Variação 1
      `${x},${y} ${x + size / 2},${y + size} ${x + size},${y}`, // Variação 2
    ];

    return orientations[Math.floor(Math.random() * orientations.length)];
  },

  // Cria SVG com triângulos para a seção de Programação (montanha da direita)
  createProgramacaoTriangles: function () {
    const svg = document.getElementById("svg-programacao-triangles");
    if (!svg) return;

    const width = 750;
    const height = 800;
    const triangleCount = 400; // 400 triângulos para preencher toda a montanha

    for (let i = 0; i < triangleCount; i++) {
      const polygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
      );
      polygon.setAttribute(
        "points",
        this.generateMountainTriangle(i, triangleCount, width, height, false)
      );
      polygon.setAttribute("class", "animated-triangle");
      polygon.style.opacity = Math.random() * 0.4 + 0.2; // Opacidade variada (0.2 a 0.6)
      svg.appendChild(polygon);
    }
  },

  // Cria SVG com triângulos para a seção de Inscrições (montanha da esquerda)
  createInscricoesTriangles: function () {
    const svg = document.getElementById("svg-inscricoes-triangles");
    if (!svg) return;

    const width = 690;
    const height = 800;
    const triangleCount = 400; // 400 triângulos para preencher toda a montanha

    for (let i = 0; i < triangleCount; i++) {
      const polygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
      );
      polygon.setAttribute(
        "points",
        this.generateMountainTriangle(i, triangleCount, width, height, true)
      );
      polygon.setAttribute("class", "animated-triangle");
      polygon.style.opacity = Math.random() * 0.4 + 0.2; // Opacidade variada (0.2 a 0.6)
      svg.appendChild(polygon);
    }
  },

  // Anima os triângulos da seção de Programação (montanha avançando da direita)
  animateProgramacaoTriangles: function () {
    const triangles = document.querySelectorAll(
      "#svg-programacao-triangles .animated-triangle"
    );
    if (triangles.length === 0) return;

    gsap.fromTo(
      triangles,
      {
        x: 300, // Começam mais fora da tela
        opacity: 0,
        scale: 0.5,
      },
      {
        x: 0,
        opacity: (index, target) => parseFloat(target.style.opacity) || 0.3,
        scale: 1,
        duration: 1.5,
        ease: "power3.out",
        stagger: {
          each: 0.008,
          from: "start", // Aparecem de baixo para cima
        },
        scrollTrigger: {
          trigger: "#programacao",
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none none",
        },
      }
    );

    // Animação contínua sutil (começa após a entrada)
    setTimeout(() => {
      gsap.to(triangles, {
        y: "random(-3, 3)",
        x: "+=random(-2, 2)",
        duration: "random(4, 6)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          each: 0.08,
          from: "random",
        },
      });
    }, 2000);
  },

  // Anima os triângulos da seção de Inscrições (montanha avançando da esquerda)
  animateInscricoesTriangles: function () {
    const triangles = document.querySelectorAll(
      "#svg-inscricoes-triangles .animated-triangle"
    );
    if (triangles.length === 0) return;

    gsap.fromTo(
      triangles,
      {
        x: -300, // Começam mais fora da tela
        opacity: 0,
        scale: 0.5,
      },
      {
        x: 0,
        opacity: (index, target) => parseFloat(target.style.opacity) || 0.3,
        scale: 1,
        duration: 1.5,
        ease: "power3.out",
        stagger: {
          each: 0.008,
          from: "start", // Aparecem de baixo para cima
        },
        scrollTrigger: {
          trigger: "#inscricoes",
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none none",
        },
      }
    );

    // Animação contínua sutil (começa após a entrada)
    setTimeout(() => {
      gsap.to(triangles, {
        y: "random(-3, 3)",
        x: "+=random(-2, 2)",
        duration: "random(4, 6)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          each: 0.08,
          from: "random",
        },
      });
    }, 2000);
  },

  // Cria triângulos flutuantes de fundo na seção de Programação
  createFloatingTriangles: function () {
    const svg = document.getElementById("svg-programacao-floating");
    if (!svg) return;

    const width = 1200;
    const height = 800;
    const triangleCount = 12; // 12 triângulos flutuantes

    for (let i = 0; i < triangleCount; i++) {
      const polygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
      );
      const size = Math.random() * 20 + 15; // Tamanho menor: entre 15 e 35
      const x = Math.random() * width;
      const y = Math.random() * height;

      // Triângulos simples aleatórios
      const points = `${x},${y} ${x + size},${y} ${x + size / 2},${y + size}`;

      polygon.setAttribute("points", points);
      polygon.setAttribute("class", "floating-triangle");
      polygon.style.opacity = Math.random() * 0.04 + 0.01; // Menos visível (0.01 a 0.05)

      // Rotação inicial aleatória
      polygon.style.transformOrigin = "center";
      polygon.style.transform = `rotate(${Math.random() * 360}deg)`;

      svg.appendChild(polygon);
    }
  },

  // Anima os triângulos flutuantes
  animateFloatingTriangles: function () {
    const triangles = document.querySelectorAll(
      "#svg-programacao-floating .floating-triangle"
    );
    if (triangles.length === 0) return;

    triangles.forEach((triangle, index) => {
      // Movimento vertical (lento e sutil)
      gsap.to(triangle, {
        y: `random(-50, 50)`,
        duration: `random(15, 25)`,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 5,
      });

      // Movimento horizontal (lento e sutil)
      gsap.to(triangle, {
        x: `random(-40, 40)`,
        duration: `random(18, 28)`,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 5,
      });

      // Rotação (muito lenta e sutil)
      gsap.to(triangle, {
        rotation: `random(-30, 30)`,
        duration: `random(20, 35)`,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 5,
      });
    });
  },

  init: function () {
    // Gera os triângulos
    this.createProgramacaoTriangles();
    this.createInscricoesTriangles();
    this.createFloatingTriangles();

    // Anima após um pequeno delay
    setTimeout(() => {
      this.animateProgramacaoTriangles();
      this.animateInscricoesTriangles();
      this.animateFloatingTriangles();
    }, 500);
  },
};
