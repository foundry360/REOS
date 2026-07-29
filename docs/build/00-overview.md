# Build Phase 0 — Overview

## What you are building

REOS Phase 1 inside **one** GHL sub-account (the master / template):

```text
Lead in
  → Intake (opp + ai_qualifying)
  → Researcher (channel + researcher_done)
  → Coordinator (assign + one bot Active)
  → Concierge qualifies
       → Hot / ready_to_book → Scheduler books
       → Warm / Cold → Follow-Up
       → ai_handoff → human
  → Scout (daily catch)
  → Compliance Guard (opt-out kill switch)
```

## Naming conventions

| Asset | Name pattern |
|---|---|
| Pipeline | `REOS Leads` |
| Calendar | `REOS Consult` |
| Bots | `REOS Lead Concierge`, `REOS Scheduler`, `REOS Follow-Up` |
| Workflows | `REOS {Name}` (e.g. `REOS Intake`, `REOS Coordinator`) |
| Tags | lowercase snake (`temp_hot`, `ready_to_book`) |

Keep spelling consistent. Live tags sometimes use `research_done` instead of `researcher_done`. Pick one spelling in the master and use it everywhere (workflows + docs notes).

## Build order (strict)

1. Fields  
2. Tags  
3. Pipeline + calendar  
4. Bots (prompts + actions; Scheduler calendar linked)  
5. Workflows in published order (see Phase 4)  
6. Smart lists  
7. Lead sources → Intake  
8. Test  
9. Snapshot  

Do not wire Appointment Booking on Concierge. Do not start Concierge from Intake.

## Roles vs views

- **Permissions** (Settings → My Staff → Roles): security (hide Workflows / AI Agents from agents).  
- **Smart lists**: work queues only, not security.

## Next

→ [`01-prerequisites-and-fields.md`](01-prerequisites-and-fields.md)
