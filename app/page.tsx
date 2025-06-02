import SurveyForm from "@/components/survey-form";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-2 text-center">
          <div className="flex justify-center">
            <Image
              src="/agahflogo white.svg"
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
        <SurveyForm />

        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AGA Health Foundation</p>
        </footer>
      </div>
    </main>
  );
}
