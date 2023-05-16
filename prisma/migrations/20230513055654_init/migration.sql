/*
  Warnings:

  - A unique constraint covering the columns `[name,email]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `user_name_email_key` ON `user`(`name`, `email`);
