-- CreateEnum
CREATE TYPE "VisitTime" AS ENUM ('LESS_THAN_MONTH', 'ONE_TWO_MONTHS', 'THREE_SIX_MONTHS', 'MORE_THAN_SIX_MONTHS');

-- CreateEnum
CREATE TYPE "VisitPurpose" AS ENUM ('GENERAL_PRACTICE', 'OCCUPATIONAL_HEALTH');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('AGAG_EMPLOYEE', 'AGAG_CONTRACTOR_DEPENDANT', 'OTHER_CORPORATE_EMPLOYEE', 'CONTRACTOR_EMPLOYEE');

-- CreateEnum
CREATE TYPE "PatientType" AS ENUM ('NEW_PATIENT', 'RETURNING_PATIENT');

-- CreateTable
CREATE TABLE "SurveySubmission" (
    "id" TEXT NOT NULL,
    "visitTime" TEXT NOT NULL,
    "visitPurpose" TEXT NOT NULL,
    "visitedOtherPlaces" BOOLEAN NOT NULL DEFAULT false,
    "wouldRecommend" BOOLEAN,
    "whyNotRecommend" TEXT,
    "recommendation" TEXT,
    "userType" TEXT NOT NULL,
    "patientType" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SurveySubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "locationType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmissionLocation" (
    "id" SERIAL NOT NULL,
    "submissionId" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubmissionLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" SERIAL NOT NULL,
    "submissionId" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,
    "reception" TEXT,
    "professionalism" TEXT,
    "understanding" TEXT,
    "promptnessCare" TEXT,
    "promptnessFeedback" TEXT,
    "overall" TEXT,
    "admission" TEXT,
    "nurseProfessionalism" TEXT,
    "doctorProfessionalism" TEXT,
    "discharge" TEXT,
    "foodQuality" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneralObservation" (
    "id" SERIAL NOT NULL,
    "submissionId" TEXT NOT NULL,
    "cleanliness" TEXT,
    "facilities" TEXT,
    "security" TEXT,
    "overall" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GeneralObservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepartmentConcern" (
    "id" SERIAL NOT NULL,
    "submissionId" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,
    "concern" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DepartmentConcern_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_name_key" ON "Location"("name");

-- CreateIndex
CREATE INDEX "Location_name_idx" ON "Location"("name");

-- CreateIndex
CREATE INDEX "SubmissionLocation_submissionId_idx" ON "SubmissionLocation"("submissionId");

-- CreateIndex
CREATE INDEX "SubmissionLocation_locationId_idx" ON "SubmissionLocation"("locationId");

-- CreateIndex
CREATE INDEX "Rating_submissionId_idx" ON "Rating"("submissionId");

-- CreateIndex
CREATE INDEX "Rating_locationId_idx" ON "Rating"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "GeneralObservation_submissionId_key" ON "GeneralObservation"("submissionId");

-- CreateIndex
CREATE INDEX "GeneralObservation_submissionId_idx" ON "GeneralObservation"("submissionId");

-- CreateIndex
CREATE INDEX "DepartmentConcern_submissionId_idx" ON "DepartmentConcern"("submissionId");

-- CreateIndex
CREATE INDEX "DepartmentConcern_locationId_idx" ON "DepartmentConcern"("locationId");

-- AddForeignKey
ALTER TABLE "SubmissionLocation" ADD CONSTRAINT "SubmissionLocation_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "SurveySubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionLocation" ADD CONSTRAINT "SubmissionLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "SurveySubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralObservation" ADD CONSTRAINT "GeneralObservation_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "SurveySubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentConcern" ADD CONSTRAINT "DepartmentConcern_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "SurveySubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentConcern" ADD CONSTRAINT "DepartmentConcern_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;
