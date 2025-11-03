/**
 * Worktech Main Application
 * Main entry point that initializes all modules
 */

$(function () {
  // Initialize HTML includes first, then initialize everything else
  if (window.WorktechApp && window.WorktechApp.includeHTML) {
    window.WorktechApp.includeHTML(function() {
      // Called after all HTML includes are loaded
      
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

      // Initialize smooth scroll
      if (window.WorktechApp && window.WorktechApp.SmoothScroll) {
        window.WorktechApp.SmoothScroll.init();
      }

      // Initialize GSAP animations
      if (window.WorktechApp && window.WorktechApp.GSAPAnimations) {
        window.WorktechApp.GSAPAnimations.init();
      }

      // Initialize Animated Triangles
      if (window.WorktechApp && window.WorktechApp.AnimatedTriangles) {
        window.WorktechApp.AnimatedTriangles.init();
      }
    });
  }
});
