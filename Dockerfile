# Use Node.js as the base image
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application with production configuration
RUN npm run build:prod

# Production stage
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy built artifacts from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Expose the port the app runs on
EXPOSE 4000

# Environment variables
ENV PORT=4000

# Command to run the application
CMD ["npm", "run", "serve:ssr:prod"]
