# REOS Build Checklist (master location)

Use while building the **template** sub-account. For client installs after Snapshot, use [`../ONBOARDING.md`](../ONBOARDING.md).

## Phase 1 — Prerequisites and fields

- [ ] Sub-account with Conversation AI  
- [ ] PIT created; `npm run connect` OK  
- [ ] `npm run seed:fields`  
- [ ] Custom fields visible (Intent, profiles, preferences, AI)  

## Phase 2 — Tags, pipeline, calendar

- [ ] All required tags created (see [`REFERENCE.md`](REFERENCE.md))  
- [ ] Pipeline **REOS Leads** stages New → Closed Lost  
- [ ] Calendar **REOS Consult** 30 min + reminders  

## Phase 3 — Bots

- [ ] REOS Lead Concierge (prompts + actions; Booking Off; Stop bot Off)  
- [ ] REOS Scheduler (prompts; Booking On → REOS Consult)  
- [ ] REOS Follow-Up (prompts; Booking Off)  
- [ ] COMPLIANCE blocks in Additional Info (all three)  
- [ ] SMS channel enabled for testing  

## Phase 4 — Workflows published

- [ ] REOS Appointment Booked  
- [ ] REOS Intake (no Concierge Active)  
- [ ] REOS Researcher (no Concierge Active)  
- [ ] REOS Coordinator (Active last; compliance block)  
- [ ] REOS Compliance Guard  
- [ ] REOS Hot (`ready_to_book`)  
- [ ] REOS Warm  
- [ ] REOS Cold  
- [ ] REOS Handoff  
- [ ] Tag bridges / channel openers as needed  
- [ ] REOS Scout — Daily Priority  
- [ ] Start Scheduler / Start Follow-Up paused or aligned with Coordinator  

## Phase 5 — Smart lists

- [ ] Ready to Book  
- [ ] Needs Contact Info  
- [ ] Human Handoff  
- [ ] Nurture  
- [ ] Email Only  
- [ ] Scout Needs Booking (optional)  

## Phase 6 — Lead sources

- [ ] Lead form → Intake  
- [ ] No double Contact Created + Form  
- [ ] Meta bridges if used (tags only)  

## Phase 7 — Test

- [ ] Researcher pass  
- [ ] Coordinator pass  
- [ ] Compliance pass  
- [ ] Hot → book pass  
- [ ] Warm/Cold pass  
- [ ] Handoff pass  
- [ ] Form → live SMS pass  

## Phase 8 — Snapshot

- [ ] Snapshot created with CAI + workflows + fields + tags + pipeline + calendar + lists  
- [ ] Test load into empty sub-account  
- [ ] Client onboarding checklist validated once  

**Master build complete:** _______________ (date)  
**Snapshot name / version:** _______________
