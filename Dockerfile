FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
RUN --mount=type=secret,id=API_URL \
  --mount=type=secret,id=AUTH_GOOGLE_ID \
  --mount=type=secret,id=AUTH_GOOGLE_SECRET \
  --mount=type=secret,id=AUTH_SECRET \
  --mount=type=secret,id=AUTH_TRUST_HOST \
  --mount=type=secret,id=MONGODB_URI \
  export AUTH_GOOGLE_ID=$(cat /run/secrets/AUTH_GOOGLE_ID) && \
  export API_URL=$(cat /run/secrets/API_URL) && \
  export AUTH_GOOGLE_SECRET=$(cat /run/secrets/AUTH_GOOGLE_SECRET) && \
  export AUTH_SECRET=$(cat /run/secrets/AUTH_SECRET) && \
  export AUTH_SECRET=$(cat /run/secrets/AUTH_TRUST_HOST) && \
  export AUTH_SECRET=$(cat /run/secrets/MONGODB_URI) && \
RUN npm run build
CMD npm run dev