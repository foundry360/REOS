# REOS Scout — Priority & Intake Router

**Phase 1 agent:** The Scout — integrates and prioritizes new and existing leads to work first.

Scout is **not** a Conversation AI chat bot. It is a **workflow (+ optional Workflow AI Agent action)** that ranks who should be worked and routes them to Concierge, Scheduler, or Follow-Up.

| Piece | Role |
|---|---|
| **REOS Scout — New Lead** | On form/FB/IG/contact create → ensure opp + assign + hand to Concierge (often overlaps Intake) |
| **REOS Scout — Daily Priority** | Scheduled run → find stagnant / high-value leads → tag + notify + route |

---

## What Scout decides

For each contact it evaluates:

1. **Skip** if `appt_booked`, `ai_handoff`, DND/opt-out, or Closed Won/Lost  
2. **Scheduler** if `ready_to_book` or (`temp_hot` and no upcoming book)  
3. **Follow-Up** if `temp_warm` or `temp_cold`  
4. **Concierge** if new / never qualified (no temperature, still AI Qualifying / New)  
5. **Notify assigned user** for top priority (`scout_priority`)

---

## Priority score (simple rules)

Use tags + stages; optional later: custom field **Scout Score**.

| Signal | Priority |
|---|---|
| `temp_hot` or `ready_to_book`, no `appt_booked` | **P1 — work now** → tag `scout_priority` |
| New lead &lt; 24h, no bot active | **P1** → ensure Concierge Active (Intake) |
| `temp_warm`, no reply in 3+ days | **P2** → Follow-Up Active / nudge |
| `temp_cold`, monthly nurture only | **P3** → leave to Cold drip |
| `appt_booked` | **Skip** |

---

## Tags Scout may set

| Tag | Meaning |
|---|---|
| `scout_priority` | Needs human or bot attention today |
| `scout_reviewed` | Touched by daily Scout run (optional, clear next day) |

Create these in Settings → Tags.

---

## Optional Workflow AI Agent instructions

If you use GHL **AI Agent** workflow action inside Daily Priority:

```text
You are the REOS Scout. Review this contact’s tags, opportunity stage, Lead Temperature, AI Summary, and last activity.
Return:
1) priority: P1 | P2 | P3 | SKIP
2) route: Concierge | Scheduler | Follow-Up | Human | None
3) reason: one sentence
Do not invent appointments. Prefer SKIP if appt_booked or ai_handoff. Prefer Scheduler if ready_to_book. Prefer Follow-Up if temp_warm or temp_cold. Prefer Concierge if no temperature and stage is New or AI Qualifying.
```

Then branch the workflow on that output (or keep pure If/Else rules below — recommended for MVP).

---

## Relationship to existing workflows

| Existing | Scout relationship |
|---|---|
| **REOS Intake** + **Researcher** | New-lead → Concierge. Scout Daily covers **existing / stuck** leads. |
| **Start Scheduler** | Scout can add `ready_to_book` or `scout_priority` for Hot stuck leads |
| **Start Follow-Up** | Scout can re-activate Follow-Up for silent Warm leads |
| **Hot** | Scout P1 aligns with Hot + unbooked |

MVP: build **Daily Priority** only; keep Intake as the new-lead Scout.
