/*
 * ============================================================
 *  CONFIGURAÇÃO DA LANDING PAGE — edite só este arquivo
 * ============================================================
 *  Depois de editar, faça commit/push: o GitHub Pages
 *  atualiza o site sozinho em ~1 minuto.
 */
window.PRC_CONFIG = {
  /* Valores exibidos na página */
  VALOR_SINAL: 50,          // sinal cobrado agora (R$)
  VALOR_CONSULTA: 600,      // valor cheio da consulta (R$)

  /* WhatsApp da clínica (só números, com 55 + DDD) */
  WHATSAPP: "5511969988757",

  /* ---------- PAGAMENTO ----------
   * Preencha UMA ou AS DUAS opções abaixo.
   * Se ficar vazia, a opção some da página.
   */

  /* 1) Link de pagamento de R$ 50 (cartão/Pix) gerado no
   *    Mercado Pago, InfinitePay, PagSeguro, Asaas, Stripe etc. */
  LINK_PAGAMENTO: "",

  /* 2) Pix direto: a página gera o QR Code e o "copia e cola"
   *    já com o valor de R$ 50.
   *    CHAVE_PIX: CNPJ (só números), e-mail, celular (+5511...) ou chave aleatória.
   *    NOME_RECEBEDOR: até 25 letras, sem acento (como está no banco).
   *    CIDADE_RECEBEDOR: até 15 letras, sem acento. */
  CHAVE_PIX: "",
  NOME_RECEBEDOR: "PRC CLINICA",
  CIDADE_RECEBEDOR: "SAO PAULO",

  /* ---------- RASTREAMENTO (opcional) ----------
   * ID do Pixel da Meta (Facebook/Instagram Ads).
   * Dispara: PageView, Lead (formulário) e InitiateCheckout (pagar). */
  META_PIXEL_ID: ""
};
