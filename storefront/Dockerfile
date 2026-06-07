FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/releases ./.yarn/releases
RUN yarn install

FROM deps AS builder
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.nikoolife.co.uk
ARG NEXT_PUBLIC_BASE_URL=https://nikoolife.co.uk
ARG NEXT_PUBLIC_DEFAULT_REGION=gb
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=$NEXT_PUBLIC_MEDUSA_BACKEND_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_DEFAULT_REGION=$NEXT_PUBLIC_DEFAULT_REGION
COPY . .
RUN yarn build

FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 8000
ENV PORT=8000
CMD ["node", "server.js"]
