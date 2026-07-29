# REOS Build Guide

Master guide to **build** REOS inside a GoHighLevel sub-account (template / master location first, then Snapshot to clients).

This is the build path. For SaaS customer journey (Sales → Support form → client account), see [`ARCHITECTURE.md`](ARCHITECTURE.md) and [`CUSTOMER-ONBOARDING.md`](CUSTOMER-ONBOARDING.md) when those exist. For click-level workflow steps, see [`WORKFLOWS.md`](WORKFLOWS.md).

## Build phases

| Phase | Doc | Outcome |
|---|---|---|
| 0 | [`build/00-overview.md`](build/00-overview.md) | Scope, rules, naming |
| 1 | [`build/01-prerequisites-and-fields.md`](build/01-prerequisites-and-fields.md) | PIT, seed custom fields |
| 2 | [`build/02-tags-pipeline-calendar.md`](build/02-tags-pipeline-calendar.md) | Tags, REOS Leads, REOS Consult |
| 3 | [`build/03-bots.md`](build/03-bots.md) | Concierge, Scheduler, Follow-Up |
| 4 | [`build/04-workflows.md`](build/04-workflows.md) | All REOS workflows (build order) |
| 5 | [`build/05-smart-lists.md`](build/05-smart-lists.md) | Agent work queues |
| 6 | [`build/06-lead-sources.md`](build/06-lead-sources.md) | Forms / FB / SMS → Intake |
| 7 | [`build/07-publish-and-test.md`](build/07-publish-and-test.md) | Publish + [`TESTING.md`](TESTING.md) |
| 8 | [`build/08-snapshot-master.md`](build/08-snapshot-master.md) | Package master as Snapshot |

**Checkbox tracker:** [`build/CHECKLIST.md`](build/CHECKLIST.md)  
**Quick reference:** [`build/REFERENCE.md`](build/REFERENCE.md)

## Also use

| Doc | Role |
|---|---|
| [`GHL_SETUP.md`](GHL_SETUP.md) | Narrative setup (overlaps this build; prefer BUILD for order) |
| [`WORKFLOWS.md`](WORKFLOWS.md) | Full workflow action tables |
| [`TESTING.md`](TESTING.md) | Scenario tests |
| [`prompts/`](prompts/) | Paste into Bot Goals / agent notes |

## Target outcome

One working **master** REOS location with:

- Custom fields + tags + pipeline + calendar  
- Three Conversation AI bots (Concierge, Scheduler, Follow-Up)  
- Core workflows published (Intake → Researcher → Coordinator → Compliance + Hot/Warm/Cold/Handoff + Appointment Booked + Scout)  
- Smart lists  
- Lead form wired to Intake  
- Smoke tests passed  
- Snapshot ready to clone for customer sub-accounts  

## Critical GHL rules (do not skip)

1. **Intake does not** start Concierge. Researcher ends at `researcher_done` (or `research_done`). **Coordinator** starts bots.  
2. **Update Conversation AI:** last step wins as Assigned bot. Owner bot must be **Active last**.  
3. No “Reactivate after” on routing Inactives.  
4. CAI does not auto-speak when activated mid-thread. Use channel openers after Scheduler / Follow-Up Active.  
5. Concierge: **Stop bot Off**; Appointment Booking **Off**. Scheduler: Appointment Booking **On**.  
6. Concierge max ~5 Trigger a workflow actions. Use tiny tag bridges.  
7. Opt-out via **Compliance Guard** + `opted_out` / `compliance_hold`.  

## Suggested build time

| Path | Notes |
|---|---|
| From scratch | Multi-session; follow phases 1→7 in order |
| From Snapshot | Use client [`ONBOARDING.md`](ONBOARDING.md) / CSV; do not rebuild from this guide |

Start at [`build/00-overview.md`](build/00-overview.md).
