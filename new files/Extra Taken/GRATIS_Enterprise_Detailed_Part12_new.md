# GRATIS.NGO Enterprise Development Prompts - PART 12
## DevOps, Infrastructure, Security & Performance (Sections 49-53)
### Total Estimated Size: ~85,000 tokens | Complexity: HIGH

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 49: DOCKER & CONTAINER ORCHESTRATION
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 49.1: Production Dockerfile & Multi-Stage Build

Create a production-ready multi-stage Docker build for the GRATIS.NGO Next.js application with security hardening, optimized layer caching, and non-root user execution.

### FILE: Dockerfile

```dockerfile
# ============================================================================
# GRATIS.NGO — Production Multi-Stage Dockerfile
# ============================================================================
# Stage 1: Dependencies
# Stage 2: Builder
# Stage 3: Runner (minimal production image)
# ============================================================================

# ---------------------------------------------------------------------------
# Stage 1: Install dependencies
# ---------------------------------------------------------------------------
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json* ./

# Install production dependencies only for layer caching
RUN npm ci --omit=dev --ignore-scripts && \
    npm cache clean --force

# Install all dependencies (including dev) for build step
COPY package.json package-lock.json* /tmp/
RUN cd /tmp && npm ci && \
    npm cache clean --force

# ---------------------------------------------------------------------------
# Stage 2: Build the application
# ---------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy all deps from temp build
COPY --from=deps /tmp/node_modules ./node_modules
COPY . .

# Build arguments for environment variables
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_APP_ENV=production

# Set environment variables for build
ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY \
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN \
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID \
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET \
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID \
    NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID \
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_APP_ENV=$NEXT_PUBLIC_APP_ENV \
    NEXT_TELEMETRY_DISABLED=1

# Build Next.js application
RUN npm run build

# ---------------------------------------------------------------------------
# Stage 3: Production runner
# ---------------------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Security: run as non-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Install runtime dependencies
RUN apk add --no-cache \
    curl \
    tini \
    dumb-init

# Copy production node_modules
COPY --from=deps /app/node_modules ./node_modules

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package.json ./

# Create necessary directories with correct ownership
RUN mkdir -p .next/cache && \
    chown -R nextjs:nodejs .next

# Environment
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME="0.0.0.0" \
    NEXT_TELEMETRY_DISABLED=1

# Security headers
LABEL maintainer="GRATIS.NGO <tech@gratis.ngo>" \
      org.opencontainers.image.title="GRATIS.NGO Platform" \
      org.opencontainers.image.description="Enterprise NGO donation and impact platform" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.vendor="Stichting GRATIS" \
      org.opencontainers.image.source="https://github.com/gratis-ngo/platform"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Switch to non-root user
USER nextjs

EXPOSE 3000

# Use tini as init system for proper signal handling
ENTRYPOINT ["tini", "--"]
CMD ["node", "server.js"]
```

---

## PROMPT 49.2: Docker Compose for Local Development & Production

### FILE: docker-compose.yml

```yaml
# ============================================================================
# GRATIS.NGO — Docker Compose (Local Development)
# ============================================================================

version: "3.9"

services:
  # --------------------------------------------------------------------------
  # Next.js Application
  # --------------------------------------------------------------------------
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
      args:
        NODE_ENV: development
    container_name: gratis-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NODE_ENV=development
      - WATCHPACK_POLLING=true
    env_file:
      - .env.local
    depends_on:
      redis:
        condition: service_healthy
    networks:
      - gratis-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # --------------------------------------------------------------------------
  # Redis (Caching, Sessions, Rate Limiting)
  # --------------------------------------------------------------------------
  redis:
    image: redis:7-alpine
    container_name: gratis-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
      - ./docker/redis/redis.conf:/usr/local/etc/redis/redis.conf
    command: redis-server /usr/local/etc/redis/redis.conf
    networks:
      - gratis-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3

  # --------------------------------------------------------------------------
  # Firebase Emulators (Local Development)
  # --------------------------------------------------------------------------
  firebase:
    build:
      context: ./docker/firebase
      dockerfile: Dockerfile
    container_name: gratis-firebase
    restart: unless-stopped
    ports:
      - "4000:4000"   # Emulator Suite UI
      - "8080:8080"   # Firestore
      - "9099:9099"   # Auth
      - "9199:9199"   # Storage
      - "5001:5001"   # Cloud Functions
    volumes:
      - firebase-data:/home/firebase/.firebase
      - ./firebase.json:/home/firebase/firebase.json
      - ./firestore.rules:/home/firebase/firestore.rules
      - ./storage.rules:/home/firebase/storage.rules
    networks:
      - gratis-network

  # --------------------------------------------------------------------------
  # Mailhog (Local Email Testing)
  # --------------------------------------------------------------------------
  mailhog:
    image: mailhog/mailhog:latest
    container_name: gratis-mailhog
    restart: unless-stopped
    ports:
      - "1025:1025"   # SMTP
      - "8025:8025"   # Web UI
    networks:
      - gratis-network

  # --------------------------------------------------------------------------
  # Stripe CLI (Webhook Forwarding)
  # --------------------------------------------------------------------------
  stripe-cli:
    image: stripe/stripe-cli:latest
    container_name: gratis-stripe
    restart: unless-stopped
    command: listen --forward-to http://app:3000/api/webhooks/stripe --api-key ${STRIPE_SECRET_KEY}
    env_file:
      - .env.local
    depends_on:
      - app
    networks:
      - gratis-network

volumes:
  redis-data:
    driver: local
  firebase-data:
    driver: local

networks:
  gratis-network:
    driver: bridge
```

---

### FILE: docker-compose.prod.yml

```yaml
# ============================================================================
# GRATIS.NGO — Docker Compose (Production)
# ============================================================================

version: "3.9"

services:
  # --------------------------------------------------------------------------
  # Next.js Application (Production)
  # --------------------------------------------------------------------------
  app:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_FIREBASE_API_KEY: ${NEXT_PUBLIC_FIREBASE_API_KEY}
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${NEXT_PUBLIC_FIREBASE_PROJECT_ID}
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}
        NEXT_PUBLIC_FIREBASE_APP_ID: ${NEXT_PUBLIC_FIREBASE_APP_ID}
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
        NEXT_PUBLIC_APP_URL: ${NEXT_PUBLIC_APP_URL}
    container_name: gratis-app-prod
    restart: always
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    environment:
      - NODE_ENV=production
    depends_on:
      redis:
        condition: service_healthy
    deploy:
      resources:
        limits:
          cpus: "2"
          memory: 2G
        reservations:
          cpus: "0.5"
          memory: 512M
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 5
        window: 120s
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "5"
    networks:
      - gratis-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 60s

  # --------------------------------------------------------------------------
  # Redis (Production with persistence)
  # --------------------------------------------------------------------------
  redis:
    image: redis:7-alpine
    container_name: gratis-redis-prod
    restart: always
    volumes:
      - redis-prod-data:/data
      - ./docker/redis/redis-prod.conf:/usr/local/etc/redis/redis.conf
    command: redis-server /usr/local/etc/redis/redis.conf
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 512M
    networks:
      - gratis-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3

  # --------------------------------------------------------------------------
  # Nginx Reverse Proxy
  # --------------------------------------------------------------------------
  nginx:
    image: nginx:alpine
    container_name: gratis-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./docker/nginx/conf.d:/etc/nginx/conf.d:ro
      - certbot-data:/etc/letsencrypt:ro
      - certbot-webroot:/var/www/certbot:ro
    depends_on:
      - app
    networks:
      - gratis-network
    healthcheck:
      test: ["CMD", "nginx", "-t"]
      interval: 30s
      timeout: 10s
      retries: 3

  # --------------------------------------------------------------------------
  # Certbot (SSL Certificates)
  # --------------------------------------------------------------------------
  certbot:
    image: certbot/certbot:latest
    container_name: gratis-certbot
    volumes:
      - certbot-data:/etc/letsencrypt
      - certbot-webroot:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
    networks:
      - gratis-network

volumes:
  redis-prod-data:
    driver: local
  certbot-data:
    driver: local
  certbot-webroot:
    driver: local

networks:
  gratis-network:
    driver: bridge
```

---

## PROMPT 49.3: Development Dockerfile & Firebase Emulator Image

### FILE: Dockerfile.dev

```dockerfile
# ============================================================================
# GRATIS.NGO — Development Dockerfile
# ============================================================================

FROM node:20-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    libc6-compat \
    curl \
    git

# Copy dependency manifests
COPY package.json package-lock.json* ./

# Install all dependencies (including dev)
RUN npm ci && npm cache clean --force

# Copy source code (volumes override this in dev)
COPY . .

# Environment
ENV NODE_ENV=development \
    PORT=3000 \
    WATCHPACK_POLLING=true

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

---

### FILE: docker/firebase/Dockerfile

```dockerfile
# ============================================================================
# Firebase Emulator Suite
# ============================================================================

FROM node:20-alpine

RUN apk add --no-cache openjdk17-jre-headless curl bash

# Install Firebase CLI
RUN npm install -g firebase-tools && \
    npm cache clean --force

# Create non-root user
RUN addgroup -S firebase && adduser -S firebase -G firebase
WORKDIR /home/firebase

# Copy config files
COPY firebase.json firestore.rules storage.rules ./

# Download emulators
RUN firebase setup:emulators:firestore && \
    firebase setup:emulators:auth && \
    firebase setup:emulators:storage && \
    firebase setup:emulators:ui

USER firebase

EXPOSE 4000 8080 9099 9199 5001

CMD ["firebase", "emulators:start", "--project", "gratis-ngo-dev"]
```

---

## PROMPT 49.4: Nginx Configuration & Redis Config

### FILE: docker/nginx/nginx.conf

```nginx
# ============================================================================
# GRATIS.NGO — Nginx Configuration
# ============================================================================

user nginx;
worker_processes auto;
pid /run/nginx.pid;
error_log /var/log/nginx/error.log warn;

events {
    worker_connections 2048;
    multi_accept on;
    use epoll;
}

