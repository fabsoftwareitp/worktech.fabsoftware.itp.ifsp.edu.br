$(function() {
	$(document).ready(function(){
		$('.tooltipped').tooltip();
	});

	function acendeLampada(){
		$("#lamp a").removeClass("black");
		$("#lamp a").addClass("white");
		$("#lamp a i").removeClass("white-text");
		$("#lamp a i").addClass("orange-text");
		$("#lamp").css({
			"transform":"rotate(180deg)"
		});
	}
	function apagaLampada(){
		$("#lamp a").removeClass("white");
		$("#lamp a").addClass("black");
		$("#lamp a i").removeClass("orange-text");
		$("#lamp a i").addClass("white-text");
		$("#lamp").css({
			"transform":"rotate(+360deg)"
		});
	}
	if (localStorage.getItem("moment") != null) {
		if (localStorage.getItem("moment") == "dark") {
			$("body").addClass("dark");	
			$("#logo-topo-home").attr("src", "img/logo_worktech_remake_white.png");
			$("#logo_footer").attr("src", "img/ifsp_white.png");
			apagaLampada();
		}else{
			$("body").removeClass("dark");	
			$("#logo-topo-home").attr("src", "img/logo_worktech_remake.png");
			$("#logo_footer").attr("src", "img/ifsp.png");
			acendeLampada();
		}
	}

	$("#lamp").on("click", function(){
		$("body").toggleClass("dark");
		var logo_atual = $("#logo-topo-home").attr("src");
		if (logo_atual == "img/logo_worktech_remake.png") {
			$("#logo-topo-home").attr("src", "img/logo_worktech_remake_white.png");
			$("#logo_footer").attr("src", "img/ifsp_white.png");
			localStorage.setItem("moment", "dark");
			acendeLampada();
		}else{
			$("#logo-topo-home").attr("src", "img/logo_worktech_remake.png");
			$("#logo_footer").attr("src", "img/ifsp.png");
			localStorage.setItem("moment", "light");
			apagaLampada();
		}

	});

	$.getJSON( "./jsons/workshops.json", function(data, index) {			
		$.each(data, function(index){
			var date = index;
			var all = $("<div>");
			$.each(this[0], function(index) {	
				var horario = index;
				var iconDescription = "<i class='material-icons' aria-hidden='true' style='transform:translate(0,7px)'>person</i>";
				var block = $("<div>");
				var content = $("<div>");
				$(all).attr('id', date);
				$(all).css("display", "none");
				$(block).addClass("timeline-block");	
				$(content).addClass("timeline-content");
				$(content).append("<p>" + horario + "</p>");
	
				$.each(this, function(index){				
					$(content).append("<h3 class='md-text'>" + this.titulo + "</h3>");
					if (this.palestrante != "") 
						$(content).append("<p>" + this.palestrante + "</p>");
					if (this.descricao != "")
						$(content).append("<p class='descricao'>" + iconDescription + " " + this.descricao + "</p>");
					
					// Adicionando o link do currículo do palestrante, caso exista
					if (this.Curriculo) {
						var linkCurriculo = $("<a>").attr("href", this.Curriculo).text("Currículo").addClass("curriculo-link");
						$(content).append(linkCurriculo);
					}
	
					$(block).append(content);
					$(all).append(block);			
				});
	
			});
			$(".timeline").append(all);
			// $(".timeline .timeline-block:first-child").prepend("<h1>"+index+"</h1>");
			$($("a.timeline-activation.active").attr("href")).show("fast");
		});
	});
	
	$(window).scroll( function(){    
		$('.timeline-block').each( function(i){            
			var bottom_of_object = $(this).offset().top;
			var bottom_of_window = $(window).scrollTop() + $(window).height();           
			if( bottom_of_window > (bottom_of_object+300) ){                
				$(this).addClass("current");
			}else{
				$(this).removeClass("current");
			}     
		});        
	});   
	var altura = $("body").height();

	if($(window).scrollTop() < altura/5){
		$("#up").css({
			"opacity":"0"
		});
	}else{
		$("#up").css({
			"opacity":"1"
		});
	}

	$(document).ready(function() {
		let links = document.querySelectorAll("a")
	
		links.forEach(link => {
			link.addEventListener('click', function(event) {
				event.preventDefault();
	
				let target = $(this.hash);
	
				if (target.length) {
					let position = target.offset().top;
	
					$('html, body').animate({
						scrollTop: position
					}, 700);
				}
			});
		});
	});

	$(document).ready(function(){
		$(".timeline-activation:first").addClass("active");
		$($(".timeline-activation:first").attr("href")).show("fast");
	});
});

function navbarToggle() {
    let navbarMenu = document.querySelector('.nav2');

    if (navbarMenu.classList.contains('active')) {
        navbarMenu.classList.remove('active');
        setTimeout(() => {
            navbarMenu.classList.add('inactive');
        }, 300);
    } else {
        navbarMenu.classList.remove('inactive'); 
        navbarMenu.classList.add('active'); 
    }
}

document.addEventListener('click', function(event) {
    let navbarMenu = document.querySelector('.nav2');
    let navButton = document.querySelector('.navButton');

    if (!navbarMenu.contains(event.target) && !navButton.contains(event.target)) {
        if (navbarMenu.classList.contains('active')) {
            navbarMenu.classList.remove('active');
            setTimeout(() => {
                navbarMenu.classList.add('inactive');
            }, 300);
        }
    }
});
