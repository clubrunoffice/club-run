/*
  Warnings:

  - You are about to drop the column `teamId` on the `users` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ChatGPTCostLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "cost" REAL NOT NULL DEFAULT 0,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatGPTCostLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TeamMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_TeamMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "teams" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TeamMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_p2p_missions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "curatorId" TEXT NOT NULL,
    "runnerId" TEXT,
    "teamId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "venueAddress" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "budget" REAL NOT NULL,
    "deadline" DATETIME NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "ipfsHash" TEXT NOT NULL,
    "proofHash" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "requirements" TEXT NOT NULL,
    "openMarket" BOOLEAN NOT NULL DEFAULT true,
    "assignedAt" DATETIME,
    "proofSubmittedAt" DATETIME,
    "completedAt" DATETIME,
    "cancelledAt" DATETIME,
    "paymentDetails" TEXT,
    "disputeRaisedBy" TEXT,
    "disputeReason" TEXT,
    "disputeEvidence" TEXT,
    "disputeRaisedAt" DATETIME,
    "verificationMethod" TEXT,
    "verificationDetails" TEXT,
    "trackRequirements" TEXT,
    "verificationWindow" TEXT,
    "autoVerifyEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "p2p_missions_curatorId_fkey" FOREIGN KEY ("curatorId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "p2p_missions_runnerId_fkey" FOREIGN KEY ("runnerId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "p2p_missions_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_p2p_missions" ("assignedAt", "budget", "cancelledAt", "completedAt", "createdAt", "curatorId", "deadline", "description", "disputeEvidence", "disputeRaisedAt", "disputeRaisedBy", "disputeReason", "eventType", "id", "ipfsHash", "openMarket", "paymentDetails", "paymentMethod", "proofHash", "proofSubmittedAt", "requirements", "runnerId", "status", "teamId", "title", "updatedAt", "venueAddress") SELECT "assignedAt", "budget", "cancelledAt", "completedAt", "createdAt", "curatorId", "deadline", "description", "disputeEvidence", "disputeRaisedAt", "disputeRaisedBy", "disputeReason", "eventType", "id", "ipfsHash", "openMarket", "paymentDetails", "paymentMethod", "proofHash", "proofSubmittedAt", "requirements", "runnerId", "status", "teamId", "title", "updatedAt", "venueAddress" FROM "p2p_missions";
DROP TABLE "p2p_missions";
ALTER TABLE "new_p2p_missions" RENAME TO "p2p_missions";
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "name" TEXT NOT NULL,
    "googleId" TEXT,
    "avatar" TEXT,
    "walletAddress" TEXT,
    "role" TEXT NOT NULL DEFAULT 'DJ',
    "tokenBalance" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "totalCheckIns" INTEGER NOT NULL DEFAULT 0,
    "missionsCompleted" INTEGER NOT NULL DEFAULT 0,
    "level" TEXT NOT NULL DEFAULT 'Navigator',
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "badges" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "seratoAccessToken" TEXT,
    "seratoRefreshToken" TEXT,
    "seratoTokenExpiresAt" DATETIME,
    "seratoUsername" TEXT,
    "seratoDisplayName" TEXT,
    "seratoConnectedAt" DATETIME
);
INSERT INTO "new_users" ("avatar", "badges", "createdAt", "currentStreak", "email", "googleId", "id", "isActive", "lastLoginAt", "level", "missionsCompleted", "name", "passwordHash", "role", "theme", "tokenBalance", "totalCheckIns", "updatedAt", "walletAddress") SELECT "avatar", "badges", "createdAt", "currentStreak", "email", "googleId", "id", "isActive", "lastLoginAt", "level", "missionsCompleted", "name", "passwordHash", "role", "theme", "tokenBalance", "totalCheckIns", "updatedAt", "walletAddress" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");
CREATE UNIQUE INDEX "users_walletAddress_key" ON "users"("walletAddress");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ChatGPTCostLog_userId_timestamp_idx" ON "ChatGPTCostLog"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "ChatGPTCostLog_timestamp_idx" ON "ChatGPTCostLog"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "_TeamMembers_AB_unique" ON "_TeamMembers"("A", "B");

-- CreateIndex
CREATE INDEX "_TeamMembers_B_index" ON "_TeamMembers"("B");
