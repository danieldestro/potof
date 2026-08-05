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
  ('potof', 'Potof', 'Provedor próprio do potof.', NULL, 1, 1, NOW(3), NOW(3)),
  ('fotop', 'Fotop', 'fotop.com.br', 'https://fotop.com.br', 1, 0, NOW(3), NOW(3));

-- Categorias (id explícito = código do fotop — ver comentário em
-- backend/prisma/categoriaSeedData.ts, fonte desta lista)
INSERT IGNORE INTO categorias (id, slug, nome, ativo, created_at, updated_at) VALUES
  (1, 'corridaderua', 'Corrida de rua', 1, NOW(3), NOW(3)),
  (22, 'treinos', 'Treinos', 1, NOW(3), NOW(3)),
  (3, 'futebol', 'Futebol', 1, NOW(3), NOW(3)),
  (4, 'ciclismo', 'Ciclismo', 1, NOW(3), NOW(3)),
  (11, 'triathlon', 'Duathlon / Triathlon', 1, NOW(3), NOW(3)),
  (18, 'corridatrail', 'Corrida de montanha', 1, NOW(3), NOW(3)),
  (77, 'carnaval', 'Carnaval', 1, NOW(3), NOW(3)),
  (78, 'show-festival', 'Show / Festival', 1, NOW(3), NOW(3)),
  (24, 'acampamentos', 'Acampamentos', 1, NOW(3), NOW(3)),
  (26, 'beachtennis', 'Beach Tênis', 1, NOW(3), NOW(3)),
  (27, 'crossfit', 'Crossfit', 1, NOW(3), NOW(3)),
  (12, 'artemarcial', 'Arte Marcial', 1, NOW(3), NOW(3)),
  (17, 'esportesamotor', 'Esportes a motor', 1, NOW(3), NOW(3)),
  (20, 'turismo', 'Turismo', 1, NOW(3), NOW(3)),
  (23, 'Formatura', 'Formatura', 1, NOW(3), NOW(3)),
  (19, 'escolar', 'Escolar', 1, NOW(3), NOW(3)),
  (13, 'eventosocial', 'Evento Social', 1, NOW(3), NOW(3)),
  (14, 'ensaio', 'Ensaio', 1, NOW(3), NOW(3)),
  (28, 'futevolei', 'Futevôlei', 1, NOW(3), NOW(3)),
  (33, 'natacao', 'Natação', 1, NOW(3), NOW(3)),
  (39, 'esportesaquaticos', 'Esportes Aquáticos', 1, NOW(3), NOW(3)),
  (41, 'corridaobstaculos', 'Corrida de Obstáculos', 1, NOW(3), NOW(3)),
  (25, 'basquete', 'Basquete', 1, NOW(3), NOW(3)),
  (9, 'tenis', 'Tenis', 1, NOW(3), NOW(3)),
  (36, 'handball', 'Handebol', 1, NOW(3), NOW(3)),
  (32, 'hipismo', 'Hipismo', 1, NOW(3), NOW(3)),
  (31, 'golfe', 'Golfe', 1, NOW(3), NOW(3)),
  (40, 'padel', 'Padel', 1, NOW(3), NOW(3)),
  (2, 'rally', 'Rally', 1, NOW(3), NOW(3)),
  (37, 'rugby', 'Rugby', 1, NOW(3), NOW(3)),
  (16, 'surf', 'Surf', 1, NOW(3), NOW(3)),
  (34, 'volei', 'Vôlei', 1, NOW(3), NOW(3)),
  (35, 'baseball', 'Baseball', 1, NOW(3), NOW(3)),
  (30, 'ginasticaartistica', 'Ginástica Artística', 1, NOW(3), NOW(3)),
  (38, 'futebolamericano', 'Futebol Americano', 1, NOW(3), NOW(3)),
  (42, 'airsoft', 'AirSoft', 1, NOW(3), NOW(3)),
  (43, 'atletismo', 'Atletismo', 1, NOW(3), NOW(3)),
  (44, 'badminton', 'Badminton', 1, NOW(3), NOW(3)),
  (45, 'beachsoccer', 'Beach Soccer', 1, NOW(3), NOW(3)),
  (46, 'canoagem', 'Canoagem', 1, NOW(3), NOW(3)),
  (61, 'capoeira', 'Capoeira', 1, NOW(3), NOW(3)),
  (47, 'danca', 'Dança', 1, NOW(3), NOW(3)),
  (48, 'equestre', 'Equestre', 1, NOW(3), NOW(3)),
  (62, 'fisiculturismo', 'Fisiculturismo', 1, NOW(3), NOW(3)),
  (63, 'futsal', 'Futsal', 1, NOW(3), NOW(3)),
  (49, 'hockey', 'Hockey', 1, NOW(3), NOW(3)),
  (64, 'iatismo', 'Iatismo', 1, NOW(3), NOW(3)),
  (50, 'ioga', 'Ioga', 1, NOW(3), NOW(3)),
  (65, 'jiu-jítzu', 'Jiu-jítzu', 1, NOW(3), NOW(3)),
  (66, 'judo', 'Judô', 1, NOW(3), NOW(3)),
  (67, 'karate', 'Karatê', 1, NOW(3), NOW(3)),
  (51, 'kitesurf', 'Kitesurf', 1, NOW(3), NOW(3)),
  (52, 'mergulho', 'Mergulho', 1, NOW(3), NOW(3)),
  (68, 'motociclismo', 'Motociclismo', 1, NOW(3), NOW(3)),
  (69, 'motocros', 'Motocros', 1, NOW(3), NOW(3)),
  (70, 'muaythai', 'Muay Thai', 1, NOW(3), NOW(3)),
  (53, 'paintball', 'Paintball', 1, NOW(3), NOW(3)),
  (72, 'parapente', 'Parapente', 1, NOW(3), NOW(3)),
  (71, 'paraquedismo', 'Paraquedismo', 1, NOW(3), NOW(3)),
  (54, 'patinação', 'Patinação', 1, NOW(3), NOW(3)),
  (55, 'pescaria', 'Pescaria', 1, NOW(3), NOW(3)),
  (73, 'pets', 'Pets', 1, NOW(3), NOW(3)),
  (56, 'pickleball', 'Pickleball', 1, NOW(3), NOW(3)),
  (57, 'pilates', 'Pilates', 1, NOW(3), NOW(3)),
  (74, 'poloaquatico', 'Polo aquático', 1, NOW(3), NOW(3)),
  (58, 'rodeio', 'Rodeio', 1, NOW(3), NOW(3)),
  (59, 'skate', 'Skate', 1, NOW(3), NOW(3)),
  (60, 'tenisdemesa', 'Tênis de mesa', 1, NOW(3), NOW(3)),
  (75, 'xadrez', 'Xadrez', 1, NOW(3), NOW(3)),
  (79, 'hyrox', 'Hyrox', 1, NOW(3), NOW(3)),
  (80, 'moda', 'Moda', 1, NOW(3), NOW(3)),
  (15, 'outrosesportes', 'Outros Esportes', 1, NOW(3), NOW(3)),
  (5, 'outros', 'Outros', 1, NOW(3), NOW(3));

