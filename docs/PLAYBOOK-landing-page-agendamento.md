# Playbook – Landing page de agendamento para clínica (formulário → Meta Lead → planilha → WhatsApp)

Processo usado para criar a landing page da Clínica PRC (repositório `scale-ag/lp-cl-nica-prc-vendas`),
escrito para ser repetido em outros clientes. **Nada aqui é específico da PRC**: pixel, WhatsApp,
textos, cores e planilha são sempre os do novo cliente.

> Código de referência: `scale-ag/lp-cl-nica-prc-vendas`, branch `claude/brave-mayer-ntywpd`.
> Reaproveite a estrutura e a lógica (`assets/js/main.js`, `google-apps-script/Codigo.gs`, CSS),
> trocando todo o conteúdo e a identidade visual.

---

## 1. O funil

1. Paciente chega pelo anúncio (com UTMs) e lê a página: **dor → por que nada funcionou → o que tratamos →
   método → resultados → depoimentos → como é a consulta → equipe → formulário → FAQ**.
2. **Nenhum preço aparece antes do formulário.** No formulário, os valores ficam explícitos.
3. Ao enviar o formulário:
   - dispara o evento **Lead** no Pixel da Meta (com `eventID`);
   - grava o lead numa **planilha Google** (Apps Script) com nome, WhatsApp, respostas e **UTMs**;
   - mostra uma contagem de **5 segundos** ("Pronto, Fulana! Recebemos seus dados…");
   - redireciona sozinho para o **WhatsApp** da clínica com uma mensagem pronta.
4. A equipe agenda e cobra o sinal pelo WhatsApp e marca o **Status** do lead na planilha.

Hospedagem: **GitHub Pages** (site estático: HTML + CSS + JS puro, sem build).

---

## 2. O que pedir ao usuário antes de começar

| Item | Exemplo |
|---|---|
| Site atual do cliente (para extrair conteúdo, logo, cores, fotos) | `https://site-do-cliente.com.br` |
| Nome do médico/clínica, especialidade, cidade/endereço | |
| WhatsApp que recebe os leads (55 + DDD + número) | `55119XXXXXXXX` |
| Mensagem pronta do WhatsApp | "Olá, preenchi o formulário do site e gostaria de agendar meu horário" |
| Valor da consulta e do sinal (se houver), e se o sinal é **abatido** | consulta R$ X, sinal R$ Y |
| **Perguntas do formulário** (campos e opções) | queixa, período, etc. |
| ID do Pixel da Meta | |
| Link da planilha Google (vazia) | |
| Público principal (ex.: maioria mulheres) | define tom ("você não está sozinha") e fotos |
| Regras de remarcação/reembolso | se não souber, deixar configurável |
| Repositório GitHub novo (público) para hospedar | `scale-ag/lp-...` |

**Não invente** políticas, preços, números, títulos, CRMs ou resultados. O que não estiver no site ou
não vier do usuário fica genérico ou configurável, e o usuário é avisado.

---

## 3. Coleta de conteúdo do site do cliente

- Muitos sites WordPress têm **Mod_Security**: `curl` simples devolve "Not Acceptable".
  Use User-Agent de navegador e cabeçalhos:
  ```bash
  UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
  curl -sSL -A "$UA" -H "Accept: text/html" -H "Accept-Language: pt-BR" https://SITE/ -o index.html
  ```
- Baixe também as páginas internas (quem somos, tratamentos, resultados, contato) e extraia o texto.
- **Biblioteca de mídia do WordPress** (lista todas as imagens, inclusive as do blog):
  `https://SITE/wp-json/wp/v2/media?per_page=100&page=1`
- **Identidade visual**: logo (procure `logo*.svg` no tema), cores do CSS do tema
  (`grep -oE '#[0-9a-fA-F]{6}' style.css | sort | uniq -c | sort -rn`) e fontes (`@import` do Google Fonts).
- **Imagens**: comprima com ImageMagick (`convert foto.jpg -resize 1200x -strip -quality 80 out.jpg`).
  Fotos de antes/depois costumam vir em pares (`X.jpg` = antes, `X-2.jpg` = depois); confira olhando.
