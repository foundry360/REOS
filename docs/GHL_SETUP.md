# REOS Lead Concierge — GHL Setup Guide

Simple native workflow. No external AI server.

**Flow:** Lead arrives → **Concierge** qualifies → Hot/`ready_to_book` → **Scheduler** books · Warm/Cold → **Follow-Up** nurtures → back to Scheduler when ready.

Prompt packs: [`prompts/lead-concierge.md`](prompts/lead-concierge.md) · [`prompts/scheduler.md`](prompts/scheduler.md) · [`prompts/follow-up.md`](prompts/follow-up.md)  
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

Verify in GHL: **Settings → Custom Fields** (contact). You should see Intent, Buyer/Seller/Investor Profile, and AI fields.

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
3. New leads stay on **REOS Intake** (Scout’s “new lead” job).

---

## 6. Workflows

**Full click-path guide:** [`WORKFLOWS.md`](WORKFLOWS.md) — build these before finishing bot Appointment Booking.

Keep them linear. Let the bot handle conversational branching.

### Workflow 1 — `REOS Intake`

**Triggers (any):**
- Form Submitted  
- FB Lead Form  
- Contact Created (optional filter: has phone)  
- Inbound SMS (if you want every new text conversation to qualify)

**Actions:**
1. Create/Update Opportunity → Pipeline `REOS Leads`, Stage `New`
2. Update Opportunity Stage → `AI Qualifying`
3. Add tag `ai_qualifying` (optional)
4. **Start Conversation AI** / Send to Concierge bot  
   - Or: SMS first message + enable bot on contact  
5. (Optional) Assign to user / round-robin

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
