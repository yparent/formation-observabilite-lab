// Codespaces : « No data » sur les panels d'un dashboard dont le titre contient un accent.
//
// Grafana 13 envoie le titre du dashboard et celui du panel dans deux en-têtes HTTP
// (X-Dashboard-Title, X-Panel-Title) à chaque requête /api/ds/query. Le proxy de GitHub
// Codespaces (https://<codespace>-3000.app.github.dev) rejette en 400, sans message,
// toute requête dont un en-tête contient un caractère non-ASCII : « Signaux dorés »,
// « Requêtes en cours »... => 400 => panel vide. En local, rien de tout ça.
//
// Ce script est chargé par la page de Grafana avant l'application (voir entrypoint.sh) :
// il retire les accents de ces deux en-têtes, et seulement d'eux. Les titres affichés
// ne changent pas. Correctif amont : grafana/grafana#130454.
(function () {
  var NAMES = ['x-dashboard-title', 'x-panel-title'];

  function ascii(v) {
    return String(v).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\x20-\x7e]/g, '?');
  }

  function clean(headers) {
    var out = new Headers();
    var add = function (value, name) {
      out.append(name, NAMES.indexOf(String(name).toLowerCase()) >= 0 ? ascii(value) : value);
    };
    if (headers instanceof Headers) headers.forEach(add);
    else if (Array.isArray(headers)) headers.forEach(function (p) { add(p[1], p[0]); });
    else Object.keys(headers).forEach(function (k) { add(headers[k], k); });
    return out;
  }

  var originalFetch = window.fetch;
  window.fetch = function (input, init) {
    if (init && init.headers) {
      init = Object.assign({}, init, { headers: clean(init.headers) });
    } else if (input instanceof Request) {
      input = new Request(input, { headers: clean(input.headers) });
    }
    return originalFetch.call(this, input, init);
  };

  var originalSetHeader = XMLHttpRequest.prototype.setRequestHeader;
  XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
    if (NAMES.indexOf(String(name).toLowerCase()) >= 0) value = ascii(value);
    return originalSetHeader.call(this, name, value);
  };
})();
