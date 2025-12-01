/*
  Warnings:

  - You are about to drop the `VisitGuide` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VisitGuideStep` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `authorId` on the `ClinicNote` table. All the data in the column will be lost.
  - You are about to drop the column `authorName` on the `ClinicNote` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `User` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `passwordHash` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "VisitGuide_slug_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "VisitGuide";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "VisitGuideStep";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Clinic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "area" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "openingHours" TEXT,
    "services" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Clinic" ("address", "area", "createdAt", "id", "isPublic", "latitude", "longitude", "name", "openingHours", "services", "updatedAt") SELECT "address", "area", "createdAt", "id", "isPublic", "latitude", "longitude", "name", "openingHours", "services", "updatedAt" FROM "Clinic";
DROP TABLE "Clinic";
ALTER TABLE "new_Clinic" RENAME TO "Clinic";
CREATE TABLE "new_ClinicNote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clinicId" INTEGER NOT NULL,
    "author" TEXT,
    "role" TEXT DEFAULT 'chw',
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClinicNote_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ClinicNote" ("clinicId", "content", "createdAt", "id", "role") SELECT "clinicId", "content", "createdAt", "id", "role" FROM "ClinicNote";
DROP TABLE "ClinicNote";
ALTER TABLE "new_ClinicNote" RENAME TO "ClinicNote";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "channel" TEXT,
    "language" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("channel", "createdAt", "email", "id", "language", "passwordHash", "phoneNumber", "role") SELECT "channel", "createdAt", "email", "id", "language", "passwordHash", "phoneNumber", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
