// Timeline/Schedule functionality
window.WorktechApp = window.WorktechApp || {};

window.WorktechApp.Timeline = {
  loadWorkshops: function () {
    $.getJSON("./jsons/workshops.json", function (data, index) {
      $.each(data, function (index) {
        var date = index;
        var all = $("<div>");

        var periodIcons = { "Dia todo": "event", "Manhã": "wb_sunny", "Noite": "brightness_3" };

        $.each(this, function (periodName, periodTimes) {
          // Marcador de turno sobre a linha da timeline
          $(all).append(
            "<p class='turno-label'><span><i class='material-icons' aria-hidden='true'>" +
              (periodIcons[periodName] || "schedule") +
              "</i>" +
              periodName +
              "</span></p>"
          );

          $.each(periodTimes, function (horario, workshops) {
            var iconLocal =
              "<i class='material-icons' aria-hidden='true' style='transform:translate(0,7px)'>place</i>";
            
            $(all).attr({
              id: date,
              role: "tabpanel",
              "aria-labelledby": "tab-" + date,
            });
            $(all).css("display", "none");

            $.each(workshops, function (index) {
              // Criar um bloco separado para cada palestra
              var block = $("<div>");
              var content = $("<div>");
              var card = $("<div>"); // Card para envolver o conteúdo da palestra
              
              $(block).addClass("timeline-block");
              $(content).addClass("timeline-content");
              $(card).addClass("workshop-card");
              
              // Horário (fora do card); atividades sem horário fixo usam chave vazia
              if (horario !== "") {
                $(content).append("<p class='workshop-time'>" + horario + "</p>");
              }
              
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
                $(card).append("<p class='descricao'>" + this.descricao + "</p>");
              }

              // Local e duração na mesma linha, quando existirem
              var detalhes = [this.local, this.duracao].filter(function (item) {
                return item && item.trim() !== "";
              });
              if (detalhes.length) {
                $(card).append(
                  "<p class='descricao'>" + iconLocal + " " + detalhes.join(" · ") + "</p>"
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

    // Primeiro dia ativo por padrao; o conteudo e exibido em loadWorkshops
    // assim que o JSON termina de carregar
    $(".timeline-activation:first").addClass("active");
  },
};