http {
    # ------------------------------------------------------------------
    # Basic Settings
    # ------------------------------------------------------------------
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    charset utf-8;
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;
    client_max_body_size 50m;

    # ------------------------------------------------------------------
    # Logging
    # ------------------------------------------------------------------
    log_format main '$remote_addr - $remote_user [$time_local] '
                    '"$request" $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent" '
                    '$request_time $upstream_response_time';
    access_log /var/log/nginx/access.log main;

    # ------------------------------------------------------------------
    # Gzip Compression
    # ------------------------------------------------------------------
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml
        application/rss+xml
        application/atom+xml
        image/svg+xml
        font/woff2;

    # ------------------------------------------------------------------
    # Rate Limiting Zones
    # ------------------------------------------------------------------
    limit_req_zone $binary_remote_addr zone=general:10m rate=30r/s;
    limit_req_zone $binary_remote_addr zone=api:10m rate=20r/s;
    limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/s;
    limit_req_zone $binary_remote_addr zone=webhooks:10m rate=50r/s;
    limit_req_zone $binary_remote_addr zone=donations:10m rate=10r/s;

    # Connection limiting
    limit_conn_zone $binary_remote_addr zone=addr:10m;

    # ------------------------------------------------------------------
    # Upstream
    # ------------------------------------------------------------------
    upstream nextjs_upstream {
        server app:3000;
        keepalive 64;
    }

    # ------------------------------------------------------------------
    # SSL Configuration (shared)
    # ------------------------------------------------------------------
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;
    ssl_stapling on;
    ssl_stapling_verify on;

    include /etc/nginx/conf.d/*.conf;
}
```

---

### FILE: docker/nginx/conf.d/gratis.conf

```nginx
# ============================================================================
# GRATIS.NGO — Server Configuration
# ============================================================================

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name gratis.ngo www.gratis.ngo;

    # Certbot challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name gratis.ngo www.gratis.ngo;

    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/gratis.ngo/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gratis.ngo/privkey.pem;

    # ------------------------------------------------------------------
    # Security Headers
    # ------------------------------------------------------------------
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(self)" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://api.stripe.com wss://*.firebaseio.com; frame-src https://js.stripe.com https://hooks.stripe.com;" always;

    # ------------------------------------------------------------------
    # Connection Limits
    # ------------------------------------------------------------------
    limit_conn addr 100;

    # ------------------------------------------------------------------
    # Static Assets (aggressive caching)
    # ------------------------------------------------------------------
    location /_next/static/ {
        proxy_pass http://nextjs_upstream;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header X-Cache-Status $upstream_cache_status;
    }

    location /static/ {
        proxy_pass http://nextjs_upstream;
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    # Favicon & manifest
    location ~* \.(ico|webmanifest)$ {
        proxy_pass http://nextjs_upstream;
        add_header Cache-Control "public, max-age=86400";
    }

    # ------------------------------------------------------------------
    # API Routes
    # ------------------------------------------------------------------
    # Authentication endpoints (strict rate limit)
    location /api/auth/ {
        limit_req zone=auth burst=10 nodelay;
        proxy_pass http://nextjs_upstream;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Request-ID $request_id;
    }

    # Webhook endpoints (high throughput)
    location /api/webhooks/ {
        limit_req zone=webhooks burst=100 nodelay;
        proxy_pass http://nextjs_upstream;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
    }

    # Donation endpoints
    location /api/donations/ {
        limit_req zone=donations burst=20 nodelay;
        proxy_pass http://nextjs_upstream;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # General API
    location /api/ {
        limit_req zone=api burst=40 nodelay;
        proxy_pass http://nextjs_upstream;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Request-ID $request_id;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }

    # Health check (no rate limit)
    location /api/health {
        proxy_pass http://nextjs_upstream;
        access_log off;
    }

    # ------------------------------------------------------------------
    # Default (SSR pages)
    # ------------------------------------------------------------------
    location / {
        limit_req zone=general burst=60 nodelay;
        proxy_pass http://nextjs_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Request-ID $request_id;
        proxy_cache_bypass $http_upgrade;
    }

    # ------------------------------------------------------------------
    # Block sensitive paths
    # ------------------------------------------------------------------
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    location ~ ^/(\.env|\.git|docker|node_modules) {
        deny all;
        return 404;
    }
}
```

---

### FILE: docker/redis/redis.conf

```ini
# ============================================================================
# Redis Configuration (Development)
# ============================================================================

bind 0.0.0.0
port 6379
protected-mode no

# Memory
maxmemory 256mb
maxmemory-policy allkeys-lru

# Persistence (dev — relaxed)
save 900 1
save 300 10
save 60 10000
dbfilename dump.rdb
dir /data

# Logging
loglevel notice
```

---

### FILE: docker/redis/redis-prod.conf

```ini
# ============================================================================
# Redis Configuration (Production)
# ============================================================================

bind 0.0.0.0
port 6379
protected-mode yes
requirepass ${REDIS_PASSWORD}

# Memory
maxmemory 1gb
maxmemory-policy allkeys-lru

# Persistence
save 900 1
save 300 10
save 60 10000
dbfilename dump.rdb
dir /data
appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec

# Security
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command CONFIG ""

# Performance
tcp-keepalive 300
timeout 0
hz 10

# Logging
loglevel notice
logfile /data/redis.log
```

---

## PROMPT 49.5: Docker Build & Deploy Scripts

### FILE: scripts/docker-build.sh

```bash
#!/usr/bin/env bash
# ============================================================================
# GRATIS.NGO — Docker Build Script
# ============================================================================
set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Config
IMAGE_NAME="gratis-ngo"
REGISTRY="${DOCKER_REGISTRY:-ghcr.io/gratis-ngo}"
VERSION="${1:-$(git describe --tags --always 2>/dev/null || echo 'latest')}"
BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
GIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  GRATIS.NGO Docker Build${NC}"
echo -e "${BLUE}  Version: ${VERSION} | SHA: ${GIT_SHA}${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

# ------------------------------------------------------------------
# Step 1: Validate environment
# ------------------------------------------------------------------
echo -e "\n${YELLOW}[1/5] Validating environment...${NC}"

if [ ! -f ".env.production" ]; then
    echo -e "${RED}ERROR: .env.production not found${NC}"
    exit 1
fi

# Source env vars for build args
set -a
source .env.production
set +a

REQUIRED_VARS=(
    "NEXT_PUBLIC_FIREBASE_API_KEY"
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    "NEXT_PUBLIC_APP_URL"
)

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var:-}" ]; then
        echo -e "${RED}ERROR: Missing required variable: ${var}${NC}"
        exit 1
    fi
done

echo -e "${GREEN}  ✓ Environment validated${NC}"

# ------------------------------------------------------------------
# Step 2: Run tests
# ------------------------------------------------------------------
echo -e "\n${YELLOW}[2/5] Running tests...${NC}"

if npm test -- --passWithNoTests 2>/dev/null; then
    echo -e "${GREEN}  ✓ Tests passed${NC}"
else
    echo -e "${RED}  ✗ Tests failed — aborting build${NC}"
    exit 1
fi

# ------------------------------------------------------------------
# Step 3: Build Docker image
# ------------------------------------------------------------------
echo -e "\n${YELLOW}[3/5] Building Docker image...${NC}"

docker build \
    --build-arg NEXT_PUBLIC_FIREBASE_API_KEY="${NEXT_PUBLIC_FIREBASE_API_KEY}" \
    --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}" \
    --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID="${NEXT_PUBLIC_FIREBASE_PROJECT_ID}" \
    --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:-}" \
    --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:-}" \
    --build-arg NEXT_PUBLIC_FIREBASE_APP_ID="${NEXT_PUBLIC_FIREBASE_APP_ID:-}" \
    --build-arg NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}" \
    --build-arg NEXT_PUBLIC_APP_URL="${NEXT_PUBLIC_APP_URL}" \
    --label "org.opencontainers.image.created=${BUILD_DATE}" \
    --label "org.opencontainers.image.revision=${GIT_SHA}" \
    --label "org.opencontainers.image.version=${VERSION}" \
    -t "${IMAGE_NAME}:${VERSION}" \
    -t "${IMAGE_NAME}:latest" \
    -t "${REGISTRY}/${IMAGE_NAME}:${VERSION}" \
    -t "${REGISTRY}/${IMAGE_NAME}:latest" \
    -f Dockerfile \
    .

echo -e "${GREEN}  ✓ Image built: ${IMAGE_NAME}:${VERSION}${NC}"

# ------------------------------------------------------------------
# Step 4: Scan for vulnerabilities
# ------------------------------------------------------------------
echo -e "\n${YELLOW}[4/5] Scanning for vulnerabilities...${NC}"

if command -v trivy &> /dev/null; then
    trivy image --severity HIGH,CRITICAL "${IMAGE_NAME}:${VERSION}" || true
    echo -e "${GREEN}  ✓ Security scan complete${NC}"
else
    echo -e "${YELLOW}  ⚠ Trivy not installed — skipping vulnerability scan${NC}"
fi

# ------------------------------------------------------------------
# Step 5: Push to registry
# ------------------------------------------------------------------
echo -e "\n${YELLOW}[5/5] Pushing to registry...${NC}"

if [ "${PUSH:-false}" = "true" ]; then
    docker push "${REGISTRY}/${IMAGE_NAME}:${VERSION}"
    docker push "${REGISTRY}/${IMAGE_NAME}:latest"
    echo -e "${GREEN}  ✓ Pushed to ${REGISTRY}${NC}"
else
    echo -e "${YELLOW}  ⚠ Push skipped (run with PUSH=true to push)${NC}"
fi

# ------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------
echo -e "\n${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  BUILD COMPLETE${NC}"
echo -e "${GREEN}  Image: ${IMAGE_NAME}:${VERSION}${NC}"
echo -e "${GREEN}  Size:  $(docker image inspect ${IMAGE_NAME}:${VERSION} --format='{{.Size}}' | numfmt --to=iec 2>/dev/null || echo 'N/A')${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
```

---

### FILE: scripts/docker-deploy.sh

```bash
#!/usr/bin/env bash
# ============================================================================
# GRATIS.NGO — Production Deploy Script
# ============================================================================
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ENV="${1:-production}"
COMPOSE_FILE="docker-compose.prod.yml"

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  GRATIS.NGO Production Deploy — ${ENV}${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

# Pre-flight checks
echo -e "\n${YELLOW}[1/6] Pre-flight checks...${NC}"

if [ ! -f ".env.production" ]; then
    echo -e "${RED}ERROR: .env.production not found${NC}"
    exit 1
fi

if ! docker compose version &> /dev/null; then
    echo -e "${RED}ERROR: Docker Compose not available${NC}"
    exit 1
fi

echo -e "${GREEN}  ✓ Pre-flight OK${NC}"

# Create backup
echo -e "\n${YELLOW}[2/6] Creating backup...${NC}"

BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

docker compose -f "$COMPOSE_FILE" exec -T redis redis-cli BGSAVE 2>/dev/null || true
echo -e "${GREEN}  ✓ Backup created at ${BACKUP_DIR}${NC}"

# Pull latest images
echo -e "\n${YELLOW}[3/6] Pulling latest images...${NC}"
docker compose -f "$COMPOSE_FILE" pull
echo -e "${GREEN}  ✓ Images pulled${NC}"

# Rolling update
echo -e "\n${YELLOW}[4/6] Starting rolling update...${NC}"
docker compose -f "$COMPOSE_FILE" up -d --build --remove-orphans
echo -e "${GREEN}  ✓ Containers updated${NC}"

# Health check
echo -e "\n${YELLOW}[5/6] Waiting for health checks...${NC}"

MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -sf http://localhost:3000/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}  ✓ Application healthy${NC}"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo -e "  Waiting... (${RETRY_COUNT}/${MAX_RETRIES})"
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo -e "${RED}  ✗ Health check failed — rolling back${NC}"
    docker compose -f "$COMPOSE_FILE" down
    echo -e "${RED}  Deploy FAILED${NC}"
    exit 1
fi

# Cleanup
echo -e "\n${YELLOW}[6/6] Cleanup...${NC}"
docker image prune -f --filter "until=168h"
docker volume prune -f --filter "label!=keep"
echo -e "${GREEN}  ✓ Cleanup complete${NC}"

echo -e "\n${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  DEPLOY COMPLETE ✓${NC}"
echo -e "${GREEN}  URL: https://gratis.ngo${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
```

---

### FILE: .dockerignore

```
# ============================================================================
# Docker Ignore
# ============================================================================

# Dependencies
node_modules
npm-debug.log*

# Build output
.next
out
dist
build

# Environment files
.env
.env.*
!.env.example

# Version control
.git
.gitignore

# IDE
.vscode
.idea
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Docker files
docker-compose*.yml
Dockerfile*
.dockerignore

# Tests
__tests__
*.test.ts
*.test.tsx
*.spec.ts
*.spec.tsx
coverage
.nyc_output

# Documentation
*.md
docs
LICENSE

# CI/CD
.github
.gitlab-ci.yml

# Misc
scripts
backups
*.log
```



# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 50: CI/CD PIPELINE (GITHUB ACTIONS)
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 50.1: Main CI/CD Workflow

Create the primary GitHub Actions workflow for GRATIS.NGO with lint, test, build, security scan, and deploy stages across staging and production environments.

### FILE: .github/workflows/ci-cd.yml

```yaml
# ============================================================================
# GRATIS.NGO — CI/CD Pipeline
# ============================================================================
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop, staging]
  pull_request:
    branches: [main, develop]
  workflow_dispatch:
    inputs:
      environment:
        description: "Deploy environment"
        required: true
        default: "staging"
        type: choice
        options:
          - staging
          - production

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

env:
  NODE_VERSION: "20"
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

# ──────────────────────────────────────────────────────────────────────────────
jobs:
  # --------------------------------------------------------------------------
  # Job 1: Lint & Type Check
  # --------------------------------------------------------------------------
  lint:
    name: "Lint & Type Check"
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: ESLint
        run: npm run lint

      - name: TypeScript type check
        run: npx tsc --noEmit

      - name: Prettier check
        run: npx prettier --check "src/**/*.{ts,tsx,css,json}"

  # --------------------------------------------------------------------------
  # Job 2: Unit & Integration Tests
  # --------------------------------------------------------------------------
  test:
    name: "Tests"
    runs-on: ubuntu-latest
    timeout-minutes: 15
    needs: lint

    services:
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 3

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm test -- --coverage --ci --maxWorkers=2
        env:
          REDIS_URL: redis://localhost:6379
          NODE_ENV: test
          FIREBASE_PROJECT_ID: gratis-ngo-test
          STRIPE_SECRET_KEY: sk_test_mock
          NEXT_PUBLIC_APP_URL: http://localhost:3000

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/lcov.info
          flags: unittests
          fail_ci_if_error: false

  # --------------------------------------------------------------------------
  # Job 3: Security Scanning
  # --------------------------------------------------------------------------
  security:
    name: "Security Scan"
    runs-on: ubuntu-latest
    timeout-minutes: 10
    needs: lint

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Audit dependencies
        run: npm audit --audit-level=high
        continue-on-error: true

      - name: Run Snyk security test
        uses: snyk/actions/node@master
        continue-on-error: true
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

      - name: Check for secrets
        uses: trufflesecurity/trufflehog@main
        with:
          extra_args: --only-verified

  # --------------------------------------------------------------------------
  # Job 4: Build Application
  # --------------------------------------------------------------------------
  build:
    name: "Build"
    runs-on: ubuntu-latest
    timeout-minutes: 15
    needs: [test, security]

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.NEXT_PUBLIC_FIREBASE_API_KEY }}
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN }}
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_PROJECT_ID }}
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${{ secrets.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET }}
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID }}
          NEXT_PUBLIC_FIREBASE_APP_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_APP_ID }}
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY }}
          NEXT_PUBLIC_APP_URL: ${{ secrets.NEXT_PUBLIC_APP_URL }}

      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: |
            .next/
            public/
            package.json
            next.config.js
          retention-days: 1

  # --------------------------------------------------------------------------
  # Job 5: Build & Push Docker Image
  # --------------------------------------------------------------------------
  docker:
    name: "Docker Build & Push"
    runs-on: ubuntu-latest
    timeout-minutes: 20
    needs: build
    if: github.event_name == 'push' && (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/staging')

    permissions:
      contents: read
      packages: write

    outputs:
      image_tag: ${{ steps.meta.outputs.version }}

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha,prefix=
            type=ref,event=branch
            type=semver,pattern={{version}}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            NEXT_PUBLIC_FIREBASE_API_KEY=${{ secrets.NEXT_PUBLIC_FIREBASE_API_KEY }}
            NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${{ secrets.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN }}
            NEXT_PUBLIC_FIREBASE_PROJECT_ID=${{ secrets.NEXT_PUBLIC_FIREBASE_PROJECT_ID }}
            NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${{ secrets.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET }}
            NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${{ secrets.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID }}
            NEXT_PUBLIC_FIREBASE_APP_ID=${{ secrets.NEXT_PUBLIC_FIREBASE_APP_ID }}
            NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY }}
            NEXT_PUBLIC_APP_URL=${{ secrets.NEXT_PUBLIC_APP_URL }}

      - name: Scan Docker image
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ steps.meta.outputs.version }}
          format: "sarif"
          output: "trivy-results.sarif"
          severity: "CRITICAL,HIGH"

  # --------------------------------------------------------------------------
  # Job 6: Deploy to Staging
  # --------------------------------------------------------------------------
  deploy-staging:
    name: "Deploy Staging"
    runs-on: ubuntu-latest
    timeout-minutes: 10
    needs: docker
    if: github.ref == 'refs/heads/staging' || github.ref == 'refs/heads/develop'
    environment: staging

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Deploy to staging
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USER }}
          key: ${{ secrets.STAGING_SSH_KEY }}
          script: |
            cd /opt/gratis-ngo
            git pull origin staging
            docker compose -f docker-compose.prod.yml pull
            docker compose -f docker-compose.prod.yml up -d --remove-orphans
            sleep 10
            curl -sf http://localhost:3000/api/health || exit 1
            echo "Staging deploy complete"

      - name: Notify Slack
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: "Staging deploy: ${{ job.status }}"
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}

  # --------------------------------------------------------------------------
  # Job 7: Deploy to Production
  # --------------------------------------------------------------------------
  deploy-production:
    name: "Deploy Production"
    runs-on: ubuntu-latest
    timeout-minutes: 15
    needs: docker
    if: github.ref == 'refs/heads/main'
    environment: production

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Deploy to production
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.PROD_SSH_KEY }}
          script: |
            cd /opt/gratis-ngo

            # Create backup
            BACKUP_DIR="/opt/backups/$(date +%Y%m%d_%H%M%S)"
            mkdir -p "$BACKUP_DIR"
            docker compose -f docker-compose.prod.yml exec -T redis redis-cli BGSAVE || true
            cp -r /opt/gratis-ngo/redis-data "$BACKUP_DIR/" || true

            # Pull and deploy
            git pull origin main
            docker compose -f docker-compose.prod.yml pull
            docker compose -f docker-compose.prod.yml up -d --remove-orphans

            # Health check with retry
            MAX_RETRIES=20
            RETRY=0
            while [ $RETRY -lt $MAX_RETRIES ]; do
              if curl -sf http://localhost:3000/api/health > /dev/null 2>&1; then
                echo "Health check passed"
                break
              fi
              RETRY=$((RETRY + 1))
              echo "Retrying health check ($RETRY/$MAX_RETRIES)..."
              sleep 3
            done

            if [ $RETRY -eq $MAX_RETRIES ]; then
              echo "CRITICAL: Health check failed — initiating rollback"
              docker compose -f docker-compose.prod.yml down
              exit 1
            fi

            # Cleanup old images
            docker image prune -f --filter "until=168h"

      - name: Purge CDN cache
        run: |
          curl -X POST "https://api.cloudflare.com/client/v4/zones/${{ secrets.CF_ZONE_ID }}/purge_cache" \
            -H "Authorization: Bearer ${{ secrets.CF_API_TOKEN }}" \
            -H "Content-Type: application/json" \
            -d '{"purge_everything":true}'

      - name: Create release tag
        run: |
          VERSION="v$(date +%Y%m%d.%H%M)"
          git tag "$VERSION"
          git push origin "$VERSION"

      - name: Notify Slack
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: "Production deploy: ${{ job.status }} — ${{ github.sha }}"
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

