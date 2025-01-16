# Base stage for development
FROM node:20.18-alpine AS development

# Install dependencies
RUN apk add --no-cache \
    curl \
    libreoffice \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy fonts
COPY assets/fonts/. /usr/share/fonts/truetype/libreoffice/

# Set build arguments and environment variables
ARG PORT

ENV PORT=${PORT:-3000}

# Build the application
RUN npm run build

# Expose the application port
EXPOSE ${PORT}

# Command to run the application in development mode
CMD ["npm", "run", "dev"]

# Production stage
FROM node:20.18-alpine AS production

# Set environment variable for production
ENV NODE_ENV=production

# Install dependencies
RUN apk add --no-cache \
    curl \
    libreoffice \
    && rm -rf /var/cache/apk/*

# Copy fonts
COPY assets/fonts/. /usr/share/fonts/truetype/libreoffice/

# Set working directory
WORKDIR /app

# Create user and group for running the application
RUN addgroup -g 10001 usergroup && \
    adduser -u 10000 -G usergroup -D appuser && \
    mkdir -p /home/appuser/.cache && \
    chown -R appuser:usergroup /home/appuser && \
    chmod 700 /home/appuser/.cache && \
    chown -R appuser:usergroup /usr/share/fonts/truetype/

# Copy necessary files from the development stage
COPY --from=development /app/package*.json ./
COPY --from=development /app/dist ./dist
COPY storage/template/. /app/template/
COPY /libreoffice.sh ./

# Set build arguments and environment variables
ARG NUM_INSTANCES
ARG PORT

ENV NUM_INSTANCES=${NUM_INSTANCES:-1}
ENV PORT=${PORT:-3000}

# Make the script executable and run it
RUN chmod +x ./libreoffice.sh
RUN ./libreoffice.sh

# Change ownership of the necessary directories
RUN chown -R appuser:usergroup /tmp/libreoffice/ && \
    chown -R appuser:usergroup /app

# Install production dependencies
RUN npm ci --omit=dev

# Switch to the non-root user
USER appuser

# Expose the application port
EXPOSE ${PORT}

# Command to run the application in production mode
ENTRYPOINT ["node", "dist/bundle.js"]