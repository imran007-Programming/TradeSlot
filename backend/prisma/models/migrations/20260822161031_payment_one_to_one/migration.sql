/*
  Warnings:

  - You are about to drop the `Booking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Business` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Conversation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Trader` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WhatsappLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkArea` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_trderId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_traderId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "Trader" DROP CONSTRAINT "Trader_businessId_fkey";

-- DropForeignKey
ALTER TABLE "Trader" DROP CONSTRAINT "Trader_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkArea" DROP CONSTRAINT "WorkArea_traderId_fkey";

-- DropTable
DROP TABLE "Booking";

-- DropTable
DROP TABLE "Business";

-- DropTable
DROP TABLE "Conversation";

-- DropTable
DROP TABLE "Customer";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "Trader";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "WhatsappLog";

-- DropTable
DROP TABLE "WorkArea";

-- DropEnum
DROP TYPE "BookingStatus";

-- DropEnum
DROP TYPE "Channel";

-- DropEnum
DROP TYPE "ConversationStatus";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "Sender";

-- DropEnum
DROP TYPE "SlotStatus";
