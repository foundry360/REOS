# REOS Lead Concierge — Workflow Setup

Build these in GHL **Automation → Workflows** before finishing Bot Appointment Booking actions.

**Build order**

1. Tags + Pipeline + Calendar (prereqs)  
2. `REOS Appointment Booked`  
3. `REOS Intake`  
4. `REOS Hot` / `Warm` / `Cold` / `Handoff`  
5. **`REOS Start Scheduler`** (Phase 1 — The Scheduler)  
6. **`REOS Start Follow-Up`** (Phase 1 — The Follow-Up)  
7. `REOS Post-Qualify` (optional — skip)

Prompt packs: [`prompts/lead-concierge.md`](prompts/lead-concierge.md) · [`prompts/scheduler.md`](prompts/scheduler.md) · [`prompts/follow-up.md`](prompts/follow-up.md)  
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
| `ready_to_book` | Yes — Concierge → Scheduler handoff |
| `appt_booked` | Yes — set by Appointment Booked workflow |
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
4. **Add Tag** → **`ready_to_book`** (starts **REOS Start Scheduler**)  
5. **Internal Notification** → Assigned User  

```text
HOT LEAD: {{contact.first_name}} {{contact.last_name}}
Type: {{contact.lead_type}}
Score: {{contact.qualification_score}} ({{contact.lead_temperature}})

{{contact.ai_summary}}

Brief:
{{contact.agent_brief}}
```

(Pick merge fields from GHL custom values.)

6. **Create Task** (optional) — “Call Hot lead — {{contact.first_name}}” due today  
7. **If/Else** — tag `appt_booked` exists?  
   - **Yes** → End  
   - **No** → **Wait 24 hours** → If still no `appt_booked` → Internal Notification reminder to assigned user

**Publish.**

**Manual test:** Add tag `temp_hot` to a test contact that has an opp → you should get the Hot email/task.

---

## Workflow D — `REOS Warm Nurture`

Keep this for **email/SMS drip cadence**. Conversational nurture is **REOS Follow-Up** (Workflow I).

### Trigger

| Setting | Value |
|---|---|
| Trigger | **Contact Tag** |
| Tag | `temp_warm` added |

### Actions (in order)

1. **Find Opportunity** → New Leads  
2. **If/Else** — found?  
   - Yes → **Update Opportunity** → Stage **Nurture**  
   - No → **Create Opportunity** → New Leads / Nurture  
3. **Add Tag** `follow_up_active` (optional; Start Follow-Up can also key off `temp_warm`)  
4. **Wait** → 2 days  
5. **Send SMS** (light) — or skip SMS if Follow-Up bot owns chat check-ins  

```text
Hey {{contact.first_name}} — still thinking things through on your side? Happy to share a couple options when useful. No pressure.
```

6. **Wait** → 5 days  
7. **Send Email** — soft “still looking?”  
8. **Wait** → 7 days  
9. **Send Email** — soft CTA (booking link optional; Scheduler still books)

**Publish.**

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

---

## Workflow H — `REOS Start Scheduler` (Phase 1 — The Scheduler)

Starts the **REOS Scheduler** bot when the Concierge finishes qualifying and the lead should book.

### Prereqs

1. Create Conversation AI bot **REOS Scheduler** using [`prompts/scheduler.md`](prompts/scheduler.md)  
2. Tag **`ready_to_book`** exists  
3. `REOS Appointment Booked` already published  

### Trigger

| Setting | Value |
|---|---|
| Trigger | **Contact Tag** |
| Tag | **`ready_to_book`** added |

Optional second trigger later: `temp_hot` added **and** tag `appt_booked` does not exist (catch Hot leads who never got `ready_to_book`).

### Actions (in order)

1. **If/Else** — has tag `appt_booked`?  
   - **Yes** → End (already booked)  
   - **No** → continue  
2. **If/Else** — has assigned user?  
   - **No** → **Assign to User**  
   - **Yes** → continue  
3. **Update Conversation AI bot and status**  
   - Bot: **REOS Scheduler** (not Concierge)  
   - Status: **Active** / Autopilot  
4. (Optional) **Update Conversation AI** on Concierge → **Inactive** so only Scheduler speaks  
5. (Optional) SMS if Scheduler does not open on its own: “Next I’ll help you pick a consult time.”  

**Publish.**

### Concierge change (required)

On **REOS Lead Concierge**:

1. Re-paste Goal + Additional Info from updated [`prompts/lead-concierge.md`](prompts/lead-concierge.md) (scheduling handoff, not booking)  
2. **Disable Appointment Booking** action on Concierge  
3. Ensure Contact info / prompt adds tag **`ready_to_book`** when Hot or they ask to meet  
   - If Contact info cannot add tags: use **Trigger a workflow** → tiny workflow that only adds `ready_to_book`, **or** add “Add Tag `ready_to_book`” inside **REOS Hot** as well as Start Scheduler  

