document.addEventListener("DOMContentLoaded", () => {
  if (window.gsap) {
    const { gsap } = window;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
    if (window.ScrollToPlugin) gsap.registerPlugin(window.ScrollToPlugin);
    if (window.SplitText) gsap.registerPlugin(window.SplitText);

    const inscricoesImg = document.getElementById("inscricoesImg");
    if (inscricoesImg) {
      inscricoesImg.style.maxWidth = "400px";

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

  const scrollTopBtn = document.getElementById("scrollTop");

  document.addEventListener("click", (e) => {
    const target = e.target.closest("a");
    if (
      target &&
      target.tagName === "A" &&
      target.getAttribute("href")?.startsWith("#")
    ) {
      const id = target.getAttribute("href");
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        if (window.gsap && window.ScrollToPlugin) {
          window.gsap.to(window, {
            duration: 1.2,
            scrollTo: { y: el, offsetY: 80 },
            ease: "power3.inOut",
          });
        } else {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  });

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (window.gsap && window.ScrollToPlugin && !prefersReduced) {
    let currentScroll = window.scrollY;
    let targetScroll = window.scrollY;
    let ease = 0.1;
    let isScrolling = false;

    const smoothScroll = () => {
      const diff = targetScroll - currentScroll;

      if (Math.abs(diff) < 0.5) {
        currentScroll = targetScroll;
        isScrolling = false;
        return;
      }

      currentScroll += diff * ease;

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      if (currentScroll < 0) {
        currentScroll = 0;
      } else if (currentScroll > maxScroll) {
        currentScroll = maxScroll;
      }

      window.scrollTo(0, currentScroll);

      if (isScrolling) {
        requestAnimationFrame(smoothScroll);
      }
    };

    const onWheel = (e) => {
      if (e.defaultPrevented) return;
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

      const tn = (e.target && e.target.tagName) || "";
      if (
        ["INPUT", "TEXTAREA", "SELECT", "IFRAME", "VIDEO", "AUDIO"].includes(tn)
      )
        return;

      e.preventDefault();

      const delta = e.deltaY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      targetScroll += delta * 0.8;
      targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));

      if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(smoothScroll);
      }
    };

    const onTouchStart = (e) => {
      currentScroll = window.scrollY;
      targetScroll = currentScroll;
    };

    const onTouchMove = (e) => {
      targetScroll = window.scrollY;
      currentScroll = targetScroll;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    window.addEventListener("resize", () => {
      currentScroll = window.scrollY;
      targetScroll = currentScroll;
    });
  }

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
        window.gsap.to(window, {
          duration: 1.5,
          scrollTo: 0,
          ease: "power3.inOut",
        });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  if (window.gsap) {
    const { gsap } = window;

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

    const heroBackgroundAnimations = () => {
      const orbs = [
        { id: "#orb1", x: 15, y: -12, duration: 12, scale: 1.05 },
        { id: "#orb2", x: -18, y: 15, duration: 15, scale: 0.97 },
        { id: "#orb3", x: 12, y: -18, duration: 14, scale: 1.04 },
        { id: "#orb4", x: -15, y: 10, duration: 13, scale: 1.03 },
        { id: "#orb5", x: 14, y: -14, duration: 16, scale: 0.98 },
      ];

      orbs.forEach((orb, idx) => {
        const el = document.querySelector(orb.id);
        if (el) {
          gsap.to(el, {
            x: orb.x,
            y: orb.y,
            duration: orb.duration,
            yoyo: true,
            repeat: -1,
            ease: "power1.inOut",
          });
          gsap.to(el, {
            scale: orb.scale,
            duration: orb.duration + 2,
            yoyo: true,
            repeat: -1,
            ease: "power1.inOut",
          });
          if (window.ScrollTrigger) {
            gsap.to(el, {
              yPercent: -8 - idx * 3,
              xPercent: idx % 2 === 0 ? 5 : -5,
              ease: "none",
              scrollTrigger: {
                trigger: "#hero",
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            });
          }
        }
      });

      const heroWave1 = document.getElementById("heroWave1");
      const heroWave2 = document.getElementById("heroWave2");
      const heroWave3 = document.getElementById("heroWave3");

      if (heroWave1) {
        gsap.to(heroWave1, {
          attr: { d: "M 0,200 Q 350,170 650,210 T 1200,200" },
          duration: 6,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      if (heroWave2) {
        gsap.to(heroWave2, {
          attr: { d: "M 0,400 Q 350,430 650,390 T 1200,400" },
          duration: 7,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      if (heroWave3) {
        gsap.to(heroWave3, {
          attr: { d: "M 0,600 Q 350,570 650,610 T 1200,600" },
          duration: 5,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      const shapes = [
        { id: "#heroRect1", rotation: 360, duration: 25, y: -20 },
        { id: "#heroCircle1", scale: 1.4, duration: 5, y: 0 },
        { id: "#heroHexagon", rotation: -360, duration: 30, y: -15 },
        { id: "#heroRect2", rotation: 405, duration: 20, y: 0 },
        { id: "#heroTriangle1", rotation: 180, duration: 15, y: -10 },
        { id: "#heroCircle2", scale: 1.3, duration: 4.5, y: 0 },
        { id: "#heroRect3", rotation: 390, duration: 18, y: -12 },
      ];

      shapes.forEach((shape) => {
        const el = document.getElementById(shape.id.replace("#", ""));
        if (el) {
          if (shape.rotation) {
            gsap.to(el, {
              rotation: shape.rotation,
              transformOrigin: "center",
              duration: shape.duration,
              repeat: -1,
              ease: "none",
            });
          }
          if (shape.scale) {
            gsap.to(el, {
              scale: shape.scale,
              transformOrigin: "center",
              duration: shape.duration,
              yoyo: true,
              repeat: -1,
              ease: "sine.inOut",
            });
          }
          if (shape.y !== 0) {
            gsap.to(el, {
              y: shape.y,
              duration: 3,
              yoyo: true,
              repeat: -1,
              ease: "sine.inOut",
            });
          }
        }
      });

      const heroParticles = document.querySelectorAll(".hero-particle");
      heroParticles.forEach((particle, idx) => {
        const duration = 6 + Math.random() * 4;
        const delay = Math.random() * 3;
        const xMove = (Math.random() - 0.5) * 25;
        const yMove = (Math.random() - 0.5) * 25;

        gsap.to(particle, {
          x: xMove,
          y: yMove,
          duration: duration,
          yoyo: true,
          repeat: -1,
          ease: "power1.inOut",
          delay: delay,
        });

        gsap.to(particle, {
          opacity: 0.4 + Math.random() * 0.3,
          duration: 4 + Math.random() * 3,
          yoyo: true,
          repeat: -1,
          ease: "power1.inOut",
          delay: delay,
        });

        gsap.to(particle, {
          scale: 0.85 + Math.random() * 0.3,
          duration: 5 + Math.random() * 2,
          yoyo: true,
          repeat: -1,
          ease: "power1.inOut",
          delay: delay,
        });
      });

      const heroDots = document.querySelectorAll("#heroDots circle");
      heroDots.forEach((dot, idx) => {
        gsap.to(dot, {
          opacity: 0.08 + Math.random() * 0.15,
          duration: 4 + Math.random() * 3,
          yoyo: true,
          repeat: -1,
          ease: "power1.inOut",
          delay: idx * 0.3,
        });
      });

      const heroConnectors = ["#heroConn1", "#heroConn2", "#heroConn3"];
      heroConnectors.forEach((conn, idx) => {
        const el = document.getElementById(conn.replace("#", ""));
        if (el) {
          gsap.to(el, {
            strokeDashoffset: -50,
            duration: 10 + idx * 2,
            repeat: -1,
            ease: "none",
          });
        }
      });

      const heroAccents = [
        { id: "#heroAccent1", scale: 1.3, duration: 4 },
        { id: "#heroAccent2", scale: 1.4, duration: 4.5 },
        { id: "#heroAccent3", scale: 1.2, duration: 3.5 },
      ];

      heroAccents.forEach((accent) => {
        const el = document.getElementById(accent.id.replace("#", ""));
        if (el) {
          gsap.to(el, {
            scale: accent.scale,
            opacity: 0.5,
            duration: accent.duration,
            yoyo: true,
            repeat: -1,
            ease: "power1.inOut",
          });
        }
      });

      const heroGrid = document.getElementById("heroGrid");
      if (heroGrid) {
        gsap.to(heroGrid, {
          opacity: 0.1,
          duration: 6,
          yoyo: true,
          repeat: -1,
          ease: "power1.inOut",
        });
      }
    };

    heroBackgroundAnimations();

    const progOrbsAnimation = () => {
      const progOrb1 = document.getElementById("progOrb1");
      const progOrb2 = document.getElementById("progOrb2");
      const progOrb3 = document.getElementById("progOrb3");

      if (progOrb1) {
        gsap.to(progOrb1, {
          x: 30,
          y: -20,
          duration: 8,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
        gsap.to(progOrb1, {
          scale: 1.1,
          duration: 6,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      if (progOrb2) {
        gsap.to(progOrb2, {
          x: -40,
          y: 30,
          duration: 10,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
        gsap.to(progOrb2, {
          scale: 0.9,
          duration: 7,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      if (progOrb3) {
        gsap.to(progOrb3, {
          x: 25,
          y: -35,
          duration: 9,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
        gsap.to(progOrb3, {
          scale: 1.05,
          duration: 5,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }
    };

    const progLinesAnimation = () => {
      const progLine1 = document.getElementById("progLine1");
      const progLine2 = document.getElementById("progLine2");
      const progLine3 = document.getElementById("progLine3");

      if (progLine1) {
        gsap.to(progLine1, {
          attr: { d: "M 0,100 Q 350,150 650,120 T 1200,100" },
          duration: 4,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      if (progLine2) {
        gsap.to(progLine2, {
          attr: { d: "M 0,300 Q 450,350 850,320 T 1200,300" },
          duration: 5,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      if (progLine3) {
        gsap.to(progLine3, {
          attr: { d: "M 0,500 Q 400,550 750,520 T 1200,500" },
          duration: 6,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }
    };

    const progParticlesAnimation = () => {
      const particles = document.querySelectorAll(".prog-particle");
      particles.forEach((particle, idx) => {
        const duration = 3 + Math.random() * 4;
        const delay = Math.random() * 2;
        const xMove = (Math.random() - 0.5) * 50;
        const yMove = (Math.random() - 0.5) * 50;

        gsap.to(particle, {
          x: xMove,
          y: yMove,
          duration: duration,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: delay,
        });

        gsap.to(particle, {
          opacity: 0.3 + Math.random() * 0.4,
          duration: 2 + Math.random() * 2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: delay,
        });
      });
    };

    progOrbsAnimation();
    progLinesAnimation();
    progParticlesAnimation();

    const sparkle1 = document.getElementById("sparkle1");
    if (sparkle1) {
      gsap.to(sparkle1, {
        opacity: 1,
        scale: 1.2,
        duration: 1,
        yoyo: true,
        repeat: -1,
        ease: "power2.inOut",
      });
      gsap.to(sparkle1, {
        rotation: 180,
        duration: 3,
        repeat: -1,
        ease: "none",
      });
    }

    const progUnderline = document.getElementById("programacaoUnderline");
    if (progUnderline) {
      gsap.fromTo(
        progUnderline,
        {
          strokeDasharray: 200,
          strokeDashoffset: 200,
        },
        {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#programacaoTitle",
            start: "top 80%",
          },
        }
      );
    }

    if (window.ScrollTrigger) {
      const progSection = document.getElementById("programacao");

      if (progSection) {
        gsap.to("#programacaoBgGlow", {
          yPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: "#programacao",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });

        gsap.to("#progOrb1", {
          yPercent: -20,
          xPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: "#programacao",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });

        gsap.to("#progOrb2", {
          yPercent: -30,
          xPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: "#programacao",
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });

        gsap.to("#progOrb3", {
          yPercent: -25,
          xPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: "#programacao",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.8,
          },
        });

        gsap.to("#progLines", {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: "#programacao",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      const timelineCards = document.querySelectorAll(
        "#programacao .relative.rounded-xl"
      );

      gsap.from(timelineCards, {
        scrollTrigger: {
          trigger: "#programacao",
          start: "top 80%",
          toggleActions: "play none none none",
        },
        y: 30,
        autoAlpha: 0,
        scale: 0.98,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        clearProps: "all",
      });
    }

    const revealItems = document.querySelectorAll("[data-reveal]");
    revealItems.forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        y: 20,
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.out",
        clearProps: "all",
      });
    });

    const titleItems = document.querySelectorAll("[data-reveal-title]");
    titleItems.forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        y: 30,
        autoAlpha: 0,
        duration: 0.7,
        ease: "power2.out",
        clearProps: "all",
      });
    });

    const inscricoesAnimations = () => {
      const inscOrb1 = document.getElementById("inscOrb1");
      const inscOrb2 = document.getElementById("inscOrb2");
      const inscOrb3 = document.getElementById("inscOrb3");

      if (inscOrb1) {
        gsap.to(inscOrb1, {
          x: -40,
          y: 30,
          duration: 7,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
        gsap.to(inscOrb1, {
          scale: 1.15,
          duration: 5,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      if (inscOrb2) {
        gsap.to(inscOrb2, {
          x: 35,
          y: -25,
          duration: 9,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
        gsap.to(inscOrb2, {
          scale: 0.92,
          duration: 6,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      if (inscOrb3) {
        gsap.to(inscOrb3, {
          x: 20,
          y: -40,
          duration: 8,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
        gsap.to(inscOrb3, {
          scale: 1.08,
          duration: 7,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      const inscWave1 = document.getElementById("inscWave1");
      const inscWave2 = document.getElementById("inscWave2");
      const inscWave3 = document.getElementById("inscWave3");

      if (inscWave1) {
        gsap.to(inscWave1, {
          attr: { d: "M 0,150 Q 350,120 650,160 T 1200,150" },
          duration: 5,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      if (inscWave2) {
        gsap.to(inscWave2, {
          attr: { d: "M 0,300 Q 350,330 650,290 T 1200,300" },
          duration: 6,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      if (inscWave3) {
        gsap.to(inscWave3, {
          attr: { d: "M 0,450 Q 350,420 650,460 T 1200,450" },
          duration: 4,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      const inscRect1 = document.getElementById("inscRect1");
      const inscCircle1 = document.getElementById("inscCircle1");
      const inscTriangle1 = document.getElementById("inscTriangle1");
      const inscRect2 = document.getElementById("inscRect2");

      if (inscRect1) {
        gsap.to(inscRect1, {
          rotation: 360,
          transformOrigin: "center",
          duration: 20,
          repeat: -1,
          ease: "none",
        });
        gsap.to(inscRect1, {
          y: -15,
          duration: 3,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      if (inscCircle1) {
        gsap.to(inscCircle1, {
          scale: 1.3,
          transformOrigin: "center",
          duration: 4,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      if (inscTriangle1) {
        gsap.to(inscTriangle1, {
          rotation: -360,
          transformOrigin: "center",
          duration: 15,
          repeat: -1,
          ease: "none",
        });
      }

      if (inscRect2) {
        gsap.to(inscRect2, {
          rotation: 405,
          transformOrigin: "center",
          duration: 12,
          repeat: -1,
          ease: "none",
        });
        gsap.to(inscRect2, {
          scale: 1.2,
          transformOrigin: "center",
          duration: 3.5,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      const inscParticles = document.querySelectorAll(".insc-particle");
      inscParticles.forEach((particle, idx) => {
        const duration = 2.5 + Math.random() * 3;
        const delay = Math.random() * 2;
        const xMove = (Math.random() - 0.5) * 40;
        const yMove = (Math.random() - 0.5) * 40;

        gsap.to(particle, {
          x: xMove,
          y: yMove,
          duration: duration,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: delay,
        });

        gsap.to(particle, {
          opacity: 0.2 + Math.random() * 0.5,
          duration: 1.5 + Math.random() * 2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: delay,
        });

        gsap.to(particle, {
          scale: 0.8 + Math.random() * 0.4,
          duration: 2 + Math.random() * 1.5,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: delay,
        });
      });

      const inscDots = document.querySelectorAll("#inscDots circle");
      inscDots.forEach((dot, idx) => {
        gsap.to(dot, {
          opacity: 0.1 + Math.random() * 0.3,
          duration: 1 + Math.random() * 2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: idx * 0.2,
        });
      });

      const inscConnector = document.getElementById("inscConnector");
      if (inscConnector) {
        gsap.to(inscConnector, {
          strokeDashoffset: -100,
          duration: 8,
          repeat: -1,
          ease: "none",
        });
      }
    };

    inscricoesAnimations();

    if (window.ScrollTrigger) {
      const inscSection = document.getElementById("inscricoes");

      if (inscSection) {
        gsap.to("#inscricoesBgGlow", {
          yPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: "#inscricoes",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });

        gsap.to("#inscOrb1", {
          yPercent: -15,
          xPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: "#inscricoes",
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });

        gsap.to("#inscOrb2", {
          yPercent: -25,
          xPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: "#inscricoes",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.8,
          },
        });

        gsap.to("#inscOrb3", {
          yPercent: -18,
          xPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: "#inscricoes",
            start: "top bottom",
            end: "bottom top",
            scrub: 2.2,
          },
        });

        gsap.to("#inscWaves", {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: "#inscricoes",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });

        gsap.to("#inscGeometry", {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: "#inscricoes",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }
    }
  }

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
    } catch (err) {}
  }

  renderTimeline();
});
