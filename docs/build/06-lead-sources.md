# Build Phase 6 — Lead sources

Wire every inbound source to **REOS Intake** without double-firing.

## Website / landing form

1. Create or use lead capture form (name, email, phone)  
2. Map fields to contact  
3. **REOS Intake** trigger: Form Submitted → this form  
4. Do not also use Contact Created for the same form (double Intake)  

## Facebook Lead Form

- Intake trigger: Facebook Lead Form (if used)  
- Optional: tag `source_facebook` for Messenger confirmations  

## Instagram / Messenger

- Bridge workflows: tags only (`source_instagram` / `source_facebook` + `ai_qualifying` if needed)  
- Do not flip Conversation AI Active/Inactive in bridges  

## SMS inbound

- Optional Intake trigger for new SMS conversations  
- Prefer form/FB for MVP if inbound SMS creates noise  

## Manual leads

Create contact with phone → add tag `ai_qualifying` (or enroll Intake) for test paths.

## Next

→ [`07-publish-and-test.md`](07-publish-and-test.md)
