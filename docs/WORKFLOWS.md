# REOS Lead Concierge — Workflow Setup

Build these in GHL **Automation → Workflows** before finishing Bot Appointment Booking actions.

**Phased build hub:** [`BUILD.md`](BUILD.md) · workflow phase: [`build/04-workflows.md`](build/04-workflows.md)

**Build order**

1. Tags + Pipeline + Calendar (prereqs)  
2. `REOS Appointment Booked`  
3. `REOS Intake` (opp + `ai_qualifying` — **does not** start Concierge)  
4. **`REOS Researcher`** (Phase 1 — channel tags + `researcher_done`)  
5. **`REOS Coordinator`** (Phase 1 — assign + exclusive bot route)  
6. **`REOS Compliance Guard`** (Phase 1 — opt-out kill-switch)  
7. `REOS Hot` / `Warm` / `Cold` / `Handoff`  
8. **`REOS Start Scheduler`** (optional if Coordinator owns Scheduler route)  
9. **`REOS Start Follow-Up`** (optional if Coordinator owns Follow-Up route)  
10. **`REOS Scout — Daily Priority`** (Phase 1 — The Scout)  
11. `REOS Post-Qualify` (optional — skip)

Prompt packs: [`prompts/lead-concierge.md`](prompts/lead-concierge.md) · [`prompts/scheduler.md`](prompts/scheduler.md) · [`prompts/follow-up.md`](prompts/follow-up.md) · [`prompts/scout.md`](prompts/scout.md) · [`prompts/researcher.md`](prompts/researcher.md) · [`prompts/coordinator.md`](prompts/coordinator.md) · [`prompts/compliance-guard.md`](prompts/compliance-guard.md)  
Full setup: [`GHL_SETUP.md`](GHL_SETUP.md)

---

## Prerequisites (do first)

### Tags — Settings → Tags

| Tag | Required |
|---|---|
| `temp_hot` | Yes |
| `temp_warm` | Yes |
| `temp_cold` | Yes |
| `timeline_0_30` / `timeline_1_3` / `timeline_3_6` / `timeline_6_plus` / `timeline_exploring` | Yes — Warm/Cold drip branching |
| `ai_handoff` | Yes |
| `ai_qualifying` | Optional |
| `ready_to_book` | Yes — Concierge → Scheduler handoff |
| `appt_booked` | Yes — set by Appointment Booked workflow |
| `scout_priority` | Yes — Scout Daily P1 |
| `scout_reviewed` | Optional — Daily Scout touched today |
| `researcher_done` | Yes — Researcher finished; Concierge may run |
| `needs_contact_info` | Yes — missing phone and email |
| `channel_sms` / `channel_email` | Yes — Researcher channel (workflow picker often misses Preferred Channel field) |
| `lang_en` / `lang_es` | Yes — language; start with `lang_en` |
| `coordinated` | Yes — Coordinator finished a route pass |
| `coord_email_only` | Yes — email-only; bots off, human emails |
| `opted_out` | Yes — Compliance Guard; lead asked to stop |
| `compliance_hold` | Yes — bots must stay off; Coordinator respects this |
| `dnd` | Optional — alias that also starts Compliance Guard |
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
| 2 | **Add Contact Tag** | `appt_booked` |
| 3 | **Remove Contact Tag** | `ready_to_book` — required so “ready to book” smart lists clear |
| 4 | **Remove Contact Tag** (optional) | `ai_qualifying` |
| 5 | **Update Conversation AI** | **REOS Concierge** → **Inactive** |
| 6 | **Update Conversation AI** | **REOS Scheduler** → **Inactive** (Scheduler “disable after book” may already do this) |
| 7 | **Update Conversation AI** | **REOS Follow-Up** → **Active** (**last** — owns post-book Q&A / reschedule requests) |
| 8 | **If/Else — confirm on channel** (after Follow-Up Active; check Meta before SMS) | Same body on each opener path: `You're booked! Reply here if you need to reschedule.` |
| 8a | Tags include `source_facebook` | **Messenger** / **Facebook Interactive Messenger** → Reply to DM |
| 8b | Tags include `source_instagram` | **Instagram Interactive Messenger** |
| 8c | Tags include `channel_sms` | **Send SMS** |
| 8d | None | skip contact message (agent notify still runs) |
| 9 | **Internal Notification** / **Send Email** to assigned user | Subject: `Appointment booked — {{contact.first_name}}` · Body: include AI Summary / Agent Brief custom values |

