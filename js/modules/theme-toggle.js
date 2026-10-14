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

  init: function () {
    var self = this;

    if (localStorage.getItem("moment") != null) {
      if (localStorage.getItem("moment") == "dark") {
        $("body").addClass("dark");
        $("#logo-topo-home").attr("src", "img/logo_worktech.png");
        $("#logo_footer").attr("src", "img/ifsp_white.png");
        self.apagaLampada();
      } else {
        $("body").removeClass("dark");
        $("#logo-topo-home").attr("src", "img/logo_worktech_white.png");
        $("#logo_footer").attr("src", "img/ifsp.png");
        self.acendeLampada();
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
      } else {
        // Tema claro: usa logo_worktech_white.png
        $("#logo-topo-home").attr("src", "img/logo_worktech_white.png");
        $("#logo_footer").attr("src", "img/ifsp.png");
        localStorage.setItem("moment", "light");
        self.acendeLampada();
      }
    });
  },
};
