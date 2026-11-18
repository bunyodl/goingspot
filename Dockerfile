# Stage 1: Build the Application
# Slim is enough: argon2 ships glibc prebuilds, so the full image is unused weight.
FROM node:26.13.1-slim AS build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker caching.
# If these files don't change, subsequent builds can skip the install.
COPY package*.json ./
COPY tsconfig.json ./

# Install the lockfile exactly. npm ci fails if package.json and the lock disagree.
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build TypeScript
RUN npm run build || npx tsc

# Stage 2: Create the Final Production Image
FROM node:26.13.1-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy only production dependencies
COPY --from=build /usr/src/app/package*.json ./
RUN npm ci --omit=dev

# Copy the built application files from the 'build' stage
COPY --from=build /usr/src/app/dist ./dist

# Expose the port your app runs on
ENV PORT=3000
EXPOSE $PORT

# Run the application using the non-root user (recommended for security)
USER node

# Define the command to start your application
CMD [ "node", "dist/index.js" ]