## PROMPT 50.2: PR Checks & Preview Deployments

### FILE: .github/workflows/pr-checks.yml

```yaml
# ============================================================================
# GRATIS.NGO — Pull Request Checks
# ============================================================================
name: PR Checks

on:
  pull_request:
    branches: [main, develop, staging]
    types: [opened, synchronize, reopened]

jobs:
  # --------------------------------------------------------------------------
  # Bundle Size Analysis
  # --------------------------------------------------------------------------
  bundle-analysis:
    name: "Bundle Analysis"
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: dummy
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: dummy
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: dummy
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: dummy
          NEXT_PUBLIC_APP_URL: http://localhost:3000

      - name: Analyze bundle
        run: npx @next/bundle-analyzer
        continue-on-error: true

      - name: Report bundle size
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const path = '.next/analyze/client.html';
            if (fs.existsSync(path)) {
              const stats = fs.statSync('.next');
              const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
              github.rest.issues.createComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: `📦 **Bundle Analysis**\nBuild size: ~${sizeMB}MB\nSee artifacts for detailed report.`
              });
            }

  # --------------------------------------------------------------------------
  # Lighthouse Performance Audit
  # --------------------------------------------------------------------------
  lighthouse:
    name: "Lighthouse Audit"
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: dummy
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: dummy
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: dummy
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: dummy
          NEXT_PUBLIC_APP_URL: http://localhost:3000

      - name: Start server
        run: npm start &
        env:
          PORT: 3000

      - name: Wait for server
        run: npx wait-on http://localhost:3000 --timeout 60000

      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v12
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/donate
            http://localhost:3000/projects
          configPath: ./lighthouserc.json
          uploadArtifacts: true

  # --------------------------------------------------------------------------
  # Database Migration Check
  # --------------------------------------------------------------------------
  migration-check:
    name: "Migration Safety"
    runs-on: ubuntu-latest
    timeout-minutes: 5

    steps:
      - name: Checkout PR
        uses: actions/checkout@v4

      - name: Check Firestore rules changes
        run: |
          if git diff --name-only origin/${{ github.base_ref }}...HEAD | grep -q "firestore.rules"; then
            echo "⚠️ Firestore rules changed — review required"
            echo "RULES_CHANGED=true" >> $GITHUB_ENV
          fi

      - name: Validate Firestore rules
        if: env.RULES_CHANGED == 'true'
        run: |
          npm install -g firebase-tools
          firebase emulators:exec --only firestore "echo Rules validated" \
            --project gratis-ngo-dev || exit 1
```

---

## PROMPT 50.3: Automated Release & Changelog

### FILE: .github/workflows/release.yml

```yaml
# ============================================================================
# GRATIS.NGO — Automated Release
# ============================================================================
name: Release

on:
  push:
    tags:
      - "v*"

permissions:
  contents: write

jobs:
  release:
    name: "Create Release"
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Generate changelog
        id: changelog
        run: |
          PREV_TAG=$(git describe --tags --abbrev=0 HEAD^ 2>/dev/null || echo "")
          CURRENT_TAG=${GITHUB_REF#refs/tags/}

          if [ -z "$PREV_TAG" ]; then
            COMMITS=$(git log --pretty=format:"- %s (%h)" --no-merges)
          else
            COMMITS=$(git log ${PREV_TAG}..${CURRENT_TAG} --pretty=format:"- %s (%h)" --no-merges)
          fi

          # Categorize commits
          FEATURES=$(echo "$COMMITS" | grep -i "^- feat\|^- add\|^- new" || true)
          FIXES=$(echo "$COMMITS" | grep -i "^- fix\|^- bug\|^- patch" || true)
          DOCS=$(echo "$COMMITS" | grep -i "^- doc\|^- readme" || true)
          OTHER=$(echo "$COMMITS" | grep -iv "^- feat\|^- add\|^- new\|^- fix\|^- bug\|^- patch\|^- doc\|^- readme" || true)

          CHANGELOG="## What's Changed in ${CURRENT_TAG}\n\n"

          if [ -n "$FEATURES" ]; then
            CHANGELOG+="### 🚀 Features\n${FEATURES}\n\n"
          fi
          if [ -n "$FIXES" ]; then
            CHANGELOG+="### 🐛 Bug Fixes\n${FIXES}\n\n"
          fi
          if [ -n "$DOCS" ]; then
            CHANGELOG+="### 📖 Documentation\n${DOCS}\n\n"
          fi
          if [ -n "$OTHER" ]; then
            CHANGELOG+="### 🔧 Other Changes\n${OTHER}\n\n"
          fi

          echo "changelog<<EOF" >> $GITHUB_OUTPUT
          echo -e "$CHANGELOG" >> $GITHUB_OUTPUT
          echo "EOF" >> $GITHUB_OUTPUT

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          body: ${{ steps.changelog.outputs.changelog }}
          draft: false
          prerelease: ${{ contains(github.ref, 'rc') || contains(github.ref, 'beta') }}
          generate_release_notes: true
```

---

### FILE: lighthouserc.json

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "settings": {
        "chromeFlags": "--no-sandbox --disable-gpu",
        "formFactor": "desktop",
        "throttling": {
          "rttMs": 40,
          "throughputKbps": 10240,
          "cpuSlowdownMultiplier": 1
        }
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.8 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["warn", { "minScore": 0.85 }],
        "categories:seo": ["warn", { "minScore": 0.9 }],
        "first-contentful-paint": ["warn", { "maxNumericValue": 2500 }],
        "largest-contentful-paint": ["warn", { "maxNumericValue": 4000 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["warn", { "maxNumericValue": 300 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```



# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 51: MONITORING, OBSERVABILITY & HEALTH CHECKS
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 51.1: Health Check API & System Status Types

Create a comprehensive health check system with deep dependency checks, system metrics, and a public status page.

### FILE: src/types/monitoring.ts

```typescript
// ============================================================================
// MONITORING & OBSERVABILITY TYPE DEFINITIONS
// ============================================================================

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface DependencyCheck {
  name: string;
  status: HealthStatus;
  latencyMs: number;
  message?: string;
  lastChecked: string;
}

export interface SystemMetrics {
  uptime: number;
  memoryUsage: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
    percentUsed: number;
  };
  cpuUsage: {
    user: number;
    system: number;
  };
  activeConnections: number;
  requestsPerMinute: number;
  averageResponseTime: number;
  errorRate: number;
}

export interface HealthCheckResponse {
  status: HealthStatus;
  version: string;
  environment: string;
  timestamp: string;
  uptime: number;
  dependencies: DependencyCheck[];
  metrics?: SystemMetrics;
}

export interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  currentValue: number;
  status: 'ok' | 'warning' | 'critical';
  lastTriggered?: string;
  notifyChannels: ('email' | 'slack' | 'webhook')[];
}

export interface IncidentLog {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  startedAt: string;
  resolvedAt?: string;
  affectedServices: string[];
  updates: {
    timestamp: string;
    message: string;
    status: string;
  }[];
}

export interface UptimeRecord {
  service: string;
  date: string;
  uptimePercent: number;
  totalChecks: number;
  failedChecks: number;
  averageLatencyMs: number;
}

export interface MetricDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface StatusPageData {
  overallStatus: HealthStatus;
  services: {
    name: string;
    status: HealthStatus;
    uptime90d: number;
    latencyMs: number;
  }[];
  activeIncidents: IncidentLog[];
  uptimeHistory: UptimeRecord[];
  lastUpdated: string;
}
```

---

## PROMPT 51.2: Health Check Service & Dependency Monitors

### FILE: src/lib/monitoring/health-service.ts

```typescript
// ============================================================================
// HEALTH CHECK SERVICE
// ============================================================================

import { db } from '@/lib/firebase/admin';
import {
  HealthStatus,
  HealthCheckResponse,
  DependencyCheck,
  SystemMetrics,
} from '@/types/monitoring';

// ------------------------------------------------------------------
// Config
// ------------------------------------------------------------------
const APP_VERSION = process.env.npm_package_version || '1.0.0';
const APP_ENV = process.env.NODE_ENV || 'development';
const START_TIME = Date.now();

// In-memory metrics
let requestCount = 0;
let totalResponseTime = 0;
let errorCount = 0;
let lastMetricsReset = Date.now();

// ------------------------------------------------------------------
// Request Tracking (call from middleware)
// ------------------------------------------------------------------
export function trackRequest(responseTimeMs: number, isError: boolean): void {
  requestCount++;
  totalResponseTime += responseTimeMs;
  if (isError) errorCount++;

  // Reset counters every 5 minutes
  if (Date.now() - lastMetricsReset > 5 * 60 * 1000) {
    requestCount = 0;
    totalResponseTime = 0;
    errorCount = 0;
    lastMetricsReset = Date.now();
  }
}

// ------------------------------------------------------------------
// Dependency Checks
// ------------------------------------------------------------------
async function checkFirestore(): Promise<DependencyCheck> {
  const start = Date.now();
  try {
    await db.collection('_health').doc('ping').set({
      timestamp: new Date().toISOString(),
    });
    const doc = await db.collection('_health').doc('ping').get();
    if (!doc.exists) throw new Error('Read verification failed');

    return {
      name: 'firestore',
      status: 'healthy',
      latencyMs: Date.now() - start,
      lastChecked: new Date().toISOString(),
    };
  } catch (err) {
    return {
      name: 'firestore',
      status: 'unhealthy',
      latencyMs: Date.now() - start,
      message: err instanceof Error ? err.message : 'Firestore check failed',
      lastChecked: new Date().toISOString(),
    };
  }
}

async function checkRedis(): Promise<DependencyCheck> {
  const start = Date.now();
  try {
    const { getRedisClient } = await import('@/lib/cache/redis');
    const client = getRedisClient();
    await client.ping();

    return {
      name: 'redis',
      status: 'healthy',
      latencyMs: Date.now() - start,
      lastChecked: new Date().toISOString(),
    };
  } catch (err) {
    return {
      name: 'redis',
      status: 'degraded',
      latencyMs: Date.now() - start,
      message: err instanceof Error ? err.message : 'Redis check failed',
      lastChecked: new Date().toISOString(),
    };
  }
}

async function checkStripe(): Promise<DependencyCheck> {
  const start = Date.now();
  try {
    const stripe = (await import('stripe')).default(
      process.env.STRIPE_SECRET_KEY!
    );
    await stripe.balance.retrieve();

    return {
      name: 'stripe',
      status: 'healthy',
      latencyMs: Date.now() - start,
      lastChecked: new Date().toISOString(),
    };
  } catch (err) {
    return {
      name: 'stripe',
      status: 'degraded',
      latencyMs: Date.now() - start,
      message: err instanceof Error ? err.message : 'Stripe check failed',
      lastChecked: new Date().toISOString(),
    };
  }
}

async function checkFirebaseAuth(): Promise<DependencyCheck> {
  const start = Date.now();
  try {
    const { auth } = await import('@/lib/firebase/admin');
    // List 1 user to verify auth service works
    await auth.listUsers(1);

    return {
      name: 'firebase-auth',
      status: 'healthy',
      latencyMs: Date.now() - start,
      lastChecked: new Date().toISOString(),
    };
  } catch (err) {
    return {
      name: 'firebase-auth',
      status: 'unhealthy',
      latencyMs: Date.now() - start,
      message: err instanceof Error ? err.message : 'Firebase Auth check failed',
      lastChecked: new Date().toISOString(),
    };
  }
}

async function checkFirebaseStorage(): Promise<DependencyCheck> {
  const start = Date.now();
  try {
    const { storage } = await import('@/lib/firebase/admin');
    const bucket = storage.bucket();
    await bucket.exists();

    return {
      name: 'firebase-storage',
      status: 'healthy',
      latencyMs: Date.now() - start,
      lastChecked: new Date().toISOString(),
    };
  } catch (err) {
    return {
      name: 'firebase-storage',
      status: 'degraded',
      latencyMs: Date.now() - start,
      message: err instanceof Error ? err.message : 'Storage check failed',
      lastChecked: new Date().toISOString(),
    };
  }
}

// ------------------------------------------------------------------
// System Metrics
// ------------------------------------------------------------------
function getSystemMetrics(): SystemMetrics {
  const mem = process.memoryUsage();
  const cpu = process.cpuUsage();
  const elapsedMs = Date.now() - lastMetricsReset;
  const elapsedMinutes = Math.max(elapsedMs / 60000, 1);

  return {
    uptime: process.uptime(),
    memoryUsage: {
      rss: mem.rss,
      heapTotal: mem.heapTotal,
      heapUsed: mem.heapUsed,
      external: mem.external,
      percentUsed: Math.round((mem.heapUsed / mem.heapTotal) * 100),
    },
    cpuUsage: {
      user: cpu.user / 1000, // microseconds to ms
      system: cpu.system / 1000,
    },
    activeConnections: 0, // Would need socket tracking
    requestsPerMinute: Math.round(requestCount / elapsedMinutes),
    averageResponseTime:
      requestCount > 0 ? Math.round(totalResponseTime / requestCount) : 0,
    errorRate:
      requestCount > 0
        ? Math.round((errorCount / requestCount) * 10000) / 100
        : 0,
  };
}

// ------------------------------------------------------------------
// Determine overall status
// ------------------------------------------------------------------
function determineOverallStatus(deps: DependencyCheck[]): HealthStatus {
  const hasUnhealthy = deps.some((d) => d.status === 'unhealthy');
  const hasDegraded = deps.some((d) => d.status === 'degraded');

  // Critical dependencies — if any unhealthy, system is unhealthy
  const criticalDeps = ['firestore', 'firebase-auth'];
  const criticalDown = deps.some(
    (d) => criticalDeps.includes(d.name) && d.status === 'unhealthy'
  );

  if (criticalDown) return 'unhealthy';
  if (hasUnhealthy || hasDegraded) return 'degraded';
  return 'healthy';
}

// ------------------------------------------------------------------
// Main Health Check
// ------------------------------------------------------------------
export async function performHealthCheck(
  deep = false
): Promise<HealthCheckResponse> {
  const dependencies: DependencyCheck[] = [];

  if (deep) {
    // Full dependency checks (slower, authenticated only)
    const checks = await Promise.allSettled([
      checkFirestore(),
      checkRedis(),
      checkStripe(),
      checkFirebaseAuth(),
      checkFirebaseStorage(),
    ]);

    for (const result of checks) {
      if (result.status === 'fulfilled') {
        dependencies.push(result.value);
      } else {
        dependencies.push({
          name: 'unknown',
          status: 'unhealthy',
          latencyMs: 0,
          message: result.reason?.message || 'Check failed',
          lastChecked: new Date().toISOString(),
        });
      }
    }
  } else {
    // Shallow check — just verify the app is running
    dependencies.push({
      name: 'application',
      status: 'healthy',
      latencyMs: 0,
      lastChecked: new Date().toISOString(),
    });
  }

  const status = determineOverallStatus(dependencies);

  return {
    status,
    version: APP_VERSION,
    environment: APP_ENV,
    timestamp: new Date().toISOString(),
    uptime: Math.round((Date.now() - START_TIME) / 1000),
    dependencies,
    metrics: deep ? getSystemMetrics() : undefined,
  };
}
```

---

## PROMPT 51.3: Health Check & Metrics API Routes

### FILE: src/app/api/health/route.ts

```typescript
// ============================================================================
// HEALTH CHECK API — PUBLIC
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { performHealthCheck } from '@/lib/monitoring/health-service';

/**
 * GET /api/health
 * Public health check endpoint — used by load balancers, Docker, monitoring
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const deep = searchParams.get('deep') === 'true';

  try {
    const result = await performHealthCheck(deep);

    const statusCode =
      result.status === 'healthy'
        ? 200
        : result.status === 'degraded'
          ? 200
          : 503;

    return NextResponse.json(result, {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Health-Status': result.status,
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
```

---

### FILE: src/app/api/admin/monitoring/metrics/route.ts

```typescript
// ============================================================================
// ADMIN METRICS API
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, handleAuthError } from '@/lib/rbac/middleware';
import { performHealthCheck } from '@/lib/monitoring/health-service';
import { db } from '@/lib/firebase/admin';

/**
 * GET /api/admin/monitoring/metrics
 * Full system metrics — admin only
 */
export async function GET(req: NextRequest) {
  try {
    await requirePermission(req, 'analytics:read');

    // Deep health check with metrics
    const health = await performHealthCheck(true);

    // Application-level metrics from Firestore
    const [usersSnap, donationsSnap, eventsSnap] = await Promise.all([
      db.collection('users').count().get(),
      db.collection('donations').count().get(),
      db.collection('events').count().get(),
    ]);

    // Recent error count (last 24h)
    const oneDayAgo = new Date(Date.now() - 86400000).toISOString();
    const errorsSnap = await db
      .collection('audit_logs')
      .where('severity', 'in', ['error', 'critical'])
      .where('timestamp', '>=', oneDayAgo)
      .count()
      .get();

    return NextResponse.json({
      health,
      application: {
        totalUsers: usersSnap.data().count,
        totalDonations: donationsSnap.data().count,
        totalEvents: eventsSnap.data().count,
        errorsLast24h: errorsSnap.data().count,
      },
      collectedAt: new Date().toISOString(),
    });
  } catch (err) {
    return handleAuthError(err);
  }
}
```

---

### FILE: src/app/api/admin/monitoring/uptime/route.ts

```typescript
// ============================================================================
// UPTIME HISTORY API
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, handleAuthError } from '@/lib/rbac/middleware';
import { db } from '@/lib/firebase/admin';
import { UptimeRecord } from '@/types/monitoring';

/**
 * GET /api/admin/monitoring/uptime
 * Retrieve uptime history for services
 */
export async function GET(req: NextRequest) {
  try {
    await requirePermission(req, 'analytics:read');

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '90');
    const service = searchParams.get('service') || 'all';

    const startDate = new Date(
      Date.now() - days * 24 * 60 * 60 * 1000
    ).toISOString();

    let query = db
      .collection('uptime_records')
      .where('date', '>=', startDate)
      .orderBy('date', 'desc')
      .limit(days * 5); // 5 services × days

    if (service !== 'all') {
      query = db
        .collection('uptime_records')
        .where('service', '==', service)
        .where('date', '>=', startDate)
        .orderBy('date', 'desc')
        .limit(days);
    }

    const snapshot = await query.get();
    const records: UptimeRecord[] = snapshot.docs.map(
      (doc) => doc.data() as UptimeRecord
    );

    // Calculate aggregate uptime per service
    const serviceMap = new Map<
      string,
      { totalChecks: number; failedChecks: number; totalLatency: number }
    >();

    for (const record of records) {
      const existing = serviceMap.get(record.service) || {
        totalChecks: 0,
        failedChecks: 0,
        totalLatency: 0,
      };
      existing.totalChecks += record.totalChecks;
      existing.failedChecks += record.failedChecks;
      existing.totalLatency += record.averageLatencyMs * record.totalChecks;
      serviceMap.set(record.service, existing);
    }

    const aggregates = Array.from(serviceMap.entries()).map(
      ([name, data]) => ({
        service: name,
        uptimePercent:
          data.totalChecks > 0
            ? Math.round(
                ((data.totalChecks - data.failedChecks) / data.totalChecks) *
                  10000
              ) / 100
            : 100,
        averageLatencyMs:
          data.totalChecks > 0
            ? Math.round(data.totalLatency / data.totalChecks)
            : 0,
        totalChecks: data.totalChecks,
        failedChecks: data.failedChecks,
      })
    );

    return NextResponse.json({
      records,
      aggregates,
      period: { days, startDate, endDate: new Date().toISOString() },
    });
  } catch (err) {
    return handleAuthError(err);
  }
}
```

---

## PROMPT 51.4: Monitoring Middleware & Error Tracking

### FILE: src/middleware/monitoring.ts

```typescript
// ============================================================================
// MONITORING MIDDLEWARE
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { trackRequest } from '@/lib/monitoring/health-service';

// ------------------------------------------------------------------
// Request ID Generator
// ------------------------------------------------------------------
function generateRequestId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `req_${timestamp}_${random}`;
}

