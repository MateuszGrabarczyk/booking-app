# frontend/Dockerfile.dev
FROM node:18-slim

WORKDIR /app
# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy your source
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
