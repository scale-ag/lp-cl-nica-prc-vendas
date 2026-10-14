# Landing page – Clínica PRC (agendamento com sinal de R$ 50)

Página estática (HTML/CSS/JS puro) para vender o agendamento da consulta tricológica da
[Clínica PRC](https://clinicadetricologia.com.br/). A consulta custa **R$ 600**: a pessoa paga
**R$ 50 de sinal** agora para reservar o horário, e esse valor é **abatido** dos R$ 600
(paga os R$ 550 restantes no dia). A página deixa isso explícito em todos os pontos de preço
e exige que a paciente marque que está ciente antes de seguir para o pagamento.

## Fluxo da paciente

1. Preenche nome, WhatsApp, queixa e período preferido.
2. Paga o sinal pelo **Pix** (QR Code + copia e cola gerados na própria página) e/ou por um **link de pagamento** (cartão).
3. Clica em **Enviar comprovante no WhatsApp**: abre a conversa com a clínica com todos os dados preenchidos.
4. A equipe confere o pagamento e confirma dia e horário.

## Configuração (único arquivo a editar)

Edite `assets/js/config.js`:

| Campo | O que colocar |
|---|---|
| `VALOR_SINAL` / `VALOR_CONSULTA` | Valores exibidos (50 e 600) |
| `WHATSAPP` | Número que recebe os agendamentos (`55` + DDD + número) |
| `CHAVE_PIX` | Chave Pix da clínica (CNPJ só números, e-mail, `+5511...` ou aleatória) |
| `NOME_RECEBEDOR` / `CIDADE_RECEBEDOR` | Nome e cidade do titular da chave, sem acento |
| `LINK_PAGAMENTO` | Link de R$ 50 do Mercado Pago, InfinitePay, PagSeguro, Asaas etc. |
| `META_PIXEL_ID` | ID do Pixel da Meta. Eventos: `PageView`, `Lead`, `InitiateCheckout`, `Contact` |
| `RESPOSTA_REMARCAR` | Texto da pergunta "Posso remarcar?" (vazio esconde a pergunta) |

Se `CHAVE_PIX` e `LINK_PAGAMENTO` ficarem vazios, a página manda a paciente direto para o
WhatsApp pedir os dados de pagamento.

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
index.html            página
assets/css/style.css  estilos (cores e fontes da identidade PRC)
assets/js/config.js   configurações editáveis
assets/js/main.js     formulário, Pix, WhatsApp e Pixel
assets/img/           logo e fotos do site da clínica
```
