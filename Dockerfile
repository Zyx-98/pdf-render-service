# Base stage for development
FROM node:20.18-alpine AS development

# RUN apt-get update && \
#     apt-get install -y --no-install-recommends \
#     curl \
#     libreoffice \
#     libreoffice-java-common \
#     default-jre \
#     vim \
#     && rm -rf /var/lib/apt/lists/*

RUN apk add --no-cache \
    curl \
    libreoffice \
    openjdk11 \
    && rm -rf /var/cache/apk/*

COPY assets/fonts/. /usr/share/fonts/truetype/libreoffice/    

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV PORT=3000

EXPOSE ${PORT}

CMD ["npm", "run", "dev"]

# Production stage
FROM node:20.18-alpine AS production

ENV NODE_ENV=production


RUN apk add --no-cache \
    curl \
    libreoffice \
    openjdk11 \
    && rm -rf /var/cache/apk/*

COPY assets/fonts/. /usr/share/fonts/truetype/libreoffice/    

WORKDIR /app

RUN groupadd -g 10001 usergroup && \
    useradd -u 10000 -g usergroup appuser && \
    mkdir -p /home/appuser/.cache && \
    chown -R appuser:usergroup /home/appuser && \
    chmod 700 /home/appuser/.cache && \
    chown -R appuser:usergroup /usr/share/fonts/truetype/

COPY --from=development /app/package*.json ./
COPY --from=development /app/dist ./dist
COPY storage/template/. /app/template/

RUN npm ci --only=production

RUN chown -R appuser:usergroup /app

USER appuser

ENV PORT=3000

EXPOSE ${PORT}

ENTRYPOINT ["node", "dist/bundle.js"]