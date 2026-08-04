-- CreateTable
CREATE TABLE `provedores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` TEXT NULL,
    `url_site` VARCHAR(191) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `proprio` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

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

-- CreateTable
CREATE TABLE `admin_usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha_hash` VARCHAR(191) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admin_usuarios_email_key`(`email`),
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

    UNIQUE INDEX `categorias_provedores_categoria_id_provedor_id_key`(`categoria_id`, `provedor_id`),
    UNIQUE INDEX `categorias_provedores_provedor_id_id_categoria_provedor_key`(`provedor_id`, `id_categoria_provedor`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- AddForeignKey
ALTER TABLE `categorias_provedores` ADD CONSTRAINT `categorias_provedores_categoria_id_fkey` FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categorias_provedores` ADD CONSTRAINT `categorias_provedores_provedor_id_fkey` FOREIGN KEY (`provedor_id`) REFERENCES `provedores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