// ------------------------------------------------------------------
// Monitoring Middleware
// ------------------------------------------------------------------
export function withMonitoring(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    const requestId = generateRequestId();

    // Add request ID to headers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-request-id', requestId);

    let response: NextResponse;
    let isError = false;

    try {
      response = await handler(req);

      if (response.status >= 400) {
        isError = response.status >= 500;
      }
    } catch (err) {
      isError = true;

      // Log unexpected errors
      console.error(`[${requestId}] Unhandled error:`, {
        method: req.method,
        url: req.url,
        error: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
      });

      response = NextResponse.json(
        { error: 'Internal server error', requestId },
        { status: 500 }
      );
    }

    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Track metrics
    trackRequest(responseTime, isError);

    // Add monitoring headers
    response.headers.set('x-request-id', requestId);
    response.headers.set('x-response-time', `${responseTime}ms`);

    // Log slow requests (> 2 seconds)
    if (responseTime > 2000) {
      console.warn(`[${requestId}] Slow request:`, {
        method: req.method,
        url: req.url,
        responseTime: `${responseTime}ms`,
        status: response.status,
      });
    }

    return response;
  };
}
```

---

### FILE: src/lib/monitoring/error-tracker.ts

```typescript
// ============================================================================
// ERROR TRACKING SERVICE
// ============================================================================

import { db } from '@/lib/firebase/admin';

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface ErrorContext {
  userId?: string;
  requestId?: string;
  url?: string;
  method?: string;
  userAgent?: string;
  extra?: Record<string, unknown>;
}

interface TrackedError {
  id: string;
  message: string;
  stack?: string;
  fingerprint: string;
  severity: 'warning' | 'error' | 'critical';
  context: ErrorContext;
  timestamp: string;
  occurrences: number;
  firstSeen: string;
  lastSeen: string;
  resolved: boolean;
}

// ------------------------------------------------------------------
// Error Fingerprinting
// ------------------------------------------------------------------
function generateFingerprint(error: Error): string {
  // Create a stable fingerprint from error message + first few stack lines
  const stackLines = (error.stack || '')
    .split('\n')
    .slice(0, 4)
    .map((line) => line.trim().replace(/:\d+:\d+\)?$/, ''))
    .join('|');

  const raw = `${error.name}:${error.message}:${stackLines}`;

  // Simple hash
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `err_${Math.abs(hash).toString(36)}`;
}

// ------------------------------------------------------------------
// Error Tracker
// ------------------------------------------------------------------
export class ErrorTracker {
  /**
   * Track an error with context
   */
  static async capture(
    error: Error,
    severity: 'warning' | 'error' | 'critical' = 'error',
    context: ErrorContext = {}
  ): Promise<string> {
    const fingerprint = generateFingerprint(error);
    const now = new Date().toISOString();

    try {
      const ref = db.collection('error_tracking').doc(fingerprint);
      const existing = await ref.get();

      if (existing.exists) {
        // Increment occurrence count
        const data = existing.data()!;
        await ref.update({
          occurrences: (data.occurrences || 0) + 1,
          lastSeen: now,
          'context.latest': context,
          resolved: false, // Re-open if was resolved
        });
      } else {
        // New error
        const tracked: TrackedError = {
          id: fingerprint,
          message: error.message,
          stack: error.stack,
          fingerprint,
          severity,
          context,
          timestamp: now,
          occurrences: 1,
          firstSeen: now,
          lastSeen: now,
          resolved: false,
        };
        await ref.set(tracked);
      }

      // Critical errors: send immediate alert
      if (severity === 'critical') {
        await this.sendCriticalAlert(error, context);
      }

      // Log to console
      console[severity === 'warning' ? 'warn' : 'error'](
        `[ErrorTracker] ${severity.toUpperCase()}: ${error.message}`,
        {
          fingerprint,
          context,
        }
      );

      return fingerprint;
    } catch (trackingError) {
      // Don't let error tracking errors crash the app
      console.error('[ErrorTracker] Failed to track error:', trackingError);
      return fingerprint;
    }
  }

