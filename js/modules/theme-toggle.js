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

  // Imagens de cada tema. O "?v=" forca o navegador a baixar de novo quando
  // uma imagem e trocada mantendo o nome: ao alterar um arquivo, mude a versao
  // (e a do mesmo arquivo em header.html / navbar.html).
  ASSET_VERSION: "2026-3",
  IMAGES: {
    dark: { logo: "img/logo_worktech.png", footer: "img/ifsp_white.png" },
    light: { logo: "img/logo_worktech_white.png", footer: "img/ifsp.png" },
  },

  applyTheme: function (isDark) {
    var images = isDark ? this.IMAGES.dark : this.IMAGES.light;
    var version = "?v=" + this.ASSET_VERSION;

    $("body").toggleClass("dark", isDark);
    $("#logo-topo-home").attr("src", images.logo + version);
    $("#logo_footer").attr("src", images.footer + version);

    if (isDark) {
      this.apagaLampada();
    } else {
      this.acendeLampada();
    }
  },

  init: function () {
    var self = this;
    var saved = localStorage.getItem("moment");

    // Sem preferencia salva, mantem o tema padrao do <body> (escuro)
    if (saved != null) {
      self.applyTheme(saved == "dark");
    }

    $("#lamp").on("click", function () {
      var isDark = !$("body").hasClass("dark");
      self.applyTheme(isDark);
      localStorage.setItem("moment", isDark ? "dark" : "light");
    });
  },
};
