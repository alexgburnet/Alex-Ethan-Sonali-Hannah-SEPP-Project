set -e  # Exit on error

docker-compose down -v

docker compose up --build -V 