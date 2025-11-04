window.WorktechApp = window.WorktechApp || {};

window.WorktechApp.ThemeToggle = {
  acendeLampada: function () {
    $("#lamp a").removeClass("black");
    $("#lamp a").addClass("white");
    $("#lamp a i").removeClass("white-text");
    $("#lamp a i").addClass("orange-text");
    $("#lamp").css({
      transform: "rotate(180deg)",
    });
  },

  apagaLampada: function () {
    $("#lamp a").removeClass("white");
    $("#lamp a").addClass("black");
    $("#lamp a i").removeClass("orange-text");
    $("#lamp a i").addClass("white-text");
    $("#lamp").css({
      transform: "rotate(+360deg)",
    });
  },

  updateButtonColors: function (isDark) {
    $(".timeline-activation").each(function () {
      if (!$(this).hasClass("active")) {
        if (isDark) {
          $(this).css("background", "#1a1a1a");
          $(this).css("border-color", "#ffffff");
          $(this).find("i, .tab-label, .tab-date").css("color", "#ffffff");
        } else {
          $(this).css("background", "#f5f5f5");
          $(this).css("border-color", "#000");
          $(this).find("i, .tab-label, .tab-date").css("color", "#000");
        }
      }
    });
  },

  init: function () {
    var self = this;

    if (localStorage.getItem("moment") != null) {
      if (localStorage.getItem("moment") == "dark") {
        $("body").addClass("dark");
        $("#logo-topo-home").attr("src", "img/logo_worktech.png");
        $("#logo_footer").attr("src", "img/ifsp_white.png");
        self.apagaLampada();
        setTimeout(() => self.updateButtonColors(true), 1000);
      } else {
        $("body").removeClass("dark");
        $("#logo-topo-home").attr("src", "img/logo_worktech_white.png");
        $("#logo_footer").attr("src", "img/ifsp.png");
        self.acendeLampada();
        setTimeout(() => self.updateButtonColors(false), 1000);
      }
    }

    $("#lamp").on("click", function () {
      $("body").toggleClass("dark");
      var isDark = $("body").hasClass("dark");

      if (isDark) {
        // Tema escuro: usa logo_worktech.png
        $("#logo-topo-home").attr("src", "img/logo_worktech.png");
        $("#logo_footer").attr("src", "img/ifsp_white.png");
        localStorage.setItem("moment", "dark");
        self.apagaLampada();
        self.updateButtonColors(true);
      } else {
        // Tema claro: usa logo_worktech_white.png
        $("#logo-topo-home").attr("src", "img/logo_worktech_white.png");
        $("#logo_footer").attr("src", "img/ifsp.png");
        localStorage.setItem("moment", "light");
        self.acendeLampada();
        self.updateButtonColors(false);
      }
    });
  },
};
