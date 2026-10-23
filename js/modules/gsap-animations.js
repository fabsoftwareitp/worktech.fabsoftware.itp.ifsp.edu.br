window.WorktechApp = window.WorktechApp || {};

window.WorktechApp.GSAPAnimations = {
  animateHeader: function () {
    gsap.registerPlugin(ScrollTrigger);

    // Zoom sutil via transform scale apenas no background
    gsap.to(".header-background", {
      scrollTrigger: {
        trigger: ".header",
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
      },
      scale: 1.05,
      ease: "none",
    });

    // Revelacoes usam fromTo com valor final explicito: um from() le o valor
    // computado e, se houver transicao CSS em andamento durante um
    // ScrollTrigger.refresh(), grava opacity 0 como final e o elemento some.
    gsap.fromTo(
      "#logo-topo-home",
      { opacity: 0 },
      { duration: 1.2, opacity: 1, ease: "power2.out", delay: 0.2 }
    );

    gsap.fromTo(
      ".header h4",
      { y: 30, opacity: 0 },
      { duration: 1, y: 0, opacity: 1, ease: "power2.out", delay: 0.6 }
    );
  },

  animateProgramacao: function () {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#programacao",
        start: "top 80%",
        end: "top 30%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      "#programacao h1",
      { y: 30, opacity: 0 },
      { duration: 0.8, y: 0, opacity: 1, ease: "power2.out" }
    ).fromTo(
      ".timeline-activation",
      {
        opacity: 0,
        y: 20,
      },
      {
        duration: 0.6,
        opacity: 1,
        y: 0,
        stagger: 0.15,
        ease: "power2.out",
        // Libera o transform para o efeito de hover do CSS funcionar
        clearProps: "transform",
      },
      "-=0.4"
    );
  },

  // Pecas animaveis dos itens da timeline. A bolinha fica parada na linha;
  // so o texto (rotulo de turno ou conteudo do card) desliza
  timelineParts: function (items) {
    var $items = $(items);
    return {
      texts: $items
        .filter(".turno-label")
        .add($items.children(".timeline-content"))
        .get(),
      dots: $items.children(".timeline-dot").get(),
    };
  },

  // Estado apagado: texto escondido, bolinha pequena e fraca sobre a linha
  dimItems: function (items, direction) {
    var parts = this.timelineParts(items);
    gsap.set(parts.texts, { opacity: 0, x: direction * 40, y: direction ? 0 : 24 });
    gsap.set(parts.dots, { scale: 0.45, opacity: 0.25 });
  },

  // Acende um item: a bolinha cresce, solta uma onda e o texto entra
  lightItem: function (item, delay) {
    var parts = this.timelineParts(item);

    gsap.to(parts.texts, {
      duration: 0.5,
      opacity: 1,
      x: 0,
      y: 0,
      ease: "power3.out",
      delay: delay,
      overwrite: true,
    });

    if (!parts.dots.length) return;
    gsap.to(parts.dots, {
      duration: 0.35,
      scale: 1,
      opacity: 1,
      ease: "back.out(3)",
      delay: delay,
      overwrite: true,
    });
    gsap.fromTo(
      $(parts.dots).children(".timeline-dot-ring").get(),
      { scale: 1, opacity: 0.8 },
      { duration: 0.5, scale: 2.4, opacity: 0, ease: "power2.out", delay: delay }
    );
  },

  // Um sinal de luz desce pela linha e acende cada item quando passa por ele
  signalDown: function ($panel, items) {
    if (!items.length) return;

    var $pulse = $panel.children(".timeline-pulse");
    if (!$pulse.length) {
      $pulse = $("<span class='timeline-pulse' aria-hidden='true'></span>").prependTo($panel);
    }

    var panelTop = $panel.get(0).getBoundingClientRect().top;
    var tops = items.map((el) => el.getBoundingClientRect().top - panelTop);
    var start = -48;
    var end = tops[tops.length - 1] + 30;
    // Velocidade constante (~1100 px/s), sem ficar lento demais em dias longos
    var duration = gsap.utils.clamp(0.35, 0.9, (end - start) / 1100);

    gsap
      .timeline()
      .fromTo($pulse, { y: start, opacity: 1 }, { y: end, duration: duration, ease: "none" })
      .to($pulse, { opacity: 0, duration: 0.15 });

    items.forEach((item, i) => {
      this.lightItem(item, (duration * (tops[i] - start)) / (end - start));
    });
  },

  // Revela os itens de um dia. Os que ja estao na tela sao acesos pelo sinal
  // agora; os de baixo acendem conforme a rolagem, uma vez so (sem sumir ao
  // rolar para cima). direction: 1 = veio de um dia anterior, -1 = de um
  // posterior, 0 = primeira montagem
  revealPanel: function ($panel, direction) {
    if (this.reduceMotion) return;

    var self = this;
    var items = $panel.children(".turno-label, .timeline-block").get();
    var fold = window.innerHeight * 0.92;
    var visible = items.filter((el) => el.getBoundingClientRect().top < fold);
    var below = items.filter((el) => el.getBoundingClientRect().top >= fold);

    // Gatilhos de rolagem do dia anterior nao servem mais
    (this.revealTriggers || []).forEach((trigger) => trigger.kill());

    this.dimItems(visible, direction);
    this.dimItems(below, 0);
    this.signalDown($panel, visible);

    this.revealTriggers = ScrollTrigger.batch(below, {
      start: "top 92%",
      once: true,
      onEnter: (batch) => batch.forEach((item, i) => self.lightItem(item, i * 0.08)),
    });
  },

  // Primeira montagem: espera o JSON da programacao e acende o dia quando
  // ele chega na tela, para o sinal ser visto
  animateTimelineMount: function () {
    var self = this;
    if (this.reduceMotion) return;

    var mount = function () {
      var $panel = $(".timeline").children(":visible");
      self.dimItems($panel.children(".turno-label, .timeline-block").get(), 0);
      self.mountTrigger = ScrollTrigger.create({
        trigger: $panel.get(0),
        start: "top 85%",
        once: true,
        onEnter: () => self.revealPanel($panel, 0),
      });
    };

    if (window.WorktechApp.Timeline && window.WorktechApp.Timeline.ready) mount();
    else $(document).one("timeline:ready", mount);
  },

  animateInscricoes: function () {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#inscricoes",
        start: "top 80%",
        end: "top 30%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      "#inscricoes h2",
      { y: 30, opacity: 0 },
      { duration: 0.8, y: 0, opacity: 1, ease: "power2.out" }
    )
      .fromTo(
        "#inscricoes h4",
        { y: 20, opacity: 0 },
        { duration: 0.6, y: 0, opacity: 1, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        "#inscricoes .btn-large",
        { opacity: 0 },
        { duration: 0.6, opacity: 1, ease: "power2.out" },
        "-=0.3"
      );
  },

  animateLocal: function () {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#local",
        start: "top 80%",
        end: "top 30%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      "#local h2",
      { y: 30, opacity: 0 },
      { duration: 0.8, y: 0, opacity: 1, ease: "power2.out" }
    )
      .fromTo(
        "#local h5",
        { y: 20, opacity: 0 },
        { duration: 0.6, y: 0, opacity: 1, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        "#local .btn-large",
        { opacity: 0 },
        { duration: 0.6, opacity: 1, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        "#local .map-hud",
        { opacity: 0 },
        { duration: 0.8, opacity: 1, ease: "power2.out" },
        "-=0.4"
      );
  },

  animateLamp: function () {
    const lampButton = document.querySelector("#lamp a");
    if (lampButton) {
      lampButton.addEventListener("mouseenter", () => {
        gsap.to("#lamp i", {
          duration: 0.3,
          scale: 1.1,
          ease: "power2.out",
        });
      });

      lampButton.addEventListener("mouseleave", () => {
        gsap.to("#lamp i", {
          duration: 0.3,
          scale: 1,
          ease: "power2.out",
        });
      });
    }
  },

  animateSVGHeader: function () {
    gsap.to("#headerOrb1", {
      duration: 20,
      x: 50,
      y: -30,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to("#headerOrb2", {
      duration: 25,
      x: -40,
      y: 40,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to("#headerOrb3", {
      duration: 18,
      x: 30,
      y: -20,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to(".header-particle", {
      duration: 3,
      y: "random(-20, 20)",
      x: "random(-15, 15)",
      stagger: {
        each: 0.5,
        repeat: -1,
        yoyo: true,
      },
      ease: "sine.inOut",
    });
  },

  animateSVGInscricoes: function () {
    // SVG removido da seção de inscrições
  },

  animateTimelineSwitch: function () {
    var self = this;
    var $timeline = $(".timeline");
    var dayOrder = $(".timeline-activation")
      .map(function () {
        return $(this).attr("href");
      })
      .get();

    $("body").on("click", ".timeline-activation", function (e) {
      e.preventDefault();
      var target = $(this).attr("href");
      var $target = $(target);

      // As cores da aba ativa ficam no CSS (.timeline-activation.active)
      $(".timeline-activation").removeClass("active");
      $(this).addClass("active");

      // Clique rapido: conclui a troca anterior na hora para nao misturar dias
      if (self.switchTimeline) self.switchTimeline.progress(1).kill();
      // O dia inicial ainda nao acendido nao deve acender depois da troca
      if (self.mountTrigger) self.mountTrigger.kill();

      var $current = $timeline.children(":visible");
      if ($target.is($current)) return;

      if (self.reduceMotion || !$current.length) {
        $current.hide();
        $target.show();
        var parts = self.timelineParts($target.children().get());
        gsap.set(parts.texts.concat(parts.dots), { clearProps: "opacity,transform" });
        ScrollTrigger.refresh();
        return;
      }

      // O texto sai para o lado oposto ao que o novo dia vem, e as bolinhas
      // visiveis apagam de baixo para cima, como se o sinal fosse embora
      var direction =
        dayOrder.indexOf(target) > dayOrder.indexOf("#" + $current.attr("id")) ? 1 : -1;
      var startHeight = $timeline.height();
      var onScreen = $current
        .children(".turno-label, .timeline-block")
        .get()
        .filter((el) => {
          var rect = el.getBoundingClientRect();
          return rect.bottom > 0 && rect.top < window.innerHeight;
        });
      var leaving = self.timelineParts(onScreen);

      self.switchTimeline = gsap
        .timeline()
        .to(
          leaving.texts,
          {
            duration: 0.22,
            opacity: 0,
            x: -direction * 40,
            stagger: 0.015,
            ease: "power2.in",
            overwrite: true,
          },
          0
        )
        .to(
          leaving.dots,
          {
            duration: 0.18,
            scale: 0.45,
            opacity: 0.25,
            stagger: { each: 0.05, from: "end" },
            ease: "power2.in",
            overwrite: true,
          },
          0
        )
        .add(function () {
          $current.hide();
          $target.show();

          // A secao muda de altura aos poucos, sem empurrar o resto da pagina de uma vez
          gsap.fromTo(
            $timeline,
            { height: startHeight, overflow: "hidden" },
            {
              height: $timeline.height(),
              duration: 0.45,
              ease: "power3.inOut",
              clearProps: "height,overflow",
              onComplete: () => ScrollTrigger.refresh(),
            }
          );

          self.revealPanel($target, direction);
        });
    });
  },

  animateFooter: function () {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".footer-final",
        start: "top 90%",
        end: "top 60%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      ".footer-final img",
      { y: 30, opacity: 0 },
      { duration: 0.8, y: 0, opacity: 1, ease: "power2.out" }
    ).fromTo(
      ".footer-final p",
      { y: 20, opacity: 0 },
      { duration: 0.6, y: 0, opacity: 1, stagger: 0.15, ease: "power2.out" },
      "-=0.4"
    );
  },

  init: function () {
    gsap.registerPlugin(ScrollTrigger);
    this.reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.animateHeader();
    this.animateProgramacao();
    this.animateInscricoes();
    this.animateLocal();
    this.animateLamp();
    this.animateFooter();
    this.animateSVGHeader();
    this.animateSVGInscricoes();
    this.animateTimelineSwitch();
    this.animateTimelineMount();
  },
};
