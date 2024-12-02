import { Character } from "../class/character";

/**
 * 技能接口
 * @interface
 * @description 定义了游戏中技能的基本属性
 */
export interface Skill {
    /** 技能唯一标识符 */
    id: string;
    /** 技能名称 */
    name: string;
    /** 技能伤害值 */
    damage: number;
    /** 技能魔法消耗 */
    manaCost: number;
    /** 技能充能消耗 */
    chargeCost: number;
    /** 技能描述 */
    description: string;
    /** 技能效果函数 */
    effect?: (character: Character) => void;
    /** 学习需求等级 */
    requiredLevel: number;
    /** 学习费用 */
    cost: number;
}

/**
 * 技能列表
 * @constant
 * @description 游戏中所有可用的技能列表
 */
export const SKILL_LIST: Skill[] = [
    {
        id: 'fireball',
        name: '火球术',
        damage: 50,
        manaCost: 30,
        chargeCost: 100,
        description: '发射一个火球，造成范围伤害',
        requiredLevel: 1,
        cost: 0
    },
    {
        id: 'heal',
        name: '治疗术',
        damage: 0,
        manaCost: 40,
        chargeCost: 100,
        description: '恢复生命值',
        effect: (character: Character) => {
            character.hp = Math.min(character.maxHp, character.hp + 50);
        },
        requiredLevel: 2,
        cost: 10
    },
];