# Service Points Feature

This feature allows healthcare facilities to collect quick feedback from patients at specific service points using QR codes.

## Setup

### Database Setup

1. Apply the migration script to set up the required tables:

```bash
# Run the migration script
psql -U your_username -d your_database -f schema/migrate.sql
```

Or manually run the SQL commands in `schema/migrate.sql` in your database management tool.

### Environment Variables

Make sure the following environment variables are properly configured:

```
NEXT_PUBLIC_APP_URL=https://yourdomain.com
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Features

### Service Point Management

- **Create Service Points**: Create new service points with name, location, and status
- **Edit Service Points**: Update existing service points
- **Delete Service Points**: Remove unused service points
- **QR Code Generation**: Generate QR codes that link directly to feedback forms

### Feedback Collection

- **Rating System**: 1-5 star rating with emoji indicators
- **Recommendation**: "Would you recommend" question
- **Comments**: Optional comments from patients
- **Mobile-Friendly**: Responsive design for patients using mobile devices

### Reporting and Analytics

- **Feedback Analytics**: View detailed analytics by service point
- **Filter by Date Range**: Filter feedback data by specific time periods
- **Export Data**: Export feedback data for further analysis

## How It Works

1. **Setup Service Points**:

   - Navigate to `/settings/service-points`
   - Create service points for different areas of your facility

2. **Generate QR Codes**:

   - Each service point has a unique QR code
   - Print and place these QR codes at the respective service points

3. **Patient Feedback**:

   - Patients scan QR code with their smartphone
   - They complete a quick feedback form
   - Data is immediately recorded in your system

4. **View Analytics**:
   - See feedback data in the reports section
   - Filter by service point, date range, etc.
   - Identify areas for improvement

## API Reference

### Service Point Actions

The following server actions are available:

- `fetchServicePoints()`: Get all service points
- `getServicePoint(id)`: Get a specific service point
- `createServicePoint(data)`: Create a new service point
- `updateServicePoint(id, data)`: Update a service point
- `deleteServicePoint(id)`: Delete a service point
- `submitServicePointFeedback(servicePointId, rating, comment?, recommend?)`: Submit feedback

## Troubleshooting

### QR Codes Not Working

- Ensure the `NEXT_PUBLIC_APP_URL` is correctly set
- Verify that the service point ID exists in the database
- Check that the QR code is properly generated and readable

### No Data in Reports

- Verify that feedback is being submitted correctly
- Check database connections and permissions
- Ensure the date filters aren't excluding your data

## Contributing

To extend or modify this feature:

1. Service point logic is in `app/actions/service-point-actions.ts`
2. Database queries are in `lib/supabase/service-point-queries.ts`
3. Components are in their respective folders

## License

This feature is part of the main application and is covered under the same license.
