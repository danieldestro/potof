// Categorias do provedor externo Foco Radical, mapeadas para Categoria local.
// Ao contrário do Fotop (ver categoriaSeedData.ts), o id do Foco Radical NÃO vira
// Categoria.id — os códigos numéricos colidiriam com os do Fotop (ex: Foco Radical
// '3' = Ciclismo, mas Categoria.id 3 já é Futebol pelo seed do Fotop). Por isso cada
// entrada aqui carrega o id_categoria_provedor bruto do Foco Radical e resolve pra
// uma Categoria local — existente (merge, quando o nome já existia com grafia
// igual/equivalente) ou nova (id sequencial após o maior id usado pelo Fotop).
//
// Duplicatas e entradas sem valor de catálogo da lista original do Foco Radical
// ficaram de fora de propósito:
// - Nomes repetidos com ids diferentes (Beach Tennis 76/173/40, Crossfit 35/175,
//   Padel 38/999, Surf/'Surf.' 8/184, Treino/Treinos 42/170): só o id 'canônico' foi
//   mapeado — categorias_provedores tem @@unique([categoria_id, provedor_id]), então
//   não dá pra mapear dois ids do mesmo provedor pra mesma Categoria local.
// - id '61' ('teste') foi excluído: é valor de teste do próprio provedor, não uma
//   categoria de verdade.

export interface FocoRadicalCategoriaItem {
  idCategoriaProvedor: string;
  nomeOriginal: string;
  categoriaId: number;
}

