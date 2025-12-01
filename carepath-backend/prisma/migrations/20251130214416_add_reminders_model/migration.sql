/*
  Warnings:

  - You are about to drop the column `channelOverride` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `failureReason` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `lastAttemptAt` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledAtUtc` on the `Reminder` table. All the data in the column will be lost.
  - Added the required column `scheduledFor` to the `Reminder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Reminder` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reminder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "clinicId" INTEGER,
    "type" TEXT NOT NULL DEFAULT 'visit',
    "channel" TEXT NOT NULL DEFAULT 'SMS',
    "scheduledFor" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Reminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reminder_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Reminder" ("clinicId", "createdAt", "id", "status", "type", "userId") SELECT "clinicId", "createdAt", "id", "status", "type", "userId" FROM "Reminder";
DROP TABLE "Reminder";
ALTER TABLE "new_Reminder" RENAME TO "Reminder";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