**MVP tag bridge:** In **`REOS Hot`**, add action **Add Tag `ready_to_book`** near the start (after assign). That way Hot leads always enter Scheduler even if Concierge cannot apply the tag yet.

### Scheduler bot Appointment Booking

Same calendar settings as before (Buyer/Seller Consult):

- Link-only **Off**  
- Disable bot after book **On**  
- Execute workflow **Off** (Appointment Status → Confirmed still runs `REOS Appointment Booked`)  
- Reschedule **On** · Cancel **Off**  

### Manual test (no SMS)

1. On a test contact with an opp: add tag **`ready_to_book`**  
2. Confirm **REOS Start Scheduler** runs → Scheduler bot **Active**  
3. Manually book/confirm appointment → `REOS Appointment Booked` still moves stage + `appt_booked`  

---

## Workflow I — `REOS Start Follow-Up` (Phase 1 — The Follow-Up)

Starts the **REOS Follow-Up** bot for Warm/Cold leads.

### Prereqs

1. Create bot **REOS Follow-Up** from [`prompts/follow-up.md`](prompts/follow-up.md)  
2. Tags `temp_warm`, `temp_cold` exist  
3. Scheduler / Concierge already built  

### Triggers (add both)

| Trigger | Value |
|---|---|
| Contact Tag | `temp_warm` added |
| Contact Tag | `temp_cold` added |

### Actions (in order)

1. **If/Else** — tag `appt_booked` exists? *(or Last appointment at not empty, if that is what you use)*  
   - **Yes** → End  
   - **No** → continue  
2. **If/Else** — tag `ready_to_book` exists?  
   - **Yes** → End (Scheduler owns them)  
   - **No** → continue  
3. **If/Else** — has assigned user?  
   - **No** → Assign to User  
   - **Yes** → continue  
4. On **both** assign branches:  
   - **Update Conversation AI** → **REOS Follow-Up** → **Active**  
   - **Update Conversation AI** → **REOS Concierge** → **Inactive**  
   - **Update Conversation AI** → **REOS Scheduler** → **Inactive** (so Follow-Up owns the thread)  
5. Find/Update opportunity → stage **Nurture** (optional if Warm/Cold workflows already do this)

**Publish.**

### How the three bots hand off

```text
Concierge (qualify)
  ├─ temp_hot / ready_to_book → Scheduler (book)
  └─ temp_warm / temp_cold → Follow-Up (nurture)
Follow-Up hears “let’s meet” → ready_to_book → Scheduler
appt_booked → stop Follow-Up / Scheduler booking path done
```

### Manual test (no SMS)

1. Test contact **without** `appt_booked` / `ready_to_book`  
2. Add tag **`temp_warm`**  
3. Expect **REOS Start Follow-Up** execution → Follow-Up **Active**; Concierge + Scheduler **Inactive**  
4. Add **`ready_to_book`** → Start Scheduler should take over (Follow-Up can stay Inactive on next Scheduler run if you add that step there too)

**Optional:** In **REOS Start Scheduler**, after Scheduler Active, set **Follow-Up → Inactive**.

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

## Wire bots → workflows

| Bot | Appointment Booking | Role |
|---|---|---|
| **REOS Lead Concierge** | **Off** | Qualify → temp + ready_to_book |
| **REOS Scheduler** | **On** | Book consult |
| **REOS Follow-Up** | **Off** | Nurture Warm/Cold → ready_to_book when ready |

---

## Publish checklist

- [ ] Tags including `ready_to_book` + `appt_booked`  
- [ ] Pipeline **New Leads** stages live  
- [ ] Calendar Buyer/Seller Consult has slots  
- [ ] `REOS Appointment Booked` published  
- [ ] `REOS Intake` published + form attached  
- [ ] `REOS Hot` / Warm / Cold / Handoff published  
- [ ] **REOS Scheduler** bot + `REOS Start Scheduler` published  
- [ ] **REOS Follow-Up** bot + `REOS Start Follow-Up` published  
- [ ] Concierge Appointment Booking disabled; Hot adds `ready_to_book`  
- [ ] SMS/live test when connected ([`TESTING.md`](TESTING.md))

---

## Common GHL label mismatches

| This doc says | You might see in GHL |
|---|---|
| Enable Conversation AI bot | Assign Bot / Conversation AI / AI Agent |
| Update Opportunity Stage | Edit Opportunity / Pipeline Stage |
| Internal Notification | Send Email (to user) / Slack / Voice notes |
| Custom field merges | Custom Values picker on contact |

If an action name differs, match by **purpose**, not exact label.
