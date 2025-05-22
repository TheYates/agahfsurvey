-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "surveys";

-- CreateEnum
CREATE TYPE "surveys"."VisitTime" AS ENUM ('LESS_THAN_MONTH', 'ONE_TWO_MONTHS', 'THREE_SIX_MONTHS', 'MORE_THAN_SIX_MONTHS');

-- CreateEnum
CREATE TYPE "surveys"."VisitPurpose" AS ENUM ('GENERAL_PRACTICE', 'OCCUPATIONAL_HEALTH');

-- CreateEnum
CREATE TYPE "surveys"."UserType" AS ENUM ('AGAG_EMPLOYEE', 'AGAG_CONTRACTOR_DEPENDANT', 'OTHER_CORPORATE_EMPLOYEE', 'CONTRACTOR_EMPLOYEE');

-- CreateEnum
CREATE TYPE "surveys"."PatientType" AS ENUM ('NEW_PATIENT', 'RETURNING_PATIENT');

-- CreateTable
CREATE TABLE "surveys"."SurveySubmission" (
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
CREATE TABLE "surveys"."Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "locationType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surveys"."SubmissionLocation" (
    "id" SERIAL NOT NULL,
    "submissionId" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubmissionLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surveys"."Rating" (
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
CREATE TABLE "surveys"."GeneralObservation" (
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
CREATE TABLE "surveys"."DepartmentConcern" (
    "id" SERIAL NOT NULL,
    "submissionId" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,
    "concern" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DepartmentConcern_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surveys"."ServicePoints" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "show_recommend_question" BOOLEAN NOT NULL DEFAULT true,
    "show_comments_box" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServicePoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surveys"."ServicePointFeedback" (
    "id" SERIAL NOT NULL,
    "service_point_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "recommend" BOOLEAN,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServicePointFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_name_key" ON "surveys"."Location"("name");

-- CreateIndex
CREATE INDEX "Location_name_idx" ON "surveys"."Location"("name");

-- CreateIndex
CREATE INDEX "SubmissionLocation_submissionId_idx" ON "surveys"."SubmissionLocation"("submissionId");

-- CreateIndex
CREATE INDEX "SubmissionLocation_locationId_idx" ON "surveys"."SubmissionLocation"("locationId");

-- CreateIndex
CREATE INDEX "Rating_submissionId_idx" ON "surveys"."Rating"("submissionId");

-- CreateIndex
CREATE INDEX "Rating_locationId_idx" ON "surveys"."Rating"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "GeneralObservation_submissionId_key" ON "surveys"."GeneralObservation"("submissionId");

-- CreateIndex
CREATE INDEX "GeneralObservation_submissionId_idx" ON "surveys"."GeneralObservation"("submissionId");

-- CreateIndex
CREATE INDEX "DepartmentConcern_submissionId_idx" ON "surveys"."DepartmentConcern"("submissionId");

-- CreateIndex
CREATE INDEX "DepartmentConcern_locationId_idx" ON "surveys"."DepartmentConcern"("locationId");

-- CreateIndex
CREATE INDEX "ServicePointFeedback_service_point_id_idx" ON "surveys"."ServicePointFeedback"("service_point_id");

-- AddForeignKey
ALTER TABLE "surveys"."SubmissionLocation" ADD CONSTRAINT "SubmissionLocation_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "surveys"."SurveySubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surveys"."SubmissionLocation" ADD CONSTRAINT "SubmissionLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "surveys"."Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surveys"."Rating" ADD CONSTRAINT "Rating_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "surveys"."SurveySubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surveys"."Rating" ADD CONSTRAINT "Rating_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "surveys"."Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surveys"."GeneralObservation" ADD CONSTRAINT "GeneralObservation_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "surveys"."SurveySubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surveys"."DepartmentConcern" ADD CONSTRAINT "DepartmentConcern_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "surveys"."SurveySubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surveys"."DepartmentConcern" ADD CONSTRAINT "DepartmentConcern_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "surveys"."Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surveys"."ServicePointFeedback" ADD CONSTRAINT "ServicePointFeedback_service_point_id_fkey" FOREIGN KEY ("service_point_id") REFERENCES "surveys"."ServicePoints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

