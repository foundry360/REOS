# REOS — Real Estate Operating System (GoHighLevel)

GHL-native **AI Lead Concierge**: qualify inbound leads, update CRM fields, score temperature, book appointments, write an agent brief, and start Hot/Warm/Cold nurture — using Conversation AI and Workflows inside GoHighLevel.

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

Build automations from **[`docs/WORKFLOWS.md`](docs/WORKFLOWS.md)** (Intake, Appointment Booked, Hot, Warm, Cold, Handoff).

Paste bot instructions from **[`docs/prompts/lead-concierge.md`](docs/prompts/lead-concierge.md)**.

### 4. Test

Use **[`docs/TESTING.md`](docs/TESTING.md)**.

## Architecture

```text
Lead → GHL Form/FB/SMS
    → Workflow: Intake (opportunity + start bot)
    → Conversation AI: qualify + update fields + score + brief
    → Book calendar if Hot/ready
    → Tags temp_hot | temp_warm | temp_cold
    → Native nurture / agent notify workflows
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
- **AI:** AI Summary, Qualification Score, Recommended Next Action, Agent Brief  

Identity (name/phone/email) uses native GHL fields.