**Why Follow-Up Active:** Scheduler turns off after book. Without assigning Follow-Up **Active** last, Assigned stays Scheduler Inactive and post-book replies go unanswered. Follow-Up answers questions quietly; if they need to reschedule, it tags `ready_to_book` so Scheduler takes over again.

### Filters (optional)

- Only contacts with an opportunity in `REOS Leads`
- Or only appointments on calendar `REOS Consult`

**Publish** when done.

---

## Workflow B — `REOS Intake`

Creates the opportunity and queues research. **Does not** start Concierge — **REOS Researcher** tags channel, then **REOS Coordinator** starts Concierge.

### Triggers (add all you use)

| Trigger | Notes |
|---|---|
| Form Submitted | Select your lead forms / landing pages |
| Facebook Lead Form | If using FB leads |
| Contact Created | Optional |
| Customer Replied / Inbound Message | Optional — only if you want every SMS to start AI |

If “Contact Created” double-fires with Form Submitted, use **only Form Submitted + FB** for MVP.

### Actions

| # | Action | Config |
|---|---|---|
| 1 | Create/Update Opportunity | Pipeline **New Leads** (or your pipeline), Stage **New** |
| 2 | Update Opportunity Stage | **AI Qualifying** |
| 3 | Add Contact Tag | `ai_qualifying` (**required** — starts Researcher) |
| 4 | Assign to User | Round-robin or specific agent (optional) |

**Remove** any “Update Conversation AI → Concierge Active” step from Intake if you already built it — **REOS Coordinator** starts Concierge after `researcher_done`.

Skip if tag `ai_handoff` already exists.

**Publish.**

---

## Workflow K — `REOS Researcher` (Phase 1 — The Researcher)

Confirms contact details, Preferred Channel, and Preferred Language — then starts Concierge.

Prompt: [`prompts/researcher.md`](prompts/researcher.md)

### Trigger

| Setting | Value |
|---|---|
| Trigger | **Contact Tag** |
| Tag | `ai_qualifying` added |

### Actions (MVP — workflow only, no Researcher chat bot)

**Note:** Preferred Channel / Preferred Language often appear on the contact but **not** in Workflow → Update Contact Field. Use tags below.

| # | Action | Config |
|---|---|---|
| 1 | If/Else | Phone empty **AND** Email empty? |
| 1a | Yes → Add Tag | `needs_contact_info` |
| 1b | Yes → Internal Notification | Assigned user: “Lead missing phone & email — cannot start Concierge” |
| 1c | Yes → **End** (do not start Concierge) |
| 2 | No (has phone or email) → If/Else | Phone present? |
| 2a | Yes → Add Tag | `channel_sms` |
| 2b | No → Add Tag | `channel_email` |
| 3 | Add Tag | `lang_en` |
| 4 | Add Tag | `researcher_done` |
| 5 | Remove Tag | `needs_contact_info` (if present) |
| 6 | Update Conversation AI | **Skip if using Coordinator** — else Concierge Active · Scheduler Inactive · Follow-Up Inactive |

**Preferred with Coordinator:** Researcher ends at step 5 (`researcher_done`). **REOS Coordinator** starts Concierge.

**Optional later:** Researcher Conversation AI bot when SMS is live and you want to *ask* for missing phone/language instead of ending.

### If you already start Concierge from Intake

1. Open **REOS Intake** → delete Concierge Active step  
2. Publish Intake  
3. Publish **REOS Researcher** as above  

**Manual test:** Contact with phone → add `ai_qualifying` → `channel_sms` + `researcher_done`. Contact with neither phone nor email → `needs_contact_info`.

**Publish.**

---

## Workflow K2 — `REOS Field Sync` (non-premium CRM log)

Conversation AI **Contact Info** often fails to overwrite fields (and may not fire on social). This workflow appends each inbound message into **AI Summary** without GPT/OpenAI premium actions.

| Setting | Value |
|---|---|
| Trigger | **Customer Replied** (no channel filter) |
| If/Else | Tags include `research_done` (use your GHL spelling) → continue; else **End** |
| Action | **Update Contact Field** → **AI Summary** = existing AI Summary custom value + `{{message.body}}` |

**Notes**
- Appends the **latest inbound message only** (not a polished Concierge summary).
- Contact Info can still fill **empty** fields when it works (e.g. Business Name).
- Do not use GPT Powered by OpenAI unless you later want structured extraction/overwrite.
- Re-publish **REOS IG Bridge** separately when IG testing resumes (it was paused during FB debug).

**Publish.**

---

## Workflow K3 — `REOS Reactivate Concierge` (optional)

