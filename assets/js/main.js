(function () {
  "use strict";

  var C = window.PRC_CONFIG || {};
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  function brl(v) {
    return "R$ " + Number(v).toLocaleString("pt-BR", {
      minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2
    });
  }
  function waLink(text) {
    return "https://wa.me/" + C.WHATSAPP + (text ? "?text=" + encodeURIComponent(text) : "");
  }

  /* ---------- Valores e links fixos ---------- */
  $$("[data-sinal]").forEach(function (el) { el.textContent = brl(C.VALOR_SINAL); });
  $$("[data-consulta]").forEach(function (el) { el.textContent = brl(C.VALOR_CONSULTA); });
  $$("[data-restante]").forEach(function (el) { el.textContent = brl(C.VALOR_CONSULTA - C.VALOR_SINAL); });
  $$("[data-whats-link]").forEach(function (el) { el.href = waLink(); el.target = "_blank"; el.rel = "noopener"; });
  $("#whats-duvida").href = waLink("Olá! Vim pela página de agendamento e tenho uma dúvida sobre a consulta.");
  $$("[data-faq]").forEach(function (el) {
    var txt = (C[el.getAttribute("data-faq")] || "").trim();
    if (txt) $("p", el).textContent = txt; else el.remove();
  });
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Meta Pixel (opcional) ---------- */
  function track(ev, params) { if (window.fbq) window.fbq("track", ev, params || {}); }
  if (C.META_PIXEL_ID) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", C.META_PIXEL_ID);
    track("PageView");
  }

  /* ---------- Pix "copia e cola" (BR Code estático) ---------- */
  function tlv(id, value) { return id + String(value.length).padStart(2, "0") + value; }
  function clean(s, max) {
    return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^A-Za-z0-9 ]/g, "").toUpperCase().trim().slice(0, max);
  }
  function crc16(str) {
    var crc = 0xFFFF;
    for (var i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (var j = 0; j < 8; j++) crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xFFFF;
    }
    return crc.toString(16).toUpperCase().padStart(4, "0");
  }
  function pixPayload(key, name, city, amount, txid) {
    var p = tlv("00", "01") +
      tlv("26", tlv("00", "br.gov.bcb.pix") + tlv("01", key.trim())) +
      tlv("52", "0000") + tlv("53", "986") +
      tlv("54", Number(amount).toFixed(2)) +
      tlv("58", "BR") +
      tlv("59", clean(name, 25) || "PRC") +
      tlv("60", clean(city, 15) || "SAO PAULO") +
      tlv("62", tlv("05", txid)) + "6304";
    return p + crc16(p);
  }

  /* ---------- Checkout ---------- */
  var form = $("#step-form"), pay = $("#step-pay"), err = $("#form-error");
  var whats = form.elements.whats;
  var lead = null;

  whats.addEventListener("input", function () {
    var d = whats.value.replace(/\D/g, "").slice(0, 11);
    var out = d;
    if (d.length > 2) out = "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length > 7) out = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length - 4) + "-" + d.slice(-4);
    whats.value = out;
  });

  function validate() {
    var msgs = [];
    $$("input, select", form).forEach(function (f) { f.removeAttribute("aria-invalid"); });
    function bad(f, m) { f.setAttribute("aria-invalid", "true"); msgs.push(m); }
    if (form.elements.nome.value.trim().length < 3) bad(form.elements.nome, "Informe seu nome.");
    var digits = whats.value.replace(/\D/g, "");
    if (digits.length < 10) bad(whats, "Informe um WhatsApp válido com DDD.");
    if (!form.elements.queixa.value) bad(form.elements.queixa, "Selecione sua queixa.");
    if (!form.elements.periodo.value) bad(form.elements.periodo, "Selecione o melhor período.");
    if (!form.elements.ciente.checked) bad(form.elements.ciente, "Confirme que está ciente dos valores.");
    return msgs;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var msgs = validate();
    if (msgs.length) {
      err.textContent = msgs.join(" ");
      err.hidden = false;
      var first = $("[aria-invalid=true]", form);
      if (first) first.focus();
      return;
    }
    err.hidden = true;
    lead = {
      nome: form.elements.nome.value.trim(),
      whats: whats.value,
      queixa: form.elements.queixa.value,
      periodo: form.elements.periodo.value
    };
    track("Lead", { value: C.VALOR_SINAL, currency: "BRL" });
    showPayment();
  });

  function showPayment() {
    var first = lead.nome.split(" ")[0];
    $("#pay-hello").textContent = first + ", falta só o sinal para reservar o seu horário.";

    var hasPix = !!(C.CHAVE_PIX && C.CHAVE_PIX.trim());
    var hasLink = !!(C.LINK_PAGAMENTO && C.LINK_PAGAMENTO.trim());

    $("#pay-pix").hidden = !hasPix;
    $("#pay-link").hidden = !hasLink;
    $("#pay-fallback").hidden = hasPix || hasLink;

    if (hasPix) {
      var code = pixPayload(C.CHAVE_PIX, C.NOME_RECEBEDOR, C.CIDADE_RECEBEDOR, C.VALOR_SINAL, "PRCSINAL");
      $("#pix-code").value = code;
      var box = $("#pix-qr");
      box.innerHTML = "";
      if (window.qrcode) {
        var qr = window.qrcode(0, "M");
        qr.addData(code);
        qr.make();
        box.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
      }
    }
    if (hasLink) $("#pay-link-btn").href = C.LINK_PAGAMENTO.trim();

    var msg = (hasPix || hasLink
      ? "Olá! Acabei de pagar o sinal de " + brl(C.VALOR_SINAL) + " para agendar minha consulta na Clínica PRC. Segue o comprovante."
      : "Olá! Quero agendar minha consulta na Clínica PRC e pagar o sinal de " + brl(C.VALOR_SINAL) + ".") +
      "\n\nNome: " + lead.nome +
      "\nWhatsApp: " + lead.whats +
      "\nQueixa: " + lead.queixa +
      "\nPeríodo preferido: " + lead.periodo +
      "\n\nEstou ciente: a consulta custa " + brl(C.VALOR_CONSULTA) + ". O sinal de " + brl(C.VALOR_SINAL) +
      " é abatido e pago os " + brl(C.VALOR_CONSULTA - C.VALOR_SINAL) + " restantes no dia da consulta.";
    $("#whats-confirm").href = waLink(msg);
    $("#whats-confirm").textContent = hasPix || hasLink ? "Enviar comprovante no WhatsApp" : "Agendar pelo WhatsApp";
    $("#confirm-text").innerHTML = hasPix || hasLink
      ? "<strong>Já pagou?</strong> Envie o comprovante para confirmarmos o seu horário:"
      : "Seus dados já vão preenchidos na mensagem:";

    form.hidden = true;
    pay.hidden = false;
    $("#checkout").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  $("#back-form").addEventListener("click", function () {
    pay.hidden = true;
    form.hidden = false;
    form.elements.nome.focus();
  });

  $("#pix-copy").addEventListener("click", function () {
    var ta = $("#pix-code"), btn = this;
    var done = function () {
      btn.textContent = "Código copiado!";
      setTimeout(function () { btn.textContent = "Copiar código Pix"; }, 2500);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(ta.value).then(done, function () { ta.select(); document.execCommand("copy"); done(); });
    } else { ta.select(); document.execCommand("copy"); done(); }
    track("InitiateCheckout", { value: C.VALOR_SINAL, currency: "BRL", content_name: "Pix" });
  });
  $("#pay-link-btn").addEventListener("click", function () {
    track("InitiateCheckout", { value: C.VALOR_SINAL, currency: "BRL", content_name: "Link" });
  });
  $("#whats-confirm").addEventListener("click", function () {
    track("Contact");
  });

  /* ---------- CTA fixo some no topo (para não cobrir os valores) e no checkout ---------- */
  var sticky = $(".sticky-cta");
  if ("IntersectionObserver" in window && sticky) {
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.className] = en.isIntersecting; });
      sticky.classList.toggle("is-hidden", Object.keys(visible).some(function (k) { return visible[k]; }));
    }, { threshold: 0.05 });
    io.observe($(".hero"));
    io.observe($("#agendar"));
  }
})();
