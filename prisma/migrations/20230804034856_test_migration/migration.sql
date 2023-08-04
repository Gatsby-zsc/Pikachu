/*
  Warnings:

  - You are about to drop the column `ticket_info` on the `order` table. All the data in the column will be lost.
  - You are about to drop the `user_point` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[event_id,row,col]` on the table `seat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ticket_number` to the `order_ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "order_ticket" DROP CONSTRAINT "order_ticket_order_id_fkey";

-- DropForeignKey
ALTER TABLE "user_favourite_event" DROP CONSTRAINT "user_favourite_event_eventId_fkey";

-- DropForeignKey
ALTER TABLE "user_point" DROP CONSTRAINT "user_point_user_id_fkey";

-- AlterTable
ALTER TABLE "order" DROP COLUMN "ticket_info";

-- AlterTable
ALTER TABLE "order_ticket" ADD COLUMN     "ticket_number" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "review" ADD COLUMN     "rating" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "seat" ADD COLUMN     "order_id" UUID;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "user_point";

-- CreateIndex
CREATE UNIQUE INDEX "seat_event_id_row_col_key" ON "seat"("event_id", "row", "col");

-- AddForeignKey
ALTER TABLE "user_favourite_event" ADD CONSTRAINT "user_favourite_event_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_ticket" ADD CONSTRAINT "order_ticket_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seat" ADD CONSTRAINT "seat_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