- Depoimentos: use os reais do site, com o nome como aparece lá. Não repita o mesmo depoimento em duas seções.
- Prefira fotos reais da clínica/equipe e fotos do próprio blog do cliente. Evite foto de banco genérica no topo.
- Se o público for majoritariamente feminino, equilibre as fotos (troque imagens masculinas por femininas).

---

## 4. Estrutura e copy da página

Ordem das seções (todas sem preço até o formulário):

1. **Topo**: logo + botão "Reservar horário" (sem valor).
2. **Hero** centralizado, só texto: headline de dor
   (ex.: "Seu cabelo está caindo e nada do que você tentou resolveu?"), subtítulo com o método,
   CTA "Quero descobrir a causa…", 3 checks curtos.
3. **Faixa de confiança** (4 itens: método, profissionais, tempo de resultado, segurança).
4. **"Você se identifica?"**: 6 a 8 sinais/dores em cards com checkbox visual + frase de acolhimento.
5. **"Por que nada funcionou até agora"**: causa x sintoma + depoimento curto em destaque.
6. **O que tratamos**: cards com imagem.
7. **Método**: foto real + 4 pilares + CTA.
8. **Resultados**: antes/depois + aviso "os resultados variam de pessoa para pessoa".
9. **Depoimentos**.
10. **Como é a consulta**: 4 passos, **sem valores** + CTA.
11. **Equipe**.
12. **Agendamento**: lista do que a consulta inclui + **quadro de valores** + formulário.
13. **FAQ**: a primeira pergunta desfaz a confusão de preço (ex.: "A consulta custa R$ 50? Não…").
14. **Rodapé**: contatos, endereço, CNPJ/razão social (se constar no site).

Também: botão fixo no celular ("Reservar meu horário") que **some no topo e na área do formulário**,
para não cobrir conteúdo. Alterne fundos (branco/bege/escuro) para nenhuma seção "grudar" na outra.

### Clareza de preço (quando há sinal)

- **Nunca** mostre o valor cheio riscado ao lado do sinal (passa ideia de desconto).
- Quadro de valores: **Valor da consulta R$ X / Sinal para reservar R$ Y / No dia (restante) R$ X−Y**
  + "O sinal **não é desconto**: ele faz parte dos R$ X e é abatido do valor total."
- **Checkbox obrigatório** antes de enviar: "Estou ciente de que a consulta custa R$ X. Para reservar o
  horário pago R$ Y de sinal, que serão abatidos, e os R$ X−Y restantes no dia da consulta."
- Valores vêm do `config.js` (`VALOR_CONSULTA`, `VALOR_SINAL`); o restante é calculado.

---

## 5. Formulário e perguntas

As perguntas mudam por cliente. Para cada campo novo, atualize **três lugares com as mesmas chaves**:

1. `index.html`: o `<input>`/`<select>` com `name="chave"`.
2. `assets/js/main.js`: validação em `validate()` e o campo no objeto `lead` (`chave: form.elements.chave.value`).
3. `google-apps-script/Codigo.gs`: uma linha em `COLUNAS` (`['Título da coluna', 'chave']`).

Se as chaves não baterem, a coluna fica vazia na planilha. Máscara de telefone `(11) 90000-0000` já existe.

---

## 6. Lógica do envio (`assets/js/main.js`)

- **UTMs**: lê `utm_source, utm_medium, utm_campaign, utm_content, utm_term, fbclid, gclid` da URL e
  guarda no `localStorage` (último clique com UTM). Se a pessoa voltar sem UTM, usa as guardadas.
  Tudo em `try/catch` (modo anônimo pode bloquear o storage).
- **Pixel**: carregado pelo JS quando `META_PIXEL_ID` está preenchido; `PageView` ao abrir;
  `Lead` no envio com `{ eventID: leadId }` (permite deduplicar com API de Conversões).
- **Planilha**: `fetch(PLANILHA_URL, { method: "POST", mode: "no-cors", keepalive: true,
  headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(lead) })`,
  com `navigator.sendBeacon` como reserva. `text/plain` + `no-cors` evita o bloqueio de CORS
  do Apps Script; `keepalive` garante o envio mesmo com a troca de página.
- **Contagem**: esconde o formulário, mostra "Pronto, {nome}!" e conta `SEGUNDOS_ATE_WHATSAPP` (5).
  No fim: `window.location.href = "https://wa.me/NUMERO?text=" + encodeURIComponent(MENSAGEM)`.
  Use `location.href` (não `window.open`, que é bloqueado depois de um timer).
