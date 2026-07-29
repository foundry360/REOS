# Customer onboarding journey (SaaS)

How a **paying customer** enters REOS across Sales, Support, and their sub-account.

Build the product itself with [`BUILD.md`](BUILD.md). Install into their account with [`ONBOARDING.md`](ONBOARDING.md).

## Flow

```text
Sales: Lead → Closed Won
  → Welcome email (button → Support form)

Support: Form submit
  → Contact + Opportunity (pipeline REOS Onboarding)
  → Team tracks stages while installing

Customer REOS sub-account:
  → Create account + load Snapshot
  → Remap phone/calendar/users
  → Customer uses THEIR account
```

## Support pipeline stages (tracker)

New → Snapshot loaded → Connections → Testing → Live → Closed  

Customers do **not** see this board. They only see the intake form and later their own login.

## Sales workflow

- Trigger: Opportunity → Closed Won  
- Action: Send welcome email with form button  

Form URL example: `https://connect.referralpartners.io/widget/form/6sJSw37Hd4hEwlHgS73X`

Email HTML: see team Sales template (button `href` = form URL).

## Support workflow

- Trigger: Form Submitted  
- Actions: Create/Update Contact → Create Opportunity (REOS Onboarding / New) → tag → notify → optional confirmation email  

## Form copy

- Heading: Get started with REOS  
- Helper: Tell us a few basics about you and your business. This starts your onboarding.  

## Related

- Architecture: [`ARCHITECTURE.md`](ARCHITECTURE.md)  
- Client install checklist: [`ONBOARDING.md`](ONBOARDING.md)  
- Master build: [`BUILD.md`](BUILD.md)  