**Prefer native Stop bot setting:** on Concierge **Stop bot** action, enable **Reactivate bot after** (e.g. 5–10 min) for goodbye-style pauses. Disable that checkbox for lasting human handoff. Custom tag on Stop bot is optional.

Only build this workflow if you need tag-based reactivation:

| Setting | Value |
|---|---|
| Trigger | **Contact Tag** → `Stop bot` **removed** |
| If/Else | `compliance_hold` OR `opted_out` → **End** (stay off) |
| Else | **Update Conversation AI** → Concierge **Active**; Scheduler + Follow-Up **Inactive** |

---

## Workflow L — `REOS Coordinator` (Phase 1 — The Coordinator)

Assigns the human owner and turns on **exactly one** specialist bot (or none). Respects channel tags from Researcher.

Prompt: [`prompts/coordinator.md`](prompts/coordinator.md)

### Triggers (add all)

| Trigger | Tag |
|---|---|
| Contact Tag | `researcher_done` added |
| Contact Tag | `ready_to_book` added |
| Contact Tag | `temp_warm` added |
| Contact Tag | `temp_cold` added |
| Contact Tag | `ai_handoff` added |
| Contact Tag | `scout_priority` added |

### Actions (in order)

**A — Always first**

1. **If/Else** — has assigned user?  
   - No → **Assign to User**  
   - Yes → continue  

**A2 — Compliance block (before any bot activation)**

2. **If/Else** — tags include `compliance_hold` **OR** `opted_out`?  
   - **Yes** → Concierge / Scheduler / Follow-Up all **Inactive** → Add Tag `coordinated` → **End**  
   - **None** → continue  

**B — Route (nested If/Else, first match wins)**

3. **If/Else** — has tag `ai_handoff`?  
   - **Yes** → Concierge / Scheduler / Follow-Up all **Inactive** → Internal Notification “Human handoff” → Add Tag `coordinated` → **End**  
   - **No** → continue  

4. **If/Else** — has tag `ready_to_book`?  
   - **Yes** → Concierge **Inactive** → Follow-Up **Inactive** → Scheduler **Active** (last) → **channel opener** (see below) → Add Tag `coordinated` → **End**  
   - **No** → continue  
   - **Why before `appt_booked`:** first book and **reschedule** both use `ready_to_book`. Appointment Booked removes that tag after a successful book; Follow-Up can re-add it when they ask to move the time.  
   - **Why opener:** Conversation AI does not auto-speak when activated mid-thread; without this, Scheduler stays silent until the lead messages again.  
   - **Opener by channel** — do **not** stack all three on every contact. After Scheduler Active, add **If/Else** on tags, then one opener per branch:  
     | Tag | Action (Communication) |  
     |---|---|  
     | `source_facebook` or Messenger contact | **Facebook Interactive Messenger** / **Messenger** → Reply to DM |  
     | `source_instagram` **OR** `channel_instagram` | **Instagram Interactive Messenger** |  
     | Live Chat (no Meta tag; or tag you use for widget) | **Send Live Chat Message** |  
     | `channel_sms` | **Send SMS** |  
     | None / unknown | skip opener (lead must reply) or Internal Notification |  
   - Same body on every opener: `Great. Let's get a consult on the calendar. Do mornings or afternoons work better?` 

5. **If/Else** — has tag `appt_booked`?  
   - **Yes** → Concierge **Inactive** → Scheduler **Inactive** → Follow-Up **Active** (last) → Add Tag `coordinated` → **End**  
   - **No** → continue  
   - **Why Follow-Up:** post-book questions and light support; do not leave Assigned = Scheduler Inactive.  

6. **If/Else** — has tag `channel_email` **AND** Phone empty?  
   - **Yes** → Add Tag `coord_email_only` → all three bots **Inactive** → Internal Notification: “Email-only lead — reach out by email” → Add Tag `coordinated` → **End**  
   - **No** → continue  

**Critical — action order:** each **Update Conversation AI** step **assigns** that bot to the contact. The **last** step wins as Assigned bot. Always put the bot that should own the thread **last**, with the status you want (usually **Active**). Putting Follow-Up/Scheduler **Inactive** last leaves Assigned = that bot + Inactive (silent forever). That is why the conversation UI says change bots in sub-account settings — Assigned is locked by workflow.

7. **If/Else** — has tag `temp_warm` **OR** `temp_cold`?  
   - **Yes** → Concierge **Inactive** → Scheduler **Inactive** → Follow-Up **Active** (last) → Add Tag `coordinated` → **End**  
   - **No** → continue  

