# Stop any running containers
Write-Host "Stopping any running containers..." -ForegroundColor Cyan
docker-compose down

# Build and run the container
Write-Host "Building and starting the container..." -ForegroundColor Cyan
docker-compose up -d --build

# Check if container is running
Write-Host "Checking container status..." -ForegroundColor Cyan
docker-compose ps

Write-Host "Container is up and running. Access at http://localhost:3000" -ForegroundColor Green
