FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.25-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/app-openshift-v3/browser /usr/share/nginx/html
COPY docker-entrypoint.d/40-env.sh /docker-entrypoint.d/40-env.sh

USER root
RUN sed -i 's/\r$//' /docker-entrypoint.d/40-env.sh \
  && chmod +x /docker-entrypoint.d/40-env.sh \
  && chmod -R g+rwX /usr/share/nginx/html
USER 101

EXPOSE 4200