- Botão "Abrir o WhatsApp" de reserva **só aparece no fim da contagem** (senão a pessoa pula a espera).
- **Pegadinha de CSS**: `.btn { display: inline-flex }` anula o atributo `hidden`.
  Inclua `[hidden] { display: none !important; }` no CSS.

### `assets/js/config.js` (único arquivo que muda por cliente, além do conteúdo)

```js
window.PRC_CONFIG = {
  VALOR_SINAL: 50,
  VALOR_CONSULTA: 600,
  WHATSAPP: "55DDDNUMERO",
  MENSAGEM_WHATSAPP: "Olá, preenchi o formulário do site e gostaria de agendar meu horário",
  SEGUNDOS_ATE_WHATSAPP: 5,
  PLANILHA_URL: "",          // URL /exec do Apps Script
  META_PIXEL_ID: "",         // pixel do cliente
  RESPOSTA_REMARCAR: "…"     // vazio esconde a pergunta do FAQ
};
```

---

## 7. Planilha (Google Apps Script)

O script (`google-apps-script/Codigo.gs`):
- `configurarPlanilha()`: cria a aba **Leads** (reaproveita a primeira aba se estiver vazia), cabeçalho
  formatado e congelado, coluna de data formatada, WhatsApp como texto, **lista de Status**
  (Novo, Em conversa, Agendado, Sinal pago, Compareceu, Não respondeu, Desistiu).
- `doPost(e)`: lê o JSON de `e.postData.contents`, usa `LockService`, grava a linha na ordem de `COLUNAS`,
  status "Novo", e prefixa com `'` valores que começam com `= + - @` (evita fórmula injetada).
- `doGet()`: devolve "ok" (testa a implantação abrindo a URL no navegador).

O Claude **não consegue instalar** (o Google exige autorização do dono). Passo a passo para o usuário,
**em português e bem explicado** (ele pode não conhecer Apps Script):

1. Abrir a planilha → **Extensões → Apps Script** (precisa ser por esse menu, para o script ficar ligado à planilha).
2. O editor vem com `function myFunction() {}`: clicar dentro, **Cmd/Ctrl + A**, apagar, colar o código.
   (Cole o código completo **na própria resposta do chat**, num bloco copiável.)
3. **Salvar (Cmd/Ctrl + S)**. Enquanto aparecer "Mudanças não salvas", "Executar" e a lista de funções
   ficam cinza; isso confunde.
4. Na lista "Nenhuma função", escolher `configurarPlanilha` → **Executar** → autorizar.
   Aviso "O Google não verificou este app" → **Avançado → Acessar (não seguro) → Permitir** (normal).
5. O botão **Implantar** fica no editor do Apps Script (não na planilha): **Implantar → Nova implantação →
   engrenagem → App da Web → Executar como: Eu → Quem pode acessar: Qualquer pessoa → Implantar**.
6. Copiar a URL que termina em `/exec` e colar em `PLANILHA_URL`.
7. Alterou o código depois? **Implantar → Gerenciar implantações → editar → Nova versão** (mantém a URL).

Depois de configurar: `curl -sSL URL_EXEC` deve responder `ok`. Se o chat tiver acesso ao Google Drive,
leia a planilha para confirmar o cabeçalho e o lead de teste (e peça para o usuário apagar a linha de teste).

---

## 8. Publicação no GitHub Pages

- Arquivo `.nojekyll` na raiz.
- Repositório **público** (Pages grátis). O usuário configura uma vez:
  **Settings → Pages → Source: Deploy from a branch → Branch: (a branch) / (root) → Save**.
  Se o site der 404 e nenhum build rodar, normalmente o usuário não clicou em **Save**.
- URL: `https://ORG.github.io/NOME-DO-REPO/`. Cada push atualiza em ~1 minuto
  (confira com `curl` até o conteúdo novo aparecer).
- Domínio próprio (opcional): Custom domain + CNAME `agendar` → `ORG.github.io` + Enforce HTTPS.

---

## 9. Testes antes de entregar (Playwright, Chromium já instalado)

