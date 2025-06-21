# Development Stage
FROM node:22-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Build step if required
RUN npm run build:backend

EXPOSE 5000

CMD ["npm", "run", "dev:backend"]

# Production Stage
FROM node:22-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled files
COPY --from=development /usr/src/app/dist ./dist

# Copy other necessary runtime files if needed
# COPY .env ./

EXPOSE 5000

CMD ["npm", "run", "start:backend"]
