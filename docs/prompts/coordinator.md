# REOS Coordinator — Assign, Route & Channel

**Phase 1 agent:** The Coordinator — picks the right human, specialist bot, and channel for each lead.

Coordinator is a **workflow**, not a Conversation AI chat bot. It is the traffic controller after Researcher and whenever lead state changes.

| Job | How |
|---|---|
| **Who** | Ensure an assigned user (round-robin / named agent) |
| **When / which bot** | Exactly one specialist Active: Concierge · Scheduler · Follow-Up · or none (human) |
| **Channel** | Respect `channel_sms` / `channel_email` — email-only leads notify the human instead of SMS bots |

---

## Tags

| Tag | Meaning |
|---|---|
| `coordinated` | Last Coordinator pass completed |
| `coord_email_only` | No SMS path — assigned user should email |
| `researcher_done` | Input — research finished |
| `ready_to_book` | Input — send to Scheduler |
| `temp_warm` / `temp_cold` | Input — send to Follow-Up |
| `ai_handoff` | Input — all bots off, human owns |
| `appt_booked` | Input — Follow-Up Active (post-book support) unless `ready_to_book` |
| `scout_priority` | Input — notify human + reinforce route |
| `channel_sms` / `channel_email` | From Researcher |
| `compliance_hold` / `opted_out` | From Compliance Guard — bots stay off |

---

## Routing rules (priority order)

Evaluate **top to bottom**; first match wins:

| # | Condition | Route |
|---|---|---|
| 0 | `compliance_hold` or `opted_out` | All bots **Inactive** → tag `coordinated` → End (Compliance Guard) |
| 1 | `ai_handoff` | All bots **Inactive** → notify assigned user |
| 2 | `ready_to_book` | **Scheduler Active** · Concierge Inactive · Follow-Up Inactive (first book **or** reschedule) |
| 3 | `appt_booked` (and not ready_to_book) | **Follow-Up Active** · Concierge Inactive · Scheduler Inactive |
| 4 | `channel_email` and **no** phone | Tag `coord_email_only` → all bots **Inactive** → notify: email the lead |
| 5 | `temp_warm` or `temp_cold` (and not ready_to_book) | **Follow-Up Active** · Concierge Inactive · Scheduler Inactive |
| 6 | `researcher_done` or still qualifying | **Concierge Active** · Scheduler Inactive · Follow-Up Inactive |
| 7 | `scout_priority` only | Notify assigned user; do not change bots unless another rule also matches |

Always run **ensure assigned user** before notify steps. Compliance check runs immediately after assign.

---

## Relationship to other workflows

| Existing | Coordinator relationship |
|---|---|
| **Researcher** | Sets channel + `researcher_done`. Prefer Researcher **not** start Concierge — Coordinator does. |
| **Compliance Guard** | Sets `opted_out` + `compliance_hold`. Coordinator rule 0 keeps bots off. |
| **Appointment Booked** | Sets `appt_booked`, removes `ready_to_book`, Follow-Up **Active** last. Coordinator rule 3 reinforces if another tag re-runs later. |
| **Start Scheduler** | Same bot toggle as rule 2 (including reschedule). Safe to keep both (idempotent) or retire Start Scheduler later. |
| **Start Follow-Up** | Same as rule 5 (nurture). Keep or retire later. Post-book activation is owned by Appointment Booked / rule 3. |
| **Handoff** | Overlaps rule 1. Keep Handoff for task/SMS; Coordinator reinforces bots off. |
| **Scout** | Adds `scout_priority` / `ready_to_book` → Coordinator (or Start Scheduler) routes. Skip already-booked for outbound priority. |

---

## Optional Workflow AI Agent instructions

If you add a GHL **AI Agent** action inside Coordinator:

```text
You are the REOS Coordinator. Given tags and whether the contact has a phone, choose ONE route:
COMPLIANCE | HANDOFF | SCHEDULER | BOOKED_FOLLOW_UP | EMAIL_ONLY | FOLLOW_UP | CONCIERGE | NOTIFY_ONLY
Rules: COMPLIANCE if compliance_hold or opted_out. HANDOFF if ai_handoff. SCHEDULER if ready_to_book (even if appt_booked — reschedule). BOOKED_FOLLOW_UP if appt_booked and not ready_to_book. EMAIL_ONLY if channel_email and no usable phone. FOLLOW_UP if temp_warm or temp_cold. CONCIERGE if researcher_done. Else NOTIFY_ONLY.
Return route and one-sentence reason. Do not invent tags.
```

MVP: use pure If/Else (no AI Agent action).

---

## What Coordinator does not do

- Does not qualify (Concierge)
- Does not book (Scheduler)
- Does not nurture copy (Follow-Up)
- Does not invent phone/email (Researcher)
