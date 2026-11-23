FROM registry.access.redhat.com/ubi9/nodejs-22:latest
USER 0
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
# Cap quyen group 0 de UID ngau nhien cua OpenShift (restricted-v2) ghi duoc /app/uploads
RUN mkdir -p /app/uploads/guest-docs && \
    chgrp -R 0 /app && \
    chmod -R g=u /app
USER 1001
EXPOSE 4000
CMD ["node", "index.js"]
