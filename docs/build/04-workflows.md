# Build Phase 4 — Workflows

Build in **Automation → Workflows**. Full action tables: [`../WORKFLOWS.md`](../WORKFLOWS.md).

## Build order (publish as you go)

| # | Workflow | Trigger (summary) | Purpose |
|---|---|---|---|
| 1 | `REOS Appointment Booked` | Appointment Booked on REOS Consult | Stage Appointment Set, `appt_booked`, remove `ready_to_book`, confirm, notify |
| 2 | `REOS Intake` | Form / FB / optional inbound | Opp New → AI Qualifying + `ai_qualifying`. **No** Concierge Active |
| 3 | `REOS Researcher` | Tag `ai_qualifying` | Channel/lang tags → `researcher_done`. **No** Concierge Active |
| 4 | `REOS Coordinator` | `researcher_done`, `ready_to_book`, `temp_warm`/`temp_cold`, `ai_handoff`, `scout_priority` | Assign + exclusive bot; respect compliance |
| 5 | `REOS Compliance Guard` | `opted_out` / `compliance_hold` / optional `dnd` | All bots Inactive + hold |
| 6 | `REOS Hot` | Tag `temp_hot` | Notify + add `ready_to_book` |
| 7 | `REOS Warm` | Tag `temp_warm` | Nurture stage + email drip |
| 8 | `REOS Cold` | Tag `temp_cold` | Nurture stage + slower email drip |
| 9 | `REOS Handoff` | Tag `ai_handoff` | Bots off, notify, task |
| 10 | Tag bridges | Concierge Trigger workflow | Add Tag only (Hot/Warm/Cold/timeline) |
| 11 | Channel openers | After Scheduler/Follow-Up Active paths | FB / IG / SMS first message |
| 12 | `REOS Start Scheduler` | Optional if Coordinator covers | `ready_to_book` → Scheduler Active last |
| 13 | `REOS Start Follow-Up` | Optional if Coordinator covers | Warm/Cold → Follow-Up Active last |
| 14 | `REOS Scout — Daily Priority` | Schedule / smart list / manual | `scout_priority` + `ready_to_book` |
| 15 | `REOS Field Sync` | Optional Customer Replied | Append to AI Summary |
| 16 | Meta bridges | Optional IG/FB | Source tags + `ai_qualifying` only |

Skip `REOS Post-Qualify` for MVP (Hot/Warm/Cold are enough).

## Coordinator essentials

Order matters. Typical exclusive routes (Active **last**):

| Condition | Active bot |
|---|---|
| `compliance_hold` or `opted_out` | None (all Inactive) |
| `ai_handoff` or `appt_booked` | None |
| `coord_email_only` (email, no phone) | None |
| `ready_to_book` | Scheduler |
| `temp_warm` / `temp_cold` | Follow-Up |
| Default after `researcher_done` | Concierge |

Example Concierge restore path: Scheduler Inactive → Follow-Up Inactive → **Concierge Active last**.

## Warm / Cold drips

- Follow-Up owns **chat**  
- Warm/Cold workflows own **email** cadence + opp → Nurture + agent task/notify  
- Exit drips on `ready_to_book` / `opted_out` / `ai_handoff` / `compliance_hold` / `appt_booked`  

Details: [`../WORKFLOWS.md`](../WORKFLOWS.md) nurture section.

## Do not

- Start Concierge from Intake or Researcher (Coordinator owns it)  
- Put full nurture trees on Concierge Triggers (slot limit)  
- Leave Start Scheduler **and** Coordinator both flipping bots without a clear owner (prefer Coordinator; pause duplicates once proven)  

## Next

→ [`05-smart-lists.md`](05-smart-lists.md)
