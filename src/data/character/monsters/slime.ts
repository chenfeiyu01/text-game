import { Character } from "../../../class/character";
import { CharacterConfig } from "../../../class/character";
/**
 * 史莱姆怪物
 * 基础属性:
 * - 低生命值
 * - 低魔法值
 * - 低攻击力
 * - 低防御力
 * - 低暴击率
 * - 普通暴击伤害
 * - 普通充能效率
 */
export const SLIME_CONFIG: CharacterConfig = {
    name: "史莱姆",
    maxHp: 50,
    maxMp: 30,
    attack: 8,
    defense: 2,
    critRate: 0.05,
    critDamage: 1.2,
    chargeRate: 1.0
} as const;

// 创建史莱姆实例
const slime = new Character(SLIME_CONFIG);

// export default slime;