- Layout em **1366px, 390px e 320px**: sem rolagem horizontal (`scrollWidth === innerWidth`).
- Script que confere que **nenhum "R$" aparece acima do formulário**.
- Role a página antes do screenshot de página inteira (imagens com `loading="lazy"` aparecem em branco).
- Fluxo completo com `context.route`:
  - planilha **simulada** (intercepta `script.google.com`) para ver o JSON enviado com as UTMs;
  - `wa.me` interceptado para conferir número, mensagem e o tempo (~5 s);
  - formulário sem o checkbox não avança.
- **Não suje o Pixel do cliente** nos testes: bloqueie `connect.facebook.net`, ou verifique pela fila
  `window.fbq.queue` com um `fbevents.js` vazio. Se precisar testar o Pixel real, avise o usuário antes.
- O navegador headless é bloqueado pelo **botblocking** da Meta (User-Agent "HeadlessChrome"): para ver
  as requisições reais a `facebook.com/tr`, use User-Agent de Chrome comum.
- Teste o Apps Script localmente simulando `SpreadsheetApp` em Node (`vm`) para pegar erro de sintaxe.

---

## 10. Meta: verificação e cuidados

- Confirmação simples: extensão **Meta Pixel Helper / Consultor de Dados de Anúncios** mostra
  `PageView` e `Lead` como "Evento enviado".
- A aba **Eventos de teste** costuma ficar vazia (depende de login no Facebook + cookies de terceiros no
  Chrome). Isso **não** indica problema. Confirme em **Visão geral → Lead → Ver detalhes → URLs**
  (pode levar de 20 min a algumas horas).
- **Clínicas costumam cair na categoria "Saúde e bem-estar" com restrição** (modo de dados protegidos):
  a Meta remove parâmetros e o caminho da URL (aparece só o domínio, `_removed_`).
  - Use o evento **Lead padrão**; conversões personalizadas por URL não funcionam.
  - A origem do anúncio fica salva na **planilha** (independente da Meta).
  - Antes de subir a campanha, verifique se a Meta permite otimizar por **Lead**; se não,
    alternativa: campanha de **mensagens para o WhatsApp**.
- Se o pixel tiver **Gateway da API de Conversões**, os eventos aparecem com integração
  "API de Conversões": é esperado e bom.
- Parâmetros de URL para colar em cada anúncio:
  ```
  utm_source=facebook&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}
  ```

---

## 11. Lições aprendidas (evitar repetir)

- Responder **sempre em português**, com passo a passo simples (o usuário é de marketing, não dev).
- Preço antes da hora assusta: primeiro **dor e confiança**, valores só no formulário.
- Sinal mal explicado gera reclamação: quadro de valores + checkbox + FAQ + frase na mensagem/registro.
- Foto de banco genérica no topo enfraquece; use fotos reais e coerentes com o público.
- Toda mudança: testar → commit → push → conferir o site no ar com `curl` → só então avisar.
- Ser honesto quando errar uma análise (ex.: achar que um evento não era do teste e era).

---

## 12. Prompt para iniciar o novo projeto em outro chat

```
Quero criar uma landing page de agendamento para o cliente [NOME / ESPECIALIDADE], no mesmo modelo
da landing page da Clínica PRC. Siga o playbook em docs/PLAYBOOK-landing-page-agendamento.md do
repositório scale-ag/lp-cl-nica-prc-vendas (branch claude/brave-mayer-ntywpd) e use esse repositório
como referência de código (main.js, Codigo.gs, CSS). Não reutilize nenhum dado da PRC (pixel,
WhatsApp, planilha, textos, fotos, cores).

Dados do novo cliente:
- Site atual (pegar conteúdo, logo, cores, fontes, fotos): [URL]
- WhatsApp que recebe os leads: [55DDDNÚMERO]
- Mensagem pronta do WhatsApp: [TEXTO]
- Valor da consulta / sinal (se houver, e se é abatido): [VALORES]
- Perguntas do formulário: [LISTA DE CAMPOS E OPÇÕES]
- Pixel da Meta: [ID]
- Planilha (vazia): [LINK]
- Público principal: [EX.: MULHERES 30–55]
- Repositório para hospedar no GitHub Pages: [ORG/REPO e branch]

Responda sempre em português e me explique passo a passo o que eu preciso fazer do meu lado
(GitHub Pages, Apps Script da planilha, UTMs nos anúncios).
```
