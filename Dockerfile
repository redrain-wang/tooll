# Build stage
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM python:3.11-alpine

# Install nodejs, npm, supervisor for nginx
RUN apk add --no-cache nodejs npm supervisor nginx

# Copy frontend build
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Python translation service
COPY --from=build /app/server_py /app/server_py
WORKDIR /app/server_py
RUN pip install --no-cache-dir -r requirements.txt

# Copy nginx config
COPY nginx.conf /etc/nginx/http.d/default.conf

# Copy supervisord config
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 80
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]