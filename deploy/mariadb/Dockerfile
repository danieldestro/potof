# Serviço de banco de dados no Railway (deploy separado do serviço web, builder DOCKERFILE
# com este diretório como root). Existe porque o Railway não oferece um template MariaDB
# com innodb_ft_min_token_size customizável — usamos a imagem oficial e injetamos o mesmo
# parâmetro que o docker-compose.yml da raiz do repo aplica via `command:` em dev, mas como
# arquivo de config (mais robusto que depender de override de CMD funcionar num PaaS).
#
# innodb_ft_min_token_size=2: o índice FULLTEXT eventos_busca_fulltext (ver
# backend/prisma/schema.prisma) precisa indexar tokens de 2 caracteres com significado
# (ex: "5k", "8k", UFs) — o padrão do MariaDB é 3, que os descartaria silenciosamente.
FROM mariadb:10

COPY custom.cnf /etc/mysql/conf.d/custom.cnf
