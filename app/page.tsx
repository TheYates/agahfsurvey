import SurveyForm from "@/components/survey-form";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getLocations } from "@/app/actions/survey-actions";
import { Settings } from "lucide-react";

export default async function Home() {
  // Fetch locations from the database
  const locations = await getLocations();

  return (
    <main className="min-h-screen p-2 md:p-2 ">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/agahflogo svg.svg"
              alt="AGA Health Foundation Logo"
              width={120}
              height={120}
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            AGA Health Foundation
          </h1>
          <p className="text-muted-foreground">Patient Satisfaction Survey</p>
        </div>
        <SurveyForm locations={locations} />
      </div>
    </main>
  );
}
