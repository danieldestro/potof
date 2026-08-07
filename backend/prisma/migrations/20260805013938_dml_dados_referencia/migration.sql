-- Dados de referência que a aplicação depende funcionalmente (não só
-- fixtures de dev): sem isso, um ambiente novo criado só com
-- "prisma migrate deploy" (produção, por exemplo — o script de start
-- não roda "prisma db seed") sobe com essas 3 tabelas vazias, e o
-- sync dos provedores externos pula todo evento por falta de
-- mapeamento de categoria. INSERT IGNORE torna isso seguro de rodar
-- mesmo em bancos que já têm esses dados via seed manual (idempotente).
--
-- Consolidado num único arquivo DML (era fragmentado em
-- seed_dados_referencia [Potof/Fotop] + seed_foco_radical).

-- ============================================================
-- Provedor próprio (Potof) + Fotop, categorias (id = código do
-- fotop) e mapeamento identidade categorias_provedores.
-- Fonte: backend/prisma/categoriaSeedData.ts
-- ============================================================
-- Provedores
INSERT IGNORE INTO provedores (slug, nome, descricao, url_site, ativo, proprio, created_at, updated_at) VALUES
  ('potof', 'Potof', 'potof', NULL, 1, 1, NOW(), NOW()),
  ('fotop', 'Fotop', 'fotop.com.br', 'https://fotop.com.br', 1, 0, NOW(), NOW());

-- Categorias (id explícito = código do fotop — ver comentário em
-- backend/prisma/categoriaSeedData.ts, fonte desta lista)
INSERT IGNORE INTO categorias (id, slug, nome, ativo, created_at, updated_at) VALUES
  (1, 'corridaderua', 'Corrida de rua', 1, NOW(), NOW()),
  (22, 'treinos', 'Treinos', 1, NOW(), NOW()),
  (3, 'futebol', 'Futebol', 1, NOW(), NOW()),
  (4, 'ciclismo', 'Ciclismo', 1, NOW(), NOW()),
  (11, 'triathlon', 'Duathlon / Triathlon', 1, NOW(), NOW()),
  (18, 'corridatrail', 'Corrida de montanha', 1, NOW(), NOW()),
  (77, 'carnaval', 'Carnaval', 1, NOW(), NOW()),
  (78, 'show-festival', 'Show / Festival', 1, NOW(), NOW()),
  (24, 'acampamentos', 'Acampamentos', 1, NOW(), NOW()),
  (26, 'beachtennis', 'Beach Tênis', 1, NOW(), NOW()),
  (27, 'crossfit', 'Crossfit', 1, NOW(), NOW()),
  (12, 'artemarcial', 'Arte Marcial', 1, NOW(), NOW()),
  (17, 'esportesamotor', 'Esportes a motor', 1, NOW(), NOW()),
  (20, 'turismo', 'Turismo', 1, NOW(), NOW()),
  (23, 'Formatura', 'Formatura', 1, NOW(), NOW()),
  (19, 'escolar', 'Escolar', 1, NOW(), NOW()),
  (13, 'eventosocial', 'Evento Social', 1, NOW(), NOW()),
  (14, 'ensaio', 'Ensaio', 1, NOW(), NOW()),
  (28, 'futevolei', 'Futevôlei', 1, NOW(), NOW()),
  (33, 'natacao', 'Natação', 1, NOW(), NOW()),
  (39, 'esportesaquaticos', 'Esportes Aquáticos', 1, NOW(), NOW()),
  (41, 'corridaobstaculos', 'Corrida de Obstáculos', 1, NOW(), NOW()),
  (25, 'basquete', 'Basquete', 1, NOW(), NOW()),
  (9, 'tenis', 'Tenis', 1, NOW(), NOW()),
  (36, 'handball', 'Handebol', 1, NOW(), NOW()),
  (32, 'hipismo', 'Hipismo', 1, NOW(), NOW()),
  (31, 'golfe', 'Golfe', 1, NOW(), NOW()),
  (40, 'padel', 'Padel', 1, NOW(), NOW()),
  (2, 'rally', 'Rally', 1, NOW(), NOW()),
  (37, 'rugby', 'Rugby', 1, NOW(), NOW()),
  (16, 'surf', 'Surf', 1, NOW(), NOW()),
  (34, 'volei', 'Vôlei', 1, NOW(), NOW()),
  (35, 'baseball', 'Baseball', 1, NOW(), NOW()),
  (30, 'ginasticaartistica', 'Ginástica Artística', 1, NOW(), NOW()),
  (38, 'futebolamericano', 'Futebol Americano', 1, NOW(), NOW()),
  (42, 'airsoft', 'AirSoft', 1, NOW(), NOW()),
  (43, 'atletismo', 'Atletismo', 1, NOW(), NOW()),
  (44, 'badminton', 'Badminton', 1, NOW(), NOW()),
  (45, 'beachsoccer', 'Beach Soccer', 1, NOW(), NOW()),
  (46, 'canoagem', 'Canoagem', 1, NOW(), NOW()),
  (61, 'capoeira', 'Capoeira', 1, NOW(), NOW()),
  (47, 'danca', 'Dança', 1, NOW(), NOW()),
  (48, 'equestre', 'Equestre', 1, NOW(), NOW()),
  (62, 'fisiculturismo', 'Fisiculturismo', 1, NOW(), NOW()),
  (63, 'futsal', 'Futsal', 1, NOW(), NOW()),
  (49, 'hockey', 'Hockey', 1, NOW(), NOW()),
  (64, 'iatismo', 'Iatismo', 1, NOW(), NOW()),
  (50, 'ioga', 'Ioga', 1, NOW(), NOW()),
  (65, 'jiu-jítzu', 'Jiu-jítzu', 1, NOW(), NOW()),
  (66, 'judo', 'Judô', 1, NOW(), NOW()),
  (67, 'karate', 'Karatê', 1, NOW(), NOW()),
  (51, 'kitesurf', 'Kitesurf', 1, NOW(), NOW()),
  (52, 'mergulho', 'Mergulho', 1, NOW(), NOW()),
  (68, 'motociclismo', 'Motociclismo', 1, NOW(), NOW()),
  (69, 'motocros', 'Motocros', 1, NOW(), NOW()),
  (70, 'muaythai', 'Muay Thai', 1, NOW(), NOW()),
  (53, 'paintball', 'Paintball', 1, NOW(), NOW()),
  (72, 'parapente', 'Parapente', 1, NOW(), NOW()),
  (71, 'paraquedismo', 'Paraquedismo', 1, NOW(), NOW()),
  (54, 'patinação', 'Patinação', 1, NOW(), NOW()),
  (55, 'pescaria', 'Pescaria', 1, NOW(), NOW()),
  (73, 'pets', 'Pets', 1, NOW(), NOW()),
  (56, 'pickleball', 'Pickleball', 1, NOW(), NOW()),
  (57, 'pilates', 'Pilates', 1, NOW(), NOW()),
  (74, 'poloaquatico', 'Polo aquático', 1, NOW(), NOW()),
  (58, 'rodeio', 'Rodeio', 1, NOW(), NOW()),
  (59, 'skate', 'Skate', 1, NOW(), NOW()),
  (60, 'tenisdemesa', 'Tênis de mesa', 1, NOW(), NOW()),
  (75, 'xadrez', 'Xadrez', 1, NOW(), NOW()),
  (79, 'hyrox', 'Hyrox', 1, NOW(), NOW()),
  (80, 'moda', 'Moda', 1, NOW(), NOW()),
  (15, 'outrosesportes', 'Outros Esportes', 1, NOW(), NOW()),
  (5, 'outros', 'Outros', 1, NOW(), NOW());

