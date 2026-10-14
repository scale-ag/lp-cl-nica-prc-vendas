/* Funções compartilhadas entre a landing page e a página de obrigado */
(function () {
  "use strict";

  var C = window.PRC_CONFIG || {};
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var LEAD_KEY = "prc_lead";

  function brl(v) {
    return "R$ " + Number(v).toLocaleString("pt-BR", {
      minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2
    });
  }
  function waLink(text) {
    return "https://wa.me/" + C.WHATSAPP + (text ? "?text=" + encodeURIComponent(text) : "");
  }
  function track(ev, params, opts) { if (window.fbq) window.fbq("track", ev, params || {}, opts || {}); }

  /* Texto de ciência dos valores, usado nas mensagens de WhatsApp */
  function avisoValores() {
    return "Estou ciente: a consulta custa " + brl(C.VALOR_CONSULTA) + ". O sinal de " + brl(C.VALOR_SINAL) +
      " é abatido e pago os " + brl(C.VALOR_CONSULTA - C.VALOR_SINAL) + " restantes no dia da consulta.";
  }
  function dadosLead(lead) {
    return "Nome: " + lead.nome + "\nWhatsApp: " + lead.whats +
      "\nQueixa: " + lead.queixa + "\nPeríodo preferido: " + lead.periodo;
  }

  /* Guarda os dados do formulário para a página de obrigado
     (o link de pagamento abre em outra aba, então usamos localStorage) */
  function saveLead(lead) {
    try { localStorage.setItem(LEAD_KEY, JSON.stringify(lead)); } catch (e) { /* modo privado */ }
  }
  function loadLead() {
    try { return JSON.parse(localStorage.getItem(LEAD_KEY) || "null"); } catch (e) { return null; }
  }

  /* Valores e links fixos */
  $$("[data-sinal]").forEach(function (el) { el.textContent = brl(C.VALOR_SINAL); });
  $$("[data-consulta]").forEach(function (el) { el.textContent = brl(C.VALOR_CONSULTA); });
  $$("[data-restante]").forEach(function (el) { el.textContent = brl(C.VALOR_CONSULTA - C.VALOR_SINAL); });
  $$("[data-whats-link]").forEach(function (el) { el.href = waLink(); el.target = "_blank"; el.rel = "noopener"; });
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* Meta Pixel */
  if (C.META_PIXEL_ID) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", C.META_PIXEL_ID);
    track("PageView");
  }

  window.PRC = {
    C: C, brl: brl, waLink: waLink, track: track,
    avisoValores: avisoValores, dadosLead: dadosLead,
    saveLead: saveLead, loadLead: loadLead
  };
})();
