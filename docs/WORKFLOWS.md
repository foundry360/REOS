# REOS Lead Concierge — Workflow Setup

Build these in GHL **Automation → Workflows** before finishing Bot Appointment Booking actions.

**Build order**

1. Tags + Pipeline + Calendar (prereqs)  
2. `REOS Appointment Booked` (small helper — used by bot booking action)  
3. `REOS Intake`  
4. `REOS Hot`  
5. `REOS Warm Nurture`  
6. `REOS Cold Nurture`  
7. `REOS Handoff` (optional)  
8. `REOS Post-Qualify` (optional if tags already drive Hot/Warm/Cold)

Prompt pack: [`prompts/lead-concierge.md`](prompts/lead-concierge.md)  
Full setup: [`GHL_SETUP.md`](GHL_SETUP.md)

---

## Prerequisites (do first)

### Tags — Settings → Tags

| Tag | Required |
|---|---|
| `temp_hot` | Yes |
| `temp_warm` | Yes |
| `temp_cold` | Yes |
| `ai_handoff` | Yes |
| `ai_qualifying` | Optional |
| `lead_buyer` / `lead_seller` / `lead_investor` | Optional |

### Pipeline — Opportunities → Pipelines

Name: **`REOS Leads`**

Stages (exact order):

1. New  
2. AI Qualifying  
3. Qualified  
4. Appointment Set  
5. Nurture  
6. Closed Won  
7. Closed Lost  

### Calendar

Create **`REOS Consult`** (or similar), 30 min, with availability. You’ll select it in the bot’s Appointment Booking action.

---

## Workflow A — `REOS Appointment Booked`

You build this in **Automation → Workflows → Create Workflow**.

### Trigger (pick ONE)

**Option 1 — best for MVP (works even without bot “execute workflow”):**

| Setting | Value |
|---|---|
| Trigger | **Appointment Status** (sometimes labeled *Customer Booked Appointment* / *Appointment Status Changed*) |
| Calendar | `REOS Consult` (your consult calendar) |
| Status | **Booked** / Confirmed |

**Option 2 — if your bot action enrolls a workflow directly:**

| Setting | Value |
|---|---|
| Trigger | Whatever GHL requires to save the workflow (often still Appointment Booked, or a blank/manual enrollment workflow) |
| Then in Bot → Appointment Booking | Turn on **Execute specified workflows on successful appointment booking** → select `REOS Appointment Booked` |

Use **Option 1** unless you’re sure the bot enrollment path is available.

### Actions (in order)

| # | Action | Config |
|---|---|---|
| 1 | **Create/Update Opportunity** or **Update Opportunity Pipeline Stage** | Pipeline `REOS Leads` → Stage **Appointment Set** |
| 2 | **Remove Contact Tag** (optional) | `ai_qualifying` |
| 3 | **Send SMS** (optional) | `You're booked! Reply if you need to reschedule.` |
| 4 | **Internal Notification** / **Send Email** to assigned user | Subject: `Appointment booked — {{contact.first_name}}` · Body: include AI Summary / Agent Brief custom values |

### Filters (optional)

- Only contacts with an opportunity in `REOS Leads`
- Or only appointments on calendar `REOS Consult`

**Publish** when done.

---

## Workflow B — `REOS Intake`

Starts the Concierge when a lead arrives.

### Triggers (add all you use)

| Trigger | Notes |
|---|---|
| Form Submitted | Select your lead forms / landing pages |
| Facebook Lead Form | If using FB leads |
| Contact Created | Optional filter: Phone is not empty |
| Customer Replied / Inbound Message | Optional — only if you want every SMS to start AI |

If “Contact Created” double-fires with Form Submitted, use **only Form Submitted + FB** for MVP.

### Actions

| # | Action | Config |
|---|---|---|
| 1 | Create/Update Opportunity | Pipeline **REOS Leads**, Stage **New**, value optional |
| 2 | Update Opportunity Stage | **AI Qualifying** |
| 3 | Add Contact Tag | `ai_qualifying` (optional) |
| 4 | Assign to User | Round-robin or specific agent (optional) |
| 5 | Conversation AI / Enable Bot | Select **REOS Lead Concierge** bot, channel **SMS** |
| 6 | Send SMS (only if bot does not auto-open) | Short opener is optional — usually let the bot speak first |

GHL label for step 5 varies: **Enable Conversation AI**, **Assign Conversation AI Bot**, **AI Bot**, etc. Pick the action that attaches your Concierge bot to the contact.

### Filters / allowlists

- Require **Phone** present before enabling bot  
- Skip if tag `ai_handoff` already exists  

**Publish.**

---

## Workflow C — `REOS Hot`

Build this next. Pipeline name in your account: **`New Leads`**.

### Trigger

| Setting | Value |
|---|---|
| Trigger | **Contact Tag** |
| Tag | `temp_hot` added |

### Actions (in order)

1. **If/Else** — has assigned user?  
   - No → **Assign to User**  
   - Yes → continue  
2. **Find Opportunity** → pipeline **New Leads**, this contact  
3. **If/Else** — opportunity found?  
   - Yes → **Update Opportunity** → Stage **Qualified** (skip if already Appointment Set, if you can filter)  
   - No → **Create Opportunity** → New Leads / **Qualified**  
4. **Internal Notification** → Assigned User  