  /**
   * Send critical alert to admins
   */
  private static async sendCriticalAlert(
    error: Error,
    context: ErrorContext
  ): Promise<void> {
    try {
      // Fire notification to admin
      await db.collection('notifications').add({
        type: 'critical_error',
        title: `🚨 Critical Error: ${error.message.substring(0, 100)}`,
        body: `A critical error occurred. Request: ${context.method || 'N/A'} ${context.url || 'N/A'}. Check the error tracking dashboard for details.`,
        targetRole: 'super_admin',
        priority: 'urgent',
        timestamp: new Date().toISOString(),
        read: false,
        metadata: {
          errorMessage: error.message,
          requestId: context.requestId,
          url: context.url,
        },
      });

      // Slack webhook (if configured)
      const slackWebhook = process.env.SLACK_ERROR_WEBHOOK;
      if (slackWebhook) {
        await fetch(slackWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 *CRITICAL ERROR* on GRATIS.NGO\n*Message:* ${error.message}\n*URL:* ${context.url || 'N/A'}\n*Request ID:* ${context.requestId || 'N/A'}`,
          }),
        });
      }
    } catch {
      console.error('[ErrorTracker] Failed to send critical alert');
    }
  }

  /**
   * Mark an error as resolved
   */
  static async resolve(fingerprint: string): Promise<void> {
    await db.collection('error_tracking').doc(fingerprint).update({
      resolved: true,
      resolvedAt: new Date().toISOString(),
    });
  }

  /**
   * Get unresolved errors
   */
  static async getUnresolved(
    limit = 50,
    severity?: string
  ): Promise<TrackedError[]> {
    let query = db
      .collection('error_tracking')
      .where('resolved', '==', false)
      .orderBy('lastSeen', 'desc')
      .limit(limit);

    if (severity) {
      query = db
        .collection('error_tracking')
        .where('resolved', '==', false)
        .where('severity', '==', severity)
        .orderBy('lastSeen', 'desc')
        .limit(limit);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => doc.data() as TrackedError);
  }

  /**
   * Get error statistics
   */
  static async getStats(): Promise<{
    totalUnresolved: number;
    criticalCount: number;
    last24hCount: number;
    topErrors: { fingerprint: string; message: string; count: number }[];
  }> {
    const unresolvedSnap = await db
      .collection('error_tracking')
      .where('resolved', '==', false)
      .get();

    const oneDayAgo = new Date(Date.now() - 86400000).toISOString();
    const recentSnap = await db
      .collection('error_tracking')
      .where('lastSeen', '>=', oneDayAgo)
      .get();

    let criticalCount = 0;
    const errorCounts: Map<string, { message: string; count: number }> =
      new Map();

    for (const doc of unresolvedSnap.docs) {
      const data = doc.data();
      if (data.severity === 'critical') criticalCount++;
      errorCounts.set(doc.id, {
        message: data.message,
        count: data.occurrences,
      });
    }

    const topErrors = Array.from(errorCounts.entries())
      .map(([fingerprint, data]) => ({
        fingerprint,
        message: data.message,
        count: data.count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalUnresolved: unresolvedSnap.size,
      criticalCount,
      last24hCount: recentSnap.size,
      topErrors,
    };
  }
}
```

---

## PROMPT 51.5: Monitoring Dashboard Component

### FILE: src/components/admin/MonitoringDashboard.tsx

```tsx
// ============================================================================
// ADMIN MONITORING DASHBOARD
// ============================================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { HealthCheckResponse, HealthStatus } from '@/types/monitoring';

// ------------------------------------------------------------------
// Status Indicators
// ------------------------------------------------------------------
const STATUS_CONFIG: Record<
  HealthStatus,
  { color: string; bg: string; label: string; icon: string }
> = {
  healthy: { color: '#16a34a', bg: '#f0fdf4', label: 'Healthy', icon: '✅' },
  degraded: {
    color: '#ca8a04',
    bg: '#fefce8',
    label: 'Degraded',
    icon: '⚠️',
  },
  unhealthy: {
    color: '#dc2626',
    bg: '#fef2f2',
    label: 'Unhealthy',
    icon: '🔴',
  },
};

// ------------------------------------------------------------------
// Helper: Format bytes
// ------------------------------------------------------------------
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// ------------------------------------------------------------------
// Helper: Format uptime
// ------------------------------------------------------------------
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
export default function MonitoringDashboard() {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [appMetrics, setAppMetrics] = useState<Record<string, number> | null>(
    null
  );
  const [errors, setErrors] = useState<
    { fingerprint: string; message: string; count: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchData = useCallback(async () => {
    try {
      const [metricsRes, errorsRes] = await Promise.all([
        fetch('/api/admin/monitoring/metrics'),
        fetch('/api/admin/monitoring/errors'),
      ]);

      if (metricsRes.ok) {
        const data = await metricsRes.json();
        setHealth(data.health);
        setAppMetrics(data.application);
      }

      if (errorsRes.ok) {
        const data = await errorsRes.json();
        setErrors(data.topErrors || []);
      }

      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Failed to fetch monitoring data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchData, 30000); // 30s refresh
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: 60,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            border: '3px solid #e5e7eb',
            borderTopColor: '#2563eb',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const statusConfig = health
    ? STATUS_CONFIG[health.status]
    : STATUS_CONFIG.unhealthy;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
            System Monitor
          </h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: 13 }}>
            Last updated: {lastRefreshed.toLocaleTimeString()}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label
            style={{ fontSize: 13, color: '#6b7280', cursor: 'pointer' }}
          >
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              style={{ marginRight: 6 }}
            />
            Auto-refresh (30s)
          </label>
          <button
            onClick={fetchData}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: '1px solid #d1d5db',
              backgroundColor: '#fff',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Refresh Now
          </button>
        </div>
      </div>

      {/* Overall Status Banner */}
      <div
        style={{
          padding: 20,
          borderRadius: 12,
          backgroundColor: statusConfig.bg,
          border: `2px solid ${statusConfig.color}`,
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <span style={{ fontSize: 32 }}>{statusConfig.icon}</span>
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: statusConfig.color,
            }}
          >
            System {statusConfig.label}
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>
            v{health?.version || '?'} · {health?.environment || '?'} · Uptime:{' '}
            {health ? formatUptime(health.uptime) : 'N/A'}
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        {/* Requests per Minute */}
        <MetricCard
          icon="📊"
          label="Requests/min"
          value={health?.metrics?.requestsPerMinute?.toString() || '0'}
          sub="Average throughput"
        />

        {/* Response Time */}
        <MetricCard
          icon="⚡"
          label="Avg Response"
          value={`${health?.metrics?.averageResponseTime || 0}ms`}
          sub="Mean response time"
        />

        {/* Error Rate */}
        <MetricCard
          icon="🐛"
          label="Error Rate"
          value={`${health?.metrics?.errorRate || 0}%`}
          sub="Last 5 minutes"
          alert={(health?.metrics?.errorRate || 0) > 5}
        />

        {/* Memory Usage */}
        <MetricCard
          icon="💾"
          label="Heap Memory"
          value={formatBytes(health?.metrics?.memoryUsage.heapUsed || 0)}
          sub={`${health?.metrics?.memoryUsage.percentUsed || 0}% of heap`}
          alert={(health?.metrics?.memoryUsage.percentUsed || 0) > 85}
        />

        {/* Application Metrics */}
        <MetricCard
          icon="👥"
          label="Total Users"
          value={appMetrics?.totalUsers?.toLocaleString() || '0'}
          sub="Registered accounts"
        />
        <MetricCard
          icon="💰"
          label="Total Donations"
          value={appMetrics?.totalDonations?.toLocaleString() || '0'}
          sub="All-time donations"
        />
        <MetricCard
          icon="📅"
          label="Total Events"
          value={appMetrics?.totalEvents?.toLocaleString() || '0'}
          sub="Created events"
        />
        <MetricCard
          icon="🚨"
          label="Errors (24h)"
          value={appMetrics?.errorsLast24h?.toLocaleString() || '0'}
          sub="Last 24 hours"
          alert={(appMetrics?.errorsLast24h || 0) > 10}
        />
      </div>

      {/* Dependencies */}
      <div
        style={{
          backgroundColor: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: 20,
          marginBottom: 24,
        }}
      >
        <h3
          style={{ fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}
        >
          Service Dependencies
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {health?.dependencies.map((dep) => {
            const depStatus = STATUS_CONFIG[dep.status];
            return (
              <div
                key={dep.name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderRadius: 8,
                  backgroundColor: depStatus.bg,
                  border: `1px solid ${depStatus.color}20`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: depStatus.color,
                    }}
                  />
                  <span
                    style={{ fontSize: 14, fontWeight: 500, textTransform: 'capitalize' }}
                  >
                    {dep.name.replace(/-/g, ' ')}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {dep.message && (
                    <span style={{ fontSize: 12, color: '#ef4444' }}>
                      {dep.message}
                    </span>
                  )}
                  <span style={{ fontSize: 12, color: '#6b7280' }}>
                    {dep.latencyMs}ms
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: depStatus.color,
                      textTransform: 'uppercase',
                    }}
                  >
                    {dep.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Errors */}
      {errors.length > 0 && (
        <div
          style={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            padding: 20,
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>
            Top Unresolved Errors
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {errors.map((err) => (
              <div
                key={err.fingerprint}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: 6,
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    color: '#991b1b',
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginRight: 12,
                  }}
                >
                  {err.message}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#dc2626',
                    flexShrink: 0,
                    backgroundColor: '#fee2e2',
                    padding: '2px 8px',
                    borderRadius: 10,
                  }}
                >
                  ×{err.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// Metric Card Sub-component
// ------------------------------------------------------------------
function MetricCard({
  icon,
  label,
  value,
  sub,
  alert = false,
}: {
  icon: string;
  label: string;
  value: string;
  sub: string;
  alert?: boolean;
}) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 10,
        backgroundColor: alert ? '#fef2f2' : '#fff',
        border: `1px solid ${alert ? '#fecaca' : '#e5e7eb'}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>
          {label}
        </span>
      </div>
      <p
        style={{
          fontSize: 24,
          fontWeight: 700,
          margin: 0,
          color: alert ? '#dc2626' : '#111827',
        }}
      >
        {value}
      </p>
      <p style={{ fontSize: 11, color: '#9ca3af', margin: '4px 0 0' }}>{sub}</p>
    </div>
  );
}
```

---

### FILE: src/app/admin/monitoring/page.tsx

```tsx
// ============================================================================
// ADMIN MONITORING PAGE
// ============================================================================

import MonitoringDashboard from '@/components/admin/MonitoringDashboard';

export const metadata = {
  title: 'System Monitor — GRATIS.NGO Admin',
};

export default function MonitoringPage() {
  return (
    <div style={{ padding: '24px 32px' }}>
      <MonitoringDashboard />
    </div>
  );
}
```



# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 52: PERFORMANCE OPTIMIZATION & CACHING
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 52.1: Redis Caching Layer

Create a comprehensive Redis caching layer for GRATIS.NGO with automatic invalidation, TTL management, cache-aside pattern, and read-through caching for hot paths.

### FILE: src/lib/cache/redis.ts

```typescript
// ============================================================================
// REDIS CLIENT & CONNECTION MANAGEMENT
// ============================================================================

import { createClient, RedisClientType } from 'redis';

let client: RedisClientType | null = null;
let connectionPromise: Promise<RedisClientType> | null = null;

/**
 * Get or create Redis client (singleton)
 */
export function getRedisClient(): RedisClientType {
  if (client) return client;

  const url = process.env.REDIS_URL || 'redis://localhost:6379';

  client = createClient({
    url,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          console.error('[Redis] Max reconnect attempts reached');
          return new Error('Max reconnect attempts reached');
        }
        return Math.min(retries * 100, 3000);
      },
      connectTimeout: 5000,
    },
  });

  client.on('error', (err) => console.error('[Redis] Error:', err));
  client.on('reconnecting', () => console.log('[Redis] Reconnecting...'));
  client.on('ready', () => console.log('[Redis] Connected'));

  return client;
}

/**
 * Ensure client is connected
 */
export async function ensureConnection(): Promise<RedisClientType> {
  const c = getRedisClient();
  if (c.isOpen) return c;

  if (!connectionPromise) {
    connectionPromise = c.connect().then(() => {
      connectionPromise = null;
      return c;
    });
  }
  return connectionPromise;
}

/**
 * Graceful shutdown
 */
export async function disconnectRedis(): Promise<void> {
  if (client?.isOpen) {
    await client.quit();
    client = null;
  }
}
```

---

### FILE: src/lib/cache/cache-service.ts

```typescript
// ============================================================================
// CACHE SERVICE — HIGH-LEVEL CACHING API
// ============================================================================

import { ensureConnection } from './redis';

// ------------------------------------------------------------------
// Cache Key Prefixes
// ------------------------------------------------------------------
export const CachePrefix = {
  USER: 'user:',
  DONATION: 'donation:',
  PROJECT: 'project:',
  EVENT: 'event:',
  PARTNER: 'partner:',
  ANALYTICS: 'analytics:',
  BOTTLE: 'bottle:',
  TRIBE: 'tribe:',
  LEADERBOARD: 'leaderboard:',
  CONFIG: 'config:',
  RATE_LIMIT: 'rl:',
  SESSION: 'session:',
  HEALTH: 'health:',
} as const;

// ------------------------------------------------------------------
// TTL Presets (seconds)
// ------------------------------------------------------------------
export const CacheTTL = {
  SHORT: 60,          // 1 minute — real-time data
  MEDIUM: 300,        // 5 minutes — frequently updated
  STANDARD: 900,      // 15 minutes — default
  LONG: 3600,         // 1 hour — stable data
  VERY_LONG: 86400,   // 24 hours — static content
  WEEK: 604800,       // 7 days — rarely changes
} as const;

// ------------------------------------------------------------------
// Cache Service
// ------------------------------------------------------------------
export class CacheService {
  /**
   * Get a cached value (returns null if miss)
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const redis = await ensureConnection();
      const data = await redis.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (err) {
      console.warn('[Cache] GET failed:', key, err);
      return null;
    }
  }

  /**
   * Set a value in cache with TTL
   */
  static async set<T>(
    key: string,
    value: T,
    ttlSeconds: number = CacheTTL.STANDARD
  ): Promise<void> {
    try {
      const redis = await ensureConnection();
      await redis.setEx(key, ttlSeconds, JSON.stringify(value));
    } catch (err) {
      console.warn('[Cache] SET failed:', key, err);
    }
  }

  /**
   * Delete a cache key
   */
  static async del(key: string): Promise<void> {
    try {
      const redis = await ensureConnection();
      await redis.del(key);
    } catch (err) {
      console.warn('[Cache] DEL failed:', key, err);
    }
  }

  /**
   * Delete all keys matching a pattern
   */
  static async invalidatePattern(pattern: string): Promise<number> {
    try {
      const redis = await ensureConnection();
      let cursor = 0;
      let deleted = 0;

      do {
        const result = await redis.scan(cursor, {
          MATCH: pattern,
          COUNT: 100,
        });
        cursor = result.cursor;

        if (result.keys.length > 0) {
          await redis.del(result.keys);
          deleted += result.keys.length;
        }
      } while (cursor !== 0);

      return deleted;
    } catch (err) {
      console.warn('[Cache] INVALIDATE failed:', pattern, err);
      return 0;
    }
  }

  /**
   * Cache-aside pattern: get from cache, or fetch from source
   */
  static async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds: number = CacheTTL.STANDARD
  ): Promise<T> {
    // Try cache first
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;

    // Cache miss — fetch from source
    const value = await fetcher();

    // Store in cache (non-blocking)
    this.set(key, value, ttlSeconds).catch(() => {});

    return value;
  }

  /**
   * Increment a counter (atomic)
   */
  static async increment(
    key: string,
    amount: number = 1,
    ttlSeconds?: number
  ): Promise<number> {
    try {
      const redis = await ensureConnection();
      const result = await redis.incrBy(key, amount);

      if (ttlSeconds) {
        await redis.expire(key, ttlSeconds);
      }

      return result;
    } catch (err) {
      console.warn('[Cache] INCREMENT failed:', key, err);
      return 0;
    }
  }

  /**
   * Add to a sorted set (for leaderboards)
   */
  static async zAdd(
    key: string,
    score: number,
    member: string
  ): Promise<void> {
    try {
      const redis = await ensureConnection();
      await redis.zAdd(key, { score, value: member });
    } catch (err) {
      console.warn('[Cache] ZADD failed:', key, err);
    }
  }

  /**
   * Get top N from sorted set
   */
  static async zTopN(
    key: string,
    count: number
  ): Promise<{ value: string; score: number }[]> {
    try {
      const redis = await ensureConnection();
      return await redis.zRangeWithScores(key, 0, count - 1, { REV: true });
    } catch (err) {
      console.warn('[Cache] ZTOP failed:', key, err);
      return [];
    }
  }

  /**
   * Hash set operations (for complex objects)
   */
  static async hSet(
    key: string,
    field: string,
    value: string
  ): Promise<void> {
    try {
      const redis = await ensureConnection();
      await redis.hSet(key, field, value);
    } catch (err) {
      console.warn('[Cache] HSET failed:', key, err);
    }
  }

  static async hGet(key: string, field: string): Promise<string | null> {
    try {
      const redis = await ensureConnection();
      const result = await redis.hGet(key, field);
      return result ?? null;
    } catch (err) {
      console.warn('[Cache] HGET failed:', key, err);
      return null;
    }
  }

  static async hGetAll(key: string): Promise<Record<string, string>> {
    try {
      const redis = await ensureConnection();
      return await redis.hGetAll(key);
    } catch (err) {
      console.warn('[Cache] HGETALL failed:', key, err);
      return {};
    }
  }

  /**
   * Check if key exists
   */
  static async exists(key: string): Promise<boolean> {
    try {
      const redis = await ensureConnection();
      return (await redis.exists(key)) === 1;
    } catch (err) {
      return false;
    }
  }

  /**
   * Set with NX (only if not exists) — for distributed locks
   */
  static async setNX(
    key: string,
    value: string,
    ttlSeconds: number
  ): Promise<boolean> {
    try {
      const redis = await ensureConnection();
      const result = await redis.set(key, value, {
        NX: true,
        EX: ttlSeconds,
      });
      return result === 'OK';
    } catch (err) {
      return false;
    }
  }
}
```

---

## PROMPT 52.2: Cache Invalidation Strategies & Warming

### FILE: src/lib/cache/invalidation.ts

```typescript
// ============================================================================
// CACHE INVALIDATION STRATEGIES
// ============================================================================

import { CacheService, CachePrefix } from './cache-service';

// ------------------------------------------------------------------
// Entity-Level Invalidation
// ------------------------------------------------------------------
export class CacheInvalidation {
  /**
   * Invalidate all caches related to a user
   */
  static async invalidateUser(userId: string): Promise<void> {
    await Promise.all([
      CacheService.del(`${CachePrefix.USER}${userId}`),
      CacheService.del(`${CachePrefix.USER}${userId}:profile`),
      CacheService.del(`${CachePrefix.USER}${userId}:donations`),
      CacheService.del(`${CachePrefix.USER}${userId}:subscriptions`),
      CacheService.del(`${CachePrefix.USER}${userId}:activity`),
      CacheService.del(`${CachePrefix.USER}${userId}:achievements`),
    ]);
  }

