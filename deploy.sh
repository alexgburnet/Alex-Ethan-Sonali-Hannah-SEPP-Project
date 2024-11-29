set -e  # Exit on error

cd Frontend

npm install

echo "Stopping existing frontend service..."
pm2 stop frontend || echo "No frontend service to stop."

echo "Starting frontend service..."
pm2 start "npm run dev" --name frontend

echo "Deployment complete."