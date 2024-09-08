-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'AUTHOR', 'READER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'READER';
