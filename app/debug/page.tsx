"use client";

import { useState, useEffect } from "react";

type Diagnostics = {
  database_url: string;
  direct_url: string;
  node_env: string;
  prisma_models: string[];
  service_points_count: number;
  survey_count: number;
  error: string | null;
  loading: boolean;
};

export default function DebugPage() {
  const [diagnostics, setDiagnostics] = useState<Diagnostics>({
    database_url: "",
    direct_url: "",
    node_env: "",
    prisma_models: [],
    service_points_count: 0,
    survey_count: 0,
    error: null,
    loading: true,
  });

  useEffect(() => {
    async function fetchDiagnostics() {
      try {
        const response = await fetch("/api/debug");
        const data = await response.json();
        setDiagnostics({ ...data, loading: false });
      } catch (err) {
        const error = err as Error;
        setDiagnostics({
          ...diagnostics,
          error: `Error fetching diagnostics: ${error.message}`,
          loading: false,
        });
      }
    }

    fetchDiagnostics();
  }, []);

  if (diagnostics.loading) {
    return <div className="p-8">Loading diagnostics...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Diagnostics</h1>

      <div className="mb-6 bg-slate-800 text-white p-4 rounded">
        <h2 className="text-xl font-bold mb-2">Environment</h2>
        <pre>
          {JSON.stringify(
            {
              database_url: diagnostics.database_url,
              direct_url: diagnostics.direct_url,
              node_env: diagnostics.node_env,
            },
            null,
            2
          )}
        </pre>
      </div>

      <div className="mb-6 bg-slate-800 text-white p-4 rounded">
        <h2 className="text-xl font-bold mb-2">Prisma Client</h2>
        <pre>
          {JSON.stringify(
            {
              models: diagnostics.prisma_models,
            },
            null,
            2
          )}
        </pre>
      </div>

      <div className="mb-6 bg-slate-800 text-white p-4 rounded">
        <h2 className="text-xl font-bold mb-2">Database Counts</h2>
        <pre>
          {JSON.stringify(
            {
              service_points_count: diagnostics.service_points_count,
              survey_count: diagnostics.survey_count,
            },
            null,
            2
          )}
        </pre>
      </div>

      {diagnostics.error && (
        <div className="mb-6 bg-red-100 text-red-800 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <pre>{diagnostics.error}</pre>
        </div>
      )}
    </div>
  );
}
