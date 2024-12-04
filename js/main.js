document.addEventListener('DOMContentLoaded', function() {
    function acendeLampada() {
        let lampLink = document.querySelector("#lamp a");
        lampLink.classList.remove("black");
        lampLink.classList.add("white");
        let lampIcon = lampLink.querySelector("i");
        lampIcon.classList.remove("white-text");
        lampIcon.classList.add("orange-text");
        document.getElementById("lamp").style.transform = "rotate(180deg)";
    }

    function apagaLampada() {
        let lampLink = document.querySelector("#lamp a");
        lampLink.classList.remove("white");
        lampLink.classList.add("black");
        let lampIcon = lampLink.querySelector("i");
        lampIcon.classList.remove("orange-text");
        lampIcon.classList.add("white-text");
        document.getElementById("lamp").style.transform = "rotate(360deg)";
    }

    let moment = localStorage.getItem("moment");
    if (moment) {
        if (moment === "dark") {
            document.body.classList.add("dark");
            document.getElementById("logo-topo-home").src = "img/logo_worktech_remake_white.png";
            document.getElementById("logo_footer").src = "img/ifsp_white.png";
            apagaLampada();
        } else {
            document.body.classList.remove("dark");
            document.getElementById("logo-topo-home").src = "img/logo_worktech_remake.png";
            document.getElementById("logo_footer").src = "img/ifsp.png";
            acendeLampada();
        }
    }

    document.getElementById("lamp").addEventListener("click", function() {
        document.body.classList.toggle("dark");
        let logoAtual = document.getElementById("logo-topo-home").src;
        if (logoAtual.includes("logo_worktech_remake.png")) {
            document.getElementById("logo-topo-home").src = "img/logo_worktech_remake_white.png";
            document.getElementById("logo_footer").src = "img/ifsp_white.png";
            localStorage.setItem("moment", "dark");
            acendeLampada();
        } else {
            document.getElementById("logo-topo-home").src = "img/logo_worktech_remake.png";
            document.getElementById("logo_footer").src = "img/ifsp.png";
            localStorage.setItem("moment", "light");
            apagaLampada();
        }
    });

    fetch("./jsons/workshops.json")
        .then(response => response.json())
        .then(data => {
            Object.entries(data).forEach(([date, workshops]) => {
                let all = document.createElement("div");
                all.id = date;
                all.style.display = "none";

                workshops.forEach(workshop => {
                    let block = document.createElement("div");
                    let content = document.createElement("div");
                    block.classList.add("timeline-block");
                    content.classList.add("timeline-content");
                    content.innerHTML = `<p>${workshop.horario}</p>
                                         <h3 class='md-text'>${workshop.titulo}</h3>
                                         ${workshop.palestrante ? `<p>${workshop.palestrante}</p>` : ''}
                                         ${workshop.descricao ? `<p class='descricao'><i class='material-icons' aria-hidden='true' style='transform:translate(0,7px)'>person</i> ${workshop.descricao}</p>` : ''}
                                         ${workshop.Curriculo ? `<a href='${workshop.Curriculo}' class='curriculo-link'>Currículo</a>` : ''}`;

                    block.appendChild(content);
                    all.appendChild(block);
                });

                document.querySelector(".timeline").appendChild(all);
                document.querySelector(document.querySelector("a.timeline-activation.active").getAttribute("href")).style.display = "block";
            });
        });

    window.addEventListener("scroll", function() {
        document.querySelectorAll('.timeline-block').forEach(block => {
            let bottomOfObject = block.getBoundingClientRect().top + window.scrollY;
            let bottomOfWindow = window.scrollY + window.innerHeight;
            if (bottomOfWindow > (bottomOfObject + 300)) {
                block.classList.add("current");
            } else {
                block.classList.remove("current");
            }
        });
    });

    let altura = document.body.scrollHeight;
    document.getElementById("up").style.opacity = (window.scrollY < altura / 5) ? "0" : "1";

    document.querySelectorAll("a").forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            let target = document.querySelector(this.hash);
            if (target) {
                let position = target.offsetTop;
                window.scrollTo({
                    top: position,
                    behavior: 'smooth'
                });
            }
        });
    });

    document.querySelector(".timeline-activation:first-child").classList.add("active");
    document.querySelector(document.querySelector(".timeline-activation:first-child").getAttribute("href")).style.display = "block";
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
