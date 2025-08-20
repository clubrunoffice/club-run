-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('RUNNER', 'CLIENT', 'OPERATIONS', 'PARTNER', 'ADMIN');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'RUNNER';
