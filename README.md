# Hospital Survey Application

A survey application for hospital patient feedback and satisfaction tracking using Next.js and Supabase.

## Setup

### Prerequisites

- Node.js (v18 or later)
- npm or pnpm
- Supabase account

### Installation

1. Clone the repository and install dependencies:

```bash
git clone [repository-url]
cd hospitalsurvey
npm install
# or
pnpm install
```

2. Set up environment variables:

```bash
cp .env.example .env.local
```

3. Edit `.env.local` and add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### Supabase Setup

1. Create a new Supabase project at [https://app.supabase.io](https://app.supabase.io)

2. Get your API keys from the Supabase dashboard (Settings > API)

3. Create the database schema by running the migration file:

   - Go to the SQL Editor in your Supabase dashboard
   - Copy the contents of `schema/supabase-migration.sql`
   - Run the SQL commands to create all tables and relationships

4. Apply performance optimizations (optional but recommended):
   - Go to the SQL Editor in your Supabase dashboard
   - Copy the contents of `schema/performance-optimization-indexes.sql`
   - Run the SQL commands to add optimized indexes
   - See `schema/README-PERFORMANCE.md` for details on the optimizations

### Running the Application

```bash
npm run dev
# or
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses the following tables:

- **Location**: Hospital departments and locations
- **SurveySubmission**: Main survey submissions
- **SubmissionLocation**: Junction table for locations visited during a survey
- **DepartmentConcern**: Specific concerns about departments
- **Rating**: Detailed ratings for different aspects of service
- **GeneralObservation**: General observations about the facility

## Development

### Database Types

The Supabase database types are defined in `lib/supabase/database.types.ts`. If you make changes to the database schema, you'll need to update these types accordingly.

### Supabase Queries

Database queries are defined in `lib/supabase/queries.ts`. These functions use the Supabase client to fetch and manipulate data.

### Authentication

This application uses Supabase authentication. You can configure authentication methods in your Supabase dashboard.

## Deployment

1. Deploy to Vercel or your preferred hosting platform
2. Set the environment variables in your hosting platform dashboard

## License

[MIT](LICENSE)

## Performance Optimizations\n\nThe application includes several optimizations to improve performance:\n\n1. **Database Indexes**: Specialized indexes for common query patterns\n2. **Efficient Query Patterns**: Avoiding N+1 query problems\n3. **Data Limiting**: Only fetching necessary data\n4. **Client-side Caching**: Using sessionStorage to avoid redundant fetches\n5. **Parallel Data Loading**: Using Promise.all for concurrent data fetching\n\nFor details on the performance improvements and how to apply them, see schema/README-PERFORMANCE.md.\n
