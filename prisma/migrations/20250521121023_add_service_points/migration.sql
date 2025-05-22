-- CreateTable
CREATE TABLE "ServicePoints" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServicePoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicePointFeedback" (
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
CREATE INDEX "ServicePointFeedback_service_point_id_idx" ON "ServicePointFeedback"("service_point_id");

-- AddForeignKey
ALTER TABLE "ServicePointFeedback" ADD CONSTRAINT "ServicePointFeedback_service_point_id_fkey" FOREIGN KEY ("service_point_id") REFERENCES "ServicePoints"("id") ON DELETE CASCADE ON UPDATE CASCADE;
