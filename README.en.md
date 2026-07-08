# Portfolio — Automation & AI Agents on WhatsApp

🇧🇷 [Português](README.md) | 🇬🇧 **English**

Production-grade conversational **AI agents** for small businesses, built on **n8n**, integrating LLMs, WhatsApp, databases and calendar/media APIs.

> ⚠️ **Privacy & anonymization**
> This repository focuses on **architecture and engineering**. No credentials, API keys, tokens, client data, phone numbers, emails or real people's names are included. Code snippets are anonymized and use *placeholders*. Businesses and end-clients are described **by market segment only**, with no identifying details.

---

## Overview

Each agent is a WhatsApp assistant serving customers 24/7: it understands natural language (and media), performs business actions, integrates with real systems, and escalates to a human when needed.

| Project | Segment | What it does | Status |
|---|---|---|---|
| **[Priscila](projetos/priscila.en.md)** | Barbershop | Booking / rescheduling / cancellation on WhatsApp, calendar integration, RAG pricing, human handoff | ✅ Production |
| **[Nina](projetos/nina.en.md)** | Tattoo studio | Multimodal lead triage (text/audio/image), FAQ, portfolio delivery, moderation, long-term memory | ✅ Production |
| **EVA** | — | Documentation in progress | 🔜 |

---

## Stack

- **Orchestration:** n8n (workflows + sub-workflows)
- **LLMs:** OpenAI (GPT) · Anthropic (Claude) as *fallback*
- **WhatsApp channels:** Quepasa · WUZAPI (webhooks + sending)
- **Data & memory:** Supabase / PostgreSQL (+ pgvector) · Redis
- **Integrations:** Google Calendar · Google Sheets · Google Drive
- **AI patterns:** RAG · tool-calling · guardrails/moderation · short- + long-term memory · multi-model fallback

---

## Engineering patterns (shared across agents)

- **Message buffering / debounce** — groups the customer's rapid messages before replying (Redis), avoiding fragmented answers.
- **Human handoff** — pauses/resumes the bot via keyword and tracks "contacts under human handling" in the database.
- **Deterministic date resolution** — date math is moved out of the LLM into code, eliminating "today/tomorrow" errors.
- **Resilient sending (fallback)** — if delivery to the number fails, an alternate path re-sends with the normalized number.
- **Human-like presence** — "online/typing" status and splitting the reply into short messages.
- **Observability** — per-conversation token cost tracking.

---

## Code snippets (anonymized)

- [`snippets/resolver-data-deterministico.js`](snippets/resolver-data-deterministico.js) — relative-date resolver in code (takes date math away from the LLM).
- [`snippets/busca-horarios-duracao.js`](snippets/busca-horarios-duracao.js) — calendar slot generation aware of service duration.

---

## About

Design and operation of **AI agents for customer service and automation on WhatsApp**, from architecture to production: integrating LLMs with real systems (calendar, database, media), edge-case handling, resilience and observability.
