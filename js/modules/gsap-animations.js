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

  animateTimelineBlocks: function () {
    gsap.utils.toArray(".timeline-block").forEach((block, index) => {
      const isOdd = index % 2 === 0;

      gsap.fromTo(
        block,
        { x: isOdd ? -50 : 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: block,
            start: "top 85%",
            end: "top 40%",
            toggleActions: "play none none reverse",
          },
          duration: 0.8,
          x: 0,
          opacity: 1,
          ease: "power2.out",
        }
      );
    });
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
    // Parallax e zoom na imagem de fundo da seção Local
    gsap.fromTo(".index-local", 
      {
        backgroundSize: "100%, 100%",
        backgroundPosition: "50% 0%, 50% 50%",
      },
      {
        scrollTrigger: {
          trigger: ".index-local",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
        backgroundSize: "100%, 105%",
        backgroundPosition: "50% 0%, 50% 80%",
        ease: "none",
      }
    );

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
        "#local iframe",
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

  animateSVGProgramacao: function () {
    gsap.to("#progOrb1", {
      duration: 22,
      x: 60,
      y: -40,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to("#progOrb2", {
      duration: 28,
      x: -50,
      y: 30,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to("#progOrb3", {
      duration: 20,
      x: 40,
      y: -25,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to("#progLine1", {
      duration: 15,
      attr: { d: "M 0,100 Q 300,150 600,100 T 1200,100" },
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to("#progLine2", {
      duration: 18,
      attr: { d: "M 0,300 Q 400,350 800,300 T 1200,300" },
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to("#progLine3", {
      duration: 20,
      attr: { d: "M 0,500 Q 350,550 700,500 T 1200,500" },
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to(".prog-particle", {
      duration: 4,
      y: "random(-25, 25)",
      x: "random(-20, 20)",
      stagger: {
        each: 0.6,
        repeat: -1,
        yoyo: true,
      },
      ease: "sine.inOut",
    });
  },

  animateSVGInscricoes: function () {
    // SVG removido da seção de inscrições
  },

  animateSVGLocal: function () {
    gsap.to("#localOrb1", {
      duration: 23,
      x: 50,
      y: -30,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to("#localOrb2", {
      duration: 27,
      x: -45,
      y: 35,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to(".local-particle", {
      duration: 4,
      y: "random(-22, 22)",
      x: "random(-18, 18)",
      stagger: {
        each: 0.55,
        repeat: -1,
        yoyo: true,
      },
      ease: "sine.inOut",
    });
  },

  animateTimelineSwitch: function () {
    $("body").on("click", ".timeline-activation", function (e) {
      e.preventDefault();
      var target = $(this).attr("href");
      var $target = $(target);
      var $current = $(".timeline > div:visible");

      // As cores da aba ativa ficam no CSS (.timeline-activation.active)
      $(".timeline-activation").removeClass("active");
      $(this).addClass("active");

      const tl = gsap.timeline();

      if ($current.length > 0) {
        tl.to($current.find(".timeline-block").get().reverse(), {
          duration: 0.2,
          opacity: 0,
          stagger: 0.02,
          ease: "power1.in",
          onComplete: function () {
            $current.hide();
            $target.show();
            gsap.set($target, { opacity: 1 });
            gsap.set($target.find(".timeline-block"), {
              opacity: 0,
            });
          },
        });
      } else {
        $target.show();
        gsap.set($target, { opacity: 1 });
        gsap.set($target.find(".timeline-block"), {
          opacity: 0,
        });
      }

      tl.to($target.find(".timeline-block"), {
        duration: 0.35,
        opacity: 1,
        stagger: {
          each: 0.04,
          from: "start",
        },
        ease: "power1.out",
        delay: $current.length > 0 ? 0.05 : 0,
      });

      gsap.fromTo(
        $target.find(".timeline-content h3"),
        { y: 10, opacity: 0 },
        {
          duration: 0.3,
          y: 0,
          opacity: 1,
          stagger: 0.03,
          ease: "power1.out",
          delay: $current.length > 0 ? 0.15 : 0.1,
        }
      );
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

    this.animateHeader();
    this.animateProgramacao();
    this.animateInscricoes();
    this.animateLocal();
    this.animateLamp();
    this.animateFooter();
    this.animateSVGHeader();
    this.animateSVGProgramacao();
    this.animateSVGInscricoes();
    this.animateSVGLocal();
    this.animateTimelineSwitch();

    setTimeout(() => {
      this.animateTimelineBlocks();
    }, 800);
  },
};
