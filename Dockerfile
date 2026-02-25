FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm config set fetch-retry-mintimeout 100000
RUN pnpm config set fetch-retry-maxtimeout 600000
RUN pnpm install

# Expose port
EXPOSE 5173

# Start dev server
CMD ["pnpm", "dev", "--host"]