// Categorias novas introduzidas por este provedor (id sequencial, pós-seed do Fotop).
export const FOCO_RADICAL_NOVAS_CATEGORIAS: { id: number; slug: string; nome: string }[] = [
  { id: 81, slug: 'aeromodelismo', nome: 'Aeromodelismo' },
  { id: 82, slug: 'altinha', nome: 'Altinha' },
  { id: 83, slug: 'apneia', nome: 'Apneia' },
  { id: 84, slug: 'aquathlon', nome: 'Aquathlon' },
  { id: 85, slug: 'arremessodepeso', nome: 'Arremesso de Peso' },
  { id: 86, slug: 'automobilismo', nome: 'Automobilismo' },
  { id: 87, slug: 'balonismo', nome: 'Balonismo' },
  { id: 88, slug: 'biathlon', nome: 'Biathlon' },
  { id: 89, slug: 'bmx', nome: 'BMX' },
  { id: 90, slug: 'bocha', nome: 'Bocha' },
  { id: 91, slug: 'bodyboard', nome: 'Bodyboard' },
  { id: 92, slug: 'boiacross', nome: 'Bóia Cross' },
  { id: 93, slug: 'boxe', nome: 'Boxe' },
  { id: 94, slug: 'bungeejump', nome: 'Bungee Jump' },
  { id: 95, slug: 'calistenia', nome: 'Calistenia' },
  { id: 96, slug: 'cambio', nome: 'Cambio' },
  { id: 97, slug: 'caminhada', nome: 'Caminhada' },
  { id: 98, slug: 'canicross', nome: 'Canicross' },
  { id: 99, slug: 'canionismo', nome: 'Canionismo' },
  { id: 100, slug: 'canoahavaiana', nome: 'Canoa Havaiana' },
  { id: 101, slug: 'canoapolinesia', nome: 'Canoa Polinésia' },
  { id: 102, slug: 'carrinhoderolima', nome: 'Carrinho de Rolimã' },
  { id: 103, slug: 'cicloturismo', nome: 'Cicloturismo' },
  { id: 104, slug: 'corridadeorientacao', nome: 'Corrida de Orientação' },
  { id: 105, slug: 'corridaemesteira', nome: 'Corrida em Esteira' },
  { id: 106, slug: 'corridapet', nome: 'Corrida Pet' },
  { id: 107, slug: 'crosscountry', nome: 'Cross Country' },
  { id: 108, slug: 'dirtjump', nome: 'Dirt Jump' },
  { id: 109, slug: 'downhil', nome: 'Downhil' },
  { id: 110, slug: 'duathlon', nome: 'Duathlon' },
  { id: 111, slug: 'entregadekit', nome: 'Entrega de Kit' },
  { id: 112, slug: 'escalada', nome: 'Escalada' },
  { id: 113, slug: 'esgrima', nome: 'Esgrima' },
  { id: 114, slug: 'esportessubaquatico', nome: 'Esportes Subaquático' },
  { id: 115, slug: 'esqui', nome: 'Esqui' },
  { id: 116, slug: 'eventomultiesporte', nome: 'Evento Multiesporte' },
  { id: 117, slug: 'finswimming', nome: 'Finswimming' },
  { id: 118, slug: 'fitdance', nome: 'Fitdance' },
  { id: 119, slug: 'flagfootball', nome: 'Flag Football' },
  { id: 120, slug: 'freediving', nome: 'Freediving' },
  { id: 121, slug: 'frescobol', nome: 'Frescobol' },
  { id: 122, slug: 'futebol7', nome: 'Futebol 7' },
  { id: 123, slug: 'futebolsociety', nome: 'Futebol Society' },
  { id: 124, slug: 'futmesa', nome: 'Futmesa' },
  { id: 125, slug: 'ginasticaacrobatica', nome: 'Ginástica Acrobática' },
  { id: 126, slug: 'ginasticaaerobica', nome: 'Ginástica Aeróbica' },
  { id: 127, slug: 'ginasticaolimpica', nome: 'Ginástica Olímpica' },
  { id: 128, slug: 'ginasticaritmica', nome: 'Ginástica Rítmica' },
  { id: 129, slug: 'gravel', nome: 'Gravel' },
  { id: 130, slug: 'halterofilismo', nome: 'Halterofilismo' },
  { id: 131, slug: 'hiking', nome: 'Hiking' },
  { id: 132, slug: 'jogosescolares', nome: 'Jogos Escolares' },
  { id: 133, slug: 'kangoo', nome: 'Kangoo' },
  { id: 134, slug: 'kart', nome: 'Kart' },
  { id: 135, slug: 'kettlebellsport', nome: 'Kettlebell Sport' },
  { id: 136, slug: 'kickboxing', nome: 'Kickboxing' },
  { id: 137, slug: 'lacocomprido', nome: 'Laço Comprido' },
  { id: 138, slug: 'lacoemdupla', nome: 'Laço em Dupla' },
  { id: 139, slug: 'levantamentodepesoolimpico', nome: 'Levantamento de peso olímpico' },
  { id: 140, slug: 'lifesaving', nome: 'Lifesaving' },
  { id: 141, slug: 'livrepodecadastraresporte', nome: 'Livre - Pode cadastrar esporte' },
  { id: 142, slug: 'luta', nome: 'Luta' },
  { id: 143, slug: 'maratonaaquatica', nome: 'Maratona Aquática' },
  { id: 144, slug: 'marchaatletica', nome: 'Marcha Atlética' },
  { id: 145, slug: 'mma', nome: 'MMA' },
  { id: 146, slug: 'montanhismo', nome: 'Montanhismo' },
  { id: 147, slug: 'motovelocidade', nome: 'Motovelocidade' },
  { id: 148, slug: 'mountainbike', nome: 'Mountain Bike' },
  { id: 149, slug: 'mtb', nome: 'MTB' },
  { id: 150, slug: 'musculacao', nome: 'Musculação' },
  { id: 151, slug: 'natacaocorrida', nome: 'Natação / Corrida' },
  { id: 152, slug: 'natacaoempiscina', nome: 'Natação em Piscina' },
  { id: 153, slug: 'offroad', nome: 'Off-Road' },
  { id: 154, slug: 'passeiociclistico', nome: 'Passeio Ciclístico' },
  { id: 155, slug: 'pedal', nome: 'Pedal' },
  { id: 156, slug: 'pendulo', nome: 'Pêndulo' },
  { id: 157, slug: 'pentatlomoderno', nome: 'Pentatlo moderno' },
  { id: 158, slug: 'pescasubmarina', nome: 'Pesca submarina' },
  { id: 159, slug: 'poker', nome: 'Poker' },
  { id: 160, slug: 'punhobol', nome: 'Punhobol' },
  { id: 161, slug: 'queimada', nome: 'Queimada' },
  { id: 162, slug: 'rapelropejumptirolesa', nome: 'Rapel / Rope jump / Tirolesa' },
  { id: 163, slug: 'remo', nome: 'Remo' },
  { id: 164, slug: 'rockjump', nome: 'Rock Jump' },
  { id: 165, slug: 'snookersinuca', nome: 'Snooker/Sinuca' },
  { id: 166, slug: 'squash', nome: 'Squash' },
  { id: 167, slug: 'stockcar', nome: 'Stock Car' },
  { id: 168, slug: 'supstanduppaddle', nome: 'SUP - Stand Up Paddle' },
  { id: 169, slug: 'taekwondo', nome: 'Taekwondo' },
  { id: 170, slug: 'tiro', nome: 'Tiro' },
  { id: 171, slug: 'torcidas', nome: 'Torcidas' },
  { id: 172, slug: 'torcidasdefutebol', nome: 'Torcidas de Futebol' },
  { id: 173, slug: 'trailrun', nome: 'Trail Run' },
  { id: 174, slug: 'trainingcamp', nome: 'Training Camp' },
  { id: 175, slug: 'treinamentofuncional', nome: 'Treinamento Funcional' },
  { id: 176, slug: 'treinosof', nome: 'Treinos OF' },
  { id: 177, slug: 'trekkingtrilhas', nome: 'Trekking / Trilhas' },
  { id: 178, slug: 'trestambores', nome: 'Três Tambores' },
  { id: 179, slug: 'ultramaratona', nome: 'Ultramaratona' },
  { id: 180, slug: 'vaquejada', nome: 'Vaquejada' },
  { id: 181, slug: 'vela', nome: 'Vela' },
  { id: 182, slug: 'velocross', nome: 'Velocross' },
  { id: 183, slug: 'voleidepraia', nome: 'Vôlei de Praia' },
  { id: 184, slug: 'voolivre', nome: 'Voo Livre' },
  { id: 185, slug: 'wakeboard', nome: 'Wakeboard' },
  { id: 186, slug: 'windsurf', nome: 'Windsurf' },
  { id: 187, slug: 'wrestling', nome: 'Wrestling' },
];

