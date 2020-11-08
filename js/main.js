$(function(){

	function includeHTML() {
		var z, i, elmnt, file, xhttp;
		/*loop through a collection of all HTML elements:*/
		z = document.getElementsByTagName("*");
		for (i = 0; i < z.length; i++) {
			elmnt = z[i];
			/*search for elements with a certain atrribute:*/
			file = elmnt.getAttribute("w3-include-html");
			if (file) {
				/*make an HTTP request using the attribute value as the file name:*/
				xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState == 4) {
						if (this.status == 200) {elmnt.innerHTML = this.responseText;}
						if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
						/*remove the attribute, and call this function once more:*/
						elmnt.removeAttribute("w3-include-html");
						includeHTML();
					}
				} 
				xhttp.open("GET", file, true);
				xhttp.send();
				/*exit the function:*/
				return;
			}
		}
	}
	includeHTML();
	$(document).ready(function(){
		$('.tooltipped').tooltip();
		$('.sidenav').sidenav();
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
				var iconGraduation = "<i class='material-icons ' aria-hidden='true'>person</i>";
				var iconMap = "<i class='material-icons' aria-hidden='true' style='transform:translate(0,7px)'>location_on</i>";
				var block = $("<div>");
				var content = $("<div>");
				$(all).attr('id',date);
				$(all).css("display","none");
				$(block).addClass("timeline-block");	
				$(content).addClass("timeline-content");
				$(content).append("<p>"+horario+"</p>");

				$.each(this, function(index){				
					$(content).append("<h3 class='md-text'>"+this.titulo+"</h3>");
					if (this.palestrante !="") 
					//esse tem o link-> $(content).append("<p><a class='speaker-link' href='#"+replaceAll(this.palestrante.replace( /\s/g, '' ).toLowerCase())+"'>"+ this.palestrante+"</a></p>");
				$(content).append("<p>" + this.palestrante+ "</p>");
				if (this.local != "")
					$(content).append("<p class='local'>"+iconMap + " " + this.local+"</p>");
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

	$("a").on("click", function(){
		var link = $(this).attr("href");
		if(link[0] == "#"){
			var posLink = $(link).offset().top;

			$("html, body").animate({scrollTop:700},'swing');
		};
	});

	$(".timeline-activation").on("click",function(){
		$.each($(".timeline-activation"),function(){
			var activate = $(this).attr("href");
			$(activate).hide();
		});
		var exib = $(this).attr("href");

		$(".timeline-activation").removeClass("active");	
		$(this).addClass("active");
		$(exib).show("fast");
		return false;
	});

});