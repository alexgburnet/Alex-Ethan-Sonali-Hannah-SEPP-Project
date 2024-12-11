set -e  # Exit on error

sudo docker-compose down -v

sudo docker compose up --build -V 