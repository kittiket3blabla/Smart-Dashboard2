FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*

# Копируем всё содержимое public прямо в /usr/share/nginx/html/
COPY public/ /usr/share/nginx/html/
# Копируем папку src прямо в /usr/share/nginx/html/src
COPY src/ /usr/share/nginx/html/src/
COPY nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]