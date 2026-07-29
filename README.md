# REOS — Real Estate Operating System (GoHighLevel)

GHL-native **Phase 1 AI team** (Researcher + Coordinator + Concierge + Scheduler + Follow-Up + Scout + Compliance Guard): confirm reachability, assign/route, qualify, book, nurture, daily-prioritize, and stop outreach on opt-out using Conversation AI and Workflows inside GoHighLevel.

This repo seeds CRM fields and ships **full build documentation**. There is **no** external AI orchestration server for the MVP.

## Documentation

**Start with the build guide:** [`docs/BUILD.md`](docs/BUILD.md)

| Doc | Purpose |
|---|---|
| [`docs/BUILD.md`](docs/BUILD.md) | Master REOS build (phases 0–8) |
| [`docs/build/CHECKLIST.md`](docs/build/CHECKLIST.md) | Master build checkboxes |
| [`docs/build/REFERENCE.md`](docs/build/REFERENCE.md) | Tags, bots, workflow catalog |
| [`docs/WORKFLOWS.md`](docs/WORKFLOWS.md) | Workflow action tables |
| [`docs/TESTING.md`](docs/TESTING.md) | Smoke tests |
| [`docs/ONBOARDING.md`](docs/ONBOARDING.md) | Client install after Snapshot |
| [`docs/CUSTOMER-ONBOARDING.md`](docs/CUSTOMER-ONBOARDING.md) | Sales → Support → customer journey |
| [`docs/README.md`](docs/README.md) | Full docs index |

Prompt packs: [`docs/prompts/`](docs/prompts/)

## Quick start (master location)

### 1. Connect GHL

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

### 3. Build REOS in GHL

Follow **[`docs/BUILD.md`](docs/BUILD.md)** in order (fields → tags → pipeline → calendar → bots → workflows → lists → sources → test → Snapshot).

Use [`docs/WORKFLOWS.md`](docs/WORKFLOWS.md) for click-path workflow steps and [`docs/prompts/`](docs/prompts/) for Bot Goals.

### 4. Test

[`docs/TESTING.md`](docs/TESTING.md)

### 5. Snapshot and client installs

[`docs/build/08-snapshot-master.md`](docs/build/08-snapshot-master.md) then [`docs/ONBOARDING.md`](docs/ONBOARDING.md) (CSV: [`docs/REOS-Onboarding-Checklist.csv`](docs/REOS-Onboarding-Checklist.csv)).

## Architecture (product)

```text
Lead → Intake → Researcher → Coordinator
  → Concierge qualify
  → Hot/ready_to_book → Scheduler
  → Warm/Cold → Follow-Up
  → Scout daily catch
  → Compliance Guard on opt-out
```

SaaS accounts: Sales (Closed Won) → Support form/tracker → Customer REOS sub-account (Snapshot). See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

| In GHL | In this repo |
|---|---|
| Bots, workflows, calendar, pipeline, tags | Field seed script, prompts, build + test docs |

## Scripts

| Command | Purpose |
|---|---|
| `npm run connect` | Verify PIT + location |
| `npm run seed:fields` | Create/skip contact custom fields |
| `npm run typecheck` | TypeScript check |

## Custom fields (contact)

- **Intent:** Lead Type, Lead Temperature  
- **Buyer / Seller / Investor:** profile fields  
- **Contact Preferences:** Preferred Channel, Preferred Language  
- **AI:** AI Summary, Qualification Score, Recommended Next Action, Agent Brief  

Identity (name/phone/email) uses native GHL fields.
