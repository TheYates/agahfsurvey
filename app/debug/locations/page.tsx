import { LocationDebug } from "@/components/debug/location-debug";

export default function LocationDebugPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Location Debug Tool</h1>
        <p className="text-muted-foreground mt-2">
          Use this tool to check what locations are in your database and troubleshoot the survey location loading issues.
        </p>
      </div>
      
      <LocationDebug />
      
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-800 mb-3">Instructions:</h2>
        <ol className="list-decimal list-inside space-y-2 text-blue-700">
          <li>Check if locations are showing above</li>
          <li>If no locations are found, run the population script in Supabase SQL editor:</li>
          <li className="ml-4">
            <code className="bg-white px-2 py-1 rounded text-sm">
              schema/populate-locations.sql
            </code>
          </li>
          <li>After running the script, click "Refresh" to see the locations</li>
          <li>Once locations are populated, the survey forms should work properly</li>
        </ol>
      </div>
    </div>
  );
}
