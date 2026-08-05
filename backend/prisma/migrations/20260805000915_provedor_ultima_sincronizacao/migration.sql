-- AlterTable
ALTER TABLE `provedores` ADD COLUMN `ultima_sincronizacao_em` DATETIME(3) NULL,
    ADD COLUMN `ultima_sincronizacao_resultado` TEXT NULL;
