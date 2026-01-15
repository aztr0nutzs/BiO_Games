# Bio Games - Production Deployment Guide

## Overview
This guide covers the complete production deployment of Bio Games, including all microservices, security configurations, and monitoring setup.

## Prerequisites

### Required Software
- Docker 20.10+
- Docker Compose 2.0+
- AWS CLI (for AWS deployment)
- kubectl (for Kubernetes deployment)
- Node.js 18+ (for local development)
- Java 17+ (for Android build)
- PostgreSQL 15+
- Redis 7+

### Required Accounts
- AWS Account (for cloud deployment)
- GitHub Account (for CI/CD)
- Domain name with SSL certificate

## Environment Configuration

### 1. Create Production Environment File

Create `.env.production` in the project root:

```bash
# Database
PG_DATABASE=bio_games_prod
PG_USER=bio_admin
PG_PASSWORD=<STRONG_PASSWORD>

# Redis
REDIS_PASSWORD=<STRONG_PASSWORD>

# JWT Secrets
JWT_SECRET=<RANDOM_256_BIT_KEY>
ADMIN_JWT_SECRET=<RANDOM_256_BIT_KEY>
HMAC_SECRET=<RANDOM_256_BIT_KEY>

# API Keys
AWS_ACCESS_KEY_ID=<YOUR_AWS_KEY>
AWS_SECRET_ACCESS_KEY=<YOUR_AWS_SECRET>

# Monitoring
SENTRY_DSN=<YOUR_SENTRY_DSN>
```

### 2. Generate Secrets

```bash
# Generate random secrets
openssl rand -hex 32  # For JWT_SECRET
openssl rand -hex 32  # For ADMIN_JWT_SECRET
openssl rand -hex 32  # For HMAC_SECRET
```

## Deployment Steps

### Phase 1: Database Setup

1. **Initialize PostgreSQL**
```bash
docker-compose -f docker-compose.prod.yml up -d postgres
docker-compose -f docker-compose.prod.yml exec postgres psql -U bio_admin -d bio_games_prod -f /docker-entrypoint-initdb.d/init.sql
```

2. **Verify Database**
```bash
docker-compose -f docker-compose.prod.yml exec postgres psql -U bio_admin -d bio_games_prod -c "\dt"
```

### Phase 2: Redis Setup

1. **Start Redis**
```bash
docker-compose -f docker-compose.prod.yml up -d redis
```

2. **Test Redis Connection**
```bash
docker-compose -f docker-compose.prod.yml exec redis redis-cli --pass <REDIS_PASSWORD> ping
```

### Phase 3: Microservices Deployment

1. **Build All Services**
```bash
docker-compose -f docker-compose.prod.yml build
```

2. **Start Services**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

3. **Verify Services**
```bash
# Check all services are running
docker-compose -f docker-compose.prod.yml ps

# Test health endpoints
curl http://localhost:3001/health  # Auth
curl http://localhost:3002/health  # Matchmaking
curl http://localhost:3003/health  # Game Logic
curl http://localhost:3004/health  # Economy
curl http://localhost:3005/health  # Analytics
curl http://localhost:3006/health  # Admin
```

### Phase 4: SSL Configuration

1. **Generate SSL Certificates**
```bash
# For Let's Encrypt (recommended)
certbot certonly --standalone -d biogames.com -d www.biogames.com

# Copy certificates
mkdir -p nginx/ssl
cp /etc/letsencrypt/live/biogames.com/fullchain.pem nginx/ssl/cert.pem
cp /etc/letsencrypt/live/biogames.com/privkey.pem nginx/ssl/key.pem
```

2. **Start Nginx**
```bash
docker-compose -f docker-compose.prod.yml up -d nginx
```

### Phase 5: Android APK Build

1. **Build Release APK**
```bash
./gradlew assembleRelease
```

