/*
  Warnings:

  - You are about to drop the column `customFields` on the `inventories` table. All the data in the column will be lost.
  - You are about to drop the column `customIdFormat` on the `inventories` table. All the data in the column will be lost.
  - You are about to drop the `item_values` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "item_values" DROP CONSTRAINT "item_values_itemId_fkey";

-- AlterTable
ALTER TABLE "inventories" DROP COLUMN "customFields",
DROP COLUMN "customIdFormat",
ADD COLUMN     "customBool1Name" TEXT,
ADD COLUMN     "customBool1State" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "customBool2Name" TEXT,
ADD COLUMN     "customBool2State" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "customBool3Name" TEXT,
ADD COLUMN     "customBool3State" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "customIdPattern" TEXT,
ADD COLUMN     "customInt1Name" TEXT,
ADD COLUMN     "customInt1State" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "customInt2Name" TEXT,
ADD COLUMN     "customInt2State" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "customInt3Name" TEXT,
ADD COLUMN     "customInt3State" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "customString1Name" TEXT,
ADD COLUMN     "customString1State" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "customString2Name" TEXT,
ADD COLUMN     "customString2State" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "customString3Name" TEXT,
ADD COLUMN     "customString3State" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "items" ADD COLUMN     "customBool1" BOOLEAN,
ADD COLUMN     "customBool2" BOOLEAN,
ADD COLUMN     "customBool3" BOOLEAN,
ADD COLUMN     "customInt1" INTEGER,
ADD COLUMN     "customInt2" INTEGER,
ADD COLUMN     "customInt3" INTEGER,
ADD COLUMN     "customString1" TEXT,
ADD COLUMN     "customString2" TEXT,
ADD COLUMN     "customString3" TEXT;

-- DropTable
DROP TABLE "item_values";

-- DropEnum
DROP TYPE "FieldType";

-- DropEnum
DROP TYPE "IDComponentType";
