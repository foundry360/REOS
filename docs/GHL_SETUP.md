# REOS Lead Concierge — GHL Setup Guide

Simple native workflow. No external AI server.

**Flow:** Lead arrives → **Researcher** (channel) → **Coordinator** (assign + which bot) → **Concierge** qualifies → Hot/`ready_to_book` → **Scheduler** · Warm/Cold → **Follow-Up** · **Scout** daily priority · **Compliance Guard** stops bots on opt-out.

Prompt packs: [`prompts/lead-concierge.md`](prompts/lead-concierge.md) · [`prompts/scheduler.md`](prompts/scheduler.md) · [`prompts/follow-up.md`](prompts/follow-up.md) · [`prompts/scout.md`](prompts/scout.md) · [`prompts/researcher.md`](prompts/researcher.md) · [`prompts/coordinator.md`](prompts/coordinator.md) · [`prompts/compliance-guard.md`](prompts/compliance-guard.md)  
Workflows: [`WORKFLOWS.md`](WORKFLOWS.md)

---

## 0. Prerequisites

- Sub-account with Conversation AI (and Appointment Booking if available)
- Phone number connected for SMS
- Private Integration Token with `locations/customFields` scopes (for field seeding from this repo)

---

## 1. Seed custom fields

From this repo:

```bash
npm run seed:fields
```

Verify in GHL: **Settings → Custom Fields** (contact). You should see Intent, Buyer/Seller/Investor Profile, **Contact Preferences** (Preferred Channel / Language), and AI fields.

Organize into folders in the UI if they appear ungrouped.

---

## 2. Create tags

**Settings → Tags** — create:

| Tag | Purpose |
|---|---|
| `temp_hot` | Immediate agent notify + appointment path |
| `temp_warm` | Weekly nurture |
| `temp_cold` | Monthly nurture |
| `ai_handoff` | Human takeover |
| `ai_qualifying` | Intake queued; starts Researcher |
| `researcher_done` | Researcher finished |
| `needs_contact_info` | Missing phone and email |
| `opted_out` | Compliance Guard — lead asked to stop |
| `compliance_hold` | Compliance Guard — bots must stay off |
| `dnd` | Optional — also starts Compliance Guard |
| `lead_buyer` | Optional mirror of Lead Type |
| `lead_seller` | Optional |
| `lead_investor` | Optional |

---

## 3. Pipeline: `REOS Leads`

**Opportunities → Pipelines → Add Pipeline**

Stages (in order):

1. New  
2. AI Qualifying  
3. Qualified  
4. Appointment Set  
5. Nurture  
6. Closed Won  
7. Closed Lost  

---

## 4. Calendar

1. **Calendars → Create** a bookable calendar (e.g. `Buyer/Seller Consult`).
2. Set availability, duration (30 min recommended), round-robin if multiple agents.
3. In Conversation AI / Appointment Booking action, connect this calendar.
4. Enable confirmation + reminders (native GHL).

---

## 5. Conversation AI bot

1. Open **AI Agents → Conversation AI**.
2. Create bot: `REOS Lead Concierge`. Set status to **Autopilot** when ready (use Suggestive while testing).
3. Open **Bot Goals** (not Bot Training).
4. Paste from [`docs/prompts/lead-concierge.md`](prompts/lead-concierge.md):
   - §1 → **Personality**
   - §2 → **Goal or Intent**
   - §3 → **Additional Information** (or Additional Instructions)
5. Configure **Bot Actions** from §4 (Contact info, handoff, stop bot — **not** Appointment Booking).
6. Enable channels: **SMS** first; add FB/IG when ready.
7. **Bot Training** optional — skip for launch.

### 5b. Scheduler bot (Phase 1 — The Scheduler)

1. Create bot: **`REOS Scheduler`**.
2. Paste [`prompts/scheduler.md`](prompts/scheduler.md) §1–§3 into Bot Goals.
3. Enable **Appointment Booking** on Buyer/Seller Consult (disable after book **On**).
4. Enable Human handover + Stop bot.
5. Build workflow **`REOS Start Scheduler`** (tag `ready_to_book` → activate Scheduler) — see [`WORKFLOWS.md`](WORKFLOWS.md) Workflow H.
6. On **REOS Hot**, add tag **`ready_to_book`** so Hot leads always reach Scheduler.
7. Turn **Off** Appointment Booking on the Concierge bot if it was enabled earlier.

