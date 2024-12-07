import { Character } from "../class/character";
import { Monster } from "./monsters";
import { ItemId } from "./item";
import { StatType } from "./stats";

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
    monster: Monster;
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
    /** 等级范围 */
    levelRange: { min: number, max: number };
    /** 普通怪物池 */
    monsterGroups: MonsterGroup[];
    /** Boss池 */
    bosses: Monster[];
    /** 可能出现的事件 */
    events: EventConfig[];
    /** 基础奖励配置 */
    baseRewards: {
        exp: number;
        gold: number;
        items?: {
            id: ItemId;
            odds: number; // 权重
        }[];
    };
    /** 特殊规则 */
    rules: {
        minBattles: number;    // 最少战斗次数
        maxBattles: number;    // 最多战斗次数
        minEvents: number;     // 最少事件次数
        maxEvents: number;     // 最多事件次数
        bossRequired: boolean; // 是否必须击败Boss
        hiddenBosses?: Monster[]; // 隐藏Boss
    };
}

export enum ESCENES {
    MAPLE_FOREST = 'MAPLE_FOREST',     // 枫叶林
    DARKVINE_VALLEY = 'DARKVINE_VALLEY', // 黑藤谷
    DARK_SWAMP = 'DARK_SWAMP',         // 幽暗沼泽
    ANCIENT_RUINS = 'ANCIENT_RUINS',   // 古树遗迹
}

/**
 * 场景名称
 */
export const SCENE_NAMES = {
    [ESCENES.MAPLE_FOREST]: '枫叶林',
    [ESCENES.DARKVINE_VALLEY]: '黑藤谷',
    [ESCENES.DARK_SWAMP]: '幽暗沼泽',
    [ESCENES.ANCIENT_RUINS]: '古树遗迹',
}

/** 事件选项结果类型 */
export enum EventResultType {
    BUFF = 'BUFF',           // 获得增益效果
    DEBUFF = 'DEBUFF',       // 获得减益效果
    ITEM = 'ITEM',           // 获得物品
    HEAL = 'HEAL',           // 恢复生命
    DAMAGE = 'DAMAGE',       // 受到伤害
    GOLD = 'GOLD',          // 获得/失去金币
    HIDDEN_BOSS = 'HIDDEN_BOSS', // 触发隐藏Boss
    TREASURE = 'TREASURE',   // 发现宝藏
}

interface WeightedResult {
    result: {
        type: EventResultType;
        value: number;
        duration?: number;
        stat?: StatType;
        itemId?: ItemId;
        description: string;
    };
    weight: number;  // 权重，用于计算概率
}


/** 事件选项 */
export interface EventOption {
    text: string;           // 选项文本
    results: WeightedResult[]; // 选择后的结果
}

/** 事件配置 */
export interface EventConfig {
    id: string;
    title: string;
    description: string;
    options: EventOption[];
}

/** 怪物组配置 */
export interface MonsterGroup {
    monsters: Monster[];    // 可能出现的怪物
    minLevel: number;       // 最低等级
    maxLevel: number;       // 最高等级
    rewardMultiplier: number; // 奖励倍率
}