8. **Else** (usually `researcher_done`) → Scheduler **Inactive** → Follow-Up **Inactive** → Concierge **Active** (last) → Add Tag `coordinated`

**C — Scout ping (optional branch before End on any path that continues)**

If trigger was `scout_priority` and you did not already notify: **Internal Notification** → “Scout priority: {{contact.first_name}}”

### Clean handoff from Researcher

1. Open **REOS Researcher** → remove Concierge Active (if present)  
2. Researcher should end on `researcher_done`  
3. Publish both Researcher + Coordinator  

`REOS Start Scheduler` / `REOS Start Follow-Up` may stay published (same bot toggles) or be paused later once Coordinator is trusted.

**Manual test**

| Setup | Add tag | Expect |
|---|---|---|
| Phone + `channel_sms` | `researcher_done` | Concierge Active, `coordinated` |
| Phone | `ready_to_book` | Scheduler Active |
| Phone + `appt_booked` (no `ready_to_book`) | any Coordinator trigger / re-run | Follow-Up Active |
| Phone + `appt_booked` | `ready_to_book` (reschedule) | Scheduler Active |
| Phone | `temp_warm` | Follow-Up Active |
| Email only, no phone, `channel_email` | `researcher_done` | `coord_email_only`, bots Inactive, notify |
| Any | `ai_handoff` | All bots Inactive |

**Publish.**

---

## Workflow M — `REOS Compliance Guard` (Phase 1 — The Compliance Guard)

Opt-out kill-switch: stop all specialist bots and hold Coordinator from reactivating them.

Prompt: [`prompts/compliance-guard.md`](prompts/compliance-guard.md)

### Triggers

Use **separate** Contact Tag triggers (one tag each). Multi-tag on one trigger often does not fire in GHL:

| Trigger | Tag added |
|---|---|
| Contact Tag | `opted_out` |
| Contact Tag | `compliance_hold` |
| Contact Tag | `dnd` (optional) |

Optional later: Customer reply contains STOP / UNSUBSCRIBE / CANCEL → Add Tag `opted_out`.

### Actions (in order)

| # | Action | Config |
|---|---|---|
| 1 | If/Else | Has assigned user? No → Assign to User · Yes → continue |
| 2 | Update Conversation AI | REOS Lead Concierge → **Inactive** |
| 3 | Update Conversation AI | REOS Scheduler → **Inactive** |
| 4 | Update Conversation AI | REOS Follow-Up → **Inactive** |
| 5 | Add Tag | `opted_out` |
| 6 | Add Tag | `compliance_hold` |
| 7 | Remove Tag | `ready_to_book` |
| 8 | Remove Tag | `ai_qualifying` (optional) |
| 9 | Internal Notification | Assigned User — subject `REOS: Compliance hold` |

**Do not** Send SMS from this workflow. Use native **Update Conversation AI** (not GPT / premium AI actions).

### Coordinator edit (required)

After Assign, before `ai_handoff`, add If/Else: tags include `compliance_hold` OR `opted_out` → all bots Inactive → `coordinated` → End. See Workflow L step **A2**.

**Manual test:** Concierge Active contact → add `opted_out` → all bots Inactive + `compliance_hold`. Then add `researcher_done` → Coordinator keeps bots Inactive.

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

## Nurture drips (Warm / Cold + timeline)

**Split of duties**

| Piece | Job |
|---|---|
| Concierge | Qualifies → Tag Warm/Cold (+ timeline tag) |
| Coordinator / Start Follow-Up | Follow-Up **Active** last + optional chat opener |
| **REOS Warm** / **REOS Cold** (these workflows) | Opp → Nurture, agent notify/task, **email drip** by cadence |
| Follow-Up bot | Replies in chat; escalates to `ready_to_book` when ready |

Prefer **email** for drips so you don’t double-message IG/FB/SMS while Follow-Up owns chat. Use chat opener once at handoff.

### Timeline tags (Concierge Trigger → tiny Add Tag workflows)

| Tag | When |
|---|---|
| `timeline_0_30` | ASAP or 0-30 Days |
| `timeline_1_3` | 1-3 Months |
| `timeline_3_6` | 3-6 Months |
| `timeline_6_plus` | 6+ Months |
| `timeline_exploring` | Just Exploring |

Remove prior `timeline_*` tags when timeline changes (optional cleanup step in each Tag Timeline workflow).

### Exit check (before every Wait send)

If/Else → End drip branch if any of:
- `appt_booked` · `ready_to_book` · `opted_out` · `compliance_hold` · `ai_handoff`

