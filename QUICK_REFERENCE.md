# BiO Games - Quick Reference Guide

## 🚀 Getting Started (5 Minutes)

```bash
# 1. Setup environment
cp .env.example .env

# 2. Start services
docker-compose up -d

# 3. Build Android APK
./gradlew assembleDebug

# 4. Check everything works
curl http://localhost:3001/health  # Auth
curl http://localhost:3002/health  # Matchmaking
curl http://localhost:3003/health  # Game Logic
curl http://localhost:3004/health  # Economy
curl http://localhost:3005/health  # Analytics
```

---

## 📁 Project Structure

```
BiO_Games/
├── app/                          # Android application
│   ├── src/main/java/           # Java source code
│   │   └── com/bio/games/       # Main package
│   │       ├── BioGameBridge.java      # ✨ Bridge (16 methods)
│   │       ├── GameServer.java         # Game validation
│   │       ├── SecurityUtils.java      # Security checks
│   │       └── IntegrityChecker.java   # APK integrity
│   └── src/main/assets/www/     # Web assets
│       ├── bio_lobby3.html      # Main lobby
│       ├── chips_menu.html      # ✨ NEW: Chip purchases
│       ├── bio_slotz/           # Slot game
│       ├── bio_wheel/           # Wheel game
│       ├── bio_petz/            # Pet game
│       └── knxt4/               # KNXT4 game
├── server/                       # Main game server
│   ├── server.js                # Main server
│   ├── hmac_validator.js        # ✨ NEW: Request signing
│   └── game_validator.js        # ✨ NEW: Game logic
├── services/                     # Microservices
│   ├── auth/                    # Authentication
│   ├── matchmaking/             # Matchmaking
│   ├── game-logic/              # Game logic
│   ├── economy/                 # Economy
│   └── analytics/               # Analytics
├── admin/                        # Admin panel
├── scripts/                      # Utility scripts
│   └── asset_audit.py           # ✨ NEW: Asset validation
└── .github/workflows/           # CI/CD
    └── ci-cd.yml                # ✨ NEW: Pipeline
```

---

## 🔧 Common Commands

### Development
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Rebuild service
docker-compose build [service-name]

# Restart service
docker-compose restart [service-name]
```

### Android Build
```bash
# Debug build
./gradlew assembleDebug

# Release build
./gradlew assembleRelease

# Clean build
./gradlew clean

# Run tests
./gradlew test

# Install on device
./gradlew installDebug
```

### Database
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d bio_games

# Run SQL file
docker-compose exec postgres psql -U postgres -d bio_games -f /path/to/file.sql

# Backup database
docker-compose exec postgres pg_dump -U postgres bio_games > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres -d bio_games < backup.sql
```

### Redis
```bash
# Connect to Redis
docker-compose exec redis redis-cli

# Check keys
docker-compose exec redis redis-cli KEYS '*'

# Flush all data
docker-compose exec redis redis-cli FLUSHALL
```

---

## 🎮 Bridge Methods (JavaScript → Java)

All methods available via `BioGameJS` object:

```javascript
// Navigation
BioGameJS.goBackToLobby()           // ✨ NEW
BioGameJS.openStore()
BioGameJS.openChipsMenu()           // ✨ NEW

// Games
BioGameJS.playSlotz()
BioGameJS.playKNXT4()
BioGameJS.playWheel()
BioGameJS.playBioPetz()

// Economy
BioGameJS.getCredits()              // Returns int
BioGameJS.getToxins()               // Returns int
BioGameJS.addCredits(amount)
BioGameJS.addToxins(amount)

// Session
BioGameJS.getSessionToken()         // Returns string
BioGameJS.getPlayerId()             // Returns string
BioGameJS.getDeviceHash()           // Returns string

// Testing
BioGameJS.testBridge()              // Shows toast
```

---

## 🔒 Security Features

### Client-Side (Android)
1. **Root Detection** - 6 methods
2. **Emulator Detection** - 3 methods
3. **Debugger Detection** - JDWP, GDB, LLDB
4. **Hook Detection** - Frida, Xposed, Substrate
5. **APK Integrity** - Signature & hash validation
6. **SSL Pinning** - Certificate validation
7. **Code Obfuscation** - ProGuard/R8

### Server-Side
1. **HMAC Signing** - SHA256 with nonce & timestamp
2. **JWT Auth** - Token-based authentication
3. **Rate Limiting** - Anti-abuse protection
4. **Input Validation** - All inputs validated
5. **Authoritative Logic** - Server controls outcomes
6. **Anti-Cheat** - Speed hack detection

---

## 🌐 API Endpoints