2. **Sign APK**
```bash
# Generate keystore (first time only)
keytool -genkey -v -keystore bio-games.keystore -alias bio-games -keyalg RSA -keysize 2048 -validity 10000

# Sign APK
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore bio-games.keystore app/build/outputs/apk/release/app-release-unsigned.apk bio-games

# Align APK
zipalign -v 4 app/build/outputs/apk/release/app-release-unsigned.apk app/build/outputs/apk/release/app-release.apk
```

3. **Update Integrity Checker**
```bash
# Get APK signature
keytool -list -v -keystore bio-games.keystore -alias bio-games

# Update IntegrityChecker.java with the SHA-256 signature
```

### Phase 6: CI/CD Setup

1. **Configure GitHub Secrets**
Go to GitHub repository → Settings → Secrets and add:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `JWT_SECRET`
- `ADMIN_JWT_SECRET`
- `HMAC_SECRET`

2. **Enable GitHub Actions**
The CI/CD pipeline is already configured in `.github/workflows/ci-cd.yml`

### Phase 7: Monitoring Setup

1. **Install Monitoring Tools**
```bash
# Prometheus
docker run -d -p 9090:9090 prom/prometheus

# Grafana
docker run -d -p 3000:3000 grafana/grafana
```

2. **Configure Alerts**
Set up alerts for:
- Service downtime
- High error rates
- Database connection issues
- Memory/CPU usage

## Security Checklist

### Application Security
- [x] SSL/TLS enabled
- [x] HMAC request signing
- [x] JWT authentication
- [x] Rate limiting
- [x] Input validation
- [x] SQL injection prevention
- [x] XSS protection
- [x] CSRF protection

### Android Security
- [x] ProGuard obfuscation enabled
- [x] Root detection
- [x] Emulator detection
- [x] Debugger detection
- [x] APK integrity checks
- [x] SSL pinning
- [x] Anti-hooking

### Infrastructure Security
- [x] Firewall rules configured
- [x] Database access restricted
- [x] Redis password protected
- [x] Secrets encrypted
- [x] Backup strategy in place
- [x] Audit logging enabled

## Monitoring & Maintenance

### Health Checks
```bash
# Check all services
./scripts/health-check.sh

# View logs
docker-compose -f docker-compose.prod.yml logs -f [service-name]
```

### Database Backups
```bash
# Manual backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U bio_admin bio_games_prod > backup_$(date +%Y%m%d).sql

# Automated backups (add to cron)
0 2 * * * /path/to/backup-script.sh
```

### Scaling Services
```bash
# Scale specific service
docker-compose -f docker-compose.prod.yml up -d --scale game-logic=5

# For Kubernetes
kubectl scale deployment game-logic --replicas=5
```

## Rollback Procedure

### Quick Rollback
```bash
# Rollback to previous version
docker-compose -f docker-compose.prod.yml down
git checkout <previous-commit>
docker-compose -f docker-compose.prod.yml up -d
```

### Database Rollback
```bash
# Restore from backup
docker-compose -f docker-compose.prod.yml exec postgres psql -U bio_admin bio_games_prod < backup_YYYYMMDD.sql
```

## Performance Optimization

### Database Optimization
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX idx_telemetry_timestamp ON telemetry_events(timestamp);

-- Analyze tables
ANALYZE users;
ANALYZE game_sessions;
ANALYZE telemetry_events;
```

### Redis Optimization
```bash
# Configure Redis for production
redis-cli CONFIG SET maxmemory 2gb
redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

## Troubleshooting

### Common Issues

**Service won't start**
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs [service-name]

# Check resource usage
docker stats
```

**Database connection errors**
```bash
# Verify database is running
docker-compose -f docker-compose.prod.yml ps postgres

# Test connection
docker-compose -f docker-compose.prod.yml exec postgres psql -U bio_admin -d bio_games_prod -c "SELECT 1"
```

**High memory usage**
```bash
# Restart service
docker-compose -f docker-compose.prod.yml restart [service-name]

# Check for memory leaks
docker stats [container-id]
```

## Support & Contact

For production issues:
- Email: ops@biogames.com
- Slack: #bio-games-ops
- On-call: +1-XXX-XXX-XXXX

## License

Proprietary - Bio Games © 2026
