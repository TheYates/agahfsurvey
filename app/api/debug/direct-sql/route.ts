import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Try to fetch using normal Prisma query
    const prismaResult = await prisma.servicePoint.findUnique({
      where: { id: 2 },
    });

    // Try to fetch using direct SQL
    const sqlResult = await prisma.$queryRaw`
      SELECT * FROM "surveys"."ServicePoints" WHERE id = 2
    `;

    // Try to fetch using a simpler SQL query without schema
    let simpleSqlResult = null;
    try {
      simpleSqlResult = await prisma.$queryRaw`
        SELECT * FROM "ServicePoints" WHERE id = 2
      `;
    } catch (err) {
      simpleSqlResult = {
        error: err instanceof Error ? err.message : String(err),
      };
    }

    // Get schema list
    let schemas = null;
    try {
      schemas = await prisma.$queryRaw`
        SELECT schema_name FROM information_schema.schemata
      `;
    } catch (err) {
      schemas = { error: err instanceof Error ? err.message : String(err) };
    }

    // Get all tables in the public schema
    let tables = null;
    try {
      tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'surveys'
      `;
    } catch (err) {
      tables = { error: err instanceof Error ? err.message : String(err) };
    }

    return NextResponse.json({
      connection: {
        database_url: process.env.DATABASE_URL?.replace(
          /:([^:@]+)@/,
          ":******@"
        ),
      },
      results: {
        prismaModel: prismaResult,
        directSql: sqlResult,
        simpleSql: simpleSqlResult,
        schemas: schemas,
        tables: tables,
      },
    });
  } catch (error) {
    console.error("Error in direct SQL debug:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : null,
      },
      { status: 500 }
    );
  }
}
