FROM node:20-bookworm-slim AS deps

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/contracts/package.json packages/contracts/package.json

RUN npm ci

FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

# Next.js bakes `rewrites()` from next.config.js at build time. Railway passes
# service variables into `docker build` when matching ARG names exist here.
ARG API_ORIGIN=http://localhost:3001
ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ENV API_ORIGIN=$API_ORIGIN
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

RUN npm run build --workspace=packages/contracts \
  && npm run build --workspace=apps/web

FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web ./apps/web
COPY --from=builder /app/packages/contracts ./packages/contracts

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=apps/web", "--", "--hostname", "0.0.0.0"]
