#!/usr/bin/env bash
# ============================================================================
# GRATIS.NGO - Pre-Deploy Validation Script
# ============================================================================
# Validates readiness before production deployment
# Usage: ./scripts/pre-deploy-check.sh
# ============================================================================

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;36m'
NC='\033[0m' # No Color

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  GRATIS.NGO Pre-Deployment Validation${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# -----------------------------------------------------------------------------
# Helper Functions
# -----------------------------------------------------------------------------

check() {
  TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
  echo -e "${BLUE}[$(($TOTAL_CHECKS))/${BLUE}] $1${NC}"
}

pass() {
  PASSED_CHECKS=$((PASSED_CHECKS + 1))
  echo -e "  ${GREEN}✓${NC} $1"
}

fail() {
  FAILED_CHECKS=$((FAILED_CHECKS + 1))
  echo -e "  ${RED}✗${NC} $1"
}

warn() {
  echo -e "  ${YELLOW}⚠${NC} $1"
}

# -----------------------------------------------------------------------------
# Checks
# -----------------------------------------------------------------------------

# 1. Check Node.js version
check "Checking Node.js version..."
if command -v node &> /dev/null; then
  NODE_VERSION=$(node --version | cut -d'v' -f2)
  MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)
  if [ "$MAJOR_VERSION" -ge 18 ]; then
    pass "Node.js $NODE_VERSION (>= 18.x required)"
  else
    fail "Node.js $NODE_VERSION (>= 18.x required)"
  fi
else
  fail "Node.js not found"
fi

# 2. Check npm/bun
check "Checking package manager..."
if command -v bun &> /dev/null; then
  BUN_VERSION=$(bun --version)
  pass "Bun $BUN_VERSION installed"
elif command -v npm &> /dev/null; then
  NPM_VERSION=$(npm --version)
  pass "npm $NPM_VERSION installed"
else
  fail "No package manager found (npm or bun required)"
fi

# 3. Check environment variables
check "Checking environment variables..."
REQUIRED_VARS=(
  "VITE_FIREBASE_API_KEY"
  "VITE_FIREBASE_AUTH_DOMAIN"
  "VITE_FIREBASE_PROJECT_ID"
  "VITE_FIREBASE_STORAGE_BUCKET"
  "VITE_FIREBASE_MESSAGING_SENDER_ID"
  "VITE_FIREBASE_APP_ID"
)

MISSING_VARS=()
for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var:-}" ]; then
    MISSING_VARS+=("$var")
  fi
done

if [ ${#MISSING_VARS[@]} -eq 0 ]; then
  pass "All ${#REQUIRED_VARS[@]} required environment variables present"
else
  fail "Missing ${#MISSING_VARS[@]} environment variables: ${MISSING_VARS[*]}"
fi

# 4. Check dependencies
check "Checking dependencies..."
if [ -f "package.json" ]; then
  if [ -d "node_modules" ]; then
    pass "Dependencies installed"
  else
    fail "Dependencies not installed (run: npm install or bun install)"
  fi
else
  fail "package.json not found"
fi

# 5. TypeScript check
check "Running TypeScript type check..."
if command -v tsc &> /dev/null; then
  if tsc --noEmit --skipLibCheck > /dev/null 2>&1; then
    pass "TypeScript: No type errors"
  else
    warn "TypeScript: Type errors found (run: npm run type-check)"
  fi
else
  warn "TypeScript not found, skipping type check"
fi

# 6. Build test
check "Testing build process..."
if npm run build > /dev/null 2>&1 || bun run build > /dev/null 2>&1; then
  pass "Build successful"
else
  fail "Build failed (run: npm run build or bun run build)"
fi

# 7. Check for dist output
check "Checking build output..."
if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
  DIST_SIZE=$(du -sh dist | cut -f1)
  pass "Build output exists ($DIST_SIZE)"
else
  fail "Build output not found or empty"
fi

# 8. Firebase config validation
check "Validating Firebase configuration..."
if [ -f "firebase.json" ]; then
  pass "firebase.json found"
else
  fail "firebase.json not found"
fi

if [ -f "firestore.rules" ]; then
  pass "firestore.rules found"
else
  warn "firestore.rules not found"
fi

# 9. Security checks
check "Running security checks..."
if [ -f ".env" ]; then
  if grep -q "SECRET\|PASSWORD\|KEY" .env 2>/dev/null; then
    warn ".env file contains secrets (ensure .env is in .gitignore)"
  fi
fi

if [ -f ".gitignore" ]; then
  if grep -q ".env" .gitignore; then
    pass ".env is in .gitignore"
  else
    fail ".env is NOT in .gitignore (security risk!)"
  fi
else
  warn ".gitignore not found"
fi

# 10. Git status
check "Checking Git status..."
if command -v git &> /dev/null && [ -d ".git" ]; then
  if [ -z "$(git status --porcelain)" ]; then
    pass "Working directory clean"
  else
    warn "Uncommitted changes detected"
  fi

  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  pass "Current branch: $CURRENT_BRANCH"
else
  warn "Not a Git repository"
fi

# -----------------------------------------------------------------------------
# Summary
# -----------------------------------------------------------------------------

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Validation Summary${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "Total checks:   $TOTAL_CHECKS"
echo -e "${GREEN}Passed:${NC}         $PASSED_CHECKS"
echo -e "${RED}Failed:${NC}         $FAILED_CHECKS"
echo ""

if [ $FAILED_CHECKS -eq 0 ]; then
  echo -e "${GREEN}✓ All checks passed! Ready for deployment.${NC}"
  echo ""
  exit 0
else
  echo -e "${RED}✗ $FAILED_CHECKS check(s) failed. Fix issues before deploying.${NC}"
  echo ""
  exit 1
fi
