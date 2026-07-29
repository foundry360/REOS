# REOS Build Reference

## Pipeline stages (REOS Leads)

1. New  
2. AI Qualifying  
3. Qualified  
4. Appointment Set  
5. Nurture  
6. Closed Won  
7. Closed Lost  

## Tag quick list

`temp_hot` `temp_warm` `temp_cold`  
`ready_to_book` `appt_booked`  
`ai_qualifying` `researcher_done` (`research_done`) `needs_contact_info`  
`channel_sms` `channel_email` `lang_en`  
`coordinated` `coord_email_only` `ai_handoff`  
`opted_out` `compliance_hold` `dnd`  
`scout_priority` `scout_reviewed`  
`timeline_0_30` `timeline_1_3` `timeline_3_6` `timeline_6_plus` `timeline_exploring`  
`source_facebook` `source_instagram`  
`lead_buyer` `lead_seller` `lead_investor`  

## Bot matrix

| Bot | Booking | Stop bot | When Active |
|---|---|---|---|
| Concierge | Off | Off | Default after research (Coordinator) |
| Scheduler | On | Off | `ready_to_book` |
| Follow-Up | Off | Off | `temp_warm` / `temp_cold` |

## Workflow catalog

| Workflow | Starts from |
|---|---|
| REOS Intake | Form / FB / optional inbound |
| REOS Researcher | `ai_qualifying` |
| REOS Coordinator | `researcher_done`, `ready_to_book`, temps, handoff, scout |
| REOS Compliance Guard | `opted_out`, `compliance_hold`, `dnd` |
| REOS Appointment Booked | Calendar booked |
| REOS Hot | `temp_hot` |
| REOS Warm | `temp_warm` |
| REOS Cold | `temp_cold` |
| REOS Handoff | `ai_handoff` |
| REOS Scout — Daily Priority | Schedule / list / manual |
| REOS Start Scheduler | Optional `ready_to_book` |
| REOS Start Follow-Up | Optional warm/cold |

## Prompt files

| Bot / agent | Path |
|---|---|
| Concierge | [`../prompts/lead-concierge.md`](../prompts/lead-concierge.md) |
| Scheduler | [`../prompts/scheduler.md`](../prompts/scheduler.md) |
| Follow-Up | [`../prompts/follow-up.md`](../prompts/follow-up.md) |
| Researcher | [`../prompts/researcher.md`](../prompts/researcher.md) |
| Coordinator | [`../prompts/coordinator.md`](../prompts/coordinator.md) |
| Compliance | [`../prompts/compliance-guard.md`](../prompts/compliance-guard.md) |
| Scout | [`../prompts/scout.md`](../prompts/scout.md) |

## Routing gotchas

- Last Update Conversation AI wins  
- Owner bot Active **last**  
- Mid-thread activate needs channel opener  
- Concierge Trigger slots limited (~5)  
- Documented tag `researcher_done` may be `research_done` live  

## Detail docs

- Workflows: [`../WORKFLOWS.md`](../WORKFLOWS.md)  
- Setup narrative: [`../GHL_SETUP.md`](../GHL_SETUP.md)  
- Tests: [`../TESTING.md`](../TESTING.md)  
- Build hub: [`../BUILD.md`](../BUILD.md)  
