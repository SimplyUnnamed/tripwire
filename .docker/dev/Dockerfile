# FROM php:7.2.34-fpm-alpine3.12 as build

# RUN apk update \
#     && apk add --no-cache libpng-dev zeromq-dev git \
#     $PHPIZE_DEPS \
#     && docker-php-ext-install gd && docker-php-ext-install pdo_mysql && docker-php-ext-install mysqli \
#     && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin \
#     --filename=composer && hash -r

# #RUN mkdir /app
# #COPY ./ /app

# FROM trafex/alpine-nginx-php7:ba1dd422
# RUN apk update && apk add --no-cache busybox-suid sudo shadow gettext bash apache2-utils

# RUN apk update && apk add --no-cache --repository=http://dl-cdn.alpinelinux.org/alpine/v3.9/community/ \
#     php7-xml php7-session php7-bcmath php7-dba php7-gd php7-intl php7-mbstring php7-mysqli php7-pdo php7-pdo_mysql php7-soap php7-pecl-apcu php7-pecl-imagick

# COPY nginx.conf /etc/nginx/templateNginx.conf
# RUN mkdir -p /etc/nginx/sites_enabled/
# COPY site.conf /etc/nginx/templateSite.conf

# COPY php-fpm.conf /etc/php7/php-fpm.d/zzz_custom.conf
# COPY php.ini /etc/zzz_custom.ini

# COPY crontab.txt /var/crontab.txt

# COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# COPY entrypoint.sh /

# RUN chmod +x /entrypoint.sh

# WORKDIR /var/www/html
# #COPY --chown=nobody --from=build /app tripwire
# RUN chmod 755 tripwire/public
# RUN chmod 755 tripwire/cache

# WORKDIR /var/www/html
# EXPOSE 80

# ENTRYPOINT ["/entrypoint.sh"]
# CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

FROM php:7.2.34-fpm-alpine3.12 as build

RUN apk update \
    && apk add --no-cache libpng-dev zeromq-dev git \
    $PHPIZE_DEPS \
    && docker-php-ext-install gd && docker-php-ext-install pdo_mysql && docker-php-ext-install mysqli \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin \
    --filename=composer && hash -r

RUN mkdir /app
COPY ./ /app

FROM trafex/alpine-nginx-php7:ba1dd422
RUN apk update && apk add --no-cache busybox-suid sudo shadow gettext bash apache2-utils

RUN apk update && apk add --no-cache --repository=http://dl-cdn.alpinelinux.org/alpine/v3.9/community/ \
    php7-xml php7-session php7-bcmath php7-dba php7-gd php7-intl php7-mbstring php7-mysqli php7-pdo php7-pdo_mysql php7-soap php7-pecl-apcu php7-pecl-imagick

COPY nginx.conf /etc/nginx/templateNginx.conf
RUN mkdir -p /etc/nginx/sites_enabled/
COPY site.conf /etc/nginx/templateSite.conf

COPY php-fpm.conf /etc/php7/php-fpm.d/zzz_custom.conf
COPY /php.ini /etc/zzz_custom.ini

COPY crontab.txt /var/crontab.txt

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

COPY entrypoint.sh /

RUN chmod +x /entrypoint.sh

WORKDIR /var/www/html/tripwire
# COPY --chown=nobody --from=build /app tripwire
# RUN chmod 755 public
# RUN chmod 755 cache

WORKDIR /var/www/html
EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]