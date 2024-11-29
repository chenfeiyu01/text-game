import { Character } from "../../../class/human";

/**
 * 小野猪怪物
 * 基础属性:
 * - 较低生命值
 * - 较低防御力
 * - 中等攻击力
 * - 较高暴击率
 */
export const PIGLET_CONFIG = {
    name: "小野猪",
    maxHp: 80,
    maxMp: 50,
    attack: 15,
    defense: 3,
    critRate: 0.2,
    critDamage: 1.5,
    chargeRate: 1.0
} as const;

// 创建小野猪实例
const piglet = new Character(PIGLET_CONFIG);
