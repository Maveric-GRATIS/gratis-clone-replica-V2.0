# ============================================================================
# GRATIS.NGO — Vite React Production Dockerfile
# ============================================================================

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the Vite app
RUN npm run build

# Stage 2: Production - Serve with nginx
FROM nginx:alpine

# Install wget for healthcheck
RUN apk add --no-cache wget

# Create nginx config that listens on PORT env variable
RUN echo 'server { \n\
    listen ${PORT} default_server; \n\
    root /usr/share/nginx/html; \n\
    index index.html; \n\
    \n\
    gzip on; \n\
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; \n\
    \n\
    add_header X-Frame-Options "DENY" always; \n\
    add_header X-Content-Type-Options "nosniff" always; \n\
    \n\
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2)$ { \n\
    expires 1y; \n\
    add_header Cache-Control "public, immutable"; \n\
    } \n\
    \n\
    location / { \n\
    try_files $uri $uri/ /index.html; \n\
    } \n\
    \n\
    location /health { \n\
    return 200 "OK"; \n\
    add_header Content-Type text/plain; \n\
    } \n\
    }' > /etc/nginx/templates/default.conf.template

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Set PORT environment variable
ENV PORT=8080

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:${PORT}/health || exit 1

# Start nginx with environment variable substitution
CMD /bin/sh -c "envsubst '\$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
