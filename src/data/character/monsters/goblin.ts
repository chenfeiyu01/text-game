import { Character } from "../../../class/human";

/**
 * 哥布林怪物
 * 基础属性:
 * - 中等生命值
 * - 较低防御力 
 * - 中等攻击力
 * - 中等暴击率
 */
export const GOBLIN_CONFIG = {
    name: "哥布林",
    maxHp: 100,
    maxMp: 60,
    attack: 12,
    defense: 5,
    critRate: 0.15,
    critDamage: 1.5,
    chargeRate: 1.0
} as const;

// 创建哥布林实例
const goblin = new Character(GOBLIN_CONFIG);
