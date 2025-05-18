#!/bin/bash

# Check if PostgreSQL is running
echo "Checking PostgreSQL status..."
pg_isready -h localhost -p 5432

if [ $? -ne 0 ]; then
  echo "Error: PostgreSQL is not running. Please start PostgreSQL first."
  exit 1
fi

# Check if database exists
echo "Checking if database exists..."
psql -h localhost -p 5432 -U postgres -lqt | cut -d \| -f 1 | grep -qw aga_survey

if [ $? -ne 0 ]; then
  echo "Creating database 'aga_survey'..."
  psql -h localhost -p 5432 -U postgres -c "CREATE DATABASE aga_survey;"
  
  if [ $? -ne 0 ]; then
    echo "Error: Failed to create database."
    exit 1
  fi
  
  echo "Database 'aga_survey' created successfully."
else
  echo "Database 'aga_survey' already exists."
fi

# Create database schema with Prisma
echo "Running Prisma migrations..."
npx prisma migrate dev --name init

# Seed the database
echo "Seeding the database with initial data..."
npx prisma db seed

# Start Prisma Studio (optional)
echo "Would you like to start Prisma Studio? (y/n)"
read -r start_studio

if [[ $start_studio == "y" || $start_studio == "Y" ]]; then
  echo "Starting Prisma Studio..."
  npx prisma studio
fi

echo "Database initialization completed!" 