import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function ThankYouPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto text-center">
        <div className="flex justify-center mb-4">
          <Image
            src="/agahflogo svg.svg"
            alt="AGA Health Foundation Logo"
            width={180}
            height={180}
          />
        </div>

        <h1 className="text-2xl font-bold text-primary mb-2">Thank You!</h1>

        <p className="mb-6 text-muted-foreground">
          We appreciate your feedback.
          <br />
          Your input helps us improve our services
          <br />
          for everyone.
        </p>

        <div className="mt-10 text-sm text-muted-foreground">
          <p>Service with Integrity, Professionalism, and Accountability</p>
        </div>
      </div>
    </main>
  );
}
