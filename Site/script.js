/* API na Prática: comportamento da página única */

(function () {
  "use strict";

  /* ---------- 1. Demonstração de pedidos à API (dados fictícios) ---------- */
  var livros = [
    { id: 1, titulo: "Dom Casmurro", autor: "Machado de Assis" },
    { id: 2, titulo: "O Cortiço", autor: "Aluísio Azevedo" }
  ];

  var rotas = [
    {
      pedido: "GET /status",
      codigo: 200,
      sentido: "Deu certo. O servidor está de pé.",
      corpo: { ok: true, mensagem: "API da biblioteca funcionando" }
    },
    {
      pedido: "GET /livros",
      codigo: 200,
      sentido: "Deu certo. Você pediu a lista inteira.",
      corpo: livros
    },
    {
      pedido: "GET /livros/1",
      codigo: 200,
      sentido: "Deu certo. Você pediu um livro específico.",
      corpo: livros[0]
    },
    {
      pedido: "GET /livros/99",
      codigo: 404,
      sentido: "Não encontrado. Esse livro não existe.",
      corpo: { erro: "Livro não encontrado" }
    }
  ];

  var botoes = document.getElementById("routes");
  var selo = document.getElementById("slip-code");
  var sentido = document.getElementById("slip-meaning");
  var corpo = document.getElementById("slip-body");

  function mostrar(rota, botaoAtivo) {
    var todos = botoes.querySelectorAll("button");
    for (var i = 0; i < todos.length; i++) {
      todos[i].setAttribute("aria-pressed", todos[i] === botaoAtivo ? "true" : "false");
    }
    selo.textContent = rota.codigo;
    selo.classList.toggle("is-error", rota.codigo >= 400);
    sentido.textContent = rota.sentido;
    corpo.textContent = JSON.stringify(rota.corpo, null, 2);
  }

  if (botoes) {
    rotas.forEach(function (rota, indice) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "route-btn";
      b.textContent = rota.pedido;
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", function () { mostrar(rota, b); });
      botoes.appendChild(b);
      if (indice === 0) mostrar(rota, b);
    });
  }

  /* ---------- 2. Links de conteúdo que ainda não existe ---------- */
  var aviso = document.getElementById("soon-msg");
  document.querySelectorAll("a[data-soon]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      if (aviso) {
        // Limpa antes de escrever para o leitor de tela anunciar de novo
        aviso.textContent = "";
        window.setTimeout(function () {
          aviso.textContent = "Este conteúdo ainda será publicado.";
        }, 50);
      }
    });
  });

  /* ---------- 3. Item do menu ativo conforme a seção visível ---------- */
  var secoes = ["inicio", "aulas", "grupo"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var links = document.querySelectorAll(".nav a");

  function marcar(id) {
    links.forEach(function (a) {
      if (a.getAttribute("href") === "#" + id) {
        a.setAttribute("aria-current", "true");
      } else {
        a.removeAttribute("aria-current");
      }
    });
  }

  if ("IntersectionObserver" in window && secoes.length) {
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) marcar(entrada.target.id);
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    secoes.forEach(function (s) { observador.observe(s); });
  }
})();
