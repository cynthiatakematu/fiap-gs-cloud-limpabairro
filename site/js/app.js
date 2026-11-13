(function () {
  var posicaoUsuario = null;
  var totalRelatos = 0;

  var painel = [
    { regiao: "Centro", dias: 3.2 },
    { regiao: "Zona Sul", dias: 7.4 },
    { regiao: "Zona Leste", dias: 9.1 },
    { regiao: "Zona Norte", dias: 6.5 },
    { regiao: "Zona Oeste", dias: 4.8 }
  ];

  function distanciaKm(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var rad = Math.PI / 180;
    var dLat = (lat2 - lat1) * rad;
    var dLon = (lon2 - lon1) * rad;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function obterLocalizacao(callback) {
    var status = document.getElementById("gps-status");
    if (!navigator.geolocation) {
      status.textContent = "Seu navegador não permite geolocalização.";
      return;
    }
    status.textContent = "Obtendo localização...";
    navigator.geolocation.getCurrentPosition(function (pos) {
      posicaoUsuario = { lat: pos.coords.latitude, lon: pos.coords.longitude };
      status.textContent = "Localização registrada.";
      if (callback) { callback(); }
    }, function () {
      status.textContent = "Não foi possível obter a localização. Verifique a permissão do navegador.";
    });
  }

  function renderEcopontos(lista) {
    var ul = document.getElementById("lista-ecopontos");
    ul.innerHTML = "";
    lista.forEach(function (e) {
      var li = document.createElement("li");
      var nome = document.createElement("div");
      nome.className = "nome";
      nome.textContent = e.nome;
      var end = document.createElement("div");
      end.textContent = e.endereco + " | " + e.distrito;
      var tipos = document.createElement("div");
      tipos.textContent = "Aceita: " + e.tipos.join(", ");
      li.appendChild(nome);
      li.appendChild(end);
      li.appendChild(tipos);
      if (typeof e.distancia === "number") {
        var d = document.createElement("div");
        d.className = "dist";
        d.textContent = "A " + e.distancia.toFixed(1).replace(".", ",") + " km de você";
        li.appendChild(d);
      }
      ul.appendChild(li);
    });
  }

  var ecopontos = [];

  function ordenarPorDistancia() {
    if (!posicaoUsuario) { return; }
    var copia = ecopontos.map(function (e) {
      var c = Object.assign({}, e);
      c.distancia = distanciaKm(posicaoUsuario.lat, posicaoUsuario.lon, e.lat, e.lon);
      return c;
    });
    copia.sort(function (a, b) { return a.distancia - b.distancia; });
    renderEcopontos(copia.slice(0, 3));
  }

  function carregarEcopontos() {
    fetch("data/ecopontos.json")
      .then(function (r) { return r.json(); })
      .then(function (dados) {
        ecopontos = dados;
        renderEcopontos(ecopontos.slice(0, 3));
      })
      .catch(function () {
        document.getElementById("lista-ecopontos").textContent = "Não foi possível carregar os Ecopontos.";
      });
  }

  function renderGrafico() {
    var el = document.getElementById("grafico");
    var maximo = Math.max.apply(null, painel.map(function (p) { return p.dias; }));
    painel.forEach(function (p) {
      var linha = document.createElement("div");
      linha.className = "barra-linha";
      var rotulo = document.createElement("span");
      rotulo.className = "rotulo";
      rotulo.textContent = p.regiao;
      var barra = document.createElement("div");
      barra.className = "barra";
      barra.style.width = (p.dias / maximo * 60) + "%";
      var valor = document.createElement("span");
      valor.className = "valor";
      valor.textContent = String(p.dias).replace(".", ",");
      linha.appendChild(rotulo);
      linha.appendChild(barra);
      linha.appendChild(valor);
      el.appendChild(linha);
    });
  }

  document.getElementById("foto").addEventListener("change", function (ev) {
    var arquivo = ev.target.files[0];
    var previa = document.getElementById("previa");
    if (arquivo) {
      previa.src = URL.createObjectURL(arquivo);
      previa.hidden = false;
    } else {
      previa.hidden = true;
    }
  });

  document.getElementById("btn-gps").addEventListener("click", function () {
    obterLocalizacao();
  });

  document.getElementById("btn-ordenar").addEventListener("click", function () {
    if (posicaoUsuario) { ordenarPorDistancia(); } else { obterLocalizacao(ordenarPorDistancia); }
  });

  document.getElementById("btn-enviar").addEventListener("click", function () {
    var msg = document.getElementById("msg-envio");
    var foto = document.getElementById("foto").files[0];
    if (!foto) { msg.textContent = "Adicione uma foto do descarte antes de enviar."; return; }
    if (!posicaoUsuario) { msg.textContent = "Informe sua localização antes de enviar."; return; }
    totalRelatos += 1;
    document.getElementById("kpi-relatos").textContent = String(totalRelatos);
    msg.textContent = "Relato registrado no protótipo. Obrigada por ajudar o seu bairro!";
  });

  carregarEcopontos();
  renderGrafico();
})();
