# Landing page – Clínica PRC (agendamento pelo WhatsApp)

Página estática (HTML/CSS/JS puro) para gerar agendamentos da consulta tricológica da
[Clínica PRC](https://clinicadetricologia.com.br/). A consulta custa **R$ 600**; para reservar o
horário a paciente paga **R$ 50 de sinal** (pelo WhatsApp), que é **abatido** dos R$ 600 — ela paga
os R$ 550 restantes no dia. Os valores só aparecem a partir do formulário, e a paciente precisa
marcar que está ciente antes de enviar.

## Fluxo da paciente

1. Lê a página (dor → causa → método → resultados → depoimentos) e preenche o formulário.
2. Ao enviar: dispara o evento **Lead** no Pixel da Meta e o lead é gravado na **planilha** com as UTMs.
3. Aparece uma contagem de **5 segundos** (tempo para o Lead chegar na Meta e o lead cair na planilha).
4. Redireciona sozinho para o WhatsApp **+55 11 96998-8757** com a mensagem
   *"Olá, preenchi o formulário do site e gostaria de agendar meu horário"*.
5. A equipe agenda o horário e cobra o sinal pelo WhatsApp.

## Configuração (único arquivo a editar)

Edite `assets/js/config.js`:

| Campo | O que colocar |
|---|---|
| `VALOR_SINAL` / `VALOR_CONSULTA` | Valores exibidos (50 e 600) |
| `WHATSAPP` | Número que recebe os leads (`55` + DDD + número) |
| `MENSAGEM_WHATSAPP` | Mensagem que já vem escrita no WhatsApp |
| `SEGUNDOS_ATE_WHATSAPP` | Espera antes de abrir o WhatsApp (padrão 5) |
| `PLANILHA_URL` | URL `/exec` do Apps Script (veja abaixo) |
| `META_PIXEL_ID` | ID do Pixel da Meta |
| `RESPOSTA_REMARCAR` | Texto da pergunta "Posso remarcar?" (vazio esconde a pergunta) |

## Planilha de leads (Google Sheets)

O código fica em `google-apps-script/Codigo.gs`. Instalação (uma vez só, com a conta dona da planilha):

1. Abra a planilha → **Extensões → Apps Script**.
2. Apague o conteúdo do editor, cole o arquivo `Codigo.gs` inteiro e salve.
3. No seletor de funções (topo), escolha **`configurarPlanilha`** → **Executar** → autorize.
   Isso cria a aba **Leads** com as colunas e a lista de status.
4. **Implantar → Nova implantação** → engrenagem → **App da Web**:
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
5. **Implantar**, copie a URL que termina em `/exec` e cole em `PLANILHA_URL`.

Colunas: Data/hora · Nome · WhatsApp · Queixa · Período · **Status** (lista: Novo, Em conversa,
Agendado, Sinal pago, Compareceu, Não respondeu, Desistiu) · utm_source · utm_medium · utm_campaign ·
utm_content · utm_term · fbclid · gclid · Dispositivo · Página · ID do lead.

> Se alterar o código depois, use **Implantar → Gerenciar implantações → editar → Nova versão**
> para manter a mesma URL.

### UTMs nos anúncios da Meta

No anúncio, em **Rastreamento → Parâmetros de URL**, cole:

```
utm_source=facebook&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}
```

A Meta troca as chaves pelos nomes reais: na planilha você vê a **campanha**, o **conjunto** e o
**anúncio** de cada lead. A página guarda as UTMs da visita, então mesmo que a pessoa saia e volte
depois pelo link direto, a origem não se perde.

## Publicar no GitHub Pages

1. No GitHub, abra o repositório → **Settings** → **Pages** (menu da esquerda).
2. Em **Build and deployment** → **Source**, escolha **Deploy from a branch**.
3. Em **Branch**, escolha a branch com estes arquivos (ex.: `main`) e a pasta **`/ (root)`** → **Save**.
4. Aguarde 1–2 minutos. O endereço aparece no topo da mesma tela:
   `https://scale-ag.github.io/lp-cl-nica-prc-vendas/`

Cada novo commit nessa branch republica o site automaticamente.

### Domínio próprio (opcional)

1. Em **Settings → Pages → Custom domain**, digite o domínio (ex.: `agendar.clinicadetricologia.com.br`) e salve.
2. No painel DNS do domínio, crie um registro **CNAME** `agendar` apontando para `scale-ag.github.io`.
3. Depois que o DNS propagar, marque **Enforce HTTPS**.

## Estrutura

```
index.html                     página
assets/css/style.css           estilos (cores e fontes da identidade PRC)
assets/js/config.js            configurações editáveis
assets/js/main.js              formulário, UTMs, Pixel, planilha e redirecionamento
assets/img/                    logo e fotos do site da clínica
google-apps-script/Codigo.gs   script que grava os leads na planilha
```
