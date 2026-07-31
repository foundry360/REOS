# Build Phase 7 — Publish and test

## Publish checklist

- [ ] All Phase 4 workflows **Published**  
- [ ] Bots saved; Scheduler calendar = REOS Consult  
- [ ] Concierge Appointment Booking Off  
- [ ] Compliance text in Concierge / Scheduler / Follow-Up Additional Info  
- [ ] Intake has **no** Concierge Active  
- [ ] Researcher has **no** Concierge Active (Coordinator owns start)  
- [ ] Form attached to Intake  
- [ ] Smart lists created  
- [ ] Phone connected for SMS tests  

## Test suite

Run [`../TESTING.md`](../TESTING.md). Minimum pass bar:

| Scenario | Pass if |
|---|---|
| Researcher | Phone → `channel_sms` + `researcher_done`; empty → `needs_contact_info` |
| Coordinator | Exclusive Concierge / Scheduler / Follow-Up Active |
| Compliance | `opted_out` → all bots Inactive + hold |
| Hot → book | `ready_to_book` → Scheduler → `appt_booked` + Appointment Set + Follow-Up Active |
| Warm/Cold | Follow-Up + nurture path |
| Handoff | Bots off + agent notify |
| Form → SMS | Full path on a phone you control |

## Silence / wrong bot debugging

See [`../WORKFLOWS.md`](../WORKFLOWS.md) “Bot Active / Inactive audit”:

- Assigned bot shows wrong Inactive after route → Coordinator order wrong (Active last)  
- Mid-thread activate without opener → bot silent on FB/IG/SMS  
- Accidental `temp_warm` / `ready_to_book` while still qualifying  

## Next

→ [`08-snapshot-master.md`](08-snapshot-master.md)
