BIO-PET PROJECT RULES & QUALITY DOCTRINE

Version: v0.9 Early Access
Applies to: Every file, screen, system, animation, and asset

🔒 1. CORE PHILOSOPHY (ABSOLUTE)

Bio-Pet is a live, experimental cyber-organism — not a demo.

Every feature must:

Persist

React

Animate

Scale

Fail safely

Look intentional

If a system exists, it must be complete.
If it is incomplete, it must not exist at all.

🧠 2. COMPLETION STANDARD (MANDATORY)

A task is NOT complete unless ALL of the following are true:

✅ UI implemented
✅ ViewModel implemented
✅ State persisted
✅ Animations added
✅ Sound / haptics wired
✅ Edge cases handled
✅ Analytics fired
✅ Navigation tested
✅ Visual polish pass complete
✅ No TODOs remain

If any item is missing → task is incomplete

🧱 3. ARCHITECTURE LAW (NO EXCEPTIONS)
Layer separation is sacred:

UI: rendering only

ViewModel: orchestration only

Domain: pure logic only

Data: persistence only

🚫 No business logic in Composables
🚫 No database calls in UI
🚫 No UI logic in repositories

Violations require immediate refactor.

🧬 4. MUTATION & CORRUPTION RULES
Mutation system must:

Be deterministic

Be reversible only via rollback

Persist fully via Room

Animate state changes

Affect gameplay meaningfully

Corruption:

Is permanent unless rolled back

Has escalating consequences

Has unique visuals & audio

Can unlock legendary branches

🚫 No “cosmetic-only” mutations
🚫 No silent state changes

Every mutation must:

Explain itself visually

Change stats or mechanics

Be trackable historically

🎮 5. MINI-GAMES QUALITY BAR

A mini-game is invalid unless:

Replayable

Scales difficulty

Has failure states

Integrates economy

Affects pet state or instability

Has unique visuals

Has sound + haptics

🚫 No placeholder mechanics
🚫 No static screens

If it feels optional — it’s wrong.

🎞️ 6. VISUAL & ANIMATION DOCTRINE
Every screen must:

Animate in

Animate state changes

Animate user actions

React to instability

Lottie rules:

No blocking navigation

No infinite heavy loops

Layered safely above UI

Disabled in accessibility mode

🚫 Static UI = bug
🚫 Empty states = failure

🔊 7. AUDIO & HAPTICS STANDARD

Every interaction must:

Have tactile feedback

Have audio confirmation

Respect quiet hours

Be toggleable

Mutation events:

Must feel heavy

Must feel dangerous

💾 8. PERSISTENCE GUARANTEES
Room:

Must survive process death

Must migrate safely

Must never corrupt save state

DataStore:

Must load before UI usage

Must never block rendering

Must be fail-safe

🚫 No in-memory-only game state
🚫 No silent data loss

📊 9. ANALYTICS LOCKDOWN

Only track:

Critical progression events

Mutation choices

Failures

Discoveries

🚫 No spam events
🚫 No UI noise
🚫 No PII

Analytics must:

Be centralized

Be toggleable

Be documented

🧪 10. ARG & SECRETS POLICY

ARG content must:

Never be explained

Never block core gameplay

Never break UX

Be discoverable organically

Hidden ≠ impossible
Obscure ≠ unfair

🧭 11. NAVIGATION & FLOW

Single source of truth

Animated transitions everywhere

No dead ends

No back-stack bugs

Deep-link ready

🚫 Multiple NavHosts
🚫 Hardcoded routes

🎯 12. ECONOMY ETHICS

No pay-to-win

No forced waits

No dark patterns

No currency traps

Retention comes from:

Risk

Curiosity

Consequence

Not friction.

🧪 13. TESTING & VERIFICATION

Before any release:

Cold start tested

Background → foreground tested

Device rotation tested

Low memory tested

Offline tested

If it breaks once → fix immediately.

🧼 14. CODE HYGIENE

🚫 No TODO
🚫 No commented-out code
🚫 No unused assets
🚫 No magic numbers
🚫 No duplicated logic

Everything must be:

Named clearly

Documented where non-obvious

Intentional

🏁 15. RELEASE READINESS CHECK

A build is REJECTED if:

Any feature is partially implemented

Any screen feels unfinished

Any animation is missing

Any sound is missing

Any state is volatile

Early Access ≠ Incomplete

🧠 FINAL COMMANDMENT

If this were your only app on the Play Store —
would you be proud of it?

If the answer is no — keep working.
