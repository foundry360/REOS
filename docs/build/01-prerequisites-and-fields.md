# Build Phase 1 — Prerequisites and custom fields

## Prerequisites

- [ ] GHL sub-account with Conversation AI (and Appointment Booking)  
- [ ] Ability to attach a phone number (can finish SMS later, but needed before live)  
- [ ] Repo cloned; Node.js available for field seed  

## Private Integration Token

In the **master** sub-account:

1. Settings → Integrations → Private Integrations  
2. Create token with at least: `locations/customFields.readonly`, `locations/customFields.write`  
3. Copy Location ID  

In this repo:

```bash
cp .env.example .env
# GHL_PRIVATE_TOKEN=pit-...
# GHL_LOCATION_ID=...
npm install
npm run connect
```

Confirm connection succeeds before seeding.

## Seed custom fields

```bash
npm run seed:fields
```

Verify **Settings → Custom Fields** (contact):

| Folder / group | Examples |
|---|---|
| Intent | Lead Type, Lead Temperature |
| Buyer | Target Location, Budget, Property Type, Financing, Timeline, Must Haves |
| Seller | Property Address, Estimated Value, Selling Timeline, Motivation |
| Investor | Investment Strategy, Target Markets, Investment Goals |
| Contact Preferences | Preferred Channel, Preferred Language |
| AI | AI Summary, Qualification Score, Recommended Next Action, Agent Brief |

Identity (name / phone / email) uses native GHL fields. Organize into folders in the UI if ungrouped.

**Note:** Preferred Channel / Language often show on the contact but **not** in Workflow → Update Contact Field. Researcher uses **tags** (`channel_sms`, `lang_en`) for routing.

## Next

→ [`02-tags-pipeline-calendar.md`](02-tags-pipeline-calendar.md)