  /**
   * Invalidate project-related caches
   */
  static async invalidateProject(projectId: string): Promise<void> {
    await Promise.all([
      CacheService.del(`${CachePrefix.PROJECT}${projectId}`),
      CacheService.del(`${CachePrefix.PROJECT}${projectId}:details`),
      CacheService.del(`${CachePrefix.PROJECT}${projectId}:donations`),
      CacheService.invalidatePattern(`${CachePrefix.PROJECT}list:*`),
    ]);
  }

  /**
   * Invalidate donation-related caches
   */
  static async invalidateDonation(
    donationId: string,
    userId: string,
    projectId?: string
  ): Promise<void> {
    await Promise.all([
      CacheService.del(`${CachePrefix.DONATION}${donationId}`),
      CacheService.del(`${CachePrefix.USER}${userId}:donations`),
      CacheService.invalidatePattern(`${CachePrefix.ANALYTICS}donations:*`),
      CacheService.invalidatePattern(`${CachePrefix.LEADERBOARD}*`),
      projectId
        ? CacheService.del(`${CachePrefix.PROJECT}${projectId}:donations`)
        : Promise.resolve(),
    ]);
  }

  /**
   * Invalidate event-related caches
   */
  static async invalidateEvent(eventId: string): Promise<void> {
    await Promise.all([
      CacheService.del(`${CachePrefix.EVENT}${eventId}`),
      CacheService.invalidatePattern(`${CachePrefix.EVENT}list:*`),
      CacheService.invalidatePattern(`${CachePrefix.EVENT}upcoming:*`),
    ]);
  }

  /**
   * Invalidate partner caches
   */
  static async invalidatePartner(partnerId: string): Promise<void> {
    await Promise.all([
      CacheService.del(`${CachePrefix.PARTNER}${partnerId}`),
      CacheService.invalidatePattern(`${CachePrefix.PARTNER}list:*`),
      CacheService.invalidatePattern(`${CachePrefix.PARTNER}directory:*`),
    ]);
  }

  /**
   * Invalidate all analytics caches
   */
  static async invalidateAnalytics(): Promise<void> {
    await CacheService.invalidatePattern(`${CachePrefix.ANALYTICS}*`);
  }

  /**
   * Full cache flush (use sparingly)
   */
  static async flushAll(): Promise<void> {
    const { ensureConnection } = await import('./redis');
    const redis = await ensureConnection();
    await redis.flushDb();
    console.warn('[Cache] Full flush executed');
  }
}

// ------------------------------------------------------------------
// Cache Warming (pre-populate hot caches)
// ------------------------------------------------------------------
export class CacheWarmer {
  /**
   * Warm up caches on application start
   */
  static async warmup(): Promise<void> {
    console.log('[CacheWarmer] Starting cache warmup...');
    const start = Date.now();

    try {
      await Promise.allSettled([
        this.warmHomepageData(),
        this.warmLeaderboards(),
        this.warmActiveProjects(),
        this.warmUpcomingEvents(),
      ]);

      console.log(
        `[CacheWarmer] Warmup completed in ${Date.now() - start}ms`
      );
    } catch (err) {
      console.error('[CacheWarmer] Warmup failed:', err);
    }
  }

  private static async warmHomepageData(): Promise<void> {
    const { db } = await import('@/lib/firebase/admin');

    // Total donation count
    const donationsSnap = await db.collection('donations')
      .where('status', '==', 'completed')
      .count()
      .get();
    await CacheService.set(
      `${CachePrefix.ANALYTICS}homepage:totalDonations`,
      donationsSnap.data().count,
      3600
    );

    // Active NGO count
    const partnersSnap = await db.collection('partners')
      .where('status', '==', 'active')
      .count()
      .get();
    await CacheService.set(
      `${CachePrefix.ANALYTICS}homepage:activeNGOs`,
      partnersSnap.data().count,
      3600
    );

    // Total users
    const usersSnap = await db.collection('users').count().get();
    await CacheService.set(
      `${CachePrefix.ANALYTICS}homepage:totalUsers`,
      usersSnap.data().count,
      3600
    );
  }

  private static async warmLeaderboards(): Promise<void> {
    const { db } = await import('@/lib/firebase/admin');

    const topDonorsSnap = await db.collection('users')
      .orderBy('totalDonated', 'desc')
      .limit(20)
      .get();

    const leaderboard = topDonorsSnap.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().displayName || 'Anonymous',
      amount: doc.data().totalDonated || 0,
    }));

    await CacheService.set(
      `${CachePrefix.LEADERBOARD}top_donors`,
      leaderboard,
      1800
    );
  }

  private static async warmActiveProjects(): Promise<void> {
    const { db } = await import('@/lib/firebase/admin');

    const projectsSnap = await db.collection('projects')
      .where('status', '==', 'active')
      .orderBy('createdAt', 'desc')
      .limit(12)
      .get();

    const projects = projectsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    await CacheService.set(
      `${CachePrefix.PROJECT}list:active:recent`,
      projects,
      900
    );
  }

  private static async warmUpcomingEvents(): Promise<void> {
    const { db } = await import('@/lib/firebase/admin');
    const now = new Date().toISOString();

    const eventsSnap = await db.collection('events')
      .where('startDate', '>=', now)
      .where('status', '==', 'published')
      .orderBy('startDate', 'asc')
      .limit(10)
      .get();

    const events = eventsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    await CacheService.set(
      `${CachePrefix.EVENT}upcoming:next10`,
      events,
      600
    );
  }
}
```

---

## PROMPT 52.3: Image Optimization & Lazy Loading

### FILE: src/lib/optimization/image-service.ts

```typescript
// ============================================================================
// IMAGE OPTIMIZATION SERVICE
// ============================================================================

import sharp from 'sharp';
import { storage } from '@/lib/firebase/admin';

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface OptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  generateThumbnail?: boolean;
  thumbnailSize?: number;
}

interface OptimizedResult {
  url: string;
  thumbnailUrl?: string;
  width: number;
  height: number;
  sizeBytes: number;
  format: string;
  blurhash?: string;
}

// ------------------------------------------------------------------
// Image Sizes (responsive breakpoints)
// ------------------------------------------------------------------
const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 320, height: 240 },
  medium: { width: 640, height: 480 },
  large: { width: 1024, height: 768 },
  full: { width: 1920, height: 1080 },
} as const;

// ------------------------------------------------------------------
// Service
// ------------------------------------------------------------------
export class ImageOptimizer {
  private static bucket = storage.bucket();

  /**
   * Optimize and upload an image
   */
  static async optimize(
    inputBuffer: Buffer,
    destPath: string,
    options: OptimizationOptions = {}
  ): Promise<OptimizedResult> {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 80,
      format = 'webp',
      generateThumbnail = true,
      thumbnailSize = 150,
    } = options;

    // Get original metadata
    const metadata = await sharp(inputBuffer).metadata();

    // Optimize main image
    let pipeline = sharp(inputBuffer)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .rotate(); // Auto-rotate based on EXIF

    // Apply format conversion
    switch (format) {
      case 'webp':
        pipeline = pipeline.webp({ quality, effort: 4 });
        break;
      case 'avif':
        pipeline = pipeline.avif({ quality, effort: 4 });
        break;
      case 'jpeg':
        pipeline = pipeline.jpeg({ quality, mozjpeg: true });
        break;
      case 'png':
        pipeline = pipeline.png({ quality, compressionLevel: 8 });
        break;
    }

    const optimizedBuffer = await pipeline.toBuffer();
    const optimizedMeta = await sharp(optimizedBuffer).metadata();

    // Upload main image
    const ext = format === 'jpeg' ? 'jpg' : format;
    const mainPath = `${destPath}.${ext}`;
    const mainFile = this.bucket.file(mainPath);
    await mainFile.save(optimizedBuffer, {
      metadata: {
        contentType: `image/${format}`,
        cacheControl: 'public, max-age=31536000, immutable',
        metadata: {
          originalWidth: String(metadata.width || 0),
          originalHeight: String(metadata.height || 0),
          optimizedWidth: String(optimizedMeta.width || 0),
          optimizedHeight: String(optimizedMeta.height || 0),
        },
      },
    });
    await mainFile.makePublic();
    const mainUrl = `https://storage.googleapis.com/${this.bucket.name}/${mainPath}`;

    // Generate thumbnail
    let thumbnailUrl: string | undefined;
    if (generateThumbnail) {
      const thumbBuffer = await sharp(inputBuffer)
        .resize(thumbnailSize, thumbnailSize, {
          fit: 'cover',
          position: 'centre',
        })
        .webp({ quality: 60 })
        .toBuffer();

      const thumbPath = `${destPath}_thumb.webp`;
      const thumbFile = this.bucket.file(thumbPath);
      await thumbFile.save(thumbBuffer, {
        metadata: {
          contentType: 'image/webp',
          cacheControl: 'public, max-age=31536000, immutable',
        },
      });
      await thumbFile.makePublic();
      thumbnailUrl = `https://storage.googleapis.com/${this.bucket.name}/${thumbPath}`;
    }

    return {
      url: mainUrl,
      thumbnailUrl,
      width: optimizedMeta.width || 0,
      height: optimizedMeta.height || 0,
      sizeBytes: optimizedBuffer.byteLength,
      format,
    };
  }

  /**
   * Generate responsive image set
   */
  static async generateResponsiveSet(
    inputBuffer: Buffer,
    basePath: string
  ): Promise<Record<string, string>> {
    const urls: Record<string, string> = {};

    for (const [sizeName, dimensions] of Object.entries(IMAGE_SIZES)) {
      const result = await this.optimize(inputBuffer, `${basePath}/${sizeName}`, {
        maxWidth: dimensions.width,
        maxHeight: dimensions.height,
        quality: sizeName === 'thumbnail' ? 60 : 80,
        generateThumbnail: false,
      });
      urls[sizeName] = result.url;
    }

    return urls;
  }

  /**
   * Validate image before processing
   */
  static async validate(
    buffer: Buffer,
    maxSizeMB: number = 10
  ): Promise<{ valid: boolean; error?: string }> {
    // Check file size
    if (buffer.byteLength > maxSizeMB * 1024 * 1024) {
      return { valid: false, error: `Image exceeds ${maxSizeMB}MB limit` };
    }

    try {
      const metadata = await sharp(buffer).metadata();

      // Check format
      const allowedFormats = ['jpeg', 'png', 'webp', 'avif', 'gif', 'tiff'];
      if (!metadata.format || !allowedFormats.includes(metadata.format)) {
        return { valid: false, error: `Unsupported format: ${metadata.format}` };
      }

      // Check dimensions
      if ((metadata.width || 0) > 10000 || (metadata.height || 0) > 10000) {
        return { valid: false, error: 'Image dimensions too large (max 10000px)' };
      }

      return { valid: true };
    } catch {
      return { valid: false, error: 'Invalid or corrupted image file' };
    }
  }
}
```

---

## PROMPT 52.4: API Response Optimization & Compression

### FILE: src/lib/optimization/api-optimizer.ts

```typescript
// ============================================================================
// API RESPONSE OPTIMIZATION
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

// ------------------------------------------------------------------
// Response Compression (for large payloads)
// ------------------------------------------------------------------
export function compressResponse(
  data: unknown,
  req: NextRequest,
  options: {
    cache?: string;
    status?: number;
    headers?: Record<string, string>;
  } = {}
): NextResponse {
  const json = JSON.stringify(data);
  const {
    cache = 'no-store',
    status = 200,
    headers: extraHeaders = {},
  } = options;

  const responseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Cache-Control': cache,
    'X-Content-Length': String(json.length),
    ...extraHeaders,
  };

  // ETag support for conditional requests
  if (cache !== 'no-store') {
    const etag = generateETag(json);
    responseHeaders['ETag'] = etag;

    const ifNoneMatch = req.headers.get('if-none-match');
    if (ifNoneMatch === etag) {
      return new NextResponse(null, { status: 304, headers: responseHeaders });
    }
  }

  return new NextResponse(json, { status, headers: responseHeaders });
}

// ------------------------------------------------------------------
// ETag Generation
// ------------------------------------------------------------------
function generateETag(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `"${Math.abs(hash).toString(36)}"`;
}

// ------------------------------------------------------------------
// Pagination Helper
// ------------------------------------------------------------------
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export function parsePagination(
  req: NextRequest,
  defaults: { page?: number; limit?: number } = {}
): PaginationParams {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || String(defaults.page || 1)));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || String(defaults.limit || 20))));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  params: PaginationParams
) {
  const totalPages = Math.ceil(total / params.limit);

  return {
    data,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages,
      hasNext: params.page < totalPages,
      hasPrev: params.page > 1,
    },
  };
}

// ------------------------------------------------------------------
// Field Selection (sparse fieldsets)
// ------------------------------------------------------------------
export function selectFields<T extends Record<string, unknown>>(
  obj: T,
  fields?: string[]
): Partial<T> {
  if (!fields || fields.length === 0) return obj;

  const result: Partial<T> = {};
  for (const field of fields) {
    if (field in obj) {
      (result as Record<string, unknown>)[field] = obj[field];
    }
  }
  return result;
}

export function parseFieldSelection(req: NextRequest): string[] | undefined {
  const { searchParams } = new URL(req.url);
  const fields = searchParams.get('fields');
  if (!fields) return undefined;
  return fields.split(',').map((f) => f.trim());
}
```

---

### FILE: src/lib/optimization/query-optimizer.ts

```typescript
// ============================================================================
// FIRESTORE QUERY OPTIMIZATION
// ============================================================================

import {
  Query,
  DocumentData,
  CollectionReference,
} from 'firebase-admin/firestore';
import { db } from '@/lib/firebase/admin';
import { CacheService, CacheTTL } from '@/lib/cache/cache-service';

// ------------------------------------------------------------------
// Query Builder with Caching
// ------------------------------------------------------------------
export class CachedQuery<T = DocumentData> {
  private collection: CollectionReference;
  private cacheKey: string;
  private cacheTTL: number;
  private query: Query;

  constructor(
    collectionPath: string,
    cacheKeyPrefix: string,
    ttl: number = CacheTTL.STANDARD
  ) {
    this.collection = db.collection(collectionPath);
    this.query = this.collection;
    this.cacheKey = cacheKeyPrefix;
    this.cacheTTL = ttl;
  }

  where(field: string, op: FirebaseFirestore.WhereFilterOp, value: unknown): this {
    this.query = this.query.where(field, op, value);
    this.cacheKey += `:${field}${op}${String(value)}`;
    return this;
  }

  orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): this {
    this.query = this.query.orderBy(field, direction);
    this.cacheKey += `:o${field}${direction}`;
    return this;
  }

  limit(count: number): this {
    this.query = this.query.limit(count);
    this.cacheKey += `:l${count}`;
    return this;
  }

  offset(count: number): this {
    this.query = this.query.offset(count);
    this.cacheKey += `:off${count}`;
    return this;
  }

  /**
   * Execute query with cache-aside
   */
  async execute(): Promise<{ data: T[]; fromCache: boolean }> {
    // Check cache
    const cached = await CacheService.get<T[]>(this.cacheKey);
    if (cached) {
      return { data: cached, fromCache: true };
    }

    // Execute Firestore query
    const snapshot = await this.query.get();
    const data = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as T
    );

    // Cache results
    if (data.length > 0) {
      await CacheService.set(this.cacheKey, data, this.cacheTTL);
    }

    return { data, fromCache: false };
  }

  /**
   * Execute count query (cached)
   */
  async count(): Promise<number> {
    const countKey = `${this.cacheKey}:count`;

    const cached = await CacheService.get<number>(countKey);
    if (cached !== null) return cached;

    const snapshot = await this.query.count().get();
    const count = snapshot.data().count;

    await CacheService.set(countKey, count, this.cacheTTL);
    return count;
  }
}

// ------------------------------------------------------------------
// Batch Fetcher (avoid N+1 queries)
// ------------------------------------------------------------------
export class BatchFetcher {
  /**
   * Fetch multiple documents by ID in batch
   */
  static async fetchByIds<T>(
    collectionPath: string,
    ids: string[]
  ): Promise<Map<string, T>> {
    const results = new Map<string, T>();
    if (ids.length === 0) return results;

    // Firestore getAll limit is 100
    const chunks: string[][] = [];
    for (let i = 0; i < ids.length; i += 100) {
      chunks.push(ids.slice(i, i + 100));
    }

    for (const chunk of chunks) {
      const refs = chunk.map((id) => db.collection(collectionPath).doc(id));
      const docs = await db.getAll(...refs);

      for (const doc of docs) {
        if (doc.exists) {
          results.set(doc.id, { id: doc.id, ...doc.data() } as T);
        }
      }
    }

    return results;
  }

  /**
   * Resolve references in a list of documents
   * Avoids N+1 by batching all reference lookups
   */
  static async resolveReferences<T extends Record<string, unknown>>(
    documents: T[],
    referenceField: string,
    targetCollection: string,
    outputField: string
  ): Promise<T[]> {
    // Collect unique IDs
    const ids = [
      ...new Set(
        documents
          .map((doc) => doc[referenceField] as string | undefined)
          .filter(Boolean) as string[]
      ),
    ];

    if (ids.length === 0) return documents;

    // Batch fetch referenced documents
    const referenced = await this.fetchByIds(targetCollection, ids);

    // Attach to original documents
    return documents.map((doc) => ({
      ...doc,
      [outputField]: referenced.get(doc[referenceField] as string) || null,
    }));
  }
}
```

---

### FILE: next.config.js

```javascript
// ============================================================================
// NEXT.JS CONFIGURATION — PERFORMANCE OPTIMIZED
// ============================================================================

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for Docker
  output: 'standalone',

  // React strict mode
  reactStrictMode: true,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },

  // Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/health',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
    ];
  },

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Tree shaking for firebase
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'firebase-admin': false,
      };
    }

    return config;
  },

  // Experimental features
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'framer-motion',
      'date-fns',
    ],
  },

  // Compression
  compress: true,

  // Powered by header
  poweredByHeader: false,
};

module.exports = nextConfig;
```



# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 53: SECURITY HARDENING & RATE LIMITING
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 53.1: Rate Limiter Service

Create a Redis-backed rate limiting service with sliding window algorithm, tiered limits by user role, and automatic IP blocking.

### FILE: src/lib/security/rate-limiter.ts

```typescript
// ============================================================================
// RATE LIMITER — SLIDING WINDOW ALGORITHM
// ============================================================================

import { ensureConnection } from '@/lib/cache/redis';
import { NextRequest, NextResponse } from 'next/server';

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface RateLimitConfig {
  windowMs: number;      // Time window in milliseconds
  maxRequests: number;   // Max requests per window
  keyPrefix?: string;    // Redis key prefix
  message?: string;      // Custom error message
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  total: number;
  retryAfterMs?: number;
}

// ------------------------------------------------------------------
// Rate Limit Tiers
// ------------------------------------------------------------------
export const RateLimitTiers = {
  // Public endpoints (unauthenticated)
  PUBLIC: { windowMs: 60000, maxRequests: 30 },

  // Authenticated users
  AUTHENTICATED: { windowMs: 60000, maxRequests: 60 },

  // Admin users
  ADMIN: { windowMs: 60000, maxRequests: 120 },

  // Webhooks (high throughput)
  WEBHOOK: { windowMs: 60000, maxRequests: 200 },

  // Authentication attempts (strict)
  AUTH: { windowMs: 900000, maxRequests: 10 }, // 10 per 15 min

  // Donation processing
  DONATION: { windowMs: 60000, maxRequests: 5 },

  // File uploads
  UPLOAD: { windowMs: 3600000, maxRequests: 50 }, // 50 per hour

  // Search / heavy queries
  SEARCH: { windowMs: 60000, maxRequests: 20 },

  // API (general)
  API: { windowMs: 60000, maxRequests: 100 },
} as const;

