# Build Phase 5 — Smart lists

Create under **Contacts → Smart Lists**. Use **AND** between filters.

## Ready to Book

- Tag includes `ready_to_book`  
- Tag does not include `appt_booked`  
- Tag does not include `ai_handoff`  
- Tag does not include `opted_out`  
- Tag does not include `compliance_hold`  

## Needs Contact Info

- Tag includes `needs_contact_info`  
- Tag does not include `appt_booked`  
- Tag does not include `ai_handoff`  
- Tag does not include `opted_out`  
- Tag does not include `compliance_hold`  

## Human Handoff

- Tag includes `ai_handoff`  
- Tag does not include `opted_out`  
- Tag does not include `compliance_hold`  

## Nurture (Warm / Cold)

- Tag includes `temp_warm` OR `temp_cold`  
- Tag does not include `ready_to_book`  
- Tag does not include `appt_booked`  
- Tag does not include `ai_handoff`  
- Tag does not include `opted_out`  
- Tag does not include `compliance_hold`  
- Tag does not include `needs_contact_info`  

Optional split: Nurture Warm / Nurture Cold.

## Email Only

- Tag includes `coord_email_only`  
- Tag does not include `appt_booked`  
- Tag does not include `ai_handoff`  
- Tag does not include `opted_out`  
- Tag does not include `compliance_hold`  

## Scout — Needs Booking (optional)

- Hot / booking catch filters (e.g. `temp_hot` or stage Qualified)  
- Tag does not include `appt_booked`  
- Tag does not include `ai_handoff`  
- Tag does not include `compliance_hold`  

Smart Lists are **views**, not security. Lock modules with Roles.

## Next

→ [`06-lead-sources.md`](06-lead-sources.md)
