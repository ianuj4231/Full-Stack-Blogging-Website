-- DropIndex
DROP INDEX "OTP_email_key";

-- AlterTable
ALTER TABLE "OTP" ALTER COLUMN "otpPurpose" DROP DEFAULT;
