# AGA Survey Database Setup

This document provides instructions for setting up and working with the PostgreSQL database for the AGA Health Foundation survey application.

## Prerequisites

- PostgreSQL installed and running locally (version 12 or higher)
- Node.js (version 18 or higher)
- npm (version 8 or higher)

## Database Configuration

The application is configured to connect to a PostgreSQL database with the following default settings:

- Host: `localhost`
- Port: `5432`
- Database name: `aga_survey`
- Username: `postgres`
- Password: `postgres`

You can modify these settings in the `.env` file if needed.

## Setting Up the Database

### Method 1: Using the Setup Scripts

For convenience, we've provided scripts to set up the database:

#### For Windows:

```powershell
# Run as administrator
./scripts/init-db.ps1
```

#### For macOS/Linux:

```bash
# Make the script executable first
chmod +x ./scripts/init-db.sh

# Run the script
./scripts/init-db.sh
```

These scripts will:

1. Check if PostgreSQL is running
2. Create the `aga_survey` database if it doesn't exist
3. Run Prisma migrations to create the schema
4. Seed the database with initial data
5. Optionally start Prisma Studio

### Method 2: Manual Setup

If you prefer to set up the database manually, follow these steps:

1. **Create the database**:

```sql
CREATE DATABASE aga_survey;
```

2. **Generate Prisma client**:

```bash
npm run prisma:generate
```

3. **Create database schema**:

```bash
npm run prisma:migrate
```

4. **Seed the database with initial data**:

```bash
npm run db:seed
```

## Database Schema

The database schema uses Prisma ORM and includes the following main models:

- `SurveySubmission`: Core survey data
- `Location`: Hospital locations (departments, wards, etc.)
- `Rating`: Consolidated ratings for all location types
- `GeneralObservation`: Overall observations about the facility
- `DepartmentConcern`: Specific concerns about departments/locations

### Location Types

The system includes the following location types:

- `department`: Standard departments like OPD, Pharmacy, etc. and regular Occupational Health services
- `ward`: Hospital wards like Female's Ward, ICU, etc.
- `canteen`: Canteen services
- `occupational_health`: Specifically for Medicals (Occupational Health) services

### Special Note on Occupational Health

The system has two different Occupational Health entries:

1. `Occupational Health` (type = department) - Used for General Practice
2. `Occupational Health Unit (Medicals)` (type = occupational_health) - Used for Medicals (Occupational Health)

## Prisma Tools

We've added several npm scripts to work with Prisma:

- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run migrations in development
- `npm run prisma:deploy` - Run migrations in production
- `npm run prisma:studio` - Open Prisma Studio to view/edit data
- `npm run db:seed` - Seed the database with initial data

## Using Prisma Studio

Prisma Studio provides a visual interface to view and modify your database:

```bash
npm run prisma:studio
```

This will open a web interface at http://localhost:5555 where you can browse and edit the database.

## Working with Prisma in the Application

The database client is set up in `lib/db.ts` and can be imported in server components or API routes:

```typescript
import { prisma } from "@/lib/db";

// Example query
const surveys = await prisma.surveySubmission.findMany({
  include: {
    generalObservations: true,
    ratings: true,
  },
});
```

## Troubleshooting

### Connection Issues

If you're having trouble connecting to the database:

1. Ensure PostgreSQL is running
2. Check your `.env` file for correct credentials
3. Make sure your PostgreSQL user has the right permissions

### Migration Issues

If you encounter problems with migrations:

1. Reset the database: `npx prisma migrate reset`
2. Re-run migrations: `npx prisma migrate dev`

### Resetting Everything

To completely reset the database:

```bash
# Drop and recreate the database
psql -h localhost -p 5432 -U postgres -c "DROP DATABASE IF EXISTS aga_survey;"
psql -h localhost -p 5432 -U postgres -c "CREATE DATABASE aga_survey;"

# Re-run migrations and seed
npm run prisma:migrate
npm run db:seed
```
