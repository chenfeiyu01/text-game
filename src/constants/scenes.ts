import { Character } from "../class/character";

/**
 * 奖励类型接口
 * @interface
 * @description 定义了游戏中战斗奖励的数据结构
 */
export interface Reward {
    /** 经验值奖励 */
    exp: number;
    /** 金币奖励 */
    gold?: number;
    /** 物品奖励ID列表 */
    items?: string[];
}

/**
 * 战斗遭遇接口
 * @interface
 * @description 定义了游戏中战斗遭遇的数据结构
 */
export interface BattleEncounter {
    /** 怪物角色 */
    monster: Character;
    /** 战斗奖励 */
    reward: Reward;
}

/**
 * 场景接口
 * @interface
 * @description 定义了游戏中场景的数据结构
 */
export interface Scene {
    /** 场景唯一标识符 */
    id: string;
    /** 场景名称 */
    name: string;
    /** 场景描述 */
    description: string;
    /** 普通战斗列表 */
    battles: BattleEncounter[];
    /** Boss战斗 */
    boss: BattleEncounter;
    /** 等级范围 */
    levelRange: { min: number, max: number };
}

export enum ESCENES {
    MAPLE_FOREST = 'MAPLE_FOREST',     // 枫叶林
    DARKVINE_VALLEY = 'DARKVINE_VALLEY', // 黑藤谷
    DARK_SWAMP = 'DARK_SWAMP',         // 幽暗沼泽
    ANCIENT_RUINS = 'ANCIENT_RUINS',   // 古树遗迹
}