---

## Workflow D — `REOS Warm` (nurture drip)

Conversational nurture is **REOS Follow-Up**. This workflow = CRM + agent alert + **email** cadence.

### Trigger

| Setting | Value |
|---|---|
| Trigger | **Contact Tag** |
| Tag | `temp_warm` added |

### Part A — always (keep what you have)

1. Assign user if empty  
2. Find/Create opportunity → stage **Nurture**  
3. Internal Notification + task (optional)  
   - Subject: `REOS Warm nurture — {{contact.first_name}}`  
   - Body: `{{contact.first_name}} {{contact.last_name}} tagged temp_warm. Opp in Nurture. Follow-Up owns chat; email drip starting.`  
4. If `appt_booked` → **End**

### Part B — chat opener (only if not on Coordinator Lead Temp)

Skip if Coordinator already sends Follow-Up opener. Else after bots are Active elsewhere, optional: channel opener once (see Follow-Up opener copy below).

### Part C — email drip (add after Part A)

**If/Else timeline (near vs mid)**

**Near** — tags include `timeline_0_30` **OR** `timeline_1_3` (or neither timeline tag → treat as Near):

| Step | Action |
|---|---|
| 1 | Exit check → End if booked/handoff/opt-out |
| 2 | **Wait** 3 days |
| 3 | Exit check |
| 4 | **Send Email** — subject: `Still exploring {{contact.city}}?` · body soft check-in + “Has your timeline moved up?” |
| 5 | **Wait** 4 days |
| 6 | Exit check |
| 7 | **Send Email** — light value (1 tip) + soft “want to talk when you’re ready?” |
| 8 | **Wait** 7 days |
| 9 | Exit check |
| 10 | **Send Email** — “Anything change on timing?” · no hard book link required |

**Mid** — `timeline_3_6`:

| Step | Action |
|---|---|
| 1 | Exit check |
| 2 | **Wait** 7 days |
| 3 | Exit check → **Send Email** — soft check-in |
| 4 | **Wait** 14 days |
| 5 | Exit check → **Send Email** — value + timeline question |
| 6 | **Wait** 14 days |
| 7 | Exit check → **Send Email** — “Still on a ~3–6 month plan?” |

### Email copy (Warm — no em dashes)

**1 — Check-in**  
Subject: `Quick check-in, {{contact.first_name}}`

```text
Hi {{contact.first_name}},

Just checking in. No pressure on your side.

Has your timeline moved up at all, or are you still in exploring mode?

Thanks,
{{user.first_name}}
```

**2 — Value + soft**  
Subject: `One tip while you plan`

```text
Hi {{contact.first_name}},

Quick idea while you plan: write down your must-haves vs nice-to-haves for {{contact.target_location}}. It makes the search much faster later.

If you want a second set of eyes when you're closer, reply here and we'll help.

Thanks,
{{user.first_name}}
```

**3 — Timing**  
Subject: `Anything change on timing?`

```text
Hi {{contact.first_name}},

Anything change on timing?

No rush. Reply anytime if you want help.

Thanks,
{{user.first_name}}
```

**Publish.**

---

## Workflow E — `REOS Cold` (nurture drip)

### Trigger

| Setting | Value |
|---|---|
| Trigger | **Contact Tag** |
| Tag | `temp_cold` added |

### Part A — always

Same as Warm: assign, opp → **Nurture**, notify/task, End if `appt_booked`.

### Part B — monthly-style email drip

Use for `timeline_6_plus`, `timeline_exploring`, or no near/mid timeline tag.

| Step | Action |
|---|---|
| 1 | Exit check |
| 2 | **Wait** 7 days |
| 3 | Exit check → **Send Email** — buyer/seller prep guide (no book push) |
| 4 | **Wait** 30 days |
| 5 | Exit check → **Send Email** — light market / education note |
| 6 | **Wait** 30 days |
| 7 | Exit check → **Send Email** — “Still planning for later this year?” |
| 8 | Loop or enroll in Cold email campaign for monthly repeats |

### Email copy (Cold)

**Prep guide**

```text
Hi {{contact.first_name}},

Since you're planning ahead, here's a simple prep list: get clear on budget range, must-haves, and timing. No rush.

When you're closer, we're here. Reply anytime with questions.

Thanks,
{{user.first_name}}
```

**Monthly**

```text
Hi {{contact.first_name}},

Monthly check-in only. Still on a longer timeline for {{contact.target_location}}?

If anything changed (sooner or later), just reply and we'll adjust.

Thanks,
{{user.first_name}}
```

