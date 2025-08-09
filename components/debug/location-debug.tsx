"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LocationData {
  id: number;
  name: string;
  locationType: string;
  createdAt: string;
  updatedAt: string;
}

export function LocationDebug() {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching locations from Location table...");
      
      const { data, error } = await supabase
        .from("Location")
        .select("*")
        .order("locationType", { ascending: true })
        .order("name", { ascending: true });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Raw data from Supabase:", data);
      setLocations(data || []);
      
    } catch (err: any) {
      console.error("Error fetching locations:", err);
      setError(err.message || "Failed to fetch locations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const groupedLocations = locations.reduce((acc, location) => {
    const type = location.locationType;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(location);
    return acc;
  }, {} as Record<string, LocationData[]>);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Location Debug Tool
          <Button onClick={fetchLocations} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
            <h3 className="font-semibold text-red-800">Error:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <h3 className="font-semibold text-blue-800">Summary:</h3>
            <p className="text-blue-700">
              Total locations: {locations.length}
            </p>
            <p className="text-blue-700">
              Location types: {Object.keys(groupedLocations).length}
            </p>
          </div>

          {Object.keys(groupedLocations).length === 0 && !loading && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
              <h3 className="font-semibold text-yellow-800">No Locations Found!</h3>
              <p className="text-yellow-700">
                The Location table appears to be empty. You need to run the population script.
              </p>
              <div className="mt-2 p-2 bg-gray-100 rounded text-sm font-mono">
                Run this in your Supabase SQL editor:<br/>
                <code>schema/populate-locations.sql</code>
              </div>
            </div>
          )}

          {Object.entries(groupedLocations).map(([type, locs]) => (
            <div key={type} className="border rounded p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Badge variant="outline">{type}</Badge>
                ({locs.length} locations)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {locs.map((location) => (
                  <div
                    key={location.id}
                    className="p-2 bg-gray-50 rounded text-sm"
                  >
                    <div className="font-medium">{location.name}</div>
                    <div className="text-gray-500 text-xs">ID: {location.id}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">Raw Data (JSON):</h3>
          <pre className="text-xs overflow-auto max-h-40 bg-white p-2 rounded border">
            {JSON.stringify(locations, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
