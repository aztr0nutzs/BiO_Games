# Project Completion Guide
## Phases 0–8

This document defines a strict, step‑by‑step execution plan to take the project from a broken prototype to a production‑ready system. Each phase has explicit objectives, required tasks, and acceptance criteria.

---

# PHASE 0 – BASELINE & REPOSITORY SANITY

### Objective
Establish a clean, deterministic working state.

### Tasks
1. **Commit Hygiene**
   - Check git status
   - Commit or discard all local changes
   - Tag baseline: `baseline-pre-refactor`

2. **Repository Structure Audit**
   - Map directories
   - Identify:
     - game modules
     - shared assets
     - Java bridge files
     - HTML entry points

3. **Dependency Lock**
   - Freeze:
     - Gradle versions
     - SDK versions
     - NPM (if used)

4. **Build Verification**
   - Clean build
   - Install APK
   - Verify app launches

### Deliverables
- Clean git state
- Build success log
- Directory map

### Acceptance
- No uncommitted changes
- App launches
- Baseline tag exists

---

# PHASE 1 – BRIDGE & NAVIGATION FOUNDATION

### Objective
Guarantee Java ↔ JavaScript communication is 100% functional.

### Tasks
1. **Bridge Class**
   - Add `@JavascriptInterface`
   - Implement methods:
     - openStore
     - playKNXT4
     - playBioPetz
     - playBioSlotz
     - playBioWheel
     - goBackToLobby
     - openChipsMenu

2. **WebView Setup**
   - Enable:
     - JavaScript
     - DOM storage
     - hardware acceleration

3. **HTML Wiring**
   - Verify onclick methods
   - Case‑sensitive match

4. **Logging**
   - Log every bridge call

### Deliverables
- Updated Java bridge
- Verified HTML bindings

### Acceptance
- All buttons navigate
- No silent failures
- Logs show every call

---

# PHASE 2 – ASSET INTEGRITY & GAME VALIDATION

### Objective
Remove all missing, broken, or orphaned assets.

### Tasks
1. **Asset Audit Script**
   - Scan for:
     - missing files
     - unused files
     - broken paths

2. **Fix Missing Assets**
   - KNXT4
   - BiO‑Wheel
   - BiO‑Slotz

3. **Standardize Paths**
   - Relative paths only
   - No hardcoded absolute paths

4. **Screen Validation**
   - Load each module
   - Verify:
     - images
     - audio
     - animations

### Deliverables
- Asset audit report
- Cleaned asset tree

### Acceptance
- Zero missing files
- All screens render
- No 404s

---

# PHASE 3 – SERVER VALIDATION & ANTI‑CHEAT

### Objective
Remove client trust completely.

### Tasks
1. **Authoritative Server Logic**
   - Slot outcomes
   - Wheel spins
   - KNXT4 results

2. **Request Signing**
   - HMAC SHA256
   - Nonce
   - Timestamp

3. **Memory Tamper Detection**
   - Shadow variables
   - Periodic sync

4. **Abuse Detection**
   - Speed hacks
   - Macro detection

5. **APK Tamper Checks**
   - Root
   - Emulator
   - Debugger

### Deliverables
- Validation server
- Anti‑cheat rules

### Acceptance
- Offline cheating impossible
- Tampering logged
- Rewards server‑only

---

# PHASE 4 – MULTIPLAYER BACKEND

### Objective
Real‑time multiplayer infrastructure.

### Tasks
1. **Server Stack**
   - FastAPI / Node
   - Redis
   - PostgreSQL

2. **Matchmaking**
   - Ranked
   - Casual
   - Private rooms

3. **Game Sync**
   - WebSockets
   - Tick system
   - Rollback support

4. **Anti‑Desync**
   - Checksums
   - Resync

5. **Ranking**
   - ELO
   - Season resets

### Deliverables
- Multiplayer server
- Matchmaking engine

### Acceptance
- Stable matches
- No desync
- Rankings update

---

# PHASE 5 – ECONOMY & LOOTBOX SYSTEM

### Objective
Build a sustainable economy.

### Tasks
1. **Currencies**
   - Soft
   - Hard

2. **Store Engine**
   - Dynamic pricing
   - Sales

3. **Lootboxes**
   - Weighted RNG
   - Pity system

4. **Drop Tables**
   - JSON versioned

5. **Analytics**
   - Purchase tracking

### Deliverables
- Store backend
- Lootbox engine

### Acceptance
- Server‑controlled balances
- Fair RNG
- Logged purchases

---

# PHASE 6 – ANDROID HARDENING

### Objective
Protect APK & pass Play Store review.

### Tasks
1. **Obfuscation**
   - R8 / ProGuard

2. **Root Detection**
3. **Anti‑Hook**
4. **SSL Pinning**
5. **Permission Audit**
6. **Target SDK 34+**

### Deliverables
- Hardened APK

### Acceptance
- MITM blocked
- Debug blocked
- Store compliant

---

# PHASE 7 – CLOUD & CI/CD

### Objective
Production deployment.

### Tasks
1. **Dockerize services**
2. **CI Pipeline**
   - Build
   - Test
   - Deploy

3. **Secret Management**
4. **Auto‑Scaling**
5. **Monitoring**

### Deliverables
- CI pipeline
- Live servers

### Acceptance
- One‑click deploy
- Auto rollback
- Metrics visible

---

# PHASE 8 – ADMIN PANEL & MODERATION

### Objective
Full operational control.

### Tasks
1. **Admin Dashboard**
2. **RBAC roles**
3. **Cheat Review**
4. **Live Ops Tools**
5. **Economy Controls**

### Deliverables
- Web admin panel

### Acceptance
- Account management works
- Logs visible
- Economy editable

---

# FINAL CHECKLIST

- All phases signed off
- Security review complete
- Stress test passed
- Backups verified

---

**End of Guide**

