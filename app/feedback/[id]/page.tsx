// Server Component
import { FeedbackForm } from "./feedback-form";

export default async function FeedbackPage({
  params,
}: {
  params: { id: string };
}) {
  // Await params before accessing its properties
  const { id } = await params;
  return <FeedbackForm id={id} />;
}
