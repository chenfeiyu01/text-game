import { Character } from '../../../class/human';

// 玩家初始属性配置
const PLAYER_CONFIG = {
    name: "陈泡泡",
    maxHp: 100,
    maxMp: 100,
    attack: 15,
    defense: 8,
    critRate: 0.2,
    critDamage: 2.0,
    chargeRate: 3.0
} as const;

// 创建玩家实例
const player = new Character(PLAYER_CONFIG);

export default player;