export const FOCO_RADICAL_CATEGORIA_MAP: FocoRadicalCategoriaItem[] = [
  { idCategoriaProvedor: '133', nomeOriginal: 'Aeromodelismo', categoriaId: 81 }, // Aeromodelismo
  { idCategoriaProvedor: '93', nomeOriginal: 'Airsoft', categoriaId: 42 }, // AirSoft
  { idCategoriaProvedor: '128', nomeOriginal: 'Altinha', categoriaId: 82 }, // Altinha
  { idCategoriaProvedor: '156', nomeOriginal: 'Apneia', categoriaId: 83 }, // Apneia
  { idCategoriaProvedor: '77', nomeOriginal: 'Aquathlon', categoriaId: 84 }, // Aquathlon
  { idCategoriaProvedor: '94', nomeOriginal: 'Arremesso de Peso', categoriaId: 85 }, // Arremesso de Peso
  { idCategoriaProvedor: '25', nomeOriginal: 'Atletismo', categoriaId: 43 }, // Atletismo
  { idCategoriaProvedor: '31', nomeOriginal: 'Automobilismo', categoriaId: 86 }, // Automobilismo
  { idCategoriaProvedor: '125', nomeOriginal: 'Badminton', categoriaId: 44 }, // Badminton
  { idCategoriaProvedor: '151', nomeOriginal: 'Balonismo', categoriaId: 87 }, // Balonismo
  { idCategoriaProvedor: '96', nomeOriginal: 'Baseball', categoriaId: 35 }, // Baseball
  { idCategoriaProvedor: '50', nomeOriginal: 'Basquete', categoriaId: 25 }, // Basquete
  { idCategoriaProvedor: '105', nomeOriginal: 'Beach Soccer', categoriaId: 45 }, // Beach Soccer
  { idCategoriaProvedor: '76', nomeOriginal: 'Beach Tennis', categoriaId: 26 }, // Beach Tênis
  { idCategoriaProvedor: '78', nomeOriginal: 'Biathlon', categoriaId: 88 }, // Biathlon
  { idCategoriaProvedor: '111', nomeOriginal: 'BMX', categoriaId: 89 }, // BMX
  { idCategoriaProvedor: '182', nomeOriginal: 'Bocha', categoriaId: 90 }, // Bocha
  { idCategoriaProvedor: '65', nomeOriginal: 'Bodyboard', categoriaId: 91 }, // Bodyboard
  { idCategoriaProvedor: '163', nomeOriginal: 'Bóia Cross', categoriaId: 92 }, // Bóia Cross
  { idCategoriaProvedor: '47', nomeOriginal: 'Boxe', categoriaId: 93 }, // Boxe
  { idCategoriaProvedor: '168', nomeOriginal: 'Bungee Jump', categoriaId: 94 }, // Bungee Jump
  { idCategoriaProvedor: '98', nomeOriginal: 'Calistenia', categoriaId: 95 }, // Calistenia
  { idCategoriaProvedor: '171', nomeOriginal: 'Cambio', categoriaId: 96 }, // Cambio
  { idCategoriaProvedor: '60', nomeOriginal: 'Caminhada', categoriaId: 97 }, // Caminhada
  { idCategoriaProvedor: '51', nomeOriginal: 'Canicross', categoriaId: 98 }, // Canicross
  { idCategoriaProvedor: '97', nomeOriginal: 'Canionismo', categoriaId: 99 }, // Canionismo
  { idCategoriaProvedor: '108', nomeOriginal: 'Canoa Havaiana', categoriaId: 100 }, // Canoa Havaiana
  { idCategoriaProvedor: '177', nomeOriginal: 'Canoa Polinésia', categoriaId: 101 }, // Canoa Polinésia
  { idCategoriaProvedor: '44', nomeOriginal: 'Canoagem', categoriaId: 46 }, // Canoagem
  { idCategoriaProvedor: '75', nomeOriginal: 'Capoeira', categoriaId: 61 }, // Capoeira
  { idCategoriaProvedor: '134', nomeOriginal: 'Carrinho de Rolimã', categoriaId: 102 }, // Carrinho de Rolimã
  { idCategoriaProvedor: '3', nomeOriginal: 'Ciclismo', categoriaId: 4 }, // Ciclismo
  { idCategoriaProvedor: '85', nomeOriginal: 'Cicloturismo', categoriaId: 103 }, // Cicloturismo
  { idCategoriaProvedor: '30', nomeOriginal: 'Corrida de Obstáculos', categoriaId: 41 }, // Corrida de Obstáculos
  { idCategoriaProvedor: '66', nomeOriginal: 'Corrida de Orientação', categoriaId: 104 }, // Corrida de Orientação
  { idCategoriaProvedor: '1', nomeOriginal: 'Corrida de Rua', categoriaId: 1 }, // Corrida de rua
  { idCategoriaProvedor: '70', nomeOriginal: 'Corrida em Esteira', categoriaId: 105 }, // Corrida em Esteira
  { idCategoriaProvedor: '132', nomeOriginal: 'Corrida Pet', categoriaId: 106 }, // Corrida Pet
  { idCategoriaProvedor: '106', nomeOriginal: 'Cross Country', categoriaId: 107 }, // Cross Country
  { idCategoriaProvedor: '35', nomeOriginal: 'Crossfit', categoriaId: 27 }, // Crossfit
  { idCategoriaProvedor: '146', nomeOriginal: 'Dirt Jump', categoriaId: 108 }, // Dirt Jump
  { idCategoriaProvedor: '142', nomeOriginal: 'Downhil', categoriaId: 109 }, // Downhil
  { idCategoriaProvedor: '5', nomeOriginal: 'Duathlon', categoriaId: 110 }, // Duathlon
  { idCategoriaProvedor: '131', nomeOriginal: 'Em aberto', categoriaId: 5 }, // Outros
  { idCategoriaProvedor: '183', nomeOriginal: 'Entrega de Kit', categoriaId: 111 }, // Entrega de Kit
  { idCategoriaProvedor: '87', nomeOriginal: 'Escalada', categoriaId: 112 }, // Escalada
  { idCategoriaProvedor: '144', nomeOriginal: 'Esgrima', categoriaId: 113 }, // Esgrima
  { idCategoriaProvedor: '187', nomeOriginal: 'Esportes Subaquático', categoriaId: 114 }, // Esportes Subaquático
  { idCategoriaProvedor: '28', nomeOriginal: 'Esqui', categoriaId: 115 }, // Esqui
  { idCategoriaProvedor: '99', nomeOriginal: 'Evento Multiesporte', categoriaId: 116 }, // Evento Multiesporte
  { idCategoriaProvedor: '186', nomeOriginal: 'Finswimming', categoriaId: 117 }, // Finswimming
  { idCategoriaProvedor: '48', nomeOriginal: 'Fisiculturismo', categoriaId: 62 }, // Fisiculturismo
  { idCategoriaProvedor: '124', nomeOriginal: 'Fitdance', categoriaId: 118 }, // Fitdance
  { idCategoriaProvedor: '139', nomeOriginal: 'Flag Football', categoriaId: 119 }, // Flag Football
  { idCategoriaProvedor: '185', nomeOriginal: 'Freediving', categoriaId: 120 }, // Freediving
  { idCategoriaProvedor: '103', nomeOriginal: 'Frescobol', categoriaId: 121 }, // Frescobol
  { idCategoriaProvedor: '17', nomeOriginal: 'Futebol', categoriaId: 3 }, // Futebol
  { idCategoriaProvedor: '104', nomeOriginal: 'Futebol 7', categoriaId: 122 }, // Futebol 7
  { idCategoriaProvedor: '24', nomeOriginal: 'Futebol Americano', categoriaId: 38 }, // Futebol Americano
  { idCategoriaProvedor: '11', nomeOriginal: 'Futebol Society', categoriaId: 123 }, // Futebol Society
  { idCategoriaProvedor: '16', nomeOriginal: 'Futevôlei', categoriaId: 28 }, // Futevôlei
  { idCategoriaProvedor: '130', nomeOriginal: 'Futmesa', categoriaId: 124 }, // Futmesa
  { idCategoriaProvedor: '84', nomeOriginal: 'Futsal', categoriaId: 63 }, // Futsal
  { idCategoriaProvedor: '86', nomeOriginal: 'Ginástica Acrobática', categoriaId: 125 }, // Ginástica Acrobática
  { idCategoriaProvedor: '141', nomeOriginal: 'Ginástica Aeróbica', categoriaId: 126 }, // Ginástica Aeróbica
  { idCategoriaProvedor: '149', nomeOriginal: 'Ginástica Artística', categoriaId: 30 }, // Ginástica Artística
  { idCategoriaProvedor: '26', nomeOriginal: 'Ginástica Olímpica', categoriaId: 127 }, // Ginástica Olímpica
  { idCategoriaProvedor: '52', nomeOriginal: 'Ginástica Rítmica', categoriaId: 128 }, // Ginástica Rítmica
  { idCategoriaProvedor: '157', nomeOriginal: 'Golfe', categoriaId: 31 }, // Golfe
  { idCategoriaProvedor: '88', nomeOriginal: 'Gravel', categoriaId: 129 }, // Gravel
  { idCategoriaProvedor: '74', nomeOriginal: 'Halterofilismo', categoriaId: 130 }, // Halterofilismo
  { idCategoriaProvedor: '27', nomeOriginal: 'Handebol', categoriaId: 36 }, // Handebol
  { idCategoriaProvedor: '166', nomeOriginal: 'Hiking', categoriaId: 131 }, // Hiking
  { idCategoriaProvedor: '39', nomeOriginal: 'Hipismo', categoriaId: 32 }, // Hipismo
  { idCategoriaProvedor: '83', nomeOriginal: 'Hóquei', categoriaId: 49 }, // Hockey
  { idCategoriaProvedor: '20', nomeOriginal: 'Iatismo / Vela / Remo', categoriaId: 64 }, // Iatismo
  { idCategoriaProvedor: '46', nomeOriginal: 'Jiu-jitsu', categoriaId: 65 }, // Jiu-jítzu
  { idCategoriaProvedor: '140', nomeOriginal: 'Jogos Escolares', categoriaId: 132 }, // Jogos Escolares
  { idCategoriaProvedor: '23', nomeOriginal: 'Judô', categoriaId: 66 }, // Judô
  { idCategoriaProvedor: '107', nomeOriginal: 'Kangoo', categoriaId: 133 }, // Kangoo
  { idCategoriaProvedor: '71', nomeOriginal: 'Karatê', categoriaId: 67 }, // Karatê
  { idCategoriaProvedor: '73', nomeOriginal: 'Kart', categoriaId: 134 }, // Kart
  { idCategoriaProvedor: '181', nomeOriginal: 'Kettlebell Sport', categoriaId: 135 }, // Kettlebell Sport
  { idCategoriaProvedor: '53', nomeOriginal: 'Kickboxing', categoriaId: 136 }, // Kickboxing
  { idCategoriaProvedor: '7', nomeOriginal: 'Kite Surf', categoriaId: 51 }, // Kitesurf
  { idCategoriaProvedor: '81', nomeOriginal: 'Laço Comprido', categoriaId: 137 }, // Laço Comprido
  { idCategoriaProvedor: '127', nomeOriginal: 'Laço em Dupla', categoriaId: 138 }, // Laço em Dupla
  { idCategoriaProvedor: '164', nomeOriginal: 'Levantamento de peso olímpico', categoriaId: 139 }, // Levantamento de peso olímpico
  { idCategoriaProvedor: '165', nomeOriginal: 'Lifesaving', categoriaId: 140 }, // Lifesaving
  { idCategoriaProvedor: '54', nomeOriginal: 'Livre - Pode cadastrar esporte', categoriaId: 141 }, // Livre - Pode cadastrar esporte
  { idCategoriaProvedor: '57', nomeOriginal: 'Luta', categoriaId: 142 }, // Luta
  { idCategoriaProvedor: '55', nomeOriginal: 'Maratona Aquática', categoriaId: 143 }, // Maratona Aquática
  { idCategoriaProvedor: '9', nomeOriginal: 'Marcha Atlética', categoriaId: 144 }, // Marcha Atlética
  { idCategoriaProvedor: '33', nomeOriginal: 'MMA', categoriaId: 145 }, // MMA
  { idCategoriaProvedor: '13', nomeOriginal: 'Montanhismo', categoriaId: 146 }, // Montanhismo
  { idCategoriaProvedor: '14', nomeOriginal: 'Motociclismo', categoriaId: 68 }, // Motociclismo
  { idCategoriaProvedor: '101', nomeOriginal: 'Motocross', categoriaId: 69 }, // Motocros
  { idCategoriaProvedor: '172', nomeOriginal: 'Motovelocidade', categoriaId: 147 }, // Motovelocidade
  { idCategoriaProvedor: '59', nomeOriginal: 'Mountain Bike', categoriaId: 148 }, // Mountain Bike
  { idCategoriaProvedor: '79', nomeOriginal: 'MTB', categoriaId: 149 }, // MTB
  { idCategoriaProvedor: '41', nomeOriginal: 'Muay Thai', categoriaId: 70 }, // Muay Thai
  { idCategoriaProvedor: '138', nomeOriginal: 'Musculação', categoriaId: 150 }, // Musculação
  { idCategoriaProvedor: '6', nomeOriginal: 'Natação', categoriaId: 33 }, // Natação
  { idCategoriaProvedor: '89', nomeOriginal: 'Natação / Corrida', categoriaId: 151 }, // Natação / Corrida
  { idCategoriaProvedor: '92', nomeOriginal: 'Natação em Piscina', categoriaId: 152 }, // Natação em Piscina
  { idCategoriaProvedor: '18', nomeOriginal: 'Off-Road', categoriaId: 153 }, // Off-Road
  { idCategoriaProvedor: '38', nomeOriginal: 'Padel', categoriaId: 40 }, // Padel
  { idCategoriaProvedor: '45', nomeOriginal: 'Paintball', categoriaId: 53 }, // Paintball
  { idCategoriaProvedor: '12', nomeOriginal: 'Parapente', categoriaId: 72 }, // Parapente
  { idCategoriaProvedor: '135', nomeOriginal: 'Paraquedismo', categoriaId: 71 }, // Paraquedismo
  { idCategoriaProvedor: '95', nomeOriginal: 'Passeio Ciclístico', categoriaId: 154 }, // Passeio Ciclístico
  { idCategoriaProvedor: '22', nomeOriginal: 'Patinação', categoriaId: 54 }, // Patinação
  { idCategoriaProvedor: '82', nomeOriginal: 'Pedal', categoriaId: 155 }, // Pedal
  { idCategoriaProvedor: '167', nomeOriginal: 'Pêndulo', categoriaId: 156 }, // Pêndulo
  { idCategoriaProvedor: '174', nomeOriginal: 'Pentatlo moderno', categoriaId: 157 }, // Pentatlo moderno
  { idCategoriaProvedor: '159', nomeOriginal: 'Pesca esportiva', categoriaId: 55 }, // Pescaria
  { idCategoriaProvedor: '155', nomeOriginal: 'Pesca submarina', categoriaId: 158 }, // Pesca submarina
  { idCategoriaProvedor: '147', nomeOriginal: 'Pickleball', categoriaId: 56 }, // Pickleball
  { idCategoriaProvedor: '150', nomeOriginal: 'Pilates', categoriaId: 57 }, // Pilates
  { idCategoriaProvedor: '176', nomeOriginal: 'Poker', categoriaId: 159 }, // Poker
  { idCategoriaProvedor: '63', nomeOriginal: 'Polo Aquático', categoriaId: 74 }, // Polo aquático
  { idCategoriaProvedor: '152', nomeOriginal: 'Provas equestres', categoriaId: 48 }, // Equestre
  { idCategoriaProvedor: '62', nomeOriginal: 'Punhobol', categoriaId: 160 }, // Punhobol
  { idCategoriaProvedor: '110', nomeOriginal: 'Queimada', categoriaId: 161 }, // Queimada
  { idCategoriaProvedor: '112', nomeOriginal: 'Rally', categoriaId: 2 }, // Rally
  { idCategoriaProvedor: '37', nomeOriginal: 'Rapel / Rope jump / Tirolesa', categoriaId: 162 }, // Rapel / Rope jump / Tirolesa
  { idCategoriaProvedor: '21', nomeOriginal: 'Remo', categoriaId: 163 }, // Remo
  { idCategoriaProvedor: '169', nomeOriginal: 'Rock Jump', categoriaId: 164 }, // Rock Jump
  { idCategoriaProvedor: '67', nomeOriginal: 'Rugby', categoriaId: 37 }, // Rugby
  { idCategoriaProvedor: '19', nomeOriginal: 'Skate', categoriaId: 59 }, // Skate
  { idCategoriaProvedor: '160', nomeOriginal: 'Snooker/Sinuca', categoriaId: 165 }, // Snooker/Sinuca
  { idCategoriaProvedor: '178', nomeOriginal: 'Squash', categoriaId: 166 }, // Squash
  { idCategoriaProvedor: '102', nomeOriginal: 'Stock Car', categoriaId: 167 }, // Stock Car
  { idCategoriaProvedor: '29', nomeOriginal: 'SUP - Stand Up Paddle', categoriaId: 168 }, // SUP - Stand Up Paddle
  { idCategoriaProvedor: '8', nomeOriginal: 'Surf', categoriaId: 16 }, // Surf
  { idCategoriaProvedor: '15', nomeOriginal: 'Taekwondo', categoriaId: 169 }, // Taekwondo
  { idCategoriaProvedor: '36', nomeOriginal: 'Tênis', categoriaId: 9 }, // Tenis
  { idCategoriaProvedor: '68', nomeOriginal: 'Tênis de mesa', categoriaId: 60 }, // Tênis de mesa
  { idCategoriaProvedor: '34', nomeOriginal: 'Tiro', categoriaId: 170 }, // Tiro
  { idCategoriaProvedor: '179', nomeOriginal: 'Torcidas', categoriaId: 171 }, // Torcidas
  { idCategoriaProvedor: '119', nomeOriginal: 'Torcidas de Futebol', categoriaId: 172 }, // Torcidas de Futebol
  { idCategoriaProvedor: '2', nomeOriginal: 'Trail Run', categoriaId: 173 }, // Trail Run
  { idCategoriaProvedor: '109', nomeOriginal: 'Training Camp', categoriaId: 174 }, // Training Camp
  { idCategoriaProvedor: '100', nomeOriginal: 'Treinamento Funcional', categoriaId: 175 }, // Treinamento Funcional
  { idCategoriaProvedor: '170', nomeOriginal: 'Treinos', categoriaId: 22 }, // Treinos
  { idCategoriaProvedor: '180', nomeOriginal: 'Treinos OF', categoriaId: 176 }, // Treinos OF
  { idCategoriaProvedor: '32', nomeOriginal: 'Trekking / Trilhas', categoriaId: 177 }, // Trekking / Trilhas
  { idCategoriaProvedor: '126', nomeOriginal: 'Três Tambores', categoriaId: 178 }, // Três Tambores
  { idCategoriaProvedor: '4', nomeOriginal: 'Triathlon', categoriaId: 11 }, // Duathlon / Triathlon
  { idCategoriaProvedor: '56', nomeOriginal: 'Ultramaratona', categoriaId: 179 }, // Ultramaratona
  { idCategoriaProvedor: '72', nomeOriginal: 'Vaquejada', categoriaId: 180 }, // Vaquejada
  { idCategoriaProvedor: '80', nomeOriginal: 'Vela', categoriaId: 181 }, // Vela
  { idCategoriaProvedor: '154', nomeOriginal: 'Velocross', categoriaId: 182 }, // Velocross
  { idCategoriaProvedor: '49', nomeOriginal: 'Vôlei', categoriaId: 34 }, // Vôlei
  { idCategoriaProvedor: '91', nomeOriginal: 'Vôlei de Praia', categoriaId: 183 }, // Vôlei de Praia
  { idCategoriaProvedor: '43', nomeOriginal: 'Voo Livre', categoriaId: 184 }, // Voo Livre
  { idCategoriaProvedor: '153', nomeOriginal: 'Wakeboard', categoriaId: 185 }, // Wakeboard
  { idCategoriaProvedor: '158', nomeOriginal: 'Windsurf', categoriaId: 186 }, // Windsurf
  { idCategoriaProvedor: '145', nomeOriginal: 'Wrestling', categoriaId: 187 }, // Wrestling
  { idCategoriaProvedor: '90', nomeOriginal: 'Xadrez', categoriaId: 75 }, // Xadrez
  { idCategoriaProvedor: '64', nomeOriginal: 'Yoga', categoriaId: 50 }, // Ioga
];