-- Mapeamento categoria -> Fotop (identidade, já que Categoria.id == id do fotop)
-- restrito às 73 categorias desta lista (por id explícito) — NÃO a todas as
-- linhas que existirem em `categorias` no momento em que isso rodar, já que
-- categorias adicionais cadastradas depois (via admin, com id autoincrement)
-- não têm nenhuma relação com a numeração do fotop.
INSERT IGNORE INTO categorias_provedores (categoria_id, provedor_id, id_categoria_provedor, created_at, updated_at)
SELECT c.id, p.id, CAST(c.id AS CHAR), NOW(), NOW()
FROM categorias c
JOIN provedores p ON p.slug = 'fotop'
WHERE c.id IN (1, 22, 3, 4, 11, 18, 77, 78, 24, 26, 27, 12, 17, 20, 23, 19, 13, 14, 28, 33, 39, 41, 25, 9, 36, 32, 31, 40, 2, 37, 16, 34, 35, 30, 38, 42, 43, 44, 45, 46, 61, 47, 48, 62, 63, 49, 64, 50, 65, 66, 67, 51, 52, 68, 69, 70, 53, 72, 71, 54, 55, 73, 56, 57, 74, 58, 59, 60, 75, 79, 80, 15, 5);

-- ============================================================
-- Provedor Foco Radical, categorias novas (81-187) e mapeamento
-- categoria_provedor específico (não é identidade).
-- Fonte: backend/prisma/focoRadicalSeedData.ts
-- ============================================================
-- Provedor
INSERT IGNORE INTO provedores (slug, nome, descricao, url_site, ativo, proprio, created_at, updated_at) VALUES
  ('foco-radical', 'Foco Radical', 'Foco Radical', 'https://www.focoradical.com.br/', 1, 0, NOW(), NOW());

