-- Schema completo do potof, consolidado num único arquivo DDL (era
-- fragmentado em várias migrations incrementais durante o
-- desenvolvimento: init, merge admin_usuarios->usuarios,
-- provedor.ultima_sincronizacao, eventos_fulltext, eventos.url_capa
-- mais largo, categorias_provedores sem unique em categoria_id+provedor_id,
-- tabela configuracoes).
--
-- Gerado via: prisma migrate diff --from-empty --to-schema-datamodel
-- prisma/schema.prisma --script (mais o índice FULLTEXT abaixo, hoje também
-- modelado via @@fulltext em Evento — ver comentário em
-- backend/src/routes/eventos.ts).

-- CreateTable
CREATE TABLE `configuracoes` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `sync_incremental_dias` INTEGER NOT NULL DEFAULT 30,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `provedores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` TEXT NULL,
    `url_site` VARCHAR(191) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `proprio` BOOLEAN NOT NULL DEFAULT false,
    `ultima_sincronizacao_em` DATETIME(3) NULL,
    `ultima_sincronizacao_resultado` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `provedores_slug_key`(`slug`),
    UNIQUE INDEX `provedores_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categorias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` TEXT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `categorias_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categorias_provedores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoria_id` INTEGER NOT NULL,
    `provedor_id` INTEGER NOT NULL,
    `id_categoria_provedor` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `categorias_provedores_provedor_id_id_categoria_provedor_key`(`provedor_id`, `id_categoria_provedor`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eventos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` TEXT NULL,
    `local` VARCHAR(191) NULL,
    `data_hora` DATETIME(3) NOT NULL,
    `cidade` VARCHAR(191) NULL,
    `uf` VARCHAR(191) NULL,
    `pais` VARCHAR(191) NULL DEFAULT 'BR',
    `categoria_id` INTEGER NOT NULL,
    `search_selfie` BOOLEAN NOT NULL DEFAULT false,
    `search_bib` BOOLEAN NOT NULL DEFAULT false,
    `search_name` BOOLEAN NOT NULL DEFAULT false,
    `provedor_id` INTEGER NOT NULL,
    `id_evento_provedor` VARCHAR(191) NULL,
    `url_site` VARCHAR(191) NULL,
    `url_capa` VARCHAR(500) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `eventos_provedor_id_id_evento_provedor_key`(`provedor_id`, `id_evento_provedor`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NULL,
    `data_nascimento` DATE NULL,
    `cidade` VARCHAR(191) NULL,
    `uf` VARCHAR(191) NULL,
    `pais` VARCHAR(191) NULL DEFAULT 'BR',
    `perfil` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    `senha_hash` VARCHAR(191) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    UNIQUE INDEX `usuarios_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fotografos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `fotografos_usuario_id_key`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fotos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `evento_id` INTEGER NOT NULL,
    `fotografo_id` INTEGER NOT NULL,
    `url_foto` VARCHAR(191) NOT NULL,
    `url_thumb` VARCHAR(191) NULL,
    `taken_at` DATETIME(3) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `categorias_provedores` ADD CONSTRAINT `categorias_provedores_categoria_id_fkey` FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categorias_provedores` ADD CONSTRAINT `categorias_provedores_provedor_id_fkey` FOREIGN KEY (`provedor_id`) REFERENCES `provedores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eventos` ADD CONSTRAINT `eventos_categoria_id_fkey` FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eventos` ADD CONSTRAINT `eventos_provedor_id_fkey` FOREIGN KEY (`provedor_id`) REFERENCES `provedores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fotografos` ADD CONSTRAINT `fotografos_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fotos` ADD CONSTRAINT `fotos_evento_id_fkey` FOREIGN KEY (`evento_id`) REFERENCES `eventos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fotos` ADD CONSTRAINT `fotos_fotografo_id_fkey` FOREIGN KEY (`fotografo_id`) REFERENCES `fotografos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;


-- Índice FULLTEXT pros principais dados cadastrais do evento — usado
-- pela busca por nome da Home e de /eventos
-- (backend/src/routes/eventos.ts), via MATCH(...) AGAINST(...).
-- Requer innodb_ft_min_token_size=2 (ver docker-compose.yml).
ALTER TABLE eventos ADD FULLTEXT INDEX eventos_busca_fulltext (nome, local, cidade, uf, descricao);
