# REOS Client Onboarding (after Snapshot)

Install REOS into a **customer** sub-account from Snapshot. Do not rebuild from [`BUILD.md`](BUILD.md) unless the Snapshot failed.

**Spreadsheet:** [`REOS-Onboarding-Checklist.csv`](REOS-Onboarding-Checklist.csv) (import to Google Sheets).

Support sub-account tracks stages only (New → Snapshot loaded → Connections → Testing → Live → Closed). Customer onboards **in their** REOS account.

## 0. Install Snapshot

- [ ] Create sub-account  
- [ ] Load REOS Snapshot (fields, tags, pipelines, workflows, calendars, forms, smart lists, Conversation AI, templates, products)  
- [ ] Resolve conflicts  
- [ ] Record Location ID  

## 1. Profile and branding

- [ ] Name, timezone, logo  
- [ ] Favicon / brand assets  

## 2. Users and permissions

- [ ] Invite owner + agents  
- [ ] Roles (lock Workflows / AI Agents / Settings for agents if standard)  
- [ ] Notification recipients  

## 3. Phone, SMS, email

- [ ] LC phone  
- [ ] A2P / 10DLC  
- [ ] Sending domain  
- [ ] Test SMS + email  

## 4. Verify Snapshot landed

- [ ] Fields + core tags  
- [ ] Pipeline REOS Leads  
- [ ] Calendar REOS Consult shell  
- [ ] Three bots; Concierge Booking Off; Scheduler Booking On  
- [ ] Core workflows present  
- [ ] Smart lists present  
- [ ] Products present (e.g. Setup Fee)  

## 5. Remap connections

- [ ] Calendar sync + slots  
- [ ] Scheduler → this REOS Consult  
- [ ] Appointment Booked calendar filter  
- [ ] SMS / Meta channels  
- [ ] Forms → Intake  
- [ ] Workflow assign/notify users  

## 6. Optional

- [ ] Prompt tone / brokerage name  
- [ ] PIT for API  

## 7. Smoke test

Run [`TESTING.md`](TESTING.md) minimum scenarios.

## 8. Handoff

- [ ] Autopilot On  
- [ ] Agent queues explained  
- [ ] Support help URL shared  
- [ ] “Account ready” email with login  
- [ ] Support tracker → Live → Closed  

Full checkbox rows: use the CSV.
