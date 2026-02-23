# Production Runbook - GRATIS.NGO Platform

**Version:** 1.0
**Last Updated:** February 23, 2026
**Maintained By:** Platform Team

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Deployment Procedures](#deployment-procedures)
3. [Rollback Procedures](#rollback-procedures)
4. [Health Monitoring](#health-monitoring)
5. [Incident Response](#incident-response)
6. [Common Issues](#common-issues)
7. [Emergency Contacts](#emergency-contacts)

---

## System Overview

### Architecture
- **Frontend**: React (Vite) hosted on Firebase Hosting
- **Backend**: Firebase (Firestore, Auth, Storage, Functions)
- **Payments**: Stripe
- **Email**: SendGrid (via Firebase Functions)
- **Media**: Firebase Storage
- **Monitoring**: Sentry (optional)

### Key URLs
- **Production**: https://gratis-ngo.web.app
- **Staging**: https://gratis-ngo-staging.web.app
- **Health Check**: https://gratis-ngo.web.app/health
- **Admin Panel**: https://gratis-ngo.web.app/admin

### Service Status Pages
- **Firebase**: https://status.firebase.google.com
- **Stripe**: https://status.stripe.com
- **SendGrid**: https://status.sendgrid.com

---

## Deployment Procedures

### Pre-Deployment Checklist

1. **Code Quality**
   - [ ] All tests passing
   - [ ] TypeScript compiles without errors
   - [ ] ESLint passes
   - [ ] No console.error or console.warn in production code

2. **Configuration**
   - [ ] Environment variables set correctly
   - [ ] Firebase config verified
   - [ ] Stripe keys correct (production keys)
   - [ ] Feature flags reviewed

3. **Database**
   - [ ] Firestore rules tested
   - [ ] Indexes created if needed
   - [ ] Backup taken (if major changes)

4. **Monitoring**
   - [ ] Sentry configured
   - [ ] Error tracking active
   - [ ] Analytics verified

### Standard Deployment (Firebase Hosting)

```bash
# 1. Run pre-deployment checks
./scripts/pre-deploy-check.sh

# 2. Build production bundle
npm run build
# OR
bun run build

# 3. Deploy to Firebase
firebase deploy --only hosting

# 4. Verify deployment
curl https://gratis-ngo.web.app/health
```

### Automated Deployment

```bash
# Full automated deployment with checks
./scripts/deploy-production.sh
```

### Deploying Specific Services

```bash
# Deploy hosting only
firebase deploy --only hosting

# Deploy Firestore rules only
firebase deploy --only firestore:rules

# Deploy Firebase Functions only
firebase deploy --only functions

# Deploy storage rules only
firebase deploy --only storage

# Deploy everything
firebase deploy
```

### Post-Deployment Verification

1. **Health Check**
   ```bash
   curl https://gratis-ngo.web.app/health
   ```
   Expected: HTTP 200 with JSON health report

2. **Critical Paths**
   - [ ] Homepage loads
   - [ ] Login/Register works
   - [ ] Donation flow works
   - [ ] Admin panel accessible
   - [ ] Images load correctly

3. **Monitoring**
   - [ ] Check error logs (Firebase Console)
   - [ ] Verify Sentry dashboard
   - [ ] Monitor Firebase Analytics

---

## Rollback Procedures

### When to Rollback

- Critical bugs in production
- Site completely down
- Data corruption risk
- Security vulnerability discovered

### Quick Rollback (Previous Version)

```bash
# Automated rollback script
./scripts/rollback.sh

# Follow prompts to select deployment tag
```

### Manual Rollback

```bash
# 1. Find previous deployment tag
git tag -l "deploy-*" --sort=-version:refname | head -n 5

# 2. Checkout previous version
git checkout deploy-YYYYMMDD-HHMMSS

# 3. Rebuild
npm run build

# 4. Deploy
firebase deploy --only hosting

# 5. Return to main
git checkout main
```

### Firebase Hosting Rollback (via Console)

1. Go to Firebase Console → Hosting
2. Click "Release history"
3. Find previous successful deployment
4. Click "⋮" → "Rollback"

**Note:** This doesn't rollback code, only hosting files.

### Firestore Rules Rollback

```bash
# View rule deployment history
firebase firestore:rules:list

# Rollback to specific version
firebase firestore:rules:release <rule-id>
```

---

## Health Monitoring

### Health Check Endpoints

| Endpoint | Purpose | Expected Response |
|----------|---------|-------------------|
| `/health` | System health | HTTP 200 + JSON report |
| `/api/health` | Backend health | HTTP 200 + JSON |
| `/readiness` | Kubernetes probe | HTTP 200 |
| `/liveness` | Kubernetes probe | HTTP 200 |

### Key Metrics to Monitor

1. **Performance**
   - Page load time < 3s (target)
   - API response time < 500ms
   - Firestore query time < 200ms

2. **Errors**
   - Error rate < 1%
   - 5xx errors < 0.1%
   - Failed payments < 2%

3. **Resources**
   - Memory usage < 90%
   - CPU usage < 80%
   - Disk space > 20% free

### Monitoring Tools

- **Firebase Console**: https://console.firebase.google.com
  - Performance monitoring
  - Crashlytics
  - Analytics

- **Sentry**: https://sentry.io (if configured)
  - Error tracking
  - Performance monitoring

- **Stripe Dashboard**: https://dashboard.stripe.com
  - Payment monitoring
  - Failed charges

---

## Incident Response

### Severity Levels

| Level | Description | Response Time | Example |
|-------|-------------|---------------|---------|
| **P0 - Critical** | Site down, data loss | < 15 min | Complete outage |
| **P1 - High** | Core feature broken | < 1 hour | Payments failing |
| **P2 - Medium** | Non-critical feature broken | < 4 hours | Email not sending |
| **P3 - Low** | Minor issue | < 24 hours | UI bug |

### Incident Response Process

1. **Detect**
   - Monitoring alert
   - User report
   - Manual discovery

2. **Assess**
   - Check health dashboard
   - Review error logs
   - Determine severity

3. **Respond**
   - Notify team (Slack/Email)
   - Create incident ticket
   - Begin investigation

4. **Resolve**
   - Apply fix (hotfix or rollback)
   - Deploy to production
   - Verify resolution

5. **Post-Mortem**
   - Document root cause
   - Identify preventive measures
   - Update runbook

### Emergency Actions

```bash
# 1. Quick health check
curl https://gratis-ngo.web.app/health | jq

# 2. View recent Firebase logs
firebase functions:log --only <function-name>

# 3. Disable problematic feature (if possible)
# Update feature flags in Firebase Remote Config

# 4. Rollback if needed
./scripts/rollback.sh

# 5. Scale functions (if overloaded)
# Update function config in firebase.json
```

---

## Common Issues

### Issue: Site Not Loading

**Symptoms:** HTTP 404/500 errors

**Diagnosis:**
```bash
# Check hosting status
firebase hosting:channel:list

# Check deployment status
firebase deploy:list

# Test health endpoint
curl -I https://gratis-ngo.web.app
```

**Resolution:**
1. Verify Firebase Hosting is active
2. Check if deployment completed
3. Verify DNS settings
4. Rollback if recent deployment

---

### Issue: Authentication Failing

**Symptoms:** Users can't login

**Diagnosis:**
```bash
# Check Firebase Auth status
# Go to Firebase Console → Authentication

# Check browser console for errors
```

**Resolution:**
1. Verify Firebase Auth is enabled
2. Check API keys in environment variables
3. Verify authorized domains in Firebase Console
4. Check Firestore security rules

---

### Issue: Payments Failing

**Symptoms:** Donation/payment errors

**Diagnosis:**
```bash
# Check Stripe dashboard
# Check Firebase Functions logs

firebase functions:log --only stripeWebhook
```

**Resolution:**
1. Verify Stripe keys (test vs production)
2. Check webhook configuration
3. Verify Stripe account status
4. Review payment intent errors in Stripe

---

### Issue: High Error Rate

**Symptoms:** Many errors in logs

**Diagnosis:**
```bash
# Check Sentry dashboard
# Check Firebase error tracking

firebase functions:log --only "*" | grep ERROR
```

**Resolution:**
1. Identify error pattern
2. Check recent deployments
3. Rollback if caused by new deployment
4. Apply hotfix if known issue

---

### Issue: Database Performance

**Symptoms:** Slow queries, timeouts

**Diagnosis:**
```bash
# Check Firestore metrics in Firebase Console
# Review slow queries
```

**Resolution:**
1. Create missing indexes
2. Optimize queries (add limits, use cursors)
3. Review security rules performance
4. Consider denormalization

---

## Emergency Contacts

### Platform Team

| Role | Name | Email | Phone |
|------|------|-------|-------|
| **Tech Lead** | [Name] | tech-lead@gratis.ngo | +31 6 XXXX XXXX |
| **DevOps** | [Name] | devops@gratis.ngo | +31 6 XXXX XXXX |
| **On-Call** | [Rotating] | oncall@gratis.ngo | +31 6 XXXX XXXX |

### External Services

| Service | Support | Emergency Contact |
|---------|---------|-------------------|
| **Firebase** | https://firebase.google.com/support | - |
| **Stripe** | https://support.stripe.com | - |
| **SendGrid** | https://support.sendgrid.com | - |

### Escalation Path

1. On-Call Engineer
2. Tech Lead
3. CTO
4. CEO (for critical incidents only)

---

## Maintenance Windows

### Scheduled Maintenance
- **Time**: Sundays 02:00-04:00 CET
- **Notification**: 48 hours advance notice
- **Communication**: Email + banner on site

### Emergency Maintenance
- **Approval**: Tech Lead or higher
- **Notification**: Immediate via email/SMS
- **Max Duration**: 2 hours

---

## Backup & Recovery

### Automated Backups

- **Firestore**: Daily backup at 03:00 CET
  - Retention: 30 days
  - Location: `gs://gratis-ngo-backups/firestore/`

- **Storage**: Continuous versioning enabled
  - Retention: 90 days for deleted files

### Manual Backup

```bash
# Firestore export
gcloud firestore export gs://gratis-ngo-backups/manual/$(date +%Y%m%d)

# Download specific collection
firebase firestore:export backup/$(date +%Y%m%d)
```

### Recovery Procedure

```bash
# Restore Firestore from backup
gcloud firestore import gs://gratis-ngo-backups/firestore/YYYYMMDD/

# Restore specific collection
firebase firestore:import backup/YYYYMMDD --collection users
```

---

## Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-02-23 | 1.0 | Initial runbook creation | Platform Team |

---

## Document Maintenance

- **Review Frequency**: Monthly
- **Owner**: Tech Lead
- **Last Review**: 2026-02-23
- **Next Review**: 2026-03-23

---

**For urgent issues outside business hours, contact the on-call engineer.**