### 5c. Follow-Up bot (Phase 1 — The Follow-Up)

1. Create bot: **`REOS Follow-Up`**.
2. Paste [`prompts/follow-up.md`](prompts/follow-up.md) §1–§3 into Bot Goals.
3. Actions: Contact info (light), Human handover, Stop bot — **no** Appointment Booking.
4. Build **`REOS Start Follow-Up`**: triggers `temp_warm` / `temp_cold` → Follow-Up Active; Concierge + Scheduler Inactive — see [`WORKFLOWS.md`](WORKFLOWS.md) Workflow I.
5. Keep Warm/Cold drip workflows for email cadence; Follow-Up owns conversational check-ins.

### 5d. Scout (Phase 1 — The Scout)

Scout is a **scheduled workflow**, not a chat bot. See [`prompts/scout.md`](prompts/scout.md).

1. Create tags `scout_priority` (and optional `scout_reviewed`).
2. Build **`REOS Scout — Daily Priority`** — MVP: daily find Hot/Qualified without `appt_booked` → tag `scout_priority` + `ready_to_book` → notify agent ([`WORKFLOWS.md`](WORKFLOWS.md) Workflow J).
3. New leads stay on **REOS Intake** → **Researcher** (Scout’s “new lead” job is Intake + Researcher).

### 5e. Researcher (Phase 1 — The Researcher)

Researcher is a **workflow** (optional chat bot later). See [`prompts/researcher.md`](prompts/researcher.md).

1. Seed fields → Preferred Channel, Preferred Language (`npm run seed:fields`).
2. Create tags `researcher_done`, `needs_contact_info`.
3. **Edit REOS Intake:** keep opp + `ai_qualifying`; **remove** Concierge Active.
4. Build **`REOS Researcher`**: trigger `ai_qualifying` → tags `channel_sms`/`channel_email` + `lang_en` + `researcher_done` ([`WORKFLOWS.md`](WORKFLOWS.md) Workflow K).  
   Prefer **not** starting Concierge here — Coordinator does.  
   (Do not use Update Contact Field for Preferred Channel — GHL often hides it in the workflow list.)

### 5f. Coordinator (Phase 1 — The Coordinator)

Coordinator is a **workflow** (traffic controller). See [`prompts/coordinator.md`](prompts/coordinator.md).

1. Create tags `coordinated`, `coord_email_only`.
2. **Edit REOS Researcher:** remove Concierge Active if present; end on `researcher_done`.
3. Build **`REOS Coordinator`**: triggers on `researcher_done`, `ready_to_book`, `temp_warm`/`temp_cold`, `ai_handoff`, `scout_priority` → assign user → exclusive bot route ([`WORKFLOWS.md`](WORKFLOWS.md) Workflow L).
4. Keep Start Scheduler / Start Follow-Up for now (idempotent) or pause them once Coordinator is proven.

### 5g. Compliance Guard (Phase 1 — The Compliance Guard)

Compliance Guard is a **workflow** (opt-out kill-switch). See [`prompts/compliance-guard.md`](prompts/compliance-guard.md).

1. Create tags `opted_out`, `compliance_hold` (and `dnd` if you use it).
2. Build **`REOS Compliance Guard`**: trigger on those tags → all bots Inactive → tag hold → remove `ready_to_book` → notify ([`WORKFLOWS.md`](WORKFLOWS.md) Workflow M).
3. **Edit REOS Coordinator:** after Assign, before `ai_handoff`, If/Else tags include `compliance_hold` OR `opted_out` → bots Inactive → `coordinated` → End.
4. Paste **COMPLIANCE** blocks into Concierge / Scheduler / Follow-Up Additional Information.

---

## 6. Workflows

**Full click-path guide:** [`WORKFLOWS.md`](WORKFLOWS.md) — build these before finishing bot Appointment Booking.

Keep them linear. Let the bot handle conversational branching.

### Workflow 1 — `REOS Intake`

