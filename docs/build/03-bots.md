# Build Phase 3 — Conversation AI bots

Create bots under **AI Agents → Conversation AI**. Paste prompts from [`../prompts/`](../prompts/). Use Suggestive while building; Autopilot after tests pass.

## Matrix

| Bot | Appointment Booking | Stop bot | Role |
|---|---|---|---|
| **REOS Lead Concierge** | Off | Off (preferred) | Qualify, score, brief, temp tags, `ready_to_book` |
| **REOS Scheduler** | On → REOS Consult | Off (preferred) | Book; ask email if missing |
| **REOS Follow-Up** | Off | Off (preferred) | Warm/Cold chat nurture |

Opt-out is **Compliance Guard**, not Stop bot on goodbye.

## REOS Lead Concierge

1. Create bot `REOS Lead Concierge`  
2. Bot Goals: paste [`../prompts/lead-concierge.md`](../prompts/lead-concierge.md)  
   - §1 Personality  
   - §2 Goal / Intent  
   - §3 Additional Information (include COMPLIANCE block)  
3. Actions: Contact info, Human handover, Trigger workflow bridges (≤5). **No** Appointment Booking.  
4. Tag bridges for Hot/Warm/Cold / ready_to_book if Triggers are used (tiny workflows: Add Tag only).  
5. Channels: SMS first; FB/IG when ready.  
6. Ask-first before Ready to Book; no CRM dumps in chat; no em dashes in lead messages (per prompt pack).

## REOS Scheduler

1. Create bot `REOS Scheduler`  
2. Paste [`../prompts/scheduler.md`](../prompts/scheduler.md) §1–§3  
3. Appointment Booking → **REOS Consult**; disable after book **On**  
4. Human handover On  
5. Channels as needed  

## REOS Follow-Up

1. Create bot `REOS Follow-Up`  
2. Paste [`../prompts/follow-up.md`](../prompts/follow-up.md) §1–§3  
3. Contact info (light) + Human handover  
4. No Appointment Booking  

## Routing rules (all bots)

- When workflows flip bots: **owner Active last**  
- No “Reactivate after” on Inactive steps used for routing  
- After Scheduler / Follow-Up Active mid-thread: send channel opener (FB / IG / SMS). Live Chat send is often missing in GHL.

## Bot Training

Optional. Skip for launch.

## Next

→ [`04-workflows.md`](04-workflows.md)