No hard booking push on Cold.

**Publish.**

---

## Follow-Up chat opener (Coordinator Lead Temp or Start Follow-Up)

After Follow-Up → **Active** (last), If/Else channel (FB / IG / SMS) — one message:

```text
Hey {{contact.first_name}}. No rush on your side. Want any helpful next steps while you explore, or are you all set for now?
```

Do **not** put long email drips on Start Follow-Up.
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
Totally understand. A team member will reach out shortly.
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

1. **If/Else** — has assigned user?  
   - **No** → **Assign to User**  
   - **Yes** → continue  
   - **Note:** Do **not** End on `appt_booked`. `ready_to_book` after a book is the **reschedule** path (Follow-Up re-adds the tag).  
2. **Update Conversation AI** (**Scheduler Active must be last** on every branch — Has user / Does not have user):  
   Concierge **Inactive** → Follow-Up **Inactive** → Scheduler **Active** (last)  
   Wrong order (Scheduler Active then Follow-Up Inactive) leaves Assigned = Follow-Up Inactive and kills outreach.  
   Prefer **pausing Start Scheduler** if **REOS Coordinator** already owns the `ready_to_book` route (avoid double flips + double openers).  
3. **Channel opener** (only if Start Scheduler is live and Coordinator does not already send it): FB / IG / SMS If/Else after Scheduler Active — body:  
   `Great. Let's get a consult on the calendar. Do mornings or afternoons work better?` 

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
3. Manually book/confirm appointment → `REOS Appointment Booked` moves stage + `appt_booked`, Scheduler Inactive, **Follow-Up Active**  

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
   - **Yes** → End (`REOS Appointment Booked` / Coordinator already set Follow-Up Active for post-book)  
   - **No** → continue  
2. **If/Else** — tag `ready_to_book` exists?  
   - **Yes** → End (Scheduler owns them)  
   - **No** → continue  
3. **If/Else** — has assigned user?  
   - **No** → Assign to User  
   - **Yes** → continue  
4. On **both** assign branches (**Follow-Up Active must be last**):
   - **Update Conversation AI** → **REOS Concierge** → **Inactive**  
   - **Update Conversation AI** → **REOS Scheduler** → **Inactive**  
   - **Update Conversation AI** → **REOS Follow-Up** → **Active** (last — owns the thread)
5. Find/Update opportunity → stage **Nurture** (optional if Warm/Cold workflows already do this)

**Publish.**

### How the three bots hand off

```text
Concierge (qualify)
  ├─ temp_hot / ready_to_book → Scheduler (book)
  └─ temp_warm / temp_cold → Follow-Up (nurture)
Follow-Up hears “let’s meet” → ready_to_book → Scheduler
appt_booked → Scheduler off · Follow-Up Active (post-book Q&A)
Follow-Up hears reschedule → ready_to_book → Scheduler again
```

### Manual test (no SMS)

1. Test contact **without** `appt_booked` / `ready_to_book`  
2. Add tag **`temp_warm`**  
3. Expect **REOS Start Follow-Up** execution → Follow-Up **Active**; Concierge + Scheduler **Inactive**  
4. Add **`ready_to_book`** → Start Scheduler should take over (Follow-Up can stay Inactive on next Scheduler run if you add that step there too)

**Optional:** In **REOS Start Scheduler**, after Scheduler Active, set **Follow-Up → Inactive**.

---

## Workflow J — `REOS Scout — Daily Priority` (Phase 1 — The Scout)

Scout is **not** a chat bot. This scheduled workflow finds who to work first and routes them.

Design notes: [`prompts/scout.md`](prompts/scout.md)

### Prereqs

- Tags: `scout_priority`, `appt_booked`, `ready_to_book`, `temp_hot`, `temp_warm`, `temp_cold`, `ai_handoff`
- Pipeline **New Leads**
- Concierge / Scheduler / Follow-Up start workflows already published

### Trigger

| Setting | Value |
|---|---|
| Trigger | **Appointment / Schedule** (or **Time based** / **Recurring**) |
| Cadence | **Daily** — e.g. 8:00 AM account timezone |

If your GHL only supports “Workflow runs on contacts in a smart list,” use:

| Setting | Value |
|---|---|
| Trigger | Contact in **Smart List**: Scout Candidates |
| Smart List filters | Opportunity pipeline = New Leads · Stage is not Closed Won/Lost · Tag does not include `appt_booked` · Tag does not include `ai_handoff` |

Run that list on a schedule (or use “Customer in Workflow” enrollment from a nightly campaign).

