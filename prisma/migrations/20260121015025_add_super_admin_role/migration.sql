-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('super_admin', 'admin', 'user') NOT NULL DEFAULT 'user';
