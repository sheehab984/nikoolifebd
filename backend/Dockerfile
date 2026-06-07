FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache python3 make g++

FROM base AS deps
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/releases ./.yarn/releases
RUN yarn install

FROM deps AS builder
COPY . .
RUN yarn build

FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# Use the compiled server output as working directory.
# .medusa/server/ contains medusa-config.js (not .ts), so medusa start won't
# attempt to recompile with ts-node at runtime.
COPY --from=builder /app/.medusa/server ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 9000
CMD ["./node_modules/.bin/medusa", "start"]