-- Mapeamento categoria -> Fotop (identidade, já que Categoria.id == id do fotop)
-- restrito às 73 categorias desta lista (por id explícito) — NÃO a todas as
-- linhas que existirem em `categorias` no momento em que isso rodar, já que
-- categorias adicionais cadastradas depois (via admin, com id autoincrement)
-- não têm nenhuma relação com a numeração do fotop.
INSERT IGNORE INTO categorias_provedores (categoria_id, provedor_id, id_categoria_provedor, created_at, updated_at)
SELECT c.id, p.id, CAST(c.id AS CHAR), NOW(3), NOW(3)
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
  ('foco-radical', 'Foco Radical', 'Foco Radical', 'https://www.focoradical.com.br/', 1, 0, NOW(3), NOW(3));

-- Categorias novas introduzidas pelo Foco Radical (id sequencial pós-Fotop,
-- 81-187 — ver comentário em focoRadicalSeedData.ts sobre por que não reusa
-- a numeração bruta do provedor, ao contrário do Fotop)
INSERT IGNORE INTO categorias (id, slug, nome, ativo, created_at, updated_at) VALUES
  (81, 'aeromodelismo', 'Aeromodelismo', 1, NOW(3), NOW(3)),
  (82, 'altinha', 'Altinha', 1, NOW(3), NOW(3)),
  (83, 'apneia', 'Apneia', 1, NOW(3), NOW(3)),
  (84, 'aquathlon', 'Aquathlon', 1, NOW(3), NOW(3)),
  (85, 'arremessodepeso', 'Arremesso de Peso', 1, NOW(3), NOW(3)),
  (86, 'automobilismo', 'Automobilismo', 1, NOW(3), NOW(3)),
  (87, 'balonismo', 'Balonismo', 1, NOW(3), NOW(3)),
  (88, 'biathlon', 'Biathlon', 1, NOW(3), NOW(3)),
  (89, 'bmx', 'BMX', 1, NOW(3), NOW(3)),
  (90, 'bocha', 'Bocha', 1, NOW(3), NOW(3)),
  (91, 'bodyboard', 'Bodyboard', 1, NOW(3), NOW(3)),
  (92, 'boiacross', 'Bóia Cross', 1, NOW(3), NOW(3)),
  (93, 'boxe', 'Boxe', 1, NOW(3), NOW(3)),
  (94, 'bungeejump', 'Bungee Jump', 1, NOW(3), NOW(3)),
  (95, 'calistenia', 'Calistenia', 1, NOW(3), NOW(3)),
  (96, 'cambio', 'Cambio', 1, NOW(3), NOW(3)),
  (97, 'caminhada', 'Caminhada', 1, NOW(3), NOW(3)),
  (98, 'canicross', 'Canicross', 1, NOW(3), NOW(3)),
  (99, 'canionismo', 'Canionismo', 1, NOW(3), NOW(3)),
  (100, 'canoahavaiana', 'Canoa Havaiana', 1, NOW(3), NOW(3)),
  (101, 'canoapolinesia', 'Canoa Polinésia', 1, NOW(3), NOW(3)),
  (102, 'carrinhoderolima', 'Carrinho de Rolimã', 1, NOW(3), NOW(3)),
  (103, 'cicloturismo', 'Cicloturismo', 1, NOW(3), NOW(3)),
  (104, 'corridadeorientacao', 'Corrida de Orientação', 1, NOW(3), NOW(3)),
  (105, 'corridaemesteira', 'Corrida em Esteira', 1, NOW(3), NOW(3)),
  (106, 'corridapet', 'Corrida Pet', 1, NOW(3), NOW(3)),
  (107, 'crosscountry', 'Cross Country', 1, NOW(3), NOW(3)),
  (108, 'dirtjump', 'Dirt Jump', 1, NOW(3), NOW(3)),
  (109, 'downhil', 'Downhil', 1, NOW(3), NOW(3)),
  (110, 'duathlon', 'Duathlon', 1, NOW(3), NOW(3)),
  (111, 'entregadekit', 'Entrega de Kit', 1, NOW(3), NOW(3)),
  (112, 'escalada', 'Escalada', 1, NOW(3), NOW(3)),
  (113, 'esgrima', 'Esgrima', 1, NOW(3), NOW(3)),
  (114, 'esportessubaquatico', 'Esportes Subaquático', 1, NOW(3), NOW(3)),
  (115, 'esqui', 'Esqui', 1, NOW(3), NOW(3)),
  (116, 'eventomultiesporte', 'Evento Multiesporte', 1, NOW(3), NOW(3)),
  (117, 'finswimming', 'Finswimming', 1, NOW(3), NOW(3)),
  (118, 'fitdance', 'Fitdance', 1, NOW(3), NOW(3)),
  (119, 'flagfootball', 'Flag Football', 1, NOW(3), NOW(3)),
  (120, 'freediving', 'Freediving', 1, NOW(3), NOW(3)),
  (121, 'frescobol', 'Frescobol', 1, NOW(3), NOW(3)),
  (122, 'futebol7', 'Futebol 7', 1, NOW(3), NOW(3)),
  (123, 'futebolsociety', 'Futebol Society', 1, NOW(3), NOW(3)),
  (124, 'futmesa', 'Futmesa', 1, NOW(3), NOW(3)),
  (125, 'ginasticaacrobatica', 'Ginástica Acrobática', 1, NOW(3), NOW(3)),
  (126, 'ginasticaaerobica', 'Ginástica Aeróbica', 1, NOW(3), NOW(3)),
  (127, 'ginasticaolimpica', 'Ginástica Olímpica', 1, NOW(3), NOW(3)),
  (128, 'ginasticaritmica', 'Ginástica Rítmica', 1, NOW(3), NOW(3)),
  (129, 'gravel', 'Gravel', 1, NOW(3), NOW(3)),
  (130, 'halterofilismo', 'Halterofilismo', 1, NOW(3), NOW(3)),
  (131, 'hiking', 'Hiking', 1, NOW(3), NOW(3)),
  (132, 'jogosescolares', 'Jogos Escolares', 1, NOW(3), NOW(3)),
  (133, 'kangoo', 'Kangoo', 1, NOW(3), NOW(3)),
  (134, 'kart', 'Kart', 1, NOW(3), NOW(3)),
  (135, 'kettlebellsport', 'Kettlebell Sport', 1, NOW(3), NOW(3)),
  (136, 'kickboxing', 'Kickboxing', 1, NOW(3), NOW(3)),
  (137, 'lacocomprido', 'Laço Comprido', 1, NOW(3), NOW(3)),
  (138, 'lacoemdupla', 'Laço em Dupla', 1, NOW(3), NOW(3)),
  (139, 'levantamentodepesoolimpico', 'Levantamento de peso olímpico', 1, NOW(3), NOW(3)),
  (140, 'lifesaving', 'Lifesaving', 1, NOW(3), NOW(3)),
  (141, 'livrepodecadastraresporte', 'Livre - Pode cadastrar esporte', 1, NOW(3), NOW(3)),
  (142, 'luta', 'Luta', 1, NOW(3), NOW(3)),
  (143, 'maratonaaquatica', 'Maratona Aquática', 1, NOW(3), NOW(3)),
  (144, 'marchaatletica', 'Marcha Atlética', 1, NOW(3), NOW(3)),
  (145, 'mma', 'MMA', 1, NOW(3), NOW(3)),
  (146, 'montanhismo', 'Montanhismo', 1, NOW(3), NOW(3)),
  (147, 'motovelocidade', 'Motovelocidade', 1, NOW(3), NOW(3)),
  (148, 'mountainbike', 'Mountain Bike', 1, NOW(3), NOW(3)),
  (149, 'mtb', 'MTB', 1, NOW(3), NOW(3)),
  (150, 'musculacao', 'Musculação', 1, NOW(3), NOW(3)),
  (151, 'natacaocorrida', 'Natação / Corrida', 1, NOW(3), NOW(3)),
  (152, 'natacaoempiscina', 'Natação em Piscina', 1, NOW(3), NOW(3)),
  (153, 'offroad', 'Off-Road', 1, NOW(3), NOW(3)),
  (154, 'passeiociclistico', 'Passeio Ciclístico', 1, NOW(3), NOW(3)),
  (155, 'pedal', 'Pedal', 1, NOW(3), NOW(3)),
  (156, 'pendulo', 'Pêndulo', 1, NOW(3), NOW(3)),
  (157, 'pentatlomoderno', 'Pentatlo moderno', 1, NOW(3), NOW(3)),
  (158, 'pescasubmarina', 'Pesca submarina', 1, NOW(3), NOW(3)),
  (159, 'poker', 'Poker', 1, NOW(3), NOW(3)),
  (160, 'punhobol', 'Punhobol', 1, NOW(3), NOW(3)),
  (161, 'queimada', 'Queimada', 1, NOW(3), NOW(3)),
  (162, 'rapelropejumptirolesa', 'Rapel / Rope jump / Tirolesa', 1, NOW(3), NOW(3)),
  (163, 'remo', 'Remo', 1, NOW(3), NOW(3)),
  (164, 'rockjump', 'Rock Jump', 1, NOW(3), NOW(3)),
  (165, 'snookersinuca', 'Snooker/Sinuca', 1, NOW(3), NOW(3)),
  (166, 'squash', 'Squash', 1, NOW(3), NOW(3)),
  (167, 'stockcar', 'Stock Car', 1, NOW(3), NOW(3)),
  (168, 'supstanduppaddle', 'SUP - Stand Up Paddle', 1, NOW(3), NOW(3)),
  (169, 'taekwondo', 'Taekwondo', 1, NOW(3), NOW(3)),
  (170, 'tiro', 'Tiro', 1, NOW(3), NOW(3)),
  (171, 'torcidas', 'Torcidas', 1, NOW(3), NOW(3)),
  (172, 'torcidasdefutebol', 'Torcidas de Futebol', 1, NOW(3), NOW(3)),
  (173, 'trailrun', 'Trail Run', 1, NOW(3), NOW(3)),
  (174, 'trainingcamp', 'Training Camp', 1, NOW(3), NOW(3)),
  (175, 'treinamentofuncional', 'Treinamento Funcional', 1, NOW(3), NOW(3)),
  (176, 'treinosof', 'Treinos OF', 1, NOW(3), NOW(3)),
  (177, 'trekkingtrilhas', 'Trekking / Trilhas', 1, NOW(3), NOW(3)),
  (178, 'trestambores', 'Três Tambores', 1, NOW(3), NOW(3)),
  (179, 'ultramaratona', 'Ultramaratona', 1, NOW(3), NOW(3)),
  (180, 'vaquejada', 'Vaquejada', 1, NOW(3), NOW(3)),
  (181, 'vela', 'Vela', 1, NOW(3), NOW(3)),
  (182, 'velocross', 'Velocross', 1, NOW(3), NOW(3)),
  (183, 'voleidepraia', 'Vôlei de Praia', 1, NOW(3), NOW(3)),
  (184, 'voolivre', 'Voo Livre', 1, NOW(3), NOW(3)),
  (185, 'wakeboard', 'Wakeboard', 1, NOW(3), NOW(3)),
  (186, 'windsurf', 'Windsurf', 1, NOW(3), NOW(3)),
  (187, 'wrestling', 'Wrestling', 1, NOW(3), NOW(3));

-- Mapeamento categoria -> Foco Radical (NÃO é identidade como no Fotop — cada
-- id_categoria_provedor bruto do Foco Radical resolve pra uma Categoria local
-- existente ou nova, conforme FOCO_RADICAL_CATEGORIA_MAP)
INSERT IGNORE INTO categorias_provedores (categoria_id, provedor_id, id_categoria_provedor, created_at, updated_at)
SELECT m.categoria_id, p.id, m.id_categoria_provedor, NOW(3), NOW(3)
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
) AS m
JOIN provedores p ON p.slug = 'foco-radical';
