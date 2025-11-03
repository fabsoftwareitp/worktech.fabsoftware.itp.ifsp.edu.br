// HTML Include functionality
function includeHTML(callback) {
  var z, i, elmnt, file, xhttp;
  var pendingIncludes = 0;
  var completed = 0;

  z = document.getElementsByTagName("*");

  for (i = 0; i < z.length; i++) {
    if (z[i].getAttribute("w3-include-html")) {
      pendingIncludes++;
    }
  }

  if (pendingIncludes === 0 && callback) {
    callback();
    return;
  }

  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          var element = this.element;
          if (this.status == 200) {
            element.innerHTML = this.responseText;
            var elems = document.querySelectorAll(".sidenav");
            var instances = M.Sidenav.init(elems);
          }
          if (this.status == 404) {
            element.innerHTML = "Page not found.";
          }
          element.removeAttribute("w3-include-html");
          completed++;

          if (completed === pendingIncludes && callback) {
            callback();
          } else {
            includeHTML(callback);
          }
        }
      };
      xhttp.element = elmnt;
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
  }
}

window.WorktechApp = window.WorktechApp || {};
window.WorktechApp.includeHTML = includeHTML;
