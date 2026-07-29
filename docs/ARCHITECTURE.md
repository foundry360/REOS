# REOS Architecture

## Product

REOS (Real Estate Operating System) runs inside GoHighLevel: Conversation AI bots plus Workflows. No external AI orchestration server for MVP.

Phase 1 team:

| Piece | Type | Job |
|---|---|---|
| Intake | Workflow | New lead → opportunity + `ai_qualifying` |
| Researcher | Workflow | Channel/language tags → `researcher_done` |
| Coordinator | Workflow | Assign + exclusive bot route |
| Lead Concierge | Conversation AI | Qualify, score, brief |
| Scheduler | Conversation AI | Book consult |
| Follow-Up | Conversation AI | Warm/Cold nurture chat |
| Scout | Workflow | Daily booking catch |
| Compliance Guard | Workflow | Opt-out → all bots Inactive |

Detail: [`GHL_SETUP.md`](GHL_SETUP.md) · [`WORKFLOWS.md`](WORKFLOWS.md) · [`prompts/`](prompts/)

## Multi-account layout

Referral Partners runs REOS as a multi-location product:

| Sub-account | Purpose | Customer access |
|---|---|---|
| **Sales** | Pipeline, Closed Won, welcome email | No (internal sales) |
| **Support** | Onboarding tracker + help tickets | Form only (no pipeline) |
| **Customer REOS** (one per client) | Snapshot, bots, calendar, day-to-day CRM | Yes (their login) |

```text
Lead (Sales)
  → Closed Won
  → Welcome email (button → Support form)
  → Form creates Contact + Opportunity (Support: REOS Onboarding)
  → Team: create Customer sub-account + install Snapshot
  → Customer finishes setup in THEIR sub-account
  → Support board: New → … → Live → Closed
```

## Critical rules

1. **Customer onboards in their REOS sub-account**, not in Support.
2. **Support** tracks install steps and optional customer support tickets (separate pipelines).
3. **Sales** does not create the REOS opportunity; the Support form (or staff) does for tracking.
4. **Snapshot** carries REOS config into each customer location. Credentials and phone are always manual after install. See [`SNAPSHOT.md`](SNAPSHOT.md).
5. **Conversation AI routing:** owner bot must be **Active last**. Channel openers after Scheduler/Follow-Up Active. Prefer Stop bot Off on Concierge/Scheduler; Compliance Guard handles opt-out.

## Lead path inside a customer REOS account

```text
Form / FB / SMS
  → REOS Intake
  → REOS Researcher
  → REOS Coordinator
  → Concierge (qualify)
       ├─ Hot / ready_to_book → Scheduler → Appointment Booked
       ├─ Warm / Cold → Follow-Up (+ email drips)
       └─ ai_handoff → humans
  → Scout (daily unbooked Hot catch)
  → Compliance Guard (opted_out / compliance_hold)
```

## Data ownership

| Data | Lives in |
|---|---|
| Sales deal | Sales sub-account |
| Onboarding project card | Support `REOS Onboarding` pipeline |
| Help tickets | Support `Support` pipeline (separate) |
| Leads, bots, appointments | Customer REOS sub-account |
| Agency CSS / favicon JS | Agency Company settings (optional) |

Contacts are **not** shared across locations unless you sync them. MVP: Sales contact, Support contact, and customer-location contacts can be separate records linked by email/name in ops notes.

## Related docs

- Customer journey: [`CUSTOMER-ONBOARDING.md`](CUSTOMER-ONBOARDING.md)
- Support build: [`SUPPORT.md`](SUPPORT.md)
- Per-client install: [`ONBOARDING.md`](ONBOARDING.md)