-- Categorias novas introduzidas pelo Foco Radical (id sequencial pós-Fotop,
-- 81-187 — ver comentário em focoRadicalSeedData.ts sobre por que não reusa
-- a numeração bruta do provedor, ao contrário do Fotop)
INSERT IGNORE INTO categorias (id, slug, nome, icone, ativo, created_at, updated_at) VALUES
  (81, 'aeromodelismo', 'Aeromodelismo', NULL, 1, NOW(), NOW()),
  (82, 'altinha', 'Altinha', NULL, 1, NOW(), NOW()),
  (83, 'apneia', 'Apneia', NULL, 1, NOW(), NOW()),
  (84, 'aquathlon', 'Aquathlon', '/categoria-icons/aquathlon.svg', 1, NOW(), NOW()),
  (85, 'arremessodepeso', 'Arremesso de Peso', '/categoria-icons/arremesso-de-peso.svg', 1, NOW(), NOW()),
  (86, 'automobilismo', 'Automobilismo', '/categoria-icons/stock-car.svg', 1, NOW(), NOW()),
  (87, 'balonismo', 'Balonismo', '/categoria-icons/balonismo.svg', 1, NOW(), NOW()),
  (88, 'biathlon', 'Biathlon', '/categoria-icons/biathlon.svg', 1, NOW(), NOW()),
  (89, 'bmx', 'BMX', '/categoria-icons/bmx.svg', 1, NOW(), NOW()),
  (90, 'bocha', 'Bocha', NULL, 1, NOW(), NOW()),
  (91, 'bodyboard', 'Bodyboard', '/categoria-icons/bodyboard.svg', 1, NOW(), NOW()),
  (92, 'boiacross', 'Bóia Cross', NULL, 1, NOW(), NOW()),
  (93, 'boxe', 'Boxe', '/categoria-icons/boxe.svg', 1, NOW(), NOW()),
  (94, 'bungeejump', 'Bungee Jump', '/categoria-icons/rapel-rope-jump-tirolesa.svg', 1, NOW(), NOW()),
  (95, 'calistenia', 'Calistenia', '/categoria-icons/calistenia.svg', 1, NOW(), NOW()),
  (96, 'cambio', 'Cambio', NULL, 1, NOW(), NOW()),
  (97, 'caminhada', 'Caminhada', '/categoria-icons/caminhada.svg', 1, NOW(), NOW()),
  (98, 'canicross', 'Canicross', '/categoria-icons/canicross.svg', 1, NOW(), NOW()),
  (99, 'canionismo', 'Canionismo', NULL, 1, NOW(), NOW()),
  (100, 'canoahavaiana', 'Canoa Havaiana', '/categoria-icons/canoa-havaiana.svg', 1, NOW(), NOW()),
  (101, 'canoapolinesia', 'Canoa Polinésia', '/categoria-icons/canoa-polinesia.svg', 1, NOW(), NOW()),
  (102, 'carrinhoderolima', 'Carrinho de Rolimã', NULL, 1, NOW(), NOW()),
  (103, 'cicloturismo', 'Cicloturismo', '/categoria-icons/cicloturismo.svg', 1, NOW(), NOW()),
  (104, 'corridadeorientacao', 'Corrida de Orientação', NULL, 1, NOW(), NOW()),
  (105, 'corridaemesteira', 'Corrida em Esteira', '/categoria-icons/corrida-em-esteira.svg', 1, NOW(), NOW()),
  (106, 'corridapet', 'Corrida Pet', '/categoria-icons/corrida-pet.svg', 1, NOW(), NOW()),
  (107, 'crosscountry', 'Cross Country', '/categoria-icons/cross-country.svg', 1, NOW(), NOW()),
  (108, 'dirtjump', 'Dirt Jump', NULL, 1, NOW(), NOW()),
  (109, 'downhil', 'Downhil', NULL, 1, NOW(), NOW()),
  (110, 'duathlon', 'Duathlon', '/categoria-icons/duathlon.svg', 1, NOW(), NOW()),
  (111, 'entregadekit', 'Entrega de Kit', NULL, 1, NOW(), NOW()),
  (112, 'escalada', 'Escalada', '/categoria-icons/escalada.svg', 1, NOW(), NOW()),
  (113, 'esgrima', 'Esgrima', '/categoria-icons/esgrima.svg', 1, NOW(), NOW()),
  (114, 'esportessubaquatico', 'Esportes Subaquático', NULL, 1, NOW(), NOW()),
  (115, 'esqui', 'Esqui', '/categoria-icons/esqui.svg', 1, NOW(), NOW()),
  (116, 'eventomultiesporte', 'Evento Multiesporte', NULL, 1, NOW(), NOW()),
  (117, 'finswimming', 'Finswimming', NULL, 1, NOW(), NOW()),
  (118, 'fitdance', 'Fitdance', NULL, 1, NOW(), NOW()),
  (119, 'flagfootball', 'Flag Football', NULL, 1, NOW(), NOW()),
  (120, 'freediving', 'Freediving', NULL, 1, NOW(), NOW()),
  (121, 'frescobol', 'Frescobol', NULL, 1, NOW(), NOW()),
  (122, 'futebol7', 'Futebol 7', '/categoria-icons/futebol-7.svg', 1, NOW(), NOW()),
  (123, 'futebolsociety', 'Futebol Society', '/categoria-icons/futebol-society.svg', 1, NOW(), NOW()),
  (124, 'futmesa', 'Futmesa', NULL, 1, NOW(), NOW()),
  (125, 'ginasticaacrobatica', 'Ginástica Acrobática', '/categoria-icons/ginastica-olimpica.svg', 1, NOW(), NOW()),
  (126, 'ginasticaaerobica', 'Ginástica Aeróbica', '/categoria-icons/ginastica-olimpica.svg', 1, NOW(), NOW()),
  (127, 'ginasticaolimpica', 'Ginástica Olímpica', '/categoria-icons/ginastica-olimpica.svg', 1, NOW(), NOW()),
  (128, 'ginasticaritmica', 'Ginástica Rítmica', '/categoria-icons/ginastica-olimpica.svg', 1, NOW(), NOW()),
  (129, 'gravel', 'Gravel', '/categoria-icons/gravel.svg', 1, NOW(), NOW()),
  (130, 'halterofilismo', 'Halterofilismo', '/categoria-icons/halterofilismo.svg', 1, NOW(), NOW()),
  (131, 'hiking', 'Hiking', '/categoria-icons/hiking.svg', 1, NOW(), NOW()),
  (132, 'jogosescolares', 'Jogos Escolares', NULL, 1, NOW(), NOW()),
  (133, 'kangoo', 'Kangoo', NULL, 1, NOW(), NOW()),
  (134, 'kart', 'Kart', '/categoria-icons/kart.svg', 1, NOW(), NOW()),
  (135, 'kettlebellsport', 'Kettlebell Sport', '/categoria-icons/kettlebell-sport.svg', 1, NOW(), NOW()),
  (136, 'kickboxing', 'Kickboxing', '/categoria-icons/kickboxing.svg', 1, NOW(), NOW()),
  (137, 'lacocomprido', 'Laço Comprido', '/categoria-icons/laco-comprido.svg', 1, NOW(), NOW()),
  (138, 'lacoemdupla', 'Laço em Dupla', '/categoria-icons/laco-em-dupla.svg', 1, NOW(), NOW()),
  (139, 'levantamentodepesoolimpico', 'Levantamento de peso olímpico', '/categoria-icons/levantamento-de-peso-olimpico.svg', 1, NOW(), NOW()),
  (140, 'lifesaving', 'Lifesaving', NULL, 1, NOW(), NOW()),
  (141, 'livrepodecadastraresporte', 'Livre - Pode cadastrar esporte', NULL, 1, NOW(), NOW()),
  (142, 'luta', 'Luta', '/categoria-icons/luta.svg', 1, NOW(), NOW()),
  (143, 'maratonaaquatica', 'Maratona Aquática', '/categoria-icons/maratona-aquatica.svg', 1, NOW(), NOW()),
  (144, 'marchaatletica', 'Marcha Atlética', '/categoria-icons/marcha-atletica.svg', 1, NOW(), NOW()),
  (145, 'mma', 'MMA', '/categoria-icons/mma.svg', 1, NOW(), NOW()),
  (146, 'montanhismo', 'Montanhismo', '/categoria-icons/montanhismo.svg', 1, NOW(), NOW()),
  (147, 'motovelocidade', 'Motovelocidade', '/categoria-icons/motovelocidade.svg', 1, NOW(), NOW()),
  (148, 'mountainbike', 'Mountain Bike', '/categoria-icons/mountain-bike.svg', 1, NOW(), NOW()),
  (149, 'mtb', 'MTB', '/categoria-icons/mtb.svg', 1, NOW(), NOW()),
  (150, 'musculacao', 'Musculação', '/categoria-icons/musculacao.svg', 1, NOW(), NOW()),
  (151, 'natacaocorrida', 'Natação / Corrida', '/categoria-icons/natacao-corrida.svg', 1, NOW(), NOW()),
  (152, 'natacaoempiscina', 'Natação em Piscina', '/categoria-icons/natacao-em-piscina.svg', 1, NOW(), NOW()),
  (153, 'offroad', 'Off-Road', '/categoria-icons/off-road.svg', 1, NOW(), NOW()),
  (154, 'passeiociclistico', 'Passeio Ciclístico', '/categoria-icons/passeio-ciclistico.svg', 1, NOW(), NOW()),
  (155, 'pedal', 'Pedal', '/categoria-icons/pedal.svg', 1, NOW(), NOW()),
  (156, 'pendulo', 'Pêndulo', NULL, 1, NOW(), NOW()),
  (157, 'pentatlomoderno', 'Pentatlo moderno', '/categoria-icons/pentatlo-moderno.svg', 1, NOW(), NOW()),
  (158, 'pescasubmarina', 'Pesca submarina', NULL, 1, NOW(), NOW()),
  (159, 'poker', 'Poker', NULL, 1, NOW(), NOW()),
  (160, 'punhobol', 'Punhobol', NULL, 1, NOW(), NOW()),
  (161, 'queimada', 'Queimada', NULL, 1, NOW(), NOW()),
  (162, 'rapelropejumptirolesa', 'Rapel / Rope jump / Tirolesa', '/categoria-icons/rapel-rope-jump-tirolesa.svg', 1, NOW(), NOW()),
  (163, 'remo', 'Remo', '/categoria-icons/remo.svg', 1, NOW(), NOW()),
  (164, 'rockjump', 'Rock Jump', NULL, 1, NOW(), NOW()),
  (165, 'snookersinuca', 'Snooker/Sinuca', NULL, 1, NOW(), NOW()),
  (166, 'squash', 'Squash', '/categoria-icons/squash.svg', 1, NOW(), NOW()),
  (167, 'stockcar', 'Stock Car', '/categoria-icons/stock-car.svg', 1, NOW(), NOW()),
  (168, 'supstanduppaddle', 'SUP - Stand Up Paddle', '/categoria-icons/sup-stand-up-paddle.svg', 1, NOW(), NOW()),
  (169, 'taekwondo', 'Taekwondo', '/categoria-icons/taekwondo.svg', 1, NOW(), NOW()),
  (170, 'tiro', 'Tiro', '/categoria-icons/tiro.svg', 1, NOW(), NOW()),
  (171, 'torcidas', 'Torcidas', '/categoria-icons/torcidas.svg', 1, NOW(), NOW()),
  (172, 'torcidasdefutebol', 'Torcidas de Futebol', '/categoria-icons/torcidas-de-futebol.svg', 1, NOW(), NOW()),
  (173, 'trailrun', 'Trail Run', '/categoria-icons/trail-run.svg', 1, NOW(), NOW()),
  (174, 'trainingcamp', 'Training Camp', '/categoria-icons/training-camp.svg', 1, NOW(), NOW()),
  (175, 'treinamentofuncional', 'Treinamento Funcional', '/categoria-icons/treinamento-funcional.svg', 1, NOW(), NOW()),
  (176, 'treinosof', 'Treinos OF', '/categoria-icons/treinos-of.svg', 1, NOW(), NOW()),
  (177, 'trekkingtrilhas', 'Trekking / Trilhas', '/categoria-icons/trekking-trilhas.svg', 1, NOW(), NOW()),
  (178, 'trestambores', 'Três Tambores', '/categoria-icons/tres-tambores.svg', 1, NOW(), NOW()),
  (179, 'ultramaratona', 'Ultramaratona', '/categoria-icons/ultramaratona.svg', 1, NOW(), NOW()),
  (180, 'vaquejada', 'Vaquejada', '/categoria-icons/vaquejada.svg', 1, NOW(), NOW()),
  (181, 'vela', 'Vela', '/categoria-icons/vela.svg', 1, NOW(), NOW()),
  (182, 'velocross', 'Velocross', '/categoria-icons/velocross.svg', 1, NOW(), NOW()),
  (183, 'voleidepraia', 'Vôlei de Praia', '/categoria-icons/volei-de-praia.svg', 1, NOW(), NOW()),
  (184, 'voolivre', 'Voo Livre', '/categoria-icons/voo-livre.svg', 1, NOW(), NOW()),
  (185, 'wakeboard', 'Wakeboard', NULL, 1, NOW(), NOW()),
  (186, 'windsurf', 'Windsurf', '/categoria-icons/surf.svg', 1, NOW(), NOW()),
  (187, 'wrestling', 'Wrestling', '/categoria-icons/wrestling.svg', 1, NOW(), NOW());

