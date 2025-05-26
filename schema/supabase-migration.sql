-- Drop existing tables if they exist
DROP TABLE IF EXISTS "GeneralObservation" CASCADE;
DROP TABLE IF EXISTS "Rating" CASCADE;
DROP TABLE IF EXISTS "DepartmentConcern" CASCADE;
DROP TABLE IF EXISTS "SubmissionLocation" CASCADE;
DROP TABLE IF EXISTS "SurveySubmission" CASCADE;
DROP TABLE IF EXISTS "Location" CASCADE;

-- Create tables
CREATE TABLE IF NOT EXISTS "Location" (
	"id" SERIAL NOT NULL,
	"name" TEXT NOT NULL,
	"locationType" TEXT NOT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP NOT NULL,
	PRIMARY KEY ("id"),
	UNIQUE ("name")
);

CREATE TABLE IF NOT EXISTS "SurveySubmission" (
	"id" TEXT NOT NULL,
	"visitTime" TEXT NOT NULL,
	"visitPurpose" TEXT NOT NULL,
	"visitedOtherPlaces" BOOLEAN NOT NULL DEFAULT false,
	"wouldRecommend" BOOLEAN NULL DEFAULT NULL,
	"whyNotRecommend" TEXT NULL DEFAULT NULL,
	"recommendation" TEXT NULL DEFAULT NULL,
	"userType" TEXT NOT NULL,
	"patientType" TEXT NOT NULL,
	"submittedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "SubmissionLocation" (
	"id" SERIAL NOT NULL,
	"submissionId" TEXT NOT NULL,
	"locationId" INTEGER NOT NULL,
	"isPrimary" BOOLEAN NOT NULL DEFAULT false,
	"createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY ("id"),
	CONSTRAINT "SubmissionLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT "SubmissionLocation_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "SurveySubmission" ("id") ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "DepartmentConcern" (
	"id" SERIAL NOT NULL,
	"submissionId" TEXT NOT NULL,
	"locationId" INTEGER NOT NULL,
	"concern" TEXT NOT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY ("id"),
	CONSTRAINT "DepartmentConcern_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT "DepartmentConcern_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "SurveySubmission" ("id") ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Rating" (
	"id" SERIAL NOT NULL,
	"submissionId" TEXT NOT NULL,
	"locationId" INTEGER NOT NULL,
	"reception" TEXT NULL DEFAULT NULL,
	"professionalism" TEXT NULL DEFAULT NULL,
	"understanding" TEXT NULL DEFAULT NULL,
	"promptnessCare" TEXT NULL DEFAULT NULL,
	"promptnessFeedback" TEXT NULL DEFAULT NULL,
	"overall" TEXT NULL DEFAULT NULL,
	"admission" TEXT NULL DEFAULT NULL,
	"nurseProfessionalism" TEXT NULL DEFAULT NULL,
	"doctorProfessionalism" TEXT NULL DEFAULT NULL,
	"discharge" TEXT NULL DEFAULT NULL,
	"foodQuality" TEXT NULL DEFAULT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY ("id"),
	CONSTRAINT "Rating_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT "Rating_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "SurveySubmission" ("id") ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "GeneralObservation" (
	"id" SERIAL NOT NULL,
	"submissionId" TEXT NOT NULL,
	"cleanliness" TEXT NULL DEFAULT NULL,
	"facilities" TEXT NULL DEFAULT NULL,
	"security" TEXT NULL DEFAULT NULL,
	"overall" TEXT NULL DEFAULT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY ("id"),
	UNIQUE ("submissionId"),
	CONSTRAINT "GeneralObservation_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "SurveySubmission" ("id") ON UPDATE CASCADE ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "idx_submissionlocation_submissionid" ON "SubmissionLocation" ("submissionId");
CREATE INDEX IF NOT EXISTS "idx_submissionlocation_locationid" ON "SubmissionLocation" ("locationId");
CREATE INDEX IF NOT EXISTS "idx_departmentconcern_submissionid" ON "DepartmentConcern" ("submissionId");
CREATE INDEX IF NOT EXISTS "idx_departmentconcern_locationid" ON "DepartmentConcern" ("locationId");
CREATE INDEX IF NOT EXISTS "idx_rating_submissionid" ON "Rating" ("submissionId");
CREATE INDEX IF NOT EXISTS "idx_rating_locationid" ON "Rating" ("locationId");
CREATE INDEX IF NOT EXISTS "idx_generalobservation_submissionid" ON "GeneralObservation" ("submissionId");
CREATE INDEX IF NOT EXISTS "idx_location_name" ON "Location" ("name"); 