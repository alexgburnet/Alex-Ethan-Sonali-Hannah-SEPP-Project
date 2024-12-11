set -e  # Exit on error

cd Frontend

npm run build

cd ..

sudo docker-compose down -v

sudo docker compose up --build -V 