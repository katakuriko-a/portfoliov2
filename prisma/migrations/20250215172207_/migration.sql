/*
  Warnings:

  - You are about to drop the column `scode` on the `accounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "scode",
ADD COLUMN     "scope" TEXT;