### Actions (per contact)

```text
1. If/Else — SKIP?
   ├─ appt_booked OR ai_handoff OR DND → END
   └─ else → continue

2. If/Else — P1 Scheduler path?
   ├─ ready_to_book OR (temp_hot AND NOT appt_booked)
   │    → Add tag scout_priority
   │    → If ready_to_book missing → Add tag ready_to_book
   │    → Internal Notification to Assigned User: “P1 — needs booking”
   │    → (Start Scheduler already fires on ready_to_book)
   │    → END
   └─ else → continue

3. If/Else — P2 Follow-Up path?
   ├─ temp_warm OR temp_cold
   │    → Add tag scout_reviewed (optional)
   │    → Ensure Follow-Up path: add/re-add temp_warm or leave tag
   │      (or Update Conversation AI → Follow-Up Active if silent too long)
   │    → END
   └─ else → continue

4. Else — P1 Concierge (unqualified / stuck in New or AI Qualifying)
   → Add tag scout_priority
   → Update Conversation AI → Concierge Active
   → Scheduler Inactive · Follow-Up Inactive
   → Internal Notification: “P1 — needs qualification”
   → END
```

### Simpler MVP (recommended first)

Build only **P1 booking catch**:

**Trigger:** Daily smart list / schedule  

**Filters on enrollment or first If/Else:**
- Has `temp_hot` OR stage = Qualified  
- Does **not** have `appt_booked`  
- Does **not** have `ready_to_book` (optional — if missing, add it)

**Actions:**
1. Add tag `scout_priority`  
2. Add tag `ready_to_book` (starts Scheduler)  
3. Internal Notification to assigned user  
4. If no assigned user → Assign to User first  

That alone makes Scout useful: every morning, Hot/Qualified leads without a book get pushed to Scheduler.

### Manual test

1. Contact: `temp_hot`, no `appt_booked`, no `ready_to_book`, has assigned user  
2. Manually enroll in **REOS Scout — Daily Priority** (or run test)  
3. Expect: `scout_priority` + `ready_to_book` → Start Scheduler fires → notify agent  

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

## Bot Active / Inactive audit (when Concierge goes silent)

Use this when tags look correct (`research_done` + `coordinated`) but the bot stops after one reply.

**First check Assigned bot:** if it shows Follow-Up/Scheduler **Inactive** after a Concierge route, Coordinator’s last Update Conversation AI was wrong — see Workflow L order note.

### Workflows that set Concierge **Inactive** (by design)

| Workflow | When | What it does to Concierge |
|---|---|---|
| **REOS Coordinator** | `ready_to_book` | Inactive (Scheduler Active) |
| **REOS Coordinator** | `temp_warm` / `temp_cold` | Inactive (Follow-Up Active) |
| **REOS Coordinator** | `appt_booked` (no `ready_to_book`) | Inactive (Follow-Up Active) |
| **REOS Coordinator** | `ai_handoff` / `compliance_hold` / `opted_out` | Inactive |
| **REOS Coordinator** | `channel_email` + no phone | Inactive (`coord_email_only`) |
| **REOS Appointment Booked** | calendar booked | Inactive (Follow-Up Active) |
| **REOS Start Scheduler** | `ready_to_book` | Optional: Concierge Inactive |
| **REOS Start Follow-Up** | `temp_warm` / `temp_cold` | Concierge Inactive |
| **REOS Compliance Guard** | `opted_out` / `compliance_hold` / `dnd` | All bots Inactive |
| **REOS Handoff** (if built) | `ai_handoff` | Concierge Inactive |
| **REOS Tag Ready to Book** (custom) | If you added Update Conversation AI there | Concierge Inactive |
| **REOS Hot** | If it adds `ready_to_book` → Start Scheduler / Coordinator | Concierge Inactive next |

### Workflows that should **not** touch Conversation AI

| Workflow | Expected actions |
|---|---|
| **REOS IG Bridge** | Tags only (`source_instagram`, `ai_qualifying`) — **no** Active/Inactive |
| **REOS Field Sync** | Update Contact Field only — **no** Active/Inactive |
| **REOS Intake** | Opp + tags — **no** Concierge Active/Inactive |
| **REOS Researcher** | Channel tags + `research_done` — **no** Active/Inactive if Coordinator owns routing |
| **REOS Tag Hot/Warm/Cold** | Add temp tag only — **no** Active/Inactive |

### GHL hunt (one silent contact)

