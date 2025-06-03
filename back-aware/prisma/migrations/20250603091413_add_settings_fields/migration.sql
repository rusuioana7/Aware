-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyDailyEmail" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notifyDailyPush" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notifyTopicAlertsEmail" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notifyTopicAlertsPush" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notifyWeeklyEmail" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notifyWeeklyPush" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "providerId" TEXT;
