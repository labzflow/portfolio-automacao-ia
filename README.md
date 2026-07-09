# Portfólio — Automação & Agentes de IA no WhatsApp

🇧🇷 **Português** | 🇬🇧 [English](README.en.md)

Agentes conversacionais de IA **em produção** para pequenos negócios, construídos em **n8n** integrando LLMs, WhatsApp, bancos de dados e APIs de calendário/mídia.

> ⚠️ **Privacidade & anonimização**
> Este repositório é focado em **arquitetura e engenharia**. Nenhuma credencial, chave de API, token, dado de cliente, telefone, e-mail ou nome de pessoa real está incluído. Os trechos de código são anonimizados e usam *placeholders*. Os estabelecimentos e clientes finais são descritos apenas pelo **segmento de mercado**, sem identificação.

---

## Visão geral

Cada agente é um assistente de WhatsApp que atende clientes 24/7: entende linguagem natural (e mídia), executa ações de negócio, integra com sistemas reais e escala para um humano quando necessário.

| Projeto | Segmento | O que faz | Status |
|---|---|---|---|
| **[Priscila](projetos/priscila.md)** | Barbearia | Agendamento / reagendamento / cancelamento no WhatsApp, com calendário, preços via RAG e handoff humano | ✅ Produção |
| **[Nina](projetos/nina.md)** | Estúdio de tatuagem | Triagem multimodal de leads (texto/áudio/imagem), FAQ, envio de portfólio, moderação e memória de longo prazo | ✅ Produção |
| **[EVA](projetos/eva.md)** | Materiais odontológicos (B2B) | Atendimento B2B a dentistas: cotação/preços via RAG, montagem de pedido, catálogo e handoff para vendedor | ✅ Produção |
| **[Dispara-Zap](projetos/dispara-zap.md)** | SaaS / Marketing | Plataforma multi-tenant de campanhas WhatsApp com cadência, anti-ban por telemetria e whitelabel | ✅ Produção |
| **[ICA Avaliações](projetos/ica-avaliacoes.md)** | Avaliações técnicas | SPA de pareceres/laudos com multi-tenancy por avaliador (Supabase RLS), PDF e QR de verificação | ✅ Produção |
| **[SDR Previdenciário](projetos/sdr-previdenciario.md)** | Advocacia previdenciária | Agente SDR (em código) de qualificação de leads + agendamento no WhatsApp, com guardrails | 🛠️ Em desenvolvimento |

---

## Stack

- **Orquestração:** n8n (workflows + sub-workflows)
- **LLMs:** OpenAI (GPT) · Anthropic (Claude) como *fallback*
- **Canais WhatsApp:** Quepasa · WUZAPI (webhooks + envio)
- **Dados & memória:** Supabase / PostgreSQL (+ pgvector) · Redis
- **Integrações:** Google Calendar · Google Sheets · Google Drive
- **Padrões de IA:** RAG · *tool-calling* · *guardrails*/moderação · memória curta + longa · *fallback* multi-modelo

---

## Padrões de engenharia (comuns aos agentes)

- **Buffer / debounce de mensagens** — agrupa mensagens rápidas do cliente antes de responder (Redis), evitando respostas fragmentadas.
- **Handoff humano** — pausa/retoma o bot por palavra-chave e controla os contatos "em atendimento humano" em banco.
- **Resolução de data determinística** — o cálculo de datas sai do LLM e vai para código, eliminando erros de "hoje/amanhã".
- **Envio resiliente (fallback)** — se a entrega ao número falha, um caminho alternativo reenvia com o número normalizado.
- **Presença humanizada** — status "online/digitando" e divisão da resposta em mensagens curtas.
- **Observabilidade** — rastreio de custo de token por conversa.

---

## Trechos de código (anonimizados)

- [`snippets/resolver-data-deterministico.js`](snippets/resolver-data-deterministico.js) — resolvedor de datas relativas em código (tira a aritmética de data do LLM).
- [`snippets/busca-horarios-duracao.js`](snippets/busca-horarios-duracao.js) — geração de slots de agenda ciente da duração do serviço.

---

## Sobre

Desenvolvimento de **agentes de IA para atendimento e automação no WhatsApp**, do desenho da arquitetura à operação em produção: integração de LLMs com sistemas reais (agenda, banco, mídia), tratamento de casos de borda, resiliência e observabilidade.
