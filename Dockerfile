FROM oven/bun:1.2.2

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy the rest of the application code
COPY . .

# Install dependencies with bun
RUN bun install

# Build the application
# RUN bun run build

# Expose the port the app runs on
EXPOSE 5000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=5000

# Start the application
CMD ["bun", "run", "dev"]