### Auth Service (Port 3001)
```
POST /auth              # Login
POST /register          # Register
POST /refresh           # Refresh token
GET  /health            # Health check
```

### Matchmaking Service (Port 3002)
```
POST /matchmake         # Join matchmaking
POST /join_room         # Join specific room
POST /leave_room        # Leave room
GET  /health            # Health check
```

### Game Logic Service (Port 3003)
```
POST /validate_move     # Validate game move
POST /spin_slot         # Spin slot machine
POST /spin_wheel        # Spin wheel
GET  /health            # Health check
```

### Economy Service (Port 3004)
```
GET  /balance           # Get player balance
POST /purchase          # Make purchase
POST /reward            # Grant reward
GET  /health            # Health check
```

### Analytics Service (Port 3005)
```
POST /event             # Log event
GET  /stats             # Get statistics
GET  /health            # Health check
```

---

## 🐛 Debugging

### Check Bridge Logs
```bash
# Android logcat
adb logcat | grep BioGameBridge

# Filter by tag
adb logcat BioGameBridge:D *:S
```

### Check Service Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f auth

# Last 100 lines
docker-compose logs --tail=100 game-logic
```

### Check Database
```sql
-- Connect
docker-compose exec postgres psql -U postgres -d bio_games

-- Check tables
\dt

-- Check users
SELECT * FROM users LIMIT 10;

-- Check transactions
SELECT * FROM transactions ORDER BY created_at DESC LIMIT 10;
```

### Check Redis
```bash
# Connect
docker-compose exec redis redis-cli

# Check keys
KEYS *

# Get value
GET key_name

# Check memory
INFO memory
```

---

## 📊 Monitoring

### Health Checks
```bash
# Check all services
for port in 3001 3002 3003 3004 3005; do
  echo "Port $port:"
  curl -s http://localhost:$port/health | jq
done
```

### Resource Usage
```bash
# Docker stats
docker stats

# Service-specific
docker stats bio_games_auth_1
```

### Database Performance
```sql
-- Active connections
SELECT count(*) FROM pg_stat_activity;

-- Slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

---

## 🚨 Troubleshooting

### Service Won't Start
```bash
# Check logs
docker-compose logs [service-name]

# Check if port is in use
netstat -an | grep [port]

# Restart service
docker-compose restart [service-name]

# Rebuild and restart
docker-compose up -d --build [service-name]
```

### Database Connection Failed
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check connection
docker-compose exec postgres pg_isready

# Check credentials in .env
cat .env | grep PG_
```

### APK Build Failed
```bash
# Clean build
./gradlew clean

# Check Java version
java -version

# Check Android SDK
echo $ANDROID_HOME

# Sync Gradle
./gradlew --refresh-dependencies
```

### Bridge Not Working
```javascript
// Check if bridge exists
if (typeof BioGameJS !== 'undefined') {
  console.log('Bridge available');
  BioGameJS.testBridge();
} else {
  console.error('Bridge not available');
}
```

---

## 📝 Environment Variables

### Required
```bash
# Database
PG_HOST=localhost
PG_USER=postgres
PG_PASSWORD=password
PG_DATABASE=bio_games

# Redis
REDIS_URL=redis://localhost:6379

# Secrets
JWT_SECRET=your_secret_here
HMAC_SECRET=your_hmac_secret_here
```

### Optional
```bash
# Ports
AUTH_PORT=3001
MATCHMAKING_PORT=3002
GAME_LOGIC_PORT=3003

# Features
ENABLE_SECURITY_CHECKS=true
ENABLE_MULTIPLAYER=true
ENABLE_ANALYTICS=true
```

---

## 🔗 Useful Links

- **Deployment Guide**: `DEPLOYMENT_GUIDE.md`
- **Implementation Report**: `COMPLETE_IMPLEMENTATION_REPORT.md`
- **Implementation Summary**: `IMPLEMENTATION_SUMMARY.md`
- **Final Checklist**: `FINAL_CHECKLIST.md`
- **Phase Fixes**: `PHASE_FIXES_REPORT.md`

---

## 💡 Tips

1. **Always check logs first** when debugging
2. **Use health endpoints** to verify services
3. **Test locally** before deploying
4. **Keep .env secure** - never commit it
5. **Run asset audit** after adding new assets
6. **Monitor resource usage** in production
7. **Backup database** before major changes
8. **Test security features** on real devices

---

**Quick Start**: `docker-compose up -d && ./gradlew assembleDebug`  
**Quick Stop**: `docker-compose down`  
**Quick Test**: `curl http://localhost:3001/health`

---

**Last Updated**: January 15, 2026
