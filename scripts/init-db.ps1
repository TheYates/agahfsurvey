# PowerShell script to initialize database

# Check if PostgreSQL is installed and running
try {
    Write-Host "Checking PostgreSQL status..."
    $pgIsReady = & psql -h localhost -p 5432 -U postgres -c "SELECT 1" 2>$null
    if (-not $?) {
        Write-Host "Error: PostgreSQL is not running or credentials are invalid. Please start PostgreSQL first." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error: PostgreSQL command-line tools not found. Please install PostgreSQL." -ForegroundColor Red
    exit 1
}

# Check if database exists
Write-Host "Checking if database exists..."
$dbExists = & psql -h localhost -p 5432 -U postgres -t -c "SELECT 1 FROM pg_database WHERE datname='aga_survey'" 2>$null

if ($dbExists -notmatch "1") {
    Write-Host "Creating database 'aga_survey'..."
    & psql -h localhost -p 5432 -U postgres -c "CREATE DATABASE aga_survey;"
    
    if (-not $?) {
        Write-Host "Error: Failed to create database." -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Database 'aga_survey' created successfully." -ForegroundColor Green
} else {
    Write-Host "Database 'aga_survey' already exists." -ForegroundColor Yellow
}

# Create database schema with Prisma
Write-Host "Running Prisma migrations..." -ForegroundColor Cyan
& npx prisma migrate dev --name init

# Seed the database
Write-Host "Seeding the database with initial data..." -ForegroundColor Cyan
& npx prisma db seed

# Start Prisma Studio (optional)
$startStudio = Read-Host "Would you like to start Prisma Studio? (y/n)"

if ($startStudio -eq "y" -or $startStudio -eq "Y") {
    Write-Host "Starting Prisma Studio..." -ForegroundColor Cyan
    & npx prisma studio
}

Write-Host "Database initialization completed!" -ForegroundColor Green 