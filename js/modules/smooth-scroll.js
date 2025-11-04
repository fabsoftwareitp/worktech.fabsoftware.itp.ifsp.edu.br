// Smooth scrolling functionality
window.WorktechApp = window.WorktechApp || {};

window.WorktechApp.SmoothScroll = {
  init: function () {
    var altura = $("body").height();

    // Check scroll position for "up" button
    if ($(window).scrollTop() < altura / 5) {
      $("#up").css({
        opacity: "0",
      });
    } else {
      $("#up").css({
        opacity: "1",
      });
    }

    // Smooth scroll to anchor links
    $("a").on("click", function (e) {
      var link = $(this).attr("href");
      if (link && link[0] == "#" && link.length > 1) {
        var target = $(link);
        if (target.length) {
          e.preventDefault();
          
          // Se for um botão de troca de dia da programação, scroll até o título "Programação"
          if ($(this).hasClass("timeline-activation")) {
            var programacaoSection = $("#programacao");
            if (programacaoSection.length) {
              var posLink = programacaoSection.offset().top - 100; // 100px de margem do topo
              $("html, body").animate({ scrollTop: posLink }, 800, "swing");
            }
          } else {
            // Para outros links, comportamento normal
            var posLink = target.offset().top;
            $("html, body").animate({ scrollTop: posLink }, 800, "swing");
          }
        }
      }
    });
  },
};

