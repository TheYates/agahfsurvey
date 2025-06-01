// Server Component
import { FeedbackForm } from "./feedback-form";

export default async function FeedbackPage({
  params,
}: {
  params: { id: string };
}) {
  // Ensure params are properly awaited before accessing
  const id = params?.id;

  return <FeedbackForm id={id} />;
}
