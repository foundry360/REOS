# Build Phase 2 — Tags, pipeline, calendar

## Tags

**Settings → Tags** — create all of these before workflows.

### Required

| Tag | Purpose |
|---|---|
| `temp_hot` | Hot path / agent urgency |
| `temp_warm` | Warm nurture |
| `temp_cold` | Cold nurture |
| `ready_to_book` | Concierge/Hot → Scheduler |
| `appt_booked` | Appointment Booked workflow |
| `ai_qualifying` | Starts Researcher |
| `researcher_done` | Researcher finished (or standardize on `research_done`) |
| `needs_contact_info` | No phone and no email |
| `channel_sms` | SMS path |
| `channel_email` | Email-only path |
| `lang_en` | English (add `lang_es` if needed) |
| `coordinated` | Coordinator finished a route pass |
| `coord_email_only` | Email-only; bots off |
| `ai_handoff` | Human takeover |
| `opted_out` | Lead asked to stop |
| `compliance_hold` | Bots must stay off |
| `scout_priority` | Scout P1 |
| `timeline_0_30` | Timeline bucket |
| `timeline_1_3` | Timeline bucket |
| `timeline_3_6` | Timeline bucket |
| `timeline_6_plus` | Timeline bucket |
| `timeline_exploring` | Timeline bucket |

### Optional

| Tag | Purpose |
|---|---|
| `scout_reviewed` | Scout touched today |
| `dnd` | Also starts Compliance Guard |
| `lead_buyer` / `lead_seller` / `lead_investor` | Type mirrors |
| `source_facebook` / `source_instagram` | Meta channel openers |
| `reos_onboarding` | Support tracker only (not required in REOS master) |

## Pipeline: REOS Leads

**Opportunities → Pipelines → Add**

Stages (exact order):

1. New  
2. AI Qualifying  
3. Qualified  
4. Appointment Set  
5. Nurture  
6. Closed Won  
7. Closed Lost  

Some docs say “New Leads”; master name should be **`REOS Leads`**. Point every workflow at this pipeline.

## Calendar: REOS Consult

1. **Calendars → Create** → `REOS Consult`  
2. Duration: 30 minutes (recommended)  
3. Availability for bookable users  
4. Confirmation + reminders On  
5. You will select this calendar on **REOS Scheduler** Appointment Booking  

## Next

→ [`03-bots.md`](03-bots.md)
