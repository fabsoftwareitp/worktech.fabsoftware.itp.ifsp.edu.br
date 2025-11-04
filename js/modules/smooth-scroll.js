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
    $("a").on("click", function () {
      var link = $(this).attr("href");
      if (link && link[0] == "#") {
        var posLink = $(link).offset().top;
        $("html, body").animate({ scrollTop: 700 }, "swing");
      }
    });
  },
};

