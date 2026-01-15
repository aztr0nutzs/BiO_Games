#!/bin/bash

# Bio Games Health Check Script
# Checks all services and reports status

echo "==================================="
echo "Bio Games Health Check"
echo "==================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Services to check
SERVICES=(
  "auth:3001"
  "matchmaking:3002"
  "game-logic:3003"
  "economy:3004"
  "analytics:3005"
  "admin:3006"
)

# Check function
check_service() {
  local service=$1
  local port=$2
  local url="http://localhost:${port}/health"
  
  response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
  
  if [ "$response" = "200" ]; then
    echo -e "${GREEN}✓${NC} ${service} - OK"
    return 0
  else
    echo -e "${RED}✗${NC} ${service} - FAILED (HTTP ${response})"
    return 1
  fi
}

# Check Docker containers
echo "Checking Docker containers..."
docker-compose ps

echo ""
echo "Checking service health endpoints..."
echo ""

failed=0
for service_port in "${SERVICES[@]}"; do
  IFS=':' read -r service port <<< "$service_port"
  if ! check_service "$service" "$port"; then
    ((failed++))
  fi
done

echo ""
echo "==================================="
if [ $failed -eq 0 ]; then
  echo -e "${GREEN}All services are healthy!${NC}"
  exit 0
else
  echo -e "${RED}${failed} service(s) failed health check${NC}"
  exit 1
fi
