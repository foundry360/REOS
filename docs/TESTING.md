# REOS Lead Concierge — Manual Test Checklist

Run these in the **Referral Partners REOS** (or target) sub-account after following [`GHL_SETUP.md`](GHL_SETUP.md).

Use a real phone you control for SMS tests.

---

## Preflight

- [ ] Custom fields seeded (`npm run seed:fields`)
- [ ] Tags exist: `temp_hot`, `temp_warm`, `temp_cold`, `ai_handoff`
- [ ] Pipeline `REOS Leads` with stages New → … → Closed Lost
- [ ] Consult calendar has availability this week
- [ ] Conversation AI bot live on SMS
- [ ] Workflows published: Intake, Post-Qualify, Hot, Warm/Cold

---

## Scenario A — Hot Buyer (book appointment)

1. [ ] Submit website/test form: first name, phone, email  
2. [ ] Opportunity created in `REOS Leads` / `AI Qualifying`  
3. [ ] Bot SMS arrives within ~1 minute  
4. [ ] Reply: buying  
5. [ ] Answer location, property type, budget, **Pre-Approved**, timeline **0-30 Days**, must-haves, motivation  
6. [ ] Contact fields updated (Lead Type, Target Location, Budget, Financing, Timeline, Must Haves)  
7. [ ] Qualification Score ≥ 70; Lead Temperature = Hot; tag `temp_hot`  
8. [ ] AI Summary + Agent Brief populated  
9. [ ] Bot offers times; book a slot  
10. [ ] Appointment on calendar with notes; stage `Appointment Set`  
11. [ ] Agent receives Hot notification  

**Pass if:** CRM + calendar + agent notify all correct.

---

## Scenario B — Warm Seller (nurture, no hard book)

1. [ ] New test contact / form  
2. [ ] Reply: selling  
3. [ ] Give address; timeline **6+ Months**; mild motivation (“maybe next year”)  
4. [ ] Seller fields filled; score roughly 40–69; tag `temp_warm`  
5. [ ] Bot does **not** hard-sell appointment  
6. [ ] Stage moves to `Nurture` (or equivalent)  
7. [ ] Warm nurture message/email eventually fires (or is scheduled)  

**Pass if:** Warm tag + soft follow-up, no forced booking.

---

## Scenario C — Cold Investor

1. [ ] New contact; reply: investing  
2. [ ] Vague strategy / “just researching”; no budget or timeline  
3. [ ] Investor fields partially filled; Temperature = Cold; tag `temp_cold`  
4. [ ] Recommended Next Action ≈ long-term nurture  
5. [ ] Monthly-style nurture path engaged (or queued)  

**Pass if:** Cold classification + low-pressure nurture.

---

## Scenario D — Human handoff

1. [ ] Mid-qualification, reply: “Can I talk to a real person?”  
2. [ ] Tag `ai_handoff` applied  
3. [ ] Bot acknowledges handoff; stops pushing questions  
4. [ ] Agent notified / task created  

**Pass if:** AI pauses and human is alerted.

---

## Scenario E — Referral / Other

1. [ ] Reply: “just referring a friend” or “not sure”  
2. [ ] Lead Type = Referral (or closest)  
3. [ ] Bot collects enough to route or hand off politely  
4. [ ] No broken workflow errors  

---

## Regression after prompt edits

Re-run Scenario A after any bot instruction change.

- [ ] Still one question at a time  
- [ ] Fields still map correctly  
- [ ] Booking still works  
- [ ] Tags still apply  

---

## Failure log template

| Date | Scenario | Expected | Actual | Fix |
|---|---|---|---|---|
| | | | | |
