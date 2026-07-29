# Build Phase 8 — Snapshot the master

When Phase 7 tests pass, package the master location as a **REOS Snapshot** for customer sub-accounts.

## Include when creating Snapshot

- [ ] Custom fields  
- [ ] Tags  
- [ ] Pipelines  
- [ ] Workflows  
- [ ] Calendars (structure)  
- [ ] Forms / sites used by REOS  
- [ ] Smart Lists  
- [ ] Conversation AI (bots, prompts, actions)  
- [ ] Email / SMS templates used by drips  

## Never in Snapshot (always manual per client)

- Users and roles  
- LC phone / A2P  
- Calendar OAuth and live availability  
- Domains  
- Meta / Stripe credentials  
- Contacts and conversation history  
- Private Integration tokens  

## After load into a customer location

Follow [`../ONBOARDING.md`](../ONBOARDING.md) or import [`../REOS-Onboarding-Checklist.csv`](../REOS-Onboarding-Checklist.csv) into Google Sheets.

Must remap:

- Scheduler → this location’s REOS Consult  
- Assign / notify users in workflows  
- Phone, email domain, channels  
- Form → Intake attachment  

## Push updates

Prefer selective Snapshot push for workflow/bot fixes. Do not blindly overwrite client customizations without a plan.

## Done

Master REOS build is complete when Snapshot installs cleanly into a blank sub-account and onboarding checklist + smoke tests pass there.
