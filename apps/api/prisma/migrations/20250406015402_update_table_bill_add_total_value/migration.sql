/*
  Warnings:

  - Added the required column `totalValue` to the `Bill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "totalValue" DECIMAL(65,30) NOT NULL;
