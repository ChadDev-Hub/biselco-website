FROM postgis/postgis:18-3.6

RUN apt-get update && \
    apt-get install -y postgresql-18-cron && \
    rm -rf /var/lib/apt/lists/*


# FROM postgis/postgis:17-3.4

# RUN apt-get update && \
#     apt-get install -y postgresql-17-cron && \
#     rm -rf /var/lib/apt/lists/*
# FROM postgis/postgis:17-3.4

# RUN sed -i 's|http://apt.postgresql.org|https://apt.postgresql.org|g' \
#     /etc/apt/sources.list.d/pgdg.list && \
#     apt-get update && \
#     apt-get install -y postgresql-17-cron && \
#     rm -rf /var/lib/apt/lists/*