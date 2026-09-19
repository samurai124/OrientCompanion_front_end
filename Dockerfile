# -------------------------------------------------------------
# Stage 1: Build the React application with Vite
# -------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Build arguments with defaults for containerized reverse-proxy
ARG VITE_API_BASE_URL=/api
ARG VITE_GEMINI_API_KEY=""

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

# Cache dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build production assets
COPY . .
RUN npm run build

# -------------------------------------------------------------
# Stage 2: Production web server with Nginx
# -------------------------------------------------------------
FROM nginx:alpine

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
