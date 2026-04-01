import type { Season } from '../src/types/flower.js'
import { monthsToSeasons } from './season-mapper.js'

export interface RawFlowerData {
  id: string
  name: string
  latinName: string
  province: string
  coordinates: [number, number] // [lng, lat] 省会质心
  bloomMonths: number[] // 1-12
  description: string
  color: string
}

// 34个省级行政区省花/市花数据
// 来源：各省政府公告、《中国植物志》及权威百科
const PROVINCIAL_FLOWERS_RAW: Omit<RawFlowerData, 'bloomMonths'> & { bloomMonths: number[] }[] = [
  { id: 'bj-rose', name: '月季', latinName: 'Rosa chinensis', province: '北京市', coordinates: [116.4, 39.9], bloomMonths: [4, 5, 6, 7, 8, 9, 10], description: '月季被称为"花中皇后"，北京市花之一，四季开花，以春秋两季最盛，花色丰富，象征和平与友谊。', color: '#e8365d' },
  { id: 'bj-chrysanthemum', name: '菊花', latinName: 'Chrysanthemum morifolium', province: '北京市', coordinates: [116.5, 39.95], bloomMonths: [9, 10, 11], description: '菊花为北京市花之一，历史悠久，品种繁多，是重阳节的代表花卉，象征长寿与坚韧。', color: '#f5c518' },
  { id: 'sh-magnolia', name: '白玉兰', latinName: 'Magnolia denudata', province: '上海市', coordinates: [121.47, 31.23], bloomMonths: [2, 3, 4], description: '白玉兰是上海市花，早春盛开，花朵洁白如玉，香气清雅，是春天的使者，象征纯洁与高雅。', color: '#f8f4e8' },
  { id: 'tj-chrysanthemum', name: '菊花', latinName: 'Chrysanthemum morifolium', province: '天津市', coordinates: [117.2, 39.13], bloomMonths: [9, 10, 11], description: '菊花为天津市花，秋季盛开，品种丰富，天津以举办菊花展著称，象征坚强与长寿。', color: '#ff8c00' },
  { id: 'cq-camellia', name: '山茶花', latinName: 'Camellia japonica', province: '重庆市', coordinates: [106.55, 29.56], bloomMonths: [1, 2, 3, 4], description: '山茶花为重庆市花，冬春盛开，花大色艳，耐寒性强，象征坚贞与高洁。', color: '#c0392b' },
  { id: 'hb-plum', name: '梅花', latinName: 'Prunus mume', province: '湖北省', coordinates: [114.31, 30.52], bloomMonths: [1, 2, 3], description: '梅花为湖北省省花，武汉东湖梅园是全国最大的梅花观赏地之一，凌寒独放，象征坚强与高洁。', color: '#ff6b9d' },
  { id: 'hn-lotus', name: '荷花', latinName: 'Nelumbo nucifera', province: '湖南省', coordinates: [112.98, 28.19], bloomMonths: [6, 7, 8], description: '荷花为湖南省省花，夏季盛开，"出淤泥而不染"，是纯洁与高尚的象征，洞庭湖区荷花遍野。', color: '#ff9eb5' },
  { id: 'gd-kapok', name: '木棉花', latinName: 'Bombax ceiba', province: '广东省', coordinates: [113.26, 23.13], bloomMonths: [2, 3, 4], description: '木棉花为广东省省花，广州市花，英雄花，春季盛开，花大色红，象征英雄气概与南国风情。', color: '#e74c3c' },
  { id: 'gz-azalea', name: '杜鹃花', latinName: 'Rhododendron simsii', province: '贵州省', coordinates: [106.71, 26.57], bloomMonths: [3, 4, 5], description: '杜鹃花为贵州省省花，贵州百里杜鹃林是世界最大的天然杜鹃林海，春季漫山遍野，璀璨壮观。', color: '#e91e8c' },
  { id: 'yn-rhododendron', name: '云南山茶', latinName: 'Camellia reticulata', province: '云南省', coordinates: [102.71, 25.05], bloomMonths: [1, 2, 3, 4], description: '云南山茶为云南省省花，是世界山茶花的原始分布中心，花大如盘，色彩绚丽，被誉为"云南之骄傲"。', color: '#c0392b' },
  { id: 'sc-peony', name: '芙蓉花', latinName: 'Hibiscus mutabilis', province: '四川省', coordinates: [104.07, 30.67], bloomMonths: [9, 10, 11], description: '芙蓉花为成都市花，秋季盛开，一日三变色，朝白午红暮紫，成都自古有"蓉城"之称。', color: '#ff69b4' },
  { id: 'sx-peony', name: '牡丹', latinName: 'Paeonia suffruticosa', province: '山西省', coordinates: [112.55, 37.87], bloomMonths: [4, 5], description: '牡丹为山西省省花，花王之称，雍容华贵，洛阳牡丹甲天下，是中华民族繁荣昌盛的象征。', color: '#9b59b6' },
  { id: 'sd-peony', name: '牡丹', latinName: 'Paeonia suffruticosa', province: '山东省', coordinates: [117.0, 36.67], bloomMonths: [4, 5], description: '牡丹为山东省省花，菏泽牡丹是中国面积最大的牡丹生产基地，以"花王"著称，象征富贵吉祥。', color: '#8e44ad' },
  { id: 'he-lotus', name: '荷花', latinName: 'Nelumbo nucifera', province: '河北省', coordinates: [114.51, 38.05], bloomMonths: [6, 7, 8], description: '荷花为河北省省花，白洋淀荷花闻名全国，夏季碧荷连天，是纯洁清廉的象征。', color: '#ffb6c1' },
  { id: 'ha-lotus', name: '荷花', latinName: 'Nelumbo nucifera', province: '河南省', coordinates: [113.66, 34.76], bloomMonths: [6, 7, 8], description: '荷花为河南省省花，洛阳、开封等地荷花盛名，象征纯洁与和谐，是中原大地的夏日风景。', color: '#ff9eb5' },
  { id: 'js-plum', name: '梅花', latinName: 'Prunus mume', province: '江苏省', coordinates: [118.76, 32.06], bloomMonths: [1, 2, 3], description: '梅花为江苏省省花，南京梅花山是全国规模最大的梅花观赏地，梅花傲雪绽放，象征坚贞气节。', color: '#ffb3c6' },
  { id: 'zj-narcissus', name: '兰花', latinName: 'Cymbidium sinense', province: '浙江省', coordinates: [120.15, 30.29], bloomMonths: [1, 2, 3, 4], description: '兰花为浙江省省花，绍兴兰花举世闻名，幽香清远，象征高洁与君子之风，自古为文人所爱。', color: '#9b7ed8' },
  { id: 'ah-lotus', name: '荷花', latinName: 'Nelumbo nucifera', province: '安徽省', coordinates: [117.28, 31.86], bloomMonths: [6, 7, 8], description: '荷花为安徽省省花，皖南徽州一带荷塘成片，夏日荷花与粉墙黛瓦相映成趣，美不胜收。', color: '#ff9eb5' },
  { id: 'fj-narcissus', name: '水仙花', latinName: 'Narcissus tazetta', province: '福建省', coordinates: [119.3, 26.08], bloomMonths: [12, 1, 2], description: '水仙花为福建省省花，漳州水仙驰名中外，冬季盛开，清香淡雅，凌波而立，被誉为"凌波仙子"。', color: '#fffde7' },
  { id: 'jx-azalea', name: '杜鹃花', latinName: 'Rhododendron simsii', province: '江西省', coordinates: [115.89, 28.68], bloomMonths: [3, 4, 5], description: '杜鹃花为江西省省花，井冈山漫山遍野的杜鹃花是革命圣地的红色象征，春季灿烂盛开。', color: '#e91e63' },
  { id: 'hl-lilac', name: '丁香花', latinName: 'Syringa oblata', province: '黑龙江省', coordinates: [126.65, 45.75], bloomMonths: [4, 5], description: '丁香花为哈尔滨市花，春季盛开，紫白两色，香气浓郁，是东北大地春天到来的信号，象征勤劳朴实。', color: '#9c27b0' },
  { id: 'jl-crabapple', name: '君子兰', latinName: 'Clivia miniata', province: '吉林省', coordinates: [125.32, 43.9], bloomMonths: [1, 2, 3, 4], description: '君子兰为长春市花，冬春盛开，花形端庄，色彩鲜艳，象征君子之德，长春因此有"君子兰城"之称。', color: '#ff5722' },
  { id: 'ln-azalea', name: '天女木兰', latinName: 'Magnolia sieboldii', province: '辽宁省', coordinates: [123.43, 41.8], bloomMonths: [5, 6], description: '天女木兰为辽宁省省花，花朵洁白，芳香四溢，生长在千山等地，是辽宁山地的特色花卉。', color: '#ffffff' },
  { id: 'nm-kherlen', name: '马兰花', latinName: 'Iris lactea', province: '内蒙古自治区', coordinates: [111.66, 40.82], bloomMonths: [5, 6, 7], description: '马兰花为内蒙古自治区区花，草原上随风摇曳的蓝紫色花朵，是内蒙古大草原的标志性景色。', color: '#6c5ce7' },
  { id: 'sx-osmanthus', name: '桂花', latinName: 'Osmanthus fragrans', province: '陕西省', coordinates: [108.95, 34.27], bloomMonths: [8, 9, 10], description: '桂花为陕西省省花，汉中桂花节闻名遐迩，秋季香飘十里，是吉祥与友好的象征。', color: '#f39c12' },
  { id: 'gs-tiger-lily', name: '山丹花', latinName: 'Lilium pumilum', province: '甘肃省', coordinates: [103.82, 36.06], bloomMonths: [6, 7, 8], description: '山丹花为甘肃省省花，丝绸之路沿线山坡上盛开的红色百合，色泽鲜艳，是丝路文化的象征。', color: '#e74c3c' },
  { id: 'qh-cranesbill', name: '高山杜鹃', latinName: 'Rhododendron lapponicum', province: '青海省', coordinates: [101.77, 36.62], bloomMonths: [5, 6, 7], description: '高山杜鹃为青海省代表花卉，生长在高原山地，耐寒耐旱，花色艳丽，是青藏高原的生命奇迹。', color: '#e84393' },
  { id: 'nx-wolfberry', name: '枸杞花', latinName: 'Lycium barbarum', province: '宁夏回族自治区', coordinates: [106.27, 38.47], bloomMonths: [6, 7, 8], description: '枸杞花为宁夏代表花卉，小巧的紫色花朵孕育出驰名中外的宁夏枸杞，是塞上明珠的生命之花。', color: '#8e44ad' },
  { id: 'xj-rosa', name: '雪莲花', latinName: 'Saussurea involucrata', province: '新疆维吾尔自治区', coordinates: [87.62, 43.79], bloomMonths: [7, 8], description: '雪莲花为新疆代表花卉，生长在天山、昆仑山3000米以上的雪线附近，是高山植物中最神奇的花卉，象征圣洁与坚强。', color: '#ecf0f1' },
  { id: 'xz-rhododendron', name: '绿绒蒿', latinName: 'Meconopsis betonicifolia', province: '西藏自治区', coordinates: [91.11, 29.65], bloomMonths: [6, 7], description: '绿绒蒿为西藏代表花卉，喜马拉雅山脉特有植物，蓝色花朵极为珍稀，被称为"喜马拉雅蓝罂粟"。', color: '#2980b9' },
  { id: 'gx-osmanthus', name: '桂花', latinName: 'Osmanthus fragrans', province: '广西壮族自治区', coordinates: [108.36, 22.82], bloomMonths: [8, 9, 10], description: '桂花为广西壮族自治区区花，桂林因"桂花之乡"得名，秋季桂花飘香，美景如画，闻名遐迩。', color: '#f1c40f' },
  { id: 'hi-water-coconut', name: '三角梅', latinName: 'Bougainvillea spectabilis', province: '海南省', coordinates: [110.35, 20.02], bloomMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], description: '三角梅为海南省省花，全年盛开，色彩艳丽，适应性强，是热带海岛风情的典型代表。', color: '#e91e8c' },
  { id: 'tw-plum', name: '梅花', latinName: 'Prunus mume', province: '台湾省', coordinates: [120.96, 23.7], bloomMonths: [1, 2, 3], description: '梅花为台湾省花，阿里山、合欢山等地梅花盛开，冬末春初飘香，是坚韧精神的象征。', color: '#ffb3c6' },
  { id: 'hk-bauhinia', name: '洋紫荆', latinName: 'Bauhinia variegata', province: '香港特别行政区', coordinates: [114.17, 22.31], bloomMonths: [11, 12, 1, 2, 3], description: '洋紫荆为香港特别行政区区花，冬春盛开，五瓣粉紫色花朵构成香港旗帜图案，象征繁荣与美丽。', color: '#8b008b' },
  { id: 'mo-lotus', name: '莲花', latinName: 'Nelumbo nucifera', province: '澳门特别行政区', coordinates: [113.55, 22.2], bloomMonths: [6, 7, 8], description: '莲花为澳门特别行政区区花，澳门旗帜上的莲花象征澳门的纯洁与清廉，夏季盛开，出淤泥而不染。', color: '#ffb6c1' },

  // 著名中国特色花卉（非省花，但具代表性）
  { id: 'xj-lavender', name: '薰衣草', latinName: 'Lavandula angustifolia', province: '新疆维吾尔自治区', coordinates: [81.3, 43.9], bloomMonths: [6, 7, 8], description: '新疆伊犁河谷的薰衣草是中国最著名的薰衣草种植地，被誉为"东方普罗旺斯"，紫色花海壮观迷人。', color: '#7c4dff' },
  { id: 'yn-tulip', name: '郁金香', latinName: 'Tulipa gesneriana', province: '云南省', coordinates: [102.2, 25.8], bloomMonths: [3, 4, 5], description: '云南是中国郁金香的主要产地之一，昆明国际郁金香节吸引数十万游客，花色绚丽，五彩缤纷。', color: '#e53935' },
  { id: 'gs-rapeseed', name: '油菜花', latinName: 'Brassica napus', province: '甘肃省', coordinates: [102.07, 38.55], bloomMonths: [3, 4, 5], description: '甘南高原油菜花是西部著名景观，金黄色花海与雪山草原相映，是春天最壮观的自然画卷之一。', color: '#fdd835' },
  { id: 'jx-rapeseed', name: '油菜花', latinName: 'Brassica napus', province: '江西省', coordinates: [116.22, 29.1], bloomMonths: [2, 3], description: '江西婺源被誉为"中国最美乡村"，每年春季油菜花盛开，金黄花海与徽派建筑相映，美不胜收。', color: '#ffeb3b' },
  { id: 'sc-peach', name: '桃花', latinName: 'Prunus persica', province: '四川省', coordinates: [103.5, 31.2], bloomMonths: [3, 4], description: '四川龙泉驿桃花故里是全国最大的桃花旅游观光胜地，万亩桃花竞相开放，春意盎然，游人如织。', color: '#f48fb1' },
  { id: 'bj-peach', name: '桃花', latinName: 'Prunus persica', province: '北京市', coordinates: [116.2, 40.1], bloomMonths: [3, 4], description: '北京平谷区以桃花闻名，万亩桃花盛开时节，粉白花海绵延数十里，是春季京郊赏花胜地。', color: '#f06292' },
  { id: 'ha-peony', name: '牡丹', latinName: 'Paeonia suffruticosa', province: '河南省', coordinates: [112.45, 34.68], bloomMonths: [4, 5], description: '洛阳牡丹天下闻名，每年四月洛阳牡丹文化节吸引全国游客，品种逾千，被誉为"国色天香"。', color: '#ab47bc' },
  { id: 'zj-cherry', name: '樱花', latinName: 'Cerasus serrulata', province: '浙江省', coordinates: [119.5, 29.8], bloomMonths: [3, 4], description: '浙江杭州、宁波等地是中国最早种植樱花的地区之一，每年春季花期如云似雪，美轮美奂。', color: '#fce4ec' },
  { id: 'wh-cherry', name: '樱花', latinName: 'Cerasus serrulata', province: '湖北省', coordinates: [114.36, 30.55], bloomMonths: [3, 4], description: '武汉大学樱花是中国最著名的赏樱胜地，每年花期游人摩肩接踵，粉白花雨随风飘落，如诗如画。', color: '#f8bbd0' },
  { id: 'bj-wisteria', name: '紫藤', latinName: 'Wisteria sinensis', province: '北京市', coordinates: [116.38, 39.92], bloomMonths: [4, 5], description: '北京中山公园的百年紫藤是北京著名赏花景点，藤蔓交错，紫穗垂挂，香气迷人，是春日赏花必去之地。', color: '#7e57c2' },
  { id: 'sz-orchid', name: '蝴蝶兰', latinName: 'Phalaenopsis aphrodite', province: '广东省', coordinates: [113.88, 22.55], bloomMonths: [1, 2, 3, 4], description: '蝴蝶兰是广东及华南地区重要的兰花品种，花型优美如蝴蝶展翅，是春节最受欢迎的年花之一。', color: '#f3e5f5' },
  { id: 'yn-lotus', name: '洱海荷花', latinName: 'Nelumbo nucifera', province: '云南省', coordinates: [100.15, 25.65], bloomMonths: [6, 7, 8], description: '大理洱海畔的荷花与苍山洱海相映，是云南夏季著名的赏荷胜地，荷花丛中游船点点，如入仙境。', color: '#e91e8c' },
  { id: 'sc-lotus', name: '遂宁荷花', latinName: 'Nelumbo nucifera', province: '四川省', coordinates: [105.57, 30.51], bloomMonths: [6, 7, 8], description: '四川遂宁被称为"中国荷花之乡"，观音湖万亩荷花园是全国最大的荷花观赏园，夏季荷花盛开。', color: '#ffb3c6' },
  { id: 'gs-peony', name: '兰州牡丹', latinName: 'Paeonia suffruticosa', province: '甘肃省', coordinates: [103.82, 36.06], bloomMonths: [4, 5], description: '临夏牡丹是甘肃的特色花卉，当地牡丹种植历史悠久，每年花期万株牡丹竞相开放，绚丽壮观。', color: '#880e4f' },
  { id: 'hb-water-lily', name: '睡莲', latinName: 'Nymphaea tetragona', province: '湖北省', coordinates: [112.5, 31.1], bloomMonths: [6, 7, 8, 9], description: '湖北洪湖一带睡莲自然生长，湖面上星星点点的白色睡莲与荷花相映，是湿地生态的珍贵景观。', color: '#e1f5fe' },
  { id: 'jl-chrysanthemum', name: '延边菊花', latinName: 'Chrysanthemum indicum', province: '吉林省', coordinates: [129.5, 42.9], bloomMonths: [9, 10], description: '延边朝鲜族自治州的菊花融合了朝鲜族花卉文化，秋季金黄的野菊花遍布山野，是长白山秋景代表。', color: '#ff8f00' },
  { id: 'sd-chrysanthemum', name: '菏泽菊花', latinName: 'Chrysanthemum morifolium', province: '山东省', coordinates: [115.48, 35.23], bloomMonths: [10, 11], description: '菏泽不仅是牡丹之都，菊花种植也驰名全国，每年秋季菊花博览会展出数千个品种，蔚为壮观。', color: '#fff176' },
  { id: 'zj-azalea', name: '天台山杜鹃', latinName: 'Rhododendron fortunei', province: '浙江省', coordinates: [121.02, 29.13], bloomMonths: [4, 5], description: '浙江天台山华顶杜鹃是中国著名的高山杜鹃观赏地，每年五月杜鹃花开遍山野，粉红色花海壮观无比。', color: '#f48fb1' },
  { id: 'xz-glacier-lily', name: '报春花', latinName: 'Primula veris', province: '西藏自治区', coordinates: [90.17, 29.65], bloomMonths: [3, 4, 5], description: '西藏高原的报春花是春季最早开放的野花之一，色彩丰富，从雪线边缘一直绵延到河谷，如同春天的使者。', color: '#f06292' },
  { id: 'hl-iris', name: '鸢尾', latinName: 'Iris tectorum', province: '黑龙江省', coordinates: [128.0, 47.5], bloomMonths: [4, 5, 6], description: '东北湿地的鸢尾花是东北平原湿地最具代表性的野花，蓝紫色花朵在春末夏初盛开，成片生长极为壮观。', color: '#5c6bc0' },
  { id: 'fj-bougainvillea', name: '三角梅', latinName: 'Bougainvillea spectabilis', province: '福建省', coordinates: [118.1, 24.45], bloomMonths: [2, 3, 4, 5], description: '厦门是三角梅之城，市内三角梅品种逾百，花色繁多，是厦门最具代表性的城市花卉，四季常开。', color: '#d81b60' },
  { id: 'gd-orchid', name: '报岁兰', latinName: 'Cymbidium sinense', province: '广东省', coordinates: [112.1, 23.3], bloomMonths: [12, 1, 2], description: '报岁兰是岭南地区传统兰花品种，每逢新年前后盛开，香气浓郁持久，是广东人迎接新春的传统花卉。', color: '#6d4c41' },
  { id: 'yn-gentian', name: '龙胆花', latinName: 'Gentiana scabra', province: '云南省', coordinates: [99.3, 28.1], bloomMonths: [7, 8, 9], description: '云南高山草甸的龙胆花是高原夏末秋初的标志性花卉，深蓝紫色的花朵在绿色草甸上星星点点，极为珍贵。', color: '#1a237e' },
  { id: 'sc-gentian', name: '四川龙胆', latinName: 'Gentiana sceptrum', province: '四川省', coordinates: [102.1, 32.5], bloomMonths: [7, 8, 9], description: '四川若尔盖草原的龙胆花是高原湿地的代表花卉，蓝紫色花朵点缀在无边的草原上，是川西秘境的珍稀之花。', color: '#283593' },
  { id: 'nm-sunflower', name: '向日葵', latinName: 'Helianthus annuus', province: '内蒙古自治区', coordinates: [109.8, 40.6], bloomMonths: [7, 8, 9], description: '内蒙古乌兰察布等地种植大面积向日葵，金黄色花海随风摇曳，与蓝天白云相映，是草原夏日最壮观的景色。', color: '#fbc02d' },
  { id: 'xz-cosmos', name: '格桑花', latinName: 'Cosmos bipinnatus', province: '西藏自治区', coordinates: [88.5, 29.2], bloomMonths: [7, 8, 9], description: '格桑花被藏族人民视为幸福吉祥之花，广泛生长于西藏高原，粉紫色花朵随风起舞，是雪域高原的精神象征。', color: '#f48fb1' },
  { id: 'ha-forsythia', name: '连翘', latinName: 'Forsythia suspensa', province: '河南省', coordinates: [111.5, 35.1], bloomMonths: [3, 4], description: '太行山区的连翘是春天最早开放的野花之一，金黄色小花先于叶片绽放，是北方山地春回大地的信使。', color: '#f9a825' },
  { id: 'bj-forsythia', name: '迎春花', latinName: 'Jasminum nudiflorum', province: '北京市', coordinates: [116.3, 39.8], bloomMonths: [2, 3], description: '迎春花是北京最早报春的花卉，在冰雪消融之际率先开放，金黄色小花挂满枝头，象征希望与春天的到来。', color: '#f57f17' },
  { id: 'sx-paeonia', name: '芍药', latinName: 'Paeonia lactiflora', province: '山西省', coordinates: [113.2, 36.3], bloomMonths: [5, 6], description: '扬州是"芍药之乡"，但山西芍药同样驰名，春末夏初盛开，花大色艳，与牡丹并称"花中二绝"。', color: '#f06292' },
  { id: 'sd-paeonia', name: '扬州芍药', latinName: 'Paeonia lactiflora', province: '山东省', coordinates: [118.0, 36.0], bloomMonths: [5, 6], description: '山东作为重要的芍药产区，临沂、菏泽等地广泛种植，春末花期品种繁多，花色丰富，是重要的切花产区。', color: '#e91e8c' },
  { id: 'gx-jasmine', name: '茉莉花', latinName: 'Jasminum sambac', province: '广西壮族自治区', coordinates: [109.6, 22.3], bloomMonths: [5, 6, 7, 8, 9, 10], description: '广西横县是"世界茉莉花都"，茉莉花产量占全国80%以上，花香四溢，用于花茶制作，是中国最重要的茉莉产区。', color: '#f5f5f5' },
  { id: 'sc-campsis', name: '凌霄花', latinName: 'Campsis grandiflora', province: '四川省', coordinates: [106.0, 30.8], bloomMonths: [7, 8, 9], description: '凌霄花在四川古寺庙墙垣上广泛生长，橙红色喇叭状花朵攀援而上，是夏秋古建筑上最常见的攀援花卉。', color: '#e64a19' },
  { id: 'ah-azalea', name: '黄山杜鹃', latinName: 'Rhododendron maculiferum', province: '安徽省', coordinates: [118.16, 30.13], bloomMonths: [4, 5], description: '黄山杜鹃是黄山特有的珍稀植物，白色带斑点的花朵在云雾中绽放，与奇松怪石相映，是黄山四绝之一的重要组成。', color: '#fce4ec' },
  { id: 'ln-lilac', name: '千山丁香', latinName: 'Syringa villosa', province: '辽宁省', coordinates: [123.0, 40.9], bloomMonths: [5, 6], description: '辽宁千山的丁香花是辽东山地春天的标志性花卉，白色小花成串盛开，香气浓郁，满山飘香。', color: '#e1bee7' },
  { id: 'qh-edelweiss', name: '火绒草', latinName: 'Leontopodium leontopodioides', province: '青海省', coordinates: [100.5, 36.0], bloomMonths: [7, 8], description: '青海高原的火绒草（雪绒花）生长在3000米以上的高原草甸，白色绒毛状花朵晶莹圣洁，是高山植物的精灵。', color: '#fffde7' },
  { id: 'gd-bauhinia-pink', name: '宫粉羊蹄甲', latinName: 'Bauhinia variegata var. candida', province: '广东省', coordinates: [113.5, 22.8], bloomMonths: [2, 3, 4], description: '宫粉羊蹄甲是广东深圳的代表花卉，粉白相间的大型花朵密密层层，开花时如云似雪，是华南最美的行道树花卉。', color: '#f8bbd0' },
]

export interface ProcessedFlowerData {
  id: string
  name: string
  latinName: string
  province: string
  coordinates: [number, number]
  seasons: Season[]
  description: string
  color: string
  imageUrl: string
}

export function getProvincialFlowers(): ProcessedFlowerData[] {
  return PROVINCIAL_FLOWERS_RAW.map(f => ({
    id: f.id,
    name: f.name,
    latinName: f.latinName,
    province: f.province,
    coordinates: f.coordinates,
    seasons: monthsToSeasons(f.bloomMonths),
    description: f.description,
    color: f.color,
    imageUrl: '',
  }))
}
