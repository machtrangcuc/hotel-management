# Stage 1: Build React + Vite
FROM registry.access.redhat.com/ubi9/nodejs-22:latest AS builder
USER 0
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Build voi /api (cung domain qua Nginx proxy -> khong bi loi CORS, khong phu thuoc hostname moi truong)
ARG VITE_API_BASE_URL=/api
ARG VITE_ALLOW_PUBLIC_REGISTER=false
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_ALLOW_PUBLIC_REGISTER=${VITE_ALLOW_PUBLIC_REGISTER}
RUN npm run build
# Stage 2: Serve bang Red Hat UBI9 Nginx (non-root, port 8080)
FROM registry.access.redhat.com/ubi9/nginx-124:latest
USER 0
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /build/dist/ /opt/app-root/src/
RUN chgrp -R 0 /opt/app-root/src /etc/nginx/nginx.conf && \
    chmod -R g=u /opt/app-root/src && \
    chmod 644 /etc/nginx/nginx.conf
USER 1001
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
