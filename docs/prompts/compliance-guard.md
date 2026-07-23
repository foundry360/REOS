# REOS Compliance Guard — Opt-out & Do-Not-Message

**Phase 1 agent:** The Compliance Guard — stops AI outreach when the lead must not be contacted.

Compliance Guard is a **workflow**, not a Conversation AI chat bot. It kills Concierge / Scheduler / Follow-Up and blocks Coordinator from turning them back on.

| Job | How |
|---|---|
| **Kill switch** | On `opted_out` / `dnd` / `compliance_hold` → all specialist bots **Inactive** |
| **Hold** | Tag `compliance_hold` so Coordinator cannot reactivate bots |
| **Clear book path** | Remove `ready_to_book` (and optionally `ai_qualifying`) |
| **Alert human** | Internal Notification only — **no** SMS from this workflow |

---

## Tags

| Tag | Meaning |
|---|---|
| `opted_out` | Lead asked to stop / unsubscribed |
| `compliance_hold` | Guard engaged — bots must stay off |
| `dnd` | Optional alias if already used in the account |

---

## Workflow: `REOS Compliance Guard`

### Triggers

Prefer **three separate** Contact Tag triggers (tag added) — one per tag. A single trigger listing multiple tags often fails to fire in GHL:

- `opted_out`
- `compliance_hold`
- `dnd` (if you use it)

Optional later: Customer reply contains `STOP` / `UNSUBSCRIBE` / `CANCEL` → Add Tag `opted_out` (or rely on GHL native STOP + tag).

### Actions (linear)

1. **If/Else** — has assigned user?  
   - No → **Assign to User**  
   - Yes → continue  
2. **Update Conversation AI** → REOS Lead Concierge → **Inactive**  
3. **Update Conversation AI** → REOS Scheduler → **Inactive**  
4. **Update Conversation AI** → REOS Follow-Up → **Inactive**  
5. **Add Tag** → `opted_out`  
6. **Add Tag** → `compliance_hold`  
7. **Remove Tag** → `ready_to_book`  
8. **Remove Tag** → `ai_qualifying` (optional)  
9. **Internal Notification** → Assigned User  

| Field | Value |
|---|---|
| Subject | `REOS: Compliance hold` |
| Body | `Compliance hold — AI bots stopped for {{contact.first_name}} {{contact.last_name}}. Do not auto-text. Tags: opted_out, compliance_hold.` |

**Do not** Send SMS from this workflow.

---

## Coordinator hook (required)

In **`REOS Coordinator`**, immediately **after Assign**, **before** `ai_handoff`:

```text
If/Else — tags include compliance_hold OR opted_out?
  Yes → Concierge / Scheduler / Follow-Up all Inactive → Add Tag coordinated → End
  None → continue to ai_handoff waterfall
```

This prevents `researcher_done` (or other triggers) from restarting Concierge after a STOP.

---

## Bot prompt rules (paste into each chat bot)

Add the **COMPLIANCE** block from Concierge / Scheduler / Follow-Up prompt packs into **Additional Information**. Summary:

- If they say stop / unsubscribe / don’t text / remove me → stop pitching; Human handover + Stop bot; prefer tag `opted_out` if the bot can tag
- Never promise legal, financial, or guaranteed outcomes
- Do not continue nurture or booking pressure after opt-out language

---

## What Compliance Guard does not do

- Formal TCPA consent capture / form legal audit  
- Quiet-hours by state  
- Litigator-grade claim screening AI  
- A separate Compliance Conversation AI bot  

---

## Manual test

| Setup | Action | Expect |
|---|---|---|
| Contact with Concierge Active | Add `opted_out` | All bots Inactive; `compliance_hold`; notify |
| Same contact | Add `researcher_done` | Coordinator keeps bots Inactive |
| SMS live (optional) | Lead replies STOP | Same if keyword/native STOP tags `opted_out` |