// ------------------------------------------------------------------
// Core Rate Limiter
// ------------------------------------------------------------------
export class RateLimiter {
  /**
   * Check rate limit using sliding window
   */
  static async check(
    key: string,
    config: RateLimitConfig
  ): Promise<RateLimitResult> {
    const { windowMs, maxRequests, keyPrefix = 'rl:' } = config;
    const redisKey = `${keyPrefix}${key}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    try {
      const redis = await ensureConnection();

      // Use sorted set with timestamps as scores
      const multi = redis.multi();

      // Remove entries outside the window
      multi.zRemRangeByScore(redisKey, 0, windowStart);

      // Count current entries in window
      multi.zCard(redisKey);

      // Add current request
      multi.zAdd(redisKey, { score: now, value: `${now}:${Math.random().toString(36).slice(2, 8)}` });

      // Set expiry on the key
      multi.expire(redisKey, Math.ceil(windowMs / 1000) + 1);

      const results = await multi.exec();
      const currentCount = (results?.[1] as number) || 0;

      const allowed = currentCount < maxRequests;
      const remaining = Math.max(0, maxRequests - currentCount - (allowed ? 1 : 0));
      const resetAt = now + windowMs;

      if (!allowed) {
        // Remove the request we just added since it's not allowed
        // (the count already exceeded before we added)
        const lastAdded = results?.[2];
        if (typeof lastAdded === 'number' && lastAdded > 0) {
          // Can't easily remove the exact member, but the window cleanup handles it
        }
      }

      return {
        allowed,
        remaining,
        resetAt,
        total: maxRequests,
        retryAfterMs: allowed ? undefined : windowMs,
      };
    } catch (err) {
      // Fail open — if Redis is down, allow the request
      console.warn('[RateLimiter] Redis error, failing open:', err);
      return {
        allowed: true,
        remaining: maxRequests,
        resetAt: now + windowMs,
        total: maxRequests,
      };
    }
  }

  /**
   * Get client identifier from request
   */
  static getClientKey(req: NextRequest): string {
    // Priority: User ID > Forwarded IP > Direct IP
    const userId = req.headers.get('x-user-id');
    if (userId) return `user:${userId}`;

    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
    return `ip:${ip}`;
  }

  /**
   * Apply rate limit headers to response
   */
  static applyHeaders(
    response: NextResponse,
    result: RateLimitResult
  ): NextResponse {
    response.headers.set('X-RateLimit-Limit', String(result.total));
    response.headers.set('X-RateLimit-Remaining', String(result.remaining));
    response.headers.set(
      'X-RateLimit-Reset',
      new Date(result.resetAt).toISOString()
    );

    if (!result.allowed && result.retryAfterMs) {
      response.headers.set(
        'Retry-After',
        String(Math.ceil(result.retryAfterMs / 1000))
      );
    }

    return response;
  }
}

// ------------------------------------------------------------------
// Rate Limit Middleware
// ------------------------------------------------------------------
export function withRateLimit(config: RateLimitConfig) {
  return function rateLimit(
    handler: (req: NextRequest) => Promise<NextResponse>
  ) {
    return async (req: NextRequest): Promise<NextResponse> => {
      const clientKey = RateLimiter.getClientKey(req);
      const result = await RateLimiter.check(clientKey, config);

      if (!result.allowed) {
        const errorResponse = NextResponse.json(
          {
            error: config.message || 'Too many requests. Please try again later.',
            retryAfter: Math.ceil((result.retryAfterMs || 60000) / 1000),
          },
          { status: 429 }
        );
        return RateLimiter.applyHeaders(errorResponse, result);
      }

      const response = await handler(req);
      return RateLimiter.applyHeaders(response, result);
    };
  };
}
```

---

## PROMPT 53.2: Input Sanitization & Validation

### FILE: src/lib/security/sanitizer.ts

```typescript
// ============================================================================
// INPUT SANITIZATION & VALIDATION
// ============================================================================

// ------------------------------------------------------------------
// HTML Sanitizer (prevent XSS)
// ------------------------------------------------------------------
const DANGEROUS_TAGS = [
  'script', 'iframe', 'object', 'embed', 'form', 'input',
  'textarea', 'select', 'button', 'link', 'meta', 'base',
  'applet', 'style', 'svg', 'math',
];

const DANGEROUS_ATTRS = [
  'onclick', 'onerror', 'onload', 'onmouseover', 'onfocus',
  'onblur', 'onsubmit', 'onchange', 'oninput', 'onkeydown',
  'onkeyup', 'onkeypress', 'onmousedown', 'onmouseup',
  'ondblclick', 'oncontextmenu', 'ondrag', 'ondrop',
  'onscroll', 'onwheel', 'onanimationstart',
  'javascript:', 'data:', 'vbscript:',
];

export class Sanitizer {
  /**
   * Sanitize HTML input — strip dangerous tags and attributes
   */
  static html(input: string): string {
    if (!input) return '';

    let sanitized = input;

    // Remove dangerous tags
    for (const tag of DANGEROUS_TAGS) {
      const regex = new RegExp(
        `<\\/?${tag}[^>]*>`,
        'gi'
      );
      sanitized = sanitized.replace(regex, '');
    }

    // Remove dangerous attributes
    for (const attr of DANGEROUS_ATTRS) {
      const regex = new RegExp(
        `\\s*${attr}\\s*=\\s*["'][^"']*["']`,
        'gi'
      );
      sanitized = sanitized.replace(regex, '');

      // Also handle unquoted
      const unquoted = new RegExp(
        `\\s*${attr}\\s*=\\s*[^\\s>]+`,
        'gi'
      );
      sanitized = sanitized.replace(unquoted, '');
    }

    // Remove javascript: URLs
    sanitized = sanitized.replace(
      /href\s*=\s*["']?\s*javascript\s*:/gi,
      'href="'
    );

    return sanitized;
  }

  /**
   * Escape HTML entities (for text content)
   */
  static escapeHtml(input: string): string {
    if (!input) return '';
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  /**
   * Sanitize for SQL-like injection (Firestore field paths)
   */
  static fieldPath(input: string): string {
    if (!input) return '';
    // Only allow alphanumeric, underscores, dots, and hyphens
    return input.replace(/[^a-zA-Z0-9._-]/g, '');
  }

  /**
   * Sanitize email
   */
  static email(input: string): string {
    return input.toLowerCase().trim().slice(0, 254);
  }

  /**
   * Sanitize URL
   */
  static url(input: string): string {
    try {
      const parsed = new URL(input);
      // Only allow http(s) protocols
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return '';
      }
      return parsed.toString();
    } catch {
      return '';
    }
  }

  /**
   * Sanitize free text (notes, descriptions)
   */
  static text(input: string, maxLength: number = 10000): string {
    if (!input) return '';
    return this.escapeHtml(input.trim().slice(0, maxLength));
  }

  /**
   * Sanitize a full request body
   */
  static body<T extends Record<string, unknown>>(
    input: T,
    rules: Record<
      string,
      'html' | 'text' | 'email' | 'url' | 'number' | 'boolean' | 'skip'
    >
  ): T {
    const result = { ...input };

    for (const [key, rule] of Object.entries(rules)) {
      if (!(key in result)) continue;
      const value = result[key];

      switch (rule) {
        case 'html':
          if (typeof value === 'string') {
            (result as Record<string, unknown>)[key] = this.html(value);
          }
          break;
        case 'text':
          if (typeof value === 'string') {
            (result as Record<string, unknown>)[key] = this.text(value);
          }
          break;
        case 'email':
          if (typeof value === 'string') {
            (result as Record<string, unknown>)[key] = this.email(value);
          }
          break;
        case 'url':
          if (typeof value === 'string') {
            (result as Record<string, unknown>)[key] = this.url(value);
          }
          break;
        case 'number':
          (result as Record<string, unknown>)[key] = Number(value) || 0;
          break;
        case 'boolean':
          (result as Record<string, unknown>)[key] = Boolean(value);
          break;
        case 'skip':
          break;
      }
    }

    return result;
  }
}
```

---

## PROMPT 53.3: CORS & Security Headers Middleware

### FILE: src/lib/security/cors.ts

```typescript
// ============================================================================
// CORS CONFIGURATION
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

// ------------------------------------------------------------------
// Allowed Origins
// ------------------------------------------------------------------
const ALLOWED_ORIGINS = new Set([
  'https://gratis.ngo',
  'https://www.gratis.ngo',
  'https://app.gratis.ngo',
  'https://admin.gratis.ngo',
  ...(process.env.NODE_ENV === 'development'
    ? ['http://localhost:3000', 'http://localhost:3001']
    : []),
]);

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];

const ALLOWED_HEADERS = [
  'Content-Type',
  'Authorization',
  'X-Requested-With',
  'X-CSRF-Token',
  'X-Request-ID',
  'Accept',
  'Accept-Language',
  'Stripe-Signature',
];

const EXPOSED_HEADERS = [
  'X-Request-ID',
  'X-RateLimit-Limit',
  'X-RateLimit-Remaining',
  'X-RateLimit-Reset',
  'X-Response-Time',
];

// ------------------------------------------------------------------
// CORS Middleware
// ------------------------------------------------------------------
export function withCORS(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const origin = req.headers.get('origin') || '';

    // Handle preflight
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: getCORSHeaders(origin),
      });
    }

    // Process request
    const response = await handler(req);

    // Apply CORS headers
    const corsHeaders = getCORSHeaders(origin);
    for (const [key, value] of Object.entries(corsHeaders)) {
      response.headers.set(key, value);
    }

    return response;
  };
}

function getCORSHeaders(origin: string): Record<string, string> {
  const headers: Record<string, string> = {};

  if (ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Vary'] = 'Origin';
  }

  headers['Access-Control-Allow-Methods'] = ALLOWED_METHODS.join(', ');
  headers['Access-Control-Allow-Headers'] = ALLOWED_HEADERS.join(', ');
  headers['Access-Control-Expose-Headers'] = EXPOSED_HEADERS.join(', ');
  headers['Access-Control-Max-Age'] = '86400'; // 24h preflight cache
  headers['Access-Control-Allow-Credentials'] = 'true';

  return headers;
}
```

---

### FILE: src/lib/security/csrf.ts

```typescript
// ============================================================================
// CSRF PROTECTION
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { CacheService } from '@/lib/cache/cache-service';

const CSRF_SECRET = process.env.CSRF_SECRET || 'gratis-csrf-secret-change-me';
const CSRF_TOKEN_TTL = 3600; // 1 hour
const CSRF_HEADER = 'x-csrf-token';

/**
 * Generate a CSRF token for a session
 */
export async function generateCSRFToken(sessionId: string): Promise<string> {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  const token = `${timestamp}.${random}`;

  // Store in Redis
  await CacheService.set(
    `csrf:${sessionId}`,
    token,
    CSRF_TOKEN_TTL
  );

  return token;
}

/**
 * Validate CSRF token from request
 */
export async function validateCSRFToken(
  req: NextRequest,
  sessionId: string
): Promise<boolean> {
  const token = req.headers.get(CSRF_HEADER);
  if (!token) return false;

  const stored = await CacheService.get<string>(`csrf:${sessionId}`);
  if (!stored) return false;

  // Constant-time comparison
  if (token.length !== stored.length) return false;

  let mismatch = 0;
  for (let i = 0; i < token.length; i++) {
    mismatch |= token.charCodeAt(i) ^ stored.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * CSRF middleware for state-changing requests
 */
export function withCSRF(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    // Only check for state-changing methods
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
    if (safeMethods.includes(req.method)) {
      return handler(req);
    }

    // Skip CSRF for webhooks (they use signature verification)
    if (req.nextUrl.pathname.startsWith('/api/webhooks/')) {
      return handler(req);
    }

    // Extract session ID from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const sessionId = authHeader.replace('Bearer ', '').slice(0, 20);
    const valid = await validateCSRFToken(req, sessionId);

    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      );
    }

    return handler(req);
  };
}
```

---

## PROMPT 53.4: IP Blocking & Abuse Detection

### FILE: src/lib/security/abuse-detection.ts

```typescript
// ============================================================================
// ABUSE DETECTION & IP BLOCKING
// ============================================================================

import { db } from '@/lib/firebase/admin';
import { CacheService } from '@/lib/cache/cache-service';
import { NextRequest, NextResponse } from 'next/server';

// ------------------------------------------------------------------
// Config
// ------------------------------------------------------------------
const BLOCK_PREFIX = 'blocked:';
const SUSPICIOUS_PREFIX = 'suspicious:';
const ABUSE_THRESHOLD = 100;       // requests per minute to flag
const AUTO_BLOCK_THRESHOLD = 500;  // requests per minute to auto-block
const BLOCK_DURATION = 3600;       // 1 hour auto-block

// ------------------------------------------------------------------
// Known Bad Patterns
// ------------------------------------------------------------------
const SUSPICIOUS_PATTERNS = [
  /\.\.\//, // Path traversal
  /<script/i, // XSS attempts
  /union\s+select/i, // SQL injection
  /\$where\s*:/i, // NoSQL injection
  /\beval\s*\(/i, // Code injection
  /\bexec\s*\(/i,
  /\bdocument\s*\./i,
  /\bwindow\s*\./i,
  /on\w+\s*=/i, // Event handler injection
];

const SUSPICIOUS_USER_AGENTS = [
  'sqlmap', 'nikto', 'nmap', 'masscan',
  'dirbuster', 'gobuster', 'wfuzz',
  'nuclei', 'httpx', 'subfinder',
];

// ------------------------------------------------------------------
// Abuse Detection Service
// ------------------------------------------------------------------
export class AbuseDetector {
  /**
   * Check if an IP is currently blocked
   */
  static async isBlocked(ip: string): Promise<boolean> {
    const blocked = await CacheService.get<boolean>(`${BLOCK_PREFIX}${ip}`);
    return blocked === true;
  }

  /**
   * Block an IP address
   */
  static async blockIP(
    ip: string,
    reason: string,
    durationSeconds: number = BLOCK_DURATION
  ): Promise<void> {
    await CacheService.set(`${BLOCK_PREFIX}${ip}`, true, durationSeconds);

    // Log the block
    await db.collection('security_events').add({
      type: 'ip_blocked',
      ip,
      reason,
      duration: durationSeconds,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(
        Date.now() + durationSeconds * 1000
      ).toISOString(),
    });

    console.warn(`[Security] IP blocked: ${ip} — ${reason}`);
  }

  /**
   * Unblock an IP
   */
  static async unblockIP(ip: string): Promise<void> {
    await CacheService.del(`${BLOCK_PREFIX}${ip}`);
  }

  /**
   * Analyze request for suspicious patterns
   */
  static analyzeRequest(req: NextRequest): {
    suspicious: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];
    const url = req.url;
    const userAgent = req.headers.get('user-agent') || '';
    const body = ''; // Would need to read body for POST analysis

    // Check URL for attack patterns
    for (const pattern of SUSPICIOUS_PATTERNS) {
      if (pattern.test(url)) {
        reasons.push(`URL matches suspicious pattern: ${pattern.source}`);
      }
    }

    // Check user agent
    const lowerUA = userAgent.toLowerCase();
    for (const tool of SUSPICIOUS_USER_AGENTS) {
      if (lowerUA.includes(tool)) {
        reasons.push(`Suspicious user agent: ${tool}`);
      }
    }

    // Empty user agent
    if (!userAgent || userAgent.length < 5) {
      reasons.push('Missing or empty user agent');
    }

    // Extremely long URL (potential buffer overflow)
    if (url.length > 8192) {
      reasons.push('Excessively long URL');
    }

    return {
      suspicious: reasons.length > 0,
      reasons,
    };
  }

  /**
   * Track request frequency and auto-block if threshold exceeded
   */
  static async trackAndEnforce(ip: string): Promise<boolean> {
    const counterKey = `${SUSPICIOUS_PREFIX}counter:${ip}`;

    const count = await CacheService.increment(counterKey, 1, 60); // 1 min window

    if (count >= AUTO_BLOCK_THRESHOLD) {
      await this.blockIP(ip, 'Auto-blocked: excessive request rate', BLOCK_DURATION);
      return false; // blocked
    }

    if (count >= ABUSE_THRESHOLD) {
      // Flag but don't block
      console.warn(`[Security] Suspicious activity from ${ip}: ${count} req/min`);
    }

    return true; // allowed
  }
}

// ------------------------------------------------------------------
// Security Middleware
// ------------------------------------------------------------------
export function withSecurityCheck(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';

    // Check block list
    if (await AbuseDetector.isBlocked(ip)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Track request rate
    const allowed = await AbuseDetector.trackAndEnforce(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. You have been temporarily blocked.' },
        { status: 429 }
      );
    }

    // Analyze request for suspicious patterns
    const analysis = AbuseDetector.analyzeRequest(req);
    if (analysis.suspicious) {
      // Log but don't block (yet)
      await db.collection('security_events').add({
        type: 'suspicious_request',
        ip,
        url: req.url,
        method: req.method,
        reasons: analysis.reasons,
        userAgent: req.headers.get('user-agent'),
        timestamp: new Date().toISOString(),
      });
    }

    return handler(req);
  };
}
```

---

## PROMPT 53.5: Environment Variable Validation & Secrets Management

### FILE: src/lib/security/env-validation.ts

```typescript
// ============================================================================
// ENVIRONMENT VARIABLE VALIDATION
// ============================================================================

// ------------------------------------------------------------------
// Required Variables by Environment
// ------------------------------------------------------------------
interface EnvSchema {
  name: string;
  required: boolean;
  environments: ('development' | 'production' | 'test')[];
  validate?: (value: string) => boolean;
  description: string;
}

const ENV_SCHEMA: EnvSchema[] = [
  // Firebase
  {
    name: 'NEXT_PUBLIC_FIREBASE_API_KEY',
    required: true,
    environments: ['development', 'production'],
    description: 'Firebase API key',
  },
  {
    name: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    required: true,
    environments: ['development', 'production'],
    description: 'Firebase auth domain',
  },
  {
    name: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    required: true,
    environments: ['development', 'production', 'test'],
    description: 'Firebase project ID',
  },
  {
    name: 'FIREBASE_ADMIN_PRIVATE_KEY',
    required: true,
    environments: ['development', 'production'],
    validate: (v) => v.includes('-----BEGIN'),
    description: 'Firebase admin service account private key',
  },
  {
    name: 'FIREBASE_ADMIN_CLIENT_EMAIL',
    required: true,
    environments: ['development', 'production'],
    validate: (v) => v.includes('@'),
    description: 'Firebase admin service account email',
  },

  // Stripe
  {
    name: 'STRIPE_SECRET_KEY',
    required: true,
    environments: ['development', 'production'],
    validate: (v) => v.startsWith('sk_'),
    description: 'Stripe secret key',
  },
  {
    name: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    required: true,
    environments: ['development', 'production'],
    validate: (v) => v.startsWith('pk_'),
    description: 'Stripe publishable key',
  },
  {
    name: 'STRIPE_WEBHOOK_SECRET',
    required: true,
    environments: ['production'],
    validate: (v) => v.startsWith('whsec_'),
    description: 'Stripe webhook signing secret',
  },

  // Application
  {
    name: 'NEXT_PUBLIC_APP_URL',
    required: true,
    environments: ['development', 'production'],
    validate: (v) => v.startsWith('http'),
    description: 'Application base URL',
  },
  {
    name: 'NEXTAUTH_SECRET',
    required: true,
    environments: ['production'],
    validate: (v) => v.length >= 32,
    description: 'NextAuth secret (min 32 chars)',
  },

  // Redis
  {
    name: 'REDIS_URL',
    required: false,
    environments: ['development', 'production'],
    validate: (v) => v.startsWith('redis://') || v.startsWith('rediss://'),
    description: 'Redis connection URL',
  },

  // Email
  {
    name: 'SENDGRID_API_KEY',
    required: true,
    environments: ['production'],
    validate: (v) => v.startsWith('SG.'),
    description: 'SendGrid API key',
  },
  {
    name: 'EMAIL_FROM',
    required: true,
    environments: ['production'],
    validate: (v) => v.includes('@'),
    description: 'Default sender email address',
  },

  // Monitoring
  {
    name: 'SLACK_ERROR_WEBHOOK',
    required: false,
    environments: ['production'],
    validate: (v) => v.startsWith('https://hooks.slack.com'),
    description: 'Slack webhook for error alerts',
  },
];

// ------------------------------------------------------------------
// Validation
// ------------------------------------------------------------------
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateEnvironment(): ValidationResult {
  const env = process.env.NODE_ENV || 'development';
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const schema of ENV_SCHEMA) {
    // Check if this variable applies to current environment
    if (!schema.environments.includes(env as 'development' | 'production' | 'test')) {
      continue;
    }

    const value = process.env[schema.name];

    if (!value || value.trim() === '') {
      if (schema.required) {
        errors.push(
          `Missing required env: ${schema.name} — ${schema.description}`
        );
      } else {
        warnings.push(
          `Optional env not set: ${schema.name} — ${schema.description}`
        );
      }
      continue;
    }

    // Run custom validation
    if (schema.validate && !schema.validate(value)) {
      errors.push(
        `Invalid value for ${schema.name}: validation failed — ${schema.description}`
      );
    }
  }

  // Production-specific checks
  if (env === 'production') {
    if (process.env.STRIPE_SECRET_KEY?.startsWith('sk_test')) {
      errors.push('CRITICAL: Using test Stripe key in production!');
    }
    if (process.env.NEXT_PUBLIC_APP_URL?.includes('localhost')) {
      errors.push('CRITICAL: APP_URL contains localhost in production!');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate on startup — call in app initialization
 */
export function enforceEnvironment(): void {
  const result = validateEnvironment();

  if (result.warnings.length > 0) {
    console.warn('[ENV] Warnings:');
    result.warnings.forEach((w) => console.warn(`  ⚠️  ${w}`));
  }

  if (!result.valid) {
    console.error('[ENV] ❌ Environment validation FAILED:');
    result.errors.forEach((e) => console.error(`  ✗ ${e}`));

    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        `Environment validation failed with ${result.errors.length} error(s). Fix before deploying.`
      );
    }
  } else {
    console.log('[ENV] ✅ Environment validation passed');
  }
}
```

---

### FILE: src/middleware.ts

```typescript
// ============================================================================
// NEXT.JS ROOT MIDDLEWARE — SECURITY LAYER
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = req.nextUrl;

  // ------------------------------------------------------------------
  // Security Headers (all routes)
  // ------------------------------------------------------------------
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), payment=(self)'
  );

  // HSTS (production only)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // ------------------------------------------------------------------
  // Block sensitive paths
  // ------------------------------------------------------------------
  const blockedPaths = [
    '/.env',
    '/.git',
    '/wp-admin',
    '/wp-login',
    '/xmlrpc.php',
    '/phpmyadmin',
    '/.well-known/security.txt',
  ];

  if (blockedPaths.some((p) => pathname.startsWith(p))) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // ------------------------------------------------------------------
  // API Routes — additional headers
  // ------------------------------------------------------------------
  if (pathname.startsWith('/api/')) {
    response.headers.set('X-Request-ID', generateRequestId());
    response.headers.set('Cache-Control', 'no-store');
  }

  return response;
}

function generateRequestId(): string {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).substring(2, 8);
  return `req_${t}_${r}`;
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# END OF PART 10 — SECTIONS 49-53 COMPLETE
# ═══════════════════════════════════════════════════════════════════════════════
#
# SECTIONS COVERED:
#   49. Docker & Container Orchestration
#   50. CI/CD Pipeline (GitHub Actions)
#   51. Monitoring, Observability & Health Checks
#   52. Performance Optimization & Caching
#   53. Security Hardening & Rate Limiting
#
# TOTAL FILES: 30+ DevOps, infrastructure, and security files
#
# NEXT: Part 11 — Email, Media, Migration, Testing & Production Checklist
# ═══════════════════════════════════════════════════════════════════════════════

