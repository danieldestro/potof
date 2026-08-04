-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `perfil` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    ADD COLUMN `senha_hash` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `admin_usuarios`;