```text
HOT LEAD: {{contact.first_name}} {{contact.last_name}}
Type: {{contact.lead_type}}
Score: {{contact.qualification_score}} ({{contact.lead_temperature}})

{{contact.ai_summary}}

Brief:
{{contact.agent_brief}}
```

(Pick merge fields from GHL custom values.)

5. **Create Task** (optional) — “Call Hot lead — {{contact.first_name}}” due today  
6. **If/Else** — has upcoming appointment on Buyer/Seller Consult?  
   - **Yes** → End  
   - **No** → **Wait 24 hours** → If still no appointment → Internal Notification reminder to assigned user (+ optional booking link SMS to lead)

**Publish.**

**Manual test:** Add tag `temp_hot` to a test contact that has an opp → you should get the Hot email/task.

---

## Workflow D — `REOS Warm Nurture`

### Trigger

| Setting | Value |
|---|---|
| Trigger | **Contact Tag** |
| Tag | `temp_warm` added |

### Actions (in order)

1. **Find Opportunity** → New Leads  
2. **If/Else** — found?  
   - Yes → **Update Opportunity** → Stage **Nurture** (use your nurture/long-term stage name if different)  
   - No → **Create Opportunity** → New Leads / Nurture  
3. **Wait** → 2 days  
4. **Send SMS**

```text
Hey {{contact.first_name}} — still thinking things through on your side? Happy to share a couple options when useful. No pressure.
```

5. **Wait** → 5 days  
6. **Send Email** — soft “still looking?” + booking link  
7. **Wait** → 7 days  
8. **Send SMS** — soft CTA to book a consult  

**Publish.**

**Manual test:** Add tag `temp_warm` → opp moves to Nurture; wait steps will show as waiting in execution.

---

## Workflow E — `REOS Cold Nurture`

### Trigger

| Setting | Value |
|---|---|
| Trigger | **Contact Tag** |
| Tag | `temp_cold` added |

### Actions (in order)

1. **Find Opportunity** → New Leads  
2. **If/Else** — found?  
   - Yes → **Update Opportunity** → Stage **Nurture**  
   - No → **Create Opportunity** → New Leads / Nurture  
3. **Wait** → 7 days  
4. **Send Email** — long-term value (buyer guide / seller checklist)  
5. **Wait** → 30 days  
6. **Send Email** — monthly market note  
7. **Wait** → 30 days  
8. **Send Email** — repeat monthly (or enroll in a Cold campaign)

No hard booking push.

**Publish.**

---

## Workflow F — `REOS Handoff` (recommended)

### Trigger

| Setting | Value |
|---|---|
| Trigger | **Contact Tag** |
| Tag | `ai_handoff` added |

### Actions (in order)

1. **Update Conversation AI bot and status** → same Concierge bot → **Inactive**  
2. **If/Else** — has assigned user?  
   - No → **Assign to User**  
   - Yes → continue  
3. **Internal Notification** → Assigned User — “Human handoff requested”  
4. **Create Task** — “Call lead — handoff” due today  
5. **Send SMS** (optional) to contact:

```text
Totally understand — a team member will reach out shortly.
```

**Publish.**

**Publish.**

---

## Workflow G — `REOS Post-Qualify` (optional)

Only needed if you want a single place that reacts to temperature before Hot/Warm/Cold workflows.

**Trigger:** Tag added `temp_hot` OR `temp_warm` OR `temp_cold`  

**Actions:**

1. Opportunity → **Qualified**  
2. If/Else on tag:
   - Hot → (Hot workflow can also trigger from same tag; avoid double-notify — either use this OR Workflow C, not both for the same notify step)
   - Warm/Cold → Stage **Nurture**

**MVP tip:** Skip G. Use **C + D + E** only.

---

## Wire bot → workflows

Back in **Conversation AI → Bot Goals → Appointment Booking** action:

1. Calendar = **REOS Consult**  
2. Send booking link only = **Off**  
3. Disable bot after booking = **On**  
4. Execute workflow on booking = **On** → select **`REOS Appointment Booked`**  
5. Transfer to employee = optional  
6. Cancel = **Off** (MVP)  
7. Reschedule = **On** (or Off)

Ensure bot actions also add tags `temp_hot` / `temp_warm` / `temp_cold` / `ai_handoff` when those outcomes happen (see prompt pack §4).

---

## Publish checklist

- [ ] Tags created  
- [ ] Pipeline `REOS Leads` live  
- [ ] Calendar `REOS Consult` has slots  
- [ ] `REOS Appointment Booked` published  
- [ ] `REOS Intake` published + form attached  
- [ ] `REOS Hot` published  
- [ ] `REOS Warm Nurture` published  
- [ ] `REOS Cold Nurture` published  
- [ ] `REOS Handoff` published (optional)  
- [ ] Bot Appointment Booking points at Appointment Booked workflow  
- [ ] Test with your phone ([`TESTING.md`](TESTING.md) Scenario A)

---

## Common GHL label mismatches

| This doc says | You might see in GHL |
|---|---|
| Enable Conversation AI bot | Assign Bot / Conversation AI / AI Agent |
| Update Opportunity Stage | Edit Opportunity / Pipeline Stage |
| Internal Notification | Send Email (to user) / Slack / Voice notes |
| Custom field merges | Custom Values picker on contact |

If an action name differs, match by **purpose**, not exact label.
