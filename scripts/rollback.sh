#!/usr/bin/env bash
# ============================================================================
# GRATIS.NGO - Rollback Script
# ============================================================================
# Rollback to previous deployment
# Usage: ./scripts/rollback.sh [tag-name]
# ============================================================================

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${RED}═══════════════════════════════════════════════════════${NC}"
echo -e "${RED}  GRATIS.NGO Rollback Procedure${NC}"
echo -e "${RED}═══════════════════════════════════════════════════════${NC}"
echo ""

# -----------------------------------------------------------------------------
# Check Git
# -----------------------------------------------------------------------------

if ! command -v git &> /dev/null || [ ! -d ".git" ]; then
  echo -e "${RED}✗${NC} Not a Git repository. Cannot rollback."
  exit 1
fi

# -----------------------------------------------------------------------------
# List recent deployment tags
# -----------------------------------------------------------------------------

echo -e "${YELLOW}Recent deployments:${NC}"
echo ""
git tag -l "deploy-*" --sort=-version:refname | head -n 10 | nl
echo ""

# -----------------------------------------------------------------------------
# Get target tag
# -----------------------------------------------------------------------------

if [ -n "${1:-}" ]; then
  TARGET_TAG="$1"
else
  echo -n "Enter deployment tag to rollback to (or number from list): "
  read -r INPUT

  # Check if input is a number
  if [[ "$INPUT" =~ ^[0-9]+$ ]]; then
    TARGET_TAG=$(git tag -l "deploy-*" --sort=-version:refname | head -n 10 | sed -n "${INPUT}p")
  else
    TARGET_TAG="$INPUT"
  fi
fi

# Validate tag exists
if ! git rev-parse "$TARGET_TAG" >/dev/null 2>&1; then
  echo -e "${RED}✗${NC} Tag '$TARGET_TAG' not found"
  exit 1
fi

echo ""
echo -e "${BLUE}Target:${NC} $TARGET_TAG"
echo -e "${BLUE}Commit:${NC} $(git log -1 --format=%h $TARGET_TAG)"
echo -e "${BLUE}Date:${NC}   $(git log -1 --format=%cd $TARGET_TAG)"
echo ""

# -----------------------------------------------------------------------------
# Confirmation
# -----------------------------------------------------------------------------

echo -e "${RED}⚠ WARNING:${NC} This will rollback to a previous version!"
echo -n "Continue with rollback? (yes/no): "
read -r CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo -e "${YELLOW}Rollback cancelled.${NC}"
  exit 0
fi

echo ""

# -----------------------------------------------------------------------------
# Checkout target version
# -----------------------------------------------------------------------------

echo -e "${YELLOW}Step 1:${NC} Checking out $TARGET_TAG..."
git checkout "$TARGET_TAG"
echo -e "${GREEN}✓${NC} Checked out target version"
echo ""

# -----------------------------------------------------------------------------
# Install dependencies
# -----------------------------------------------------------------------------

echo -e "${YELLOW}Step 2:${NC} Installing dependencies..."
if command -v bun &> /dev/null; then
  bun install
else
  npm install
fi
echo -e "${GREEN}✓${NC} Dependencies installed"
echo ""

# -----------------------------------------------------------------------------
# Build
# -----------------------------------------------------------------------------

echo -e "${YELLOW}Step 3:${NC} Building..."
if command -v bun &> /dev/null; then
  bun run build
else
  npm run build
fi
echo -e "${GREEN}✓${NC} Build complete"
echo ""

# -----------------------------------------------------------------------------
# Deploy
# -----------------------------------------------------------------------------

echo -e "${YELLOW}Step 4:${NC} Deploying to Firebase..."
if command -v firebase &> /dev/null; then
  firebase deploy --only hosting
  echo -e "${GREEN}✓${NC} Deployed"
else
  echo -e "${RED}✗${NC} Firebase CLI not found"
  exit 1
fi

echo ""

# -----------------------------------------------------------------------------
# Return to main branch
# -----------------------------------------------------------------------------

echo -e "${YELLOW}Step 5:${NC} Returning to main branch..."
git checkout main
echo -e "${GREEN}✓${NC} Returned to main branch"
echo ""

# -----------------------------------------------------------------------------
# Success
# -----------------------------------------------------------------------------

echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Rollback Complete! ✓${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "Rolled back to: $TARGET_TAG"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "  1. Verify the site is working correctly"
echo -e "  2. Monitor for any issues"
echo -e "  3. Investigate what caused the need for rollback"
echo -e "  4. Create a new deployment tag when ready"
echo ""
