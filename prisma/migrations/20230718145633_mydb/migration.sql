/*
  Warnings:

  - You are about to drop the column `capacity` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `discription` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `event` table. All the data in the column will be lost.
  - Added the required column `description` to the `event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event" DROP COLUMN "capacity",
DROP COLUMN "discription",
DROP COLUMN "price",
ADD COLUMN     "description" TEXT NOT NULL;