**Triggers (any):**
- Form Submitted  
- FB Lead Form  
- Contact Created (optional)  
- Inbound SMS (if you want every new text conversation to qualify)

**Actions:**
1. Create/Update Opportunity → Pipeline `New Leads` (or yours), Stage `New`
2. Update Opportunity Stage → `AI Qualifying`
3. Add tag `ai_qualifying` (**required** — starts Researcher)
4. (Optional) Assign to user / round-robin  
**Do not** start Concierge here.

### Workflow 1b — `REOS Researcher`

**Trigger:** Tag `ai_qualifying` added  

**Actions:**
1. If no phone AND no email → tag `needs_contact_info` → notify → end  
2. Else tag `channel_sms` (phone) or `channel_email`  
3. Preferred Language = English (or tag `lang_en`)  
4. Tag `researcher_done`  
5. Do **not** start Concierge (Coordinator does)

### Workflow 1c — `REOS Coordinator`

**Triggers:** `researcher_done`, `ready_to_book`, `temp_warm`, `temp_cold`, `ai_handoff`, `scout_priority`  

**Actions:** Assign if needed → if `compliance_hold`/`opted_out` keep bots off → else route (handoff → booked → email-only → Scheduler → Follow-Up → Concierge) → tag `coordinated`

### Workflow 1d — `REOS Compliance Guard`

**Triggers:** `opted_out`, `compliance_hold`, optional `dnd`  

**Actions:** Assign if needed → all three bots Inactive → tag `opted_out` + `compliance_hold` → remove `ready_to_book` → Internal Notification `REOS: Compliance hold` → no SMS

### Workflow 2 — `REOS Post-Qualify`

**Trigger ideas (pick what your UI supports):**
- Contact tag added: `temp_hot` OR `temp_warm` OR `temp_cold`  
- OR Custom field Lead Temperature is updated  
- OR Bot goal “Score lead” completed  

**Actions:**
1. If Opportunity stage is still `AI Qualifying` → move to `Qualified`
2. If/Else on temperature tag:
   - **Hot:** move stage toward booking if not booked; ensure `temp_hot` present
   - **Warm/Cold:** move stage to `Nurture`
3. If appointment already booked → stage `Appointment Set`
4. Internal notification (optional): Slack/email with `{{contact.agent_brief}}`

### Workflow 3 — `REOS Hot`

**Trigger:** Tag `temp_hot` added  

**Actions:**
1. Notify assigned agent (SMS + email) with Agent Brief / AI Summary  
2. If no appointment: send booking link OR let bot continue booking  
3. Wait / reminder if no appointment in 24h  
4. On appointment booked → stage `Appointment Set` + confirmation to lead  

### Workflow 4 — `REOS Warm & Cold Nurture`

**Trigger:** Tag `temp_warm` OR `temp_cold`  

**If `temp_warm`:**
- Wait 2–3 days → friendly check-in SMS  
- Weekly: market tip / new listings style emails (use Campaigns or email actions)  
- Soft CTA to book consult  

**If `temp_cold`:**
- Monthly market report / seller guide  
- Long-term value; no hard sell  
- Re-enter Hot path if they reply with urgency (bot resumes or tag update)

You can split Warm and Cold into two workflows if easier to manage.

### Optional — `REOS Handoff`

**Trigger:** Tag `ai_handoff`  
**Actions:** Pause AI bot on contact → notify agent → create task “Call lead”

---

## 7. Forms / lead sources

For each inbound source (website form, landing page, FB lead ad):

1. Map name, email, phone  
2. Optionally map source into a note or custom field  
3. Ensure form is attached to **REOS Intake** trigger  

Manual leads: create contact with phone → add to Intake (or tag that starts the bot).

---

## 8. Smoke test

Follow [`docs/TESTING.md`](TESTING.md). Minimum:

1. Submit test form with your cell  
2. Bot greets and asks buy/sell/invest  
3. Custom fields populate on the contact  
4. Score + Temperature + Agent Brief filled  
5. Hot path notifies you; booking works on the calendar  

---

## Architecture reminder

| In GHL | In this repo |
|---|---|
| Bot, workflows, calendar, pipeline, tags, nurture | Field seed script + prompt/setup docs |

No Next.js orchestration layer for this MVP.
