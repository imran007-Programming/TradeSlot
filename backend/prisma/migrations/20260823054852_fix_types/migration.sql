/*
  Warnings:

  - You are about to alter the column `bookingFee` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `amount` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `applicationFeeAmount` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "bookingFee" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "applicationFeeAmount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "WorkArea" ALTER COLUMN "availableDate" SET DATA TYPE TIMESTAMP(3);
