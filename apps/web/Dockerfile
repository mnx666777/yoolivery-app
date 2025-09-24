FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY apps/web/package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY apps/web/src ./src
COPY apps/web/public ./public
COPY apps/web/next.config.ts ./
COPY apps/web/tailwind.config.ts ./
COPY apps/web/postcss.config.mjs ./
COPY apps/web/tsconfig.json ./

# Build the application
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
