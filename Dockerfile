# Multi-stage Dockerfile for Club Run Production
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S clubrun -u 1001 -G nodejs

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm ci --only=production --ignore-scripts && \
    cd backend && npm ci --only=production --ignore-scripts && \
    cd ../frontend && npm ci --only=production --ignore-scripts

# Build stage for frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install dumb-init and security packages
RUN apk add --no-cache dumb-init curl

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S clubrun -u 1001 -G nodejs

# Set working directory
WORKDIR /app

# Copy built frontend
COPY --from=frontend-builder --chown=clubrun:nodejs /app/frontend/dist ./frontend/dist

# Copy backend files
COPY --from=base --chown=clubrun:nodejs /app/backend ./backend
COPY --chown=clubrun:nodejs backend/ ./

# Copy environment files
COPY backend/env.production.example .env

# Create necessary directories
RUN mkdir -p /app/logs /app/uploads && \
    chown -R clubrun:nodejs /app/logs /app/uploads

# Switch to non-root user
USER clubrun

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start the application with proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/simple-server.js"] 