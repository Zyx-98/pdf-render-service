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
    && rm -rf /var/cache/apk/*

COPY assets/fonts/. /usr/share/fonts/truetype/libreoffice/    

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG NUM_INSTANCES

ENV NUM_INSTANCES=${NUM_INSTANCES:-1}

RUN chmod +x ./libreoffice.sh

RUN ./libreoffice.sh

RUN npm run build

ARG PORT

ENV PORT=${PORT:-3000}

EXPOSE ${PORT}

CMD ["npm", "run", "dev"]

# Production stage
FROM node:20.18-alpine AS production

ENV NODE_ENV=production


RUN apk add --no-cache \
    curl \
    libreoffice \
    && rm -rf /var/cache/apk/*

COPY assets/fonts/. /usr/share/fonts/truetype/libreoffice/    

WORKDIR /app

RUN addgroup -g 10001 usergroup && \
    adduser -u 10000 -G usergroup -D appuser && \
    mkdir -p /home/appuser/.cache && \
    chown -R appuser:usergroup /home/appuser && \
    chmod 700 /home/appuser/.cache && \
    chown -R appuser:usergroup /usr/share/fonts/truetype/

COPY --from=development /app/package*.json ./
COPY --from=development /app/dist ./dist
COPY storage/template/. /app/template/
COPY /libreoffice.sh ./

ARG NUM_INSTANCES

ENV NUM_INSTANCES=${NUM_INSTANCES:-1}

RUN chmod +x ./libreoffice.sh

RUN ./libreoffice.sh

RUN chown -R appuser:usergroup /tmp/libreoffice/

RUN npm ci --only=production

RUN chown -R appuser:usergroup /app

USER appuser

ARG PORT

RUN echo ${PORT}

ENV PORT=${PORT:-3000}

EXPOSE ${PORT}

ENTRYPOINT ["node", "dist/bundle.js"]