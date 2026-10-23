/**
 * Worktech Main Application
 * Main entry point that initializes all modules
 */

$(function () {
  // Initialize HTML includes first, then initialize everything else
  if (window.WorktechApp && window.WorktechApp.includeHTML) {
    window.WorktechApp.includeHTML(function() {
      // Called after all HTML includes are loaded
      
      // O menu e incluido dentro do .header, cujo "z-index: 1" o prendia
      // atras do conteudo e do overlay; no <body> ele fica acima de tudo
      $('.sidenav').appendTo('body');

      // Initialize sidenav (Materialize)
      $('.sidenav').sidenav({
        edge: 'left',
        draggable: true
      });

      // Close sidenav when clicking on anchor links
      $('.sidenav a[href^="#"]').on('click', function() {
        var instance = M.Sidenav.getInstance($('.sidenav'));
        if (instance) {
          instance.close();
        }
      });

      // Scroll to top functionality - stop event propagation
      $('.scroll-to-top').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $('html, body').animate({
          scrollTop: 0
        }, 800);
        
        // Close sidenav if open
        var instance = M.Sidenav.getInstance($('.sidenav'));
        if (instance) {
          instance.close();
        }
      });
      
      // Initialize tooltips (Materialize)
      $(".tooltipped").tooltip();

      // Initialize theme toggle
      if (window.WorktechApp && window.WorktechApp.ThemeToggle) {
        window.WorktechApp.ThemeToggle.init();
      }

      // Initialize timeline (AFTER HTML components are loaded)
      if (window.WorktechApp && window.WorktechApp.Timeline) {
        window.WorktechApp.Timeline.init();
      }

      // Initialize day carousel (depois da timeline, que marca o dia ativo)
      if (window.WorktechApp && window.WorktechApp.DayCarousel) {
        window.WorktechApp.DayCarousel.init();
      }

      // Initialize smooth scroll
      if (window.WorktechApp && window.WorktechApp.SmoothScroll) {
        window.WorktechApp.SmoothScroll.init();
      }

      // Initialize GSAP animations
      if (window.WorktechApp && window.WorktechApp.GSAPAnimations) {
        window.WorktechApp.GSAPAnimations.init();
      }

      // Initialize header circuit traces
      if (window.WorktechApp && window.WorktechApp.CircuitBoard) {
        window.WorktechApp.CircuitBoard.init();
      }

      // Initialize Animated Triangles
      if (window.WorktechApp && window.WorktechApp.AnimatedTriangles) {
        window.WorktechApp.AnimatedTriangles.init();
      }

      // Initialize Programacao tiled background
      if (window.WorktechApp && window.WorktechApp.TiledBackground) {
        window.WorktechApp.TiledBackground.init();
      }
    });
  }
});
