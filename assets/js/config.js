/*
 * ============================================================
 *  CONFIGURAÇÃO DA LANDING PAGE — edite só este arquivo
 * ============================================================
 *  Depois de editar, faça commit/push: o GitHub Pages
 *  atualiza o site sozinho em ~1 minuto.
 */
window.PRC_CONFIG = {
  /* Valores exibidos na página (a partir do formulário) */
  VALOR_SINAL: 50,          // sinal para reservar o horário (R$)
  VALOR_CONSULTA: 600,      // valor total da consulta (R$); o sinal é abatido dele

  /* ---------- WHATSAPP ----------
   * Depois de preencher o formulário, a pessoa espera alguns segundos
   * (para o evento Lead chegar na Meta e o lead cair na planilha)
   * e é levada automaticamente para este WhatsApp. */
  WHATSAPP: "5511969988757",
  MENSAGEM_WHATSAPP: "Olá, preenchi o formulário do site e gostaria de agendar meu horário",
  SEGUNDOS_ATE_WHATSAPP: 5,

  /* ---------- PLANILHA (Google Sheets) ----------
   * URL do App da Web do Google Apps Script (termina em /exec).
   * Passo a passo no README, seção "Planilha de leads". */
  PLANILHA_URL: "https://script.google.com/macros/s/AKfycbwalozgWlnvu0Xr8gcfiMTbA1ha2_WjrS1iJHMIPxVmdw5dbt8d6yDejP2327aJoWSs/exec",

  /* ---------- RASTREAMENTO ----------
   * ID do Pixel da Meta. Dispara PageView e Lead (formulário enviado). */
  META_PIXEL_ID: "371557988328730",

  /* ---------- REMARCAÇÃO (pergunta frequente) ----------
   * Ajuste o texto conforme a regra da clínica.
   * Deixe "" (vazio) para esconder a pergunta da página. */
  RESPOSTA_REMARCAR: "Sim. Basta avisar nossa equipe pelo WhatsApp com antecedência para escolher uma nova data."
};
