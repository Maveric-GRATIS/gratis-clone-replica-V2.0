#!/usr/bin/env bash
# ============================================================================
# GRATIS.NGO - Production Deployment Script
# ============================================================================
# Automates production deployment with safety checks
# Usage: ./scripts/deploy-production.sh
# ============================================================================

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  GRATIS.NGO Production Deployment${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# -----------------------------------------------------------------------------
# Pre-deployment validation
# -----------------------------------------------------------------------------

echo -e "${YELLOW}Step 1:${NC} Running pre-deployment checks..."
if [ -f "./scripts/pre-deploy-check.sh" ]; then
  if bash ./scripts/pre-deploy-check.sh; then
    echo -e "${GREEN}✓${NC} Pre-deployment checks passed"
  else
    echo -e "${RED}✗${NC} Pre-deployment checks failed"
    exit 1
  fi
else
  echo -e "${YELLOW}⚠${NC} Pre-deploy check script not found, skipping..."
fi

echo ""

# -----------------------------------------------------------------------------
# Confirmation
# -----------------------------------------------------------------------------

echo -e "${YELLOW}Step 2:${NC} Deployment confirmation"
echo -n "Deploy to PRODUCTION? This will update the live site. (yes/no): "
read -r CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo -e "${RED}Deployment cancelled.${NC}"
  exit 0
fi

echo ""

# -----------------------------------------------------------------------------
# Build
# -----------------------------------------------------------------------------

echo -e "${YELLOW}Step 3:${NC} Building production bundle..."
if command -v bun &> /dev/null; then
  bun run build
else
  npm run build
fi
echo -e "${GREEN}✓${NC} Build complete"
echo ""

# -----------------------------------------------------------------------------
# Deploy to Firebase Hosting
# -----------------------------------------------------------------------------

echo -e "${YELLOW}Step 4:${NC} Deploying to Firebase Hosting..."
if command -v firebase &> /dev/null; then
  firebase deploy --only hosting
  echo -e "${GREEN}✓${NC} Deployed to Firebase Hosting"
else
  echo -e "${RED}✗${NC} Firebase CLI not found (install: npm install -g firebase-tools)"
  exit 1
fi

echo ""

# -----------------------------------------------------------------------------
# Deploy Firestore rules (optional)
# -----------------------------------------------------------------------------

echo -n "Deploy Firestore rules? (yes/no): "
read -r DEPLOY_RULES

if [ "$DEPLOY_RULES" = "yes" ]; then
  echo -e "${YELLOW}Step 5:${NC} Deploying Firestore rules..."
  firebase deploy --only firestore:rules
  echo -e "${GREEN}✓${NC} Firestore rules deployed"
else
  echo -e "${YELLOW}⚠${NC} Skipped Firestore rules deployment"
fi

echo ""

# -----------------------------------------------------------------------------
# Deploy Firebase Functions (optional)
# -----------------------------------------------------------------------------

if [ -d "firebase-functions" ]; then
  echo -n "Deploy Firebase Functions? (yes/no): "
  read -r DEPLOY_FUNCTIONS

  if [ "$DEPLOY_FUNCTIONS" = "yes" ]; then
    echo -e "${YELLOW}Step 6:${NC} Deploying Firebase Functions..."
    firebase deploy --only functions
    echo -e "${GREEN}✓${NC} Firebase Functions deployed"
  else
    echo -e "${YELLOW}⚠${NC} Skipped Firebase Functions deployment"
  fi
fi

echo ""

# -----------------------------------------------------------------------------
# Post-deployment health check
# -----------------------------------------------------------------------------

echo -e "${YELLOW}Step 7:${NC} Running post-deployment health check..."
sleep 5 # Wait for deployment to propagate

HEALTH_URL=$(firebase hosting:channel:list | grep "live" | awk '{print $2}')
if [ -z "$HEALTH_URL" ]; then
  HEALTH_URL="https://gratis-ngo.web.app"
fi

echo "Checking: ${HEALTH_URL}/health"
if command -v curl &> /dev/null; then
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${HEALTH_URL}/health" || echo "000")
  if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓${NC} Health check passed (HTTP $HTTP_CODE)"
  else
    echo -e "${YELLOW}⚠${NC} Health check returned HTTP $HTTP_CODE"
  fi
else
  echo -e "${YELLOW}⚠${NC} curl not found, skipping health check"
fi

echo ""

# -----------------------------------------------------------------------------
# Git tagging
# -----------------------------------------------------------------------------

if command -v git &> /dev/null && [ -d ".git" ]; then
  echo -e "${YELLOW}Step 8:${NC} Creating deployment tag..."

  # Generate tag name
  VERSION=$(date +"%Y%m%d-%H%M%S")
  TAG="deploy-${VERSION}"

  # Create and push tag
  git tag -a "$TAG" -m "Production deployment: $VERSION"
  git push origin "$TAG"

  echo -e "${GREEN}✓${NC} Created tag: $TAG"
else
  echo -e "${YELLOW}⚠${NC} Not a Git repository, skipping tagging"
fi

echo ""

# -----------------------------------------------------------------------------
# Success
# -----------------------------------------------------------------------------

echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Deployment Successful! ✓${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "Status:  ${GREEN}LIVE${NC}"
echo -e "URL:     $HEALTH_URL"
echo -e "Tag:     $TAG"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "  1. Verify the site is working correctly"
echo -e "  2. Monitor error logs for any issues"
echo -e "  3. Notify team of successful deployment"
echo ""
