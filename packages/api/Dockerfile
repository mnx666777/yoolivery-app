FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY packages/api/package*.json ./
COPY packages/db/package*.json ../db/
COPY packages/db/ ../db/
COPY packages/api/tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY packages/api/src ./src

# Generate Prisma client
RUN cd ../db && npm run prisma:generate

# Build the application
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
