-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "name" TEXT NOT NULL,
    "googleId" TEXT,
    "privyId" TEXT,
    "avatar" TEXT,
    "walletAddress" TEXT,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'GUEST',
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
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "lastOnlineAt" DATETIME,
    "seratoAccessToken" TEXT,
    "seratoRefreshToken" TEXT,
    "seratoTokenExpiresAt" DATETIME,
    "seratoUsername" TEXT,
    "seratoDisplayName" TEXT,
    "seratoConnectedAt" DATETIME
);
INSERT INTO "new_users" ("avatar", "badges", "createdAt", "currentStreak", "email", "googleId", "id", "isActive", "lastLoginAt", "level", "missionsCompleted", "name", "passwordHash", "role", "seratoAccessToken", "seratoConnectedAt", "seratoDisplayName", "seratoRefreshToken", "seratoTokenExpiresAt", "seratoUsername", "theme", "tokenBalance", "totalCheckIns", "updatedAt", "walletAddress") SELECT "avatar", "badges", "createdAt", "currentStreak", "email", "googleId", "id", "isActive", "lastLoginAt", "level", "missionsCompleted", "name", "passwordHash", "role", "seratoAccessToken", "seratoConnectedAt", "seratoDisplayName", "seratoRefreshToken", "seratoTokenExpiresAt", "seratoUsername", "theme", "tokenBalance", "totalCheckIns", "updatedAt", "walletAddress" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");
CREATE UNIQUE INDEX "users_privyId_key" ON "users"("privyId");
CREATE UNIQUE INDEX "users_walletAddress_key" ON "users"("walletAddress");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
