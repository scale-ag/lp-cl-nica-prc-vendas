(function () {
  "use strict";

  var P = window.PRC, C = P.C;
  var lead = P.loadLead();
  var pago = new URLSearchParams(location.search).get("pago") === "1";

  if (lead && lead.nome) {
    document.getElementById("thanks-title").textContent =
      "Obrigado, " + lead.nome.split(" ")[0] + "! Falta só um passo.";
  }

  var msg = "Olá! Acabei de pagar o sinal de " + P.brl(C.VALOR_SINAL) +
    " pelo link de pagamento para agendar minha consulta na Clínica PRC. Quero confirmar meu horário." +
    (lead ? "\n\n" + P.dadosLead(lead) : "") +
    "\n\n" + P.avisoValores();
  var btn = document.getElementById("thanks-whats");
  btn.href = P.waLink(msg);
  btn.addEventListener("click", function () { P.track("Contact"); });

  /* Purchase só quando o gateway redireciona com ?pago=1, e uma única vez por agendamento
     (recarregar a página não conta outra compra). */
  if (pago) {
    var id = "prc-" + (lead && lead.id ? lead.id : "sem-lead");
    var key = "prc_purchase_" + id, ja = false;
    try { ja = localStorage.getItem(key) === "1"; } catch (e) { /* modo privado */ }
    if (!ja) {
      P.track("Purchase", { value: C.VALOR_SINAL, currency: "BRL", content_name: "Sinal consulta PRC" }, { eventID: id });
      try { localStorage.setItem(key, "1"); } catch (e) { /* modo privado */ }
    }
  }
})();
