# REOS — Real Estate Operating System (GoHighLevel)

GHL-native **Phase 1 AI team** (Researcher + Coordinator + Concierge + Scheduler + Follow-Up + Scout + Compliance Guard): confirm reachability, assign/route, qualify, book, nurture, daily-prioritize, and stop outreach on opt-out — using Conversation AI and Workflows inside GoHighLevel.

This repo seeds CRM fields and ships copy-paste setup docs. There is **no** external AI orchestration server for the MVP.

## Quick start

### 1. Connect GHL (Private Integration Token)

```bash
cp .env.example .env
# set GHL_PRIVATE_TOKEN and GHL_LOCATION_ID
npm install
npm run connect
```

### 2. Seed contact custom fields

```bash
npm run seed:fields
```

### 3. Configure GHL (manual)

Follow **[`docs/GHL_SETUP.md`](docs/GHL_SETUP.md)** for pipeline, tags, calendar, and bot.

Build automations from **[`docs/WORKFLOWS.md`](docs/WORKFLOWS.md)** (Intake, Researcher, Coordinator, Compliance Guard, Appointment Booked, Hot, Warm, Cold, Handoff, Scheduler, Follow-Up, Scout).

Paste bot / agent instructions from:

- **[`docs/prompts/researcher.md`](docs/prompts/researcher.md)** — channel + language (workflow MVP)  
- **[`docs/prompts/coordinator.md`](docs/prompts/coordinator.md)** — assign + which bot (workflow)  
- **[`docs/prompts/compliance-guard.md`](docs/prompts/compliance-guard.md)** — opt-out kill-switch (workflow)  
- **[`docs/prompts/lead-concierge.md`](docs/prompts/lead-concierge.md)** — qualify  
- **[`docs/prompts/scheduler.md`](docs/prompts/scheduler.md)** — book  
- **[`docs/prompts/follow-up.md`](docs/prompts/follow-up.md)** — nurture  
- **[`docs/prompts/scout.md`](docs/prompts/scout.md)** — daily priority (workflow, not a chat bot)

### 4. Test

Use **[`docs/TESTING.md`](docs/TESTING.md)**.

## Architecture

```text
Lead → GHL Form/FB/SMS
    → Intake (opportunity + ai_qualifying)
    → Researcher (channel tags + researcher_done)
    → Coordinator (assign + exclusive bot; respects compliance_hold)
    → Concierge: qualify + score + brief
    → Hot/ready_to_book → Scheduler books
    → Warm/Cold → Follow-Up → ready_to_book → Scheduler
    → Scout: daily Hot booking catch
    → Compliance Guard: opted_out → all bots Inactive
```

| In GHL | In this repo |
|---|---|
| Bot, workflows, calendar, pipeline, tags | Field seed script, prompts, setup + test docs |

## Scripts

| Command | Purpose |
|---|---|
| `npm run connect` | Verify PIT + location |
| `npm run seed:fields` | Create/skip contact custom fields |
| `npm run typecheck` | TypeScript check |

## Custom fields (contact)

- **Intent:** Lead Type, Lead Temperature  
- **Buyer:** Target Location, Budget, Property Type, Financing Status, Timeline, Must Have Features  
- **Seller:** Property Address, Estimated Value, Selling Timeline, Motivation  
- **Investor:** Investment Strategy, Target Markets, Investment Goals  
- **Contact Preferences:** Preferred Channel, Preferred Language  
- **AI:** AI Summary, Qualification Score, Recommended Next Action, Agent Brief  

Identity (name/phone/email) uses native GHL fields.
