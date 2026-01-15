# BiO Games - Deployment Guide

## Overview
This guide covers the complete deployment process for the BiO Games platform, including Android APK, backend services, and admin panel.

---

## Prerequisites

### Development Environment
- **Java JDK 17+** for Android development
- **Node.js 18+** for backend services
- **Docker & Docker Compose** for containerization
- **Android SDK** with API level 34
- **Git** for version control

### Production Environment
- **PostgreSQL 15+** database
- **Redis 7+** cache server
- **AWS Account** (or equivalent cloud provider)
- **Domain name** with SSL certificate
- **CI/CD pipeline** (GitHub Actions configured)

---

## Phase 0: Repository Setup

### 1. Clone and Initialize
```bash
git clone <repository-url>
cd BiO_Games
cp .env.example .env
# Edit .env with your configuration
```

### 2. Install Dependencies
```bash
# Android dependencies
./gradlew build

# Backend dependencies
cd server && npm install
cd ../admin && npm install
cd ../services/auth && npm install
# Repeat for all services
```

### 3. Create Baseline Tag
```bash
git add .
git commit -m "Baseline commit before deployment"
git tag baseline-pre-refactor
git push origin baseline-pre-refactor
```

---

## Phase 1-2: Local Development

### 1. Start Local Services
```bash
docker-compose up -d postgres redis
```

### 2. Initialize Database
```bash
docker-compose exec postgres psql -U postgres -d bio_games -f /docker-entrypoint-initdb.d/init.sql
```

### 3. Build Android APK
```bash
./gradlew assembleDebug
# APK location: app/build/outputs/apk/debug/app-debug.apk
```

### 4. Run Asset Audit
```bash
python3 scripts/asset_audit.py
```

---

## Phase 3: Security Configuration

### 1. Generate Secrets
```bash
# Generate JWT secret
openssl rand -hex 32

# Generate HMAC secret
openssl rand -hex 32
```

### 2. Update Environment Variables
Edit `.env` and update:
- `JWT_SECRET`
- `ADMIN_JWT_SECRET`
- `HMAC_SECRET`

### 3. Configure APK Signing
```bash
# Generate keystore
keytool -genkey -v -keystore bio-games.keystore -alias bio-games -keyalg RSA -keysize 2048 -validity 10000

# Update app/build.gradle with signing config
```

### 4. Enable Security Checks
In `app/build.gradle`, ensure:
```gradle
buildConfigField "boolean", "ENABLE_SECURITY_CHECKS", "true"
```

---

## Phase 4-5: Backend Services

### 1. Start All Services
```bash
docker-compose up -d
```

### 2. Verify Services
```bash
# Check service health
docker-compose ps

# Test endpoints
curl http://localhost:3001/health  # Auth service
curl http://localhost:3002/health  # Matchmaking
curl http://localhost:3003/health  # Game logic
curl http://localhost:3004/health  # Economy
curl http://localhost:3005/health  # Analytics
```

### 3. Initialize Economy
```bash
# Run economy initialization script
node services/economy/scripts/init-economy.js
```

---

## Phase 6: Android Hardening

### 1. Build Release APK
```bash
./gradlew assembleRelease
```

### 2. Verify Obfuscation
```bash
# Check ProGuard mapping
cat app/build/outputs/mapping/release/mapping.txt
```

### 3. Test Security Features
- Root detection
- Emulator detection
- Debugger detection
- SSL pinning
- APK integrity checks

---

## Phase 7: Cloud Deployment

### 1. Configure AWS
```bash
# Install AWS CLI
aws configure

# Create ECR repositories
aws ecr create-repository --repository-name bio-games/auth
aws ecr create-repository --repository-name bio-games/matchmaking
# Repeat for all services
```

### 2. Push Docker Images
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and push
docker-compose build
docker-compose push
```

### 3. Deploy to ECS
```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name bio-games-production

# Create task definitions and services
# (Use provided CloudFormation templates)
```

### 4. Configure Load Balancer
```bash
# Create Application Load Balancer
aws elbv2 create-load-balancer --name bio-games-alb --subnets <subnet-ids>

# Configure target groups and listeners
```

### 5. Setup Auto-Scaling
```bash
# Configure auto-scaling policies
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/bio-games-production/game-logic \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10
```

---

## Phase 8: Admin Panel

### 1. Access Admin Panel
```
URL: http://localhost:3006 (development)
URL: https://admin.biogames.com (production)
```

### 2. Create Admin User
```bash
node admin/scripts/create-admin.js --username admin --password <secure-password>
```

### 3. Configure RBAC
Edit `admin/config/roles.json` to define:
- Super Admin
- Admin
- Moderator
- Support

---

## Monitoring & Maintenance

### 1. Setup Monitoring
```bash
# Install monitoring agents
# Configure Sentry for error tracking
# Setup New Relic for APM
# Configure CloudWatch alarms
```

### 2. Backup Strategy
```bash
# Automated PostgreSQL backups
aws rds create-db-snapshot --db-instance-identifier bio-games-db --db-snapshot-identifier backup-$(date +%Y%m%d)

# Redis persistence
# Configured in docker-compose.yml with AOF
```

### 3. Log Aggregation
```bash
# Configure CloudWatch Logs
# Setup log retention policies
# Create log analysis dashboards
```

---

## Rollback Procedures

### 1. Application Rollback
```bash
# Rollback to previous ECS task definition
aws ecs update-service --cluster bio-games-production --service game-logic --task-definition previous-task-def
```

### 2. Database Rollback
```bash
# Restore from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier bio-games-db-restored \
  --db-snapshot-identifier backup-20260115
```

### 3. APK Rollback
```bash
# Revert to previous APK version in Play Store
# Use Google Play Console rollback feature
```

---

## Testing Checklist

### Pre-Deployment
- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] Security scan completed
- [ ] Performance testing done
- [ ] Load testing completed
- [ ] Backup verified
- [ ] Rollback plan tested

### Post-Deployment
- [ ] Health checks passing
- [ ] Monitoring active
- [ ] Logs flowing correctly
- [ ] User authentication working
- [ ] Game logic functioning
- [ ] Payment processing tested
- [ ] Admin panel accessible

---

## Troubleshooting

### Common Issues

#### Services Won't Start
```bash
# Check logs
docker-compose logs <service-name>

# Verify environment variables
docker-compose config

# Check network connectivity
docker network inspect bio_games_default
```

#### Database Connection Issues
```bash
# Test connection
docker-compose exec postgres psql -U postgres -d bio_games

# Check credentials in .env
# Verify PostgreSQL is running
docker-compose ps postgres
```

#### APK Build Failures
```bash
# Clean build
./gradlew clean

# Check Java version
java -version

# Verify SDK installation
echo $ANDROID_HOME
```

---

## Support & Documentation

- **API Documentation**: `/docs/api`
- **Architecture Diagrams**: `/docs/architecture`
- **Security Policies**: `/docs/security`
- **Incident Response**: `/docs/incident-response`

---

## Version History

- **v1.0.0** - Initial release
- **Phase 0-2** - Foundation and assets
- **Phase 3** - Security implementation
- **Phase 4-5** - Backend services
- **Phase 6** - Android hardening
- **Phase 7** - Cloud deployment
- **Phase 8** - Admin panel

---

**Last Updated**: January 15, 2026