-- Mapeamento categoria -> Foco Radical (NÃO é identidade como no Fotop — cada
-- id_categoria_provedor bruto do Foco Radical resolve pra uma Categoria local
-- existente ou nova, conforme FOCO_RADICAL_CATEGORIA_MAP)
INSERT IGNORE INTO categorias_provedores (categoria_id, provedor_id, id_categoria_provedor, created_at, updated_at)
SELECT m.categoria_id, p.id, m.id_categoria_provedor, NOW(), NOW()
FROM (
  SELECT 81 AS categoria_id, '133' AS id_categoria_provedor
  UNION ALL
  SELECT 42 AS categoria_id, '93' AS id_categoria_provedor
  UNION ALL
  SELECT 82 AS categoria_id, '128' AS id_categoria_provedor
  UNION ALL
  SELECT 83 AS categoria_id, '156' AS id_categoria_provedor
  UNION ALL
  SELECT 84 AS categoria_id, '77' AS id_categoria_provedor
  UNION ALL
  SELECT 85 AS categoria_id, '94' AS id_categoria_provedor
  UNION ALL
  SELECT 43 AS categoria_id, '25' AS id_categoria_provedor
  UNION ALL
  SELECT 86 AS categoria_id, '31' AS id_categoria_provedor
  UNION ALL
  SELECT 44 AS categoria_id, '125' AS id_categoria_provedor
  UNION ALL
  SELECT 87 AS categoria_id, '151' AS id_categoria_provedor
  UNION ALL
  SELECT 35 AS categoria_id, '96' AS id_categoria_provedor
  UNION ALL
  SELECT 25 AS categoria_id, '50' AS id_categoria_provedor
  UNION ALL
  SELECT 45 AS categoria_id, '105' AS id_categoria_provedor
  UNION ALL
  SELECT 26 AS categoria_id, '76' AS id_categoria_provedor
  UNION ALL
  SELECT 88 AS categoria_id, '78' AS id_categoria_provedor
  UNION ALL
  SELECT 89 AS categoria_id, '111' AS id_categoria_provedor
  UNION ALL
  SELECT 90 AS categoria_id, '182' AS id_categoria_provedor
  UNION ALL
  SELECT 91 AS categoria_id, '65' AS id_categoria_provedor
  UNION ALL
  SELECT 92 AS categoria_id, '163' AS id_categoria_provedor
  UNION ALL
  SELECT 93 AS categoria_id, '47' AS id_categoria_provedor
  UNION ALL
  SELECT 94 AS categoria_id, '168' AS id_categoria_provedor
  UNION ALL
  SELECT 95 AS categoria_id, '98' AS id_categoria_provedor
  UNION ALL
  SELECT 96 AS categoria_id, '171' AS id_categoria_provedor
  UNION ALL
  SELECT 97 AS categoria_id, '60' AS id_categoria_provedor
  UNION ALL
  SELECT 98 AS categoria_id, '51' AS id_categoria_provedor
  UNION ALL
  SELECT 99 AS categoria_id, '97' AS id_categoria_provedor
  UNION ALL
  SELECT 100 AS categoria_id, '108' AS id_categoria_provedor
  UNION ALL
  SELECT 101 AS categoria_id, '177' AS id_categoria_provedor
  UNION ALL
  SELECT 46 AS categoria_id, '44' AS id_categoria_provedor
  UNION ALL
  SELECT 61 AS categoria_id, '75' AS id_categoria_provedor
  UNION ALL
  SELECT 102 AS categoria_id, '134' AS id_categoria_provedor
  UNION ALL
  SELECT 4 AS categoria_id, '3' AS id_categoria_provedor
  UNION ALL
  SELECT 103 AS categoria_id, '85' AS id_categoria_provedor
  UNION ALL
  SELECT 41 AS categoria_id, '30' AS id_categoria_provedor
  UNION ALL
  SELECT 104 AS categoria_id, '66' AS id_categoria_provedor
  UNION ALL
  SELECT 1 AS categoria_id, '1' AS id_categoria_provedor
  UNION ALL
  SELECT 105 AS categoria_id, '70' AS id_categoria_provedor
  UNION ALL
  SELECT 106 AS categoria_id, '132' AS id_categoria_provedor
  UNION ALL
  SELECT 107 AS categoria_id, '106' AS id_categoria_provedor
  UNION ALL
  SELECT 27 AS categoria_id, '35' AS id_categoria_provedor
  UNION ALL
  SELECT 108 AS categoria_id, '146' AS id_categoria_provedor
  UNION ALL
  SELECT 109 AS categoria_id, '142' AS id_categoria_provedor
  UNION ALL
  SELECT 110 AS categoria_id, '5' AS id_categoria_provedor
  UNION ALL
  SELECT 5 AS categoria_id, '131' AS id_categoria_provedor
  UNION ALL
  SELECT 111 AS categoria_id, '183' AS id_categoria_provedor
  UNION ALL
  SELECT 112 AS categoria_id, '87' AS id_categoria_provedor
  UNION ALL
  SELECT 113 AS categoria_id, '144' AS id_categoria_provedor
  UNION ALL
  SELECT 114 AS categoria_id, '187' AS id_categoria_provedor
  UNION ALL
  SELECT 115 AS categoria_id, '28' AS id_categoria_provedor
  UNION ALL
  SELECT 116 AS categoria_id, '99' AS id_categoria_provedor
  UNION ALL
  SELECT 117 AS categoria_id, '186' AS id_categoria_provedor
  UNION ALL
  SELECT 62 AS categoria_id, '48' AS id_categoria_provedor
  UNION ALL
  SELECT 118 AS categoria_id, '124' AS id_categoria_provedor
  UNION ALL
  SELECT 119 AS categoria_id, '139' AS id_categoria_provedor
  UNION ALL
  SELECT 120 AS categoria_id, '185' AS id_categoria_provedor
  UNION ALL
  SELECT 121 AS categoria_id, '103' AS id_categoria_provedor
  UNION ALL
  SELECT 3 AS categoria_id, '17' AS id_categoria_provedor
  UNION ALL
  SELECT 122 AS categoria_id, '104' AS id_categoria_provedor
  UNION ALL
  SELECT 38 AS categoria_id, '24' AS id_categoria_provedor
  UNION ALL
  SELECT 123 AS categoria_id, '11' AS id_categoria_provedor
  UNION ALL
  SELECT 28 AS categoria_id, '16' AS id_categoria_provedor
  UNION ALL
  SELECT 124 AS categoria_id, '130' AS id_categoria_provedor
  UNION ALL
  SELECT 63 AS categoria_id, '84' AS id_categoria_provedor
  UNION ALL
  SELECT 125 AS categoria_id, '86' AS id_categoria_provedor
  UNION ALL
  SELECT 126 AS categoria_id, '141' AS id_categoria_provedor
  UNION ALL
  SELECT 30 AS categoria_id, '149' AS id_categoria_provedor
  UNION ALL
  SELECT 127 AS categoria_id, '26' AS id_categoria_provedor
  UNION ALL
  SELECT 128 AS categoria_id, '52' AS id_categoria_provedor
  UNION ALL
  SELECT 31 AS categoria_id, '157' AS id_categoria_provedor
  UNION ALL
  SELECT 129 AS categoria_id, '88' AS id_categoria_provedor
  UNION ALL
  SELECT 130 AS categoria_id, '74' AS id_categoria_provedor
  UNION ALL
  SELECT 36 AS categoria_id, '27' AS id_categoria_provedor
  UNION ALL
  SELECT 131 AS categoria_id, '166' AS id_categoria_provedor
  UNION ALL
  SELECT 32 AS categoria_id, '39' AS id_categoria_provedor
  UNION ALL
  SELECT 49 AS categoria_id, '83' AS id_categoria_provedor
  UNION ALL
  SELECT 64 AS categoria_id, '20' AS id_categoria_provedor
  UNION ALL
  SELECT 65 AS categoria_id, '46' AS id_categoria_provedor
  UNION ALL
  SELECT 132 AS categoria_id, '140' AS id_categoria_provedor
  UNION ALL
  SELECT 66 AS categoria_id, '23' AS id_categoria_provedor
  UNION ALL
  SELECT 133 AS categoria_id, '107' AS id_categoria_provedor
  UNION ALL
  SELECT 67 AS categoria_id, '71' AS id_categoria_provedor
  UNION ALL
  SELECT 134 AS categoria_id, '73' AS id_categoria_provedor
  UNION ALL
  SELECT 135 AS categoria_id, '181' AS id_categoria_provedor
  UNION ALL
  SELECT 136 AS categoria_id, '53' AS id_categoria_provedor
  UNION ALL
  SELECT 51 AS categoria_id, '7' AS id_categoria_provedor
  UNION ALL
  SELECT 137 AS categoria_id, '81' AS id_categoria_provedor
  UNION ALL
  SELECT 138 AS categoria_id, '127' AS id_categoria_provedor
  UNION ALL
  SELECT 139 AS categoria_id, '164' AS id_categoria_provedor
  UNION ALL
  SELECT 140 AS categoria_id, '165' AS id_categoria_provedor
  UNION ALL
  SELECT 141 AS categoria_id, '54' AS id_categoria_provedor
  UNION ALL
  SELECT 142 AS categoria_id, '57' AS id_categoria_provedor
  UNION ALL
  SELECT 143 AS categoria_id, '55' AS id_categoria_provedor
  UNION ALL
  SELECT 144 AS categoria_id, '9' AS id_categoria_provedor
  UNION ALL
  SELECT 145 AS categoria_id, '33' AS id_categoria_provedor
  UNION ALL
  SELECT 146 AS categoria_id, '13' AS id_categoria_provedor
  UNION ALL
  SELECT 68 AS categoria_id, '14' AS id_categoria_provedor
  UNION ALL
  SELECT 69 AS categoria_id, '101' AS id_categoria_provedor
  UNION ALL
  SELECT 147 AS categoria_id, '172' AS id_categoria_provedor
  UNION ALL
  SELECT 148 AS categoria_id, '59' AS id_categoria_provedor
  UNION ALL
  SELECT 149 AS categoria_id, '79' AS id_categoria_provedor
  UNION ALL
  SELECT 70 AS categoria_id, '41' AS id_categoria_provedor
  UNION ALL
  SELECT 150 AS categoria_id, '138' AS id_categoria_provedor
  UNION ALL
  SELECT 33 AS categoria_id, '6' AS id_categoria_provedor
  UNION ALL
  SELECT 151 AS categoria_id, '89' AS id_categoria_provedor
  UNION ALL
  SELECT 152 AS categoria_id, '92' AS id_categoria_provedor
  UNION ALL
  SELECT 153 AS categoria_id, '18' AS id_categoria_provedor
  UNION ALL
  SELECT 40 AS categoria_id, '38' AS id_categoria_provedor
  UNION ALL
  SELECT 53 AS categoria_id, '45' AS id_categoria_provedor
  UNION ALL
  SELECT 72 AS categoria_id, '12' AS id_categoria_provedor
  UNION ALL
  SELECT 71 AS categoria_id, '135' AS id_categoria_provedor
  UNION ALL
  SELECT 154 AS categoria_id, '95' AS id_categoria_provedor
  UNION ALL
  SELECT 54 AS categoria_id, '22' AS id_categoria_provedor
  UNION ALL
  SELECT 155 AS categoria_id, '82' AS id_categoria_provedor
  UNION ALL
  SELECT 156 AS categoria_id, '167' AS id_categoria_provedor
  UNION ALL
  SELECT 157 AS categoria_id, '174' AS id_categoria_provedor
  UNION ALL
  SELECT 55 AS categoria_id, '159' AS id_categoria_provedor
  UNION ALL
  SELECT 158 AS categoria_id, '155' AS id_categoria_provedor
  UNION ALL
  SELECT 56 AS categoria_id, '147' AS id_categoria_provedor
  UNION ALL
  SELECT 57 AS categoria_id, '150' AS id_categoria_provedor
  UNION ALL
  SELECT 159 AS categoria_id, '176' AS id_categoria_provedor
  UNION ALL
  SELECT 74 AS categoria_id, '63' AS id_categoria_provedor
  UNION ALL
  SELECT 48 AS categoria_id, '152' AS id_categoria_provedor
  UNION ALL
  SELECT 160 AS categoria_id, '62' AS id_categoria_provedor
  UNION ALL
  SELECT 161 AS categoria_id, '110' AS id_categoria_provedor
  UNION ALL
  SELECT 2 AS categoria_id, '112' AS id_categoria_provedor
  UNION ALL
  SELECT 162 AS categoria_id, '37' AS id_categoria_provedor
  UNION ALL
  SELECT 163 AS categoria_id, '21' AS id_categoria_provedor
  UNION ALL
  SELECT 164 AS categoria_id, '169' AS id_categoria_provedor
  UNION ALL
  SELECT 37 AS categoria_id, '67' AS id_categoria_provedor
  UNION ALL
  SELECT 59 AS categoria_id, '19' AS id_categoria_provedor
  UNION ALL
  SELECT 165 AS categoria_id, '160' AS id_categoria_provedor
  UNION ALL
  SELECT 166 AS categoria_id, '178' AS id_categoria_provedor
  UNION ALL
  SELECT 167 AS categoria_id, '102' AS id_categoria_provedor
  UNION ALL
  SELECT 168 AS categoria_id, '29' AS id_categoria_provedor
  UNION ALL
  SELECT 16 AS categoria_id, '8' AS id_categoria_provedor
  UNION ALL
  SELECT 169 AS categoria_id, '15' AS id_categoria_provedor
  UNION ALL
  SELECT 9 AS categoria_id, '36' AS id_categoria_provedor
  UNION ALL
  SELECT 60 AS categoria_id, '68' AS id_categoria_provedor
  UNION ALL
  SELECT 170 AS categoria_id, '34' AS id_categoria_provedor
  UNION ALL
  SELECT 171 AS categoria_id, '179' AS id_categoria_provedor
  UNION ALL
  SELECT 172 AS categoria_id, '119' AS id_categoria_provedor
  UNION ALL
  SELECT 173 AS categoria_id, '2' AS id_categoria_provedor
  UNION ALL
  SELECT 174 AS categoria_id, '109' AS id_categoria_provedor
  UNION ALL
  SELECT 175 AS categoria_id, '100' AS id_categoria_provedor
  UNION ALL
  SELECT 22 AS categoria_id, '170' AS id_categoria_provedor
  UNION ALL
  SELECT 176 AS categoria_id, '180' AS id_categoria_provedor
  UNION ALL
  SELECT 177 AS categoria_id, '32' AS id_categoria_provedor
  UNION ALL
  SELECT 178 AS categoria_id, '126' AS id_categoria_provedor
  UNION ALL
  SELECT 11 AS categoria_id, '4' AS id_categoria_provedor
  UNION ALL
  SELECT 179 AS categoria_id, '56' AS id_categoria_provedor
  UNION ALL
  SELECT 180 AS categoria_id, '72' AS id_categoria_provedor
  UNION ALL
  SELECT 181 AS categoria_id, '80' AS id_categoria_provedor
  UNION ALL
  SELECT 182 AS categoria_id, '154' AS id_categoria_provedor
  UNION ALL
  SELECT 34 AS categoria_id, '49' AS id_categoria_provedor
  UNION ALL
  SELECT 183 AS categoria_id, '91' AS id_categoria_provedor
  UNION ALL
  SELECT 184 AS categoria_id, '43' AS id_categoria_provedor
  UNION ALL
  SELECT 185 AS categoria_id, '153' AS id_categoria_provedor
  UNION ALL
  SELECT 186 AS categoria_id, '158' AS id_categoria_provedor
  UNION ALL
  SELECT 187 AS categoria_id, '145' AS id_categoria_provedor
  UNION ALL
  SELECT 75 AS categoria_id, '90' AS id_categoria_provedor
  UNION ALL
  SELECT 50 AS categoria_id, '64' AS id_categoria_provedor
  UNION ALL
  SELECT 22 AS categoria_id, '42' AS id_categoria_provedor
) AS m
JOIN provedores p ON p.slug = 'foco-radical';
