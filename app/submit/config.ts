// Configuration to ensure this page is always rendered at runtime and never pre-rendered during build
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";
