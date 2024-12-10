FROM postgres:latest

# Copy SQL scripts for initialization
COPY init.sql /docker-entrypoint-initdb.d/

# Expose PostgreSQL port
EXPOSE 5432