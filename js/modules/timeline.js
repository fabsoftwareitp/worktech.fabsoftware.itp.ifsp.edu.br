// Timeline/Schedule functionality
window.WorktechApp = window.WorktechApp || {};

window.WorktechApp.Timeline = {
  loadWorkshops: function () {
    $.getJSON("./jsons/workshops.json", function (data, index) {
      $.each(data, function (index) {
        var date = index;
        var all = $("<div>");

        $.each(this, function (periodName, periodTimes) {
          $.each(periodTimes, function (horario, workshops) {
            var iconDescription =
              "<i class='material-icons' aria-hidden='true' style='transform:translate(0,7px)'>person</i>";
            
            $(all).attr("id", date);
            $(all).css("display", "none");

            $.each(workshops, function (index) {
              // Criar um bloco separado para cada palestra
              var block = $("<div>");
              var content = $("<div>");
              var card = $("<div>"); // Card para envolver o conteúdo da palestra
              
              $(block).addClass("timeline-block");
              $(content).addClass("timeline-content");
              $(card).addClass("workshop-card");
              
              // Horário (fora do card)
              $(content).append("<p class='workshop-time'>" + horario + "</p>");
              
              // Só exibe o título se existir e não for vazio
              if (this.titulo && this.titulo.trim() !== "") {
                $(card).append("<h3 class='md-text'>" + this.titulo + "</h3>");
              }
              
              // Só exibe o palestrante se existir e não for vazio
              if (this.palestrante && this.palestrante.trim() !== "") {
                $(card).append("<p>" + this.palestrante + "</p>");
              }
              
              // Só exibe a descrição se existir e não for vazio
              if (this.descricao && this.descricao.trim() !== "") {
                $(card).append(
                  "<p class='descricao'>" +
                    iconDescription +
                    " " +
                    this.descricao +
                    "</p>"
                );
              }

              // Criar wrapper para os botões
              var hasButtons = (this.Curriculo && this.Curriculo.trim() !== "") || 
                               (this.inscricao && this.inscricao.trim() !== "");
              
              if (hasButtons) {
                var buttonsWrapper = $("<div>").addClass("buttons-wrapper");
                
                // Só exibe o link do currículo se existir e não for vazio
                if (this.Curriculo && this.Curriculo.trim() !== "") {
                  var linkCurriculo = $("<a>")
                    .attr("href", this.Curriculo)
                    .attr("target", "_blank")
                    .text("Currículo")
                    .addClass("curriculo-link");
                  $(buttonsWrapper).append(linkCurriculo);
                }

                // Só exibe o link de inscrição se existir e não for vazio
                if (this.inscricao && this.inscricao.trim() !== "") {
                  var linkInscricao = $("<a>")
                    .attr("href", this.inscricao)
                    .attr("target", "_blank")
                    .text("Fazer Inscrição")
                    .addClass("inscricao-link");
                  $(buttonsWrapper).append(linkInscricao);
                }
                
                $(card).append(buttonsWrapper);
              }

              $(content).append(card);
              $(block).append(content);
              $(all).append(block);
            });
          });
        });
        $(".timeline").append(all);
        $($("a.timeline-activation.active").attr("href")).show("fast");
      });
    });
  },

  initScrollAnimation: function () {
    $(window).scroll(function () {
      $(".timeline-block").each(function (i) {
        var bottom_of_object = $(this).offset().top;
        var bottom_of_window = $(window).scrollTop() + $(window).height();

        if (bottom_of_window > bottom_of_object + 300) {
          $(this).addClass("current");
        } else {
          $(this).removeClass("current");
        }
      });
    });
  },

  init: function () {
    this.loadWorkshops();
    this.initScrollAnimation();

    $(document).ready(function () {
      var isDark = $("body").hasClass("dark");
      var $firstBtn = $(".timeline-activation:first");
      
      $firstBtn.addClass("active");
      
      if (isDark) {
        $firstBtn.css("background", "#ffffff");
        $firstBtn.find("i, .tab-label, .tab-date").css("color", "#000");
      } else {
        $firstBtn.css("background", "#000");
        $firstBtn.find("i, .tab-label, .tab-date").css("color", "#fff");
      }
      
      $($firstBtn.attr("href")).show("fast");
    });

  },
};