1. Note time of the unanswered inbound message.  
2. Open **Automation → Workflows** → filter **Executions** for that contact around that time.  
3. Open every run → look for **Update Conversation AI** → Concierge **Inactive**.  
4. Note which workflow did it and which branch/tag caused it.  
5. Also confirm contact does **not** have: `ready_to_book`, `temp_warm`, `temp_cold`, `ai_handoff`, `opted_out`, `compliance_hold`, `coord_email_only`.

### Suspicious races on Meta (IG/FB)

- Concierge **Trigger a Workflow** for Tag Hot/Warm/Cold or Ready to Book fires too early → Coordinator/Start Follow-Up/Start Scheduler flips Concierge **Inactive** while you’re still qualifying.  
- **REOS Start Follow-Up** still published + accidental `temp_warm` → Concierge off, Follow-Up on (may also be silent on Meta).  
- Custom **Tag Ready to Book** workflow that both tags and sets Concierge Inactive.

**Meta one-shot with none of the above:** GHL Conversation AI issue — still file support; workflows aren’t the deactivator.

---

## Smart lists (work queues)

Use **AND** between filters. Do not use loose `OR tag is not X` patterns that pull half the CRM.

### Ready to Book

- Tag includes `ready_to_book`
- Tag does **not** include `appt_booked`
- Tag does **not** include `ai_handoff`
- Tag does **not** include `opted_out`
- Tag does **not** include `compliance_hold`

### Needs Contact Info

- Tag includes `needs_contact_info`
- Tag does **not** include `appt_booked`
- Tag does **not** include `ai_handoff`
- Tag does **not** include `opted_out`
- Tag does **not** include `compliance_hold`

### Human Handoff

- Tag includes `ai_handoff`
- Tag does **not** include `opted_out`
- Tag does **not** include `compliance_hold`
- Tag does **not** include `appt_booked` (optional)

Also **Remove Tag** `ready_to_book` on Handoff / Compliance paths so they leave Ready to Book.

### Nurture (Warm / Cold)

- Tag includes `temp_warm` **OR** `temp_cold` (one filter group / either tag)
- Tag does **not** include `ready_to_book`
- Tag does **not** include `appt_booked`
- Tag does **not** include `ai_handoff`
- Tag does **not** include `opted_out`
- Tag does **not** include `compliance_hold`
- Tag does **not** include `needs_contact_info`

Optional split lists: **Nurture Warm** (`temp_warm` only) and **Nurture Cold** (`temp_cold` only) with the same exclusions.

When they accept scheduling → `ready_to_book` → they leave Nurture and enter Ready to Book. Follow-Up bot owns chat; Warm/Cold email workflows can still run.

### Email Only

Coordinator tags these when `channel_email` and phone is empty (bots stay off; human emails).

- Tag includes `coord_email_only`
- Tag does **not** include `appt_booked`
- Tag does **not** include `ai_handoff`
- Tag does **not** include `opted_out`
- Tag does **not** include `compliance_hold`
- Tag does **not** include `ready_to_book` (optional; should already be off)

Optional: also require tag `channel_email`, or Phone is empty. Agent works this list by email, not SMS/CAI.

---

## Publish checklist

- [ ] Tags including `ready_to_book` + `appt_booked`  
- [ ] Pipeline **New Leads** stages live  
- [ ] Calendar Buyer/Seller Consult has slots  
- [ ] `REOS Appointment Booked` published  
- [ ] `REOS Intake` published + form attached (**no** Concierge Active)  
- [ ] **`REOS Researcher`** published (`ai_qualifying` → channel tags → `researcher_done`)  
- [ ] **`REOS Coordinator`** published (assign + compliance block + exclusive bot route)  
- [ ] **`REOS Compliance Guard`** published (`opted_out` / `compliance_hold` → bots Inactive)  
- [ ] Tags `researcher_done`, `needs_contact_info`, `coordinated`, `coord_email_only`, `opted_out`, `compliance_hold`  
- [ ] Preferred Channel / Preferred Language fields seeded (CRM display)  
- [ ] Researcher no longer starts Concierge (Coordinator does)  
- [ ] `REOS Hot` / Warm / Cold / Handoff published  
- [ ] **REOS Scheduler** bot + Start Scheduler (optional if Coordinator covers it)  
- [ ] **REOS Follow-Up** bot + Start Follow-Up (optional if Coordinator covers it)  
- [ ] **REOS Scout — Daily Priority** published (MVP P1 booking catch)  
- [ ] Concierge Appointment Booking disabled; Hot adds `ready_to_book`  
- [ ] Compliance COMPLIANCE blocks pasted into Concierge / Scheduler / Follow-Up  
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
