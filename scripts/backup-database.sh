#!/bin/bash

# Bio Games Database Backup Script
# Run this script daily via cron: 0 2 * * * /path/to/backup-database.sh

# Configuration
BACKUP_DIR="/var/backups/bio-games"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="bio_games_backup_${TIMESTAMP}.sql"
RETENTION_DAYS=30

# Database credentials (load from environment or .env file)
source .env.production 2>/dev/null || {
  echo "Error: .env.production file not found"
  exit 1
}

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "Starting database backup..."
echo "Timestamp: $TIMESTAMP"

# Perform backup
docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump \
  -U "$PG_USER" \
  -d "$PG_DATABASE" \
  --clean \
  --if-exists \
  > "${BACKUP_DIR}/${BACKUP_FILE}"

if [ $? -eq 0 ]; then
  echo "Backup completed successfully: ${BACKUP_FILE}"
  
  # Compress backup
  gzip "${BACKUP_DIR}/${BACKUP_FILE}"
  echo "Backup compressed: ${BACKUP_FILE}.gz"
  
  # Upload to S3 (optional)
  if [ ! -z "$AWS_ACCESS_KEY_ID" ]; then
    aws s3 cp "${BACKUP_DIR}/${BACKUP_FILE}.gz" "s3://${S3_BUCKET}/backups/"
    echo "Backup uploaded to S3"
  fi
  
  # Remove old backups
  find "$BACKUP_DIR" -name "bio_games_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
  echo "Old backups cleaned up (retention: ${RETENTION_DAYS} days)"
  
else
  echo "Error: Backup failed"
  exit 1
fi

echo "Backup process completed"
