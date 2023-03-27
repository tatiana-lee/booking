FROM node:18.13.0-alpine as development

WORKDIR /app

ARG NODE_ENV=production

COPY tsconfig*.json ./
COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build


FROM node:18.13.0-alpine as production

WORKDIR /app

# Copy dependencies files
COPY package*.json ./

# Install runtime dependecies (without dev/test dependecies)
RUN npm ci --omit=dev

# Copy production build
COPY --from=development /app/dist/ ./dist/

# Expose application port
EXPOSE 3000

# Start application
CMD [ "node", "dist/main.js" ]