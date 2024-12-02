import { Character } from "../class/character";

/**
 * 物品类型枚举
 * @enum {string}
 * @description 定义了游戏中所有物品的类型
 */
export enum ItemType {
    /** 装备类物品 */
    GEAR = 'gear',
    /** 消耗品 */
    CONSUMABLE = 'consumable',
    /** 材料 */
    MATERIAL = 'material'
}


/**
 * 物品接口
 * @interface
 * @description 定义了游戏中物品的基本属性
 */
export interface Item {
    /** 物品唯一标识符 */
    id: ItemId;
    /** 物品名称 */
    name: string;
    /** 物品描述 */
    description: string;
    /** 物品类型 */
    type: ItemType;
    /** 物品稀有度 */
    rarity: ItemRarity;
    /** 是否可堆叠 */
    stackable: boolean;
    /** 最大堆叠数量 */
    maxStack?: number;
    /** 物品价格 */
    price: number;
    /** 是否可强化 */
    isEnhanceable?: boolean;
}

/**
 * 背包物品接口
 * @interface
 * @description 定义了背包中物品的数据结构
 */
export interface InventoryItem {
    /** 物品对象 */
    item: Item;
    /** 物品数量 */
    quantity: number;
}

/**
 * 消耗品ID枚举
 * @enum {string}
 */
export enum ConsumableItemId {
    /** 生命药水 */
    HEALTH_POTION = 'health_potion',
    /** 魔法药水 */
    MANA_POTION = 'mana_potion'
}

/**
 * 装备ID枚举
 * @enum {string}
 */
export enum GearItemId {
    /** 木剑 */
    WOODEN_SWORD = 'wooden_sword',
    /** 铁剑 */
    IRON_SWORD = 'iron_sword'
}

/**
 * 材料ID枚举
 * @enum {string}
 */
export enum MaterialItemId {
}

/**
 * 统一的物品ID访问命名空间
 * @namespace
 */
export namespace ItemId {
    /** 消耗品ID */
    export const Consumable = ConsumableItemId;
    /** 装备ID */
    export const Gear = GearItemId;
    /** 材料ID */
    export const Material = MaterialItemId;
}

/** 所有物品ID类型的联合类型 */
export type ItemId = ConsumableItemId | GearItemId | MaterialItemId;


/**
 * 物品稀有度枚举
 * @enum {string}
 * @description 定义了游戏中所有物品的稀有度
 */
export enum ItemRarity {
    /** 普通品质 */
    COMMON = 'common',
    /** 稀有品质 */
    RARE = 'rare',
    /** 传说品质 */
    LEGENDARY = 'legendary',
    /** 史诗品质 */
    EPIC = 'epic'
}

/** 装备基础属性 */
export interface GearStats {
    /** 攻击力 */
    attack?: number;
    /** 防御力 */
    defense?: number;
    /** 最大生命值 */
    maxHp?: number;
    /** 最大魔法值 */
    maxMp?: number;
    /** 暴击率 */
    critRate?: number;
    /** 暴击伤害 */
    critDamage?: number;
    /** 充能速率 */
    chargeRate?: number;
}

/** 装备特殊效果 */
export interface GearEffect {
    /** 效果描述 */
    description: string;
    /** 效果触发条件 */
    condition?: string;
    /** 效果类型 */
    type: 'passive' | 'active' | 'onHit' | 'onDamaged';
    /** 效果实现函数 */
    effect: (character: Character) => void;
}

/** 装备槽位枚举 */
/** 装备槽位枚举 */
export enum GearSlot {
    /** 武器槽位 */
    WEAPON = 'weapon',
    /** 护甲槽位 */
    ARMOR = 'armor',
    /** 饰品槽位 */
    ACCESSORY = 'accessory'
}

/** 
 * 装备物品接口
 * @description 定义了装备类物品的基本属性和效果
 */
export interface GearItem extends Item {
    /** 物品类型为装备 */
    type: ItemType.GEAR;
    /** 装备槽位 */
    slot: GearSlot;
    /** 装备基础属性 */
    stats: GearStats;
    /** 装备特殊效果列表 */
    effects?: GearEffect[];
    /** 当前强化等级 */
    enhanceLevel: number;
}

/** 类型保护函数 */
export function isGearItem(item: Item): item is GearItem {
    return item.type === ItemType.GEAR;
}

// 强化等级区间的成功率配置
const ENHANCE_LEVEL_RANGES = [
    { min: 1, max: 3, rate: 1.00 },    // 1-3级：100%
    { min: 4, max: 6, rate: 0.70 },    // 4-6级：70%
    { min: 7, max: 9, rate: 0.40 },    // 7-9级：40%
] as const;

// 10级以上的成功率计算
function calculateHighLevelSuccessRate(level: number): number {
    if (level < 10) return 0;

    const baseRate = 0.35; // 10级的基础成功率
    const reduction = (level - 9) * 0.05; // 每级降低5%
    const minRate = 0.05; // 最低成功率

    return Math.max(baseRate - reduction, minRate);
}

// 获取强化成功率
export function getEnhanceSuccessRate(level: number): number {
    // 查找等级区间的固定成功率
    const rangeConfig = ENHANCE_LEVEL_RANGES.find(
        range => level >= range.min && level <= range.max
    );

    if (rangeConfig) {
        return rangeConfig.rate;
    }

    // 10级以上使用递减公式
    return calculateHighLevelSuccessRate(level);
}

// 强化装备
export function enhanceGear(item: GearItem): {
    success: boolean;
    stats?: GearItem['stats'];
} {

    const successRate = getEnhanceSuccessRate(item.enhanceLevel);
    const success = Math.random() <= successRate;

    if (!success) {
        return { success: false };
    }

    // 保存原始属性用于计算提升
    const baseStats = { ...item.stats };

    // 计算新属性
    const newStats: GearItem['stats'] = {};
    for (const [key, value] of Object.entries(baseStats)) {
        if (value && ENHANCE_GROWTH_RATE[key as keyof typeof ENHANCE_GROWTH_RATE]) {
            const growth = value * ENHANCE_GROWTH_RATE[key as keyof typeof ENHANCE_GROWTH_RATE];
            newStats[key as keyof GearItem['stats']] = value + growth;
        }
    }

    // 更新装备属性和等级
    item.stats = newStats;
    item.enhanceLevel += 1;

    return {
        success: true,
        stats: newStats
    };
}

// 强化费用计算
export function calculateEnhanceCost(item: GearItem): number {
    const baseCost = item.price || 1000;
    return Math.floor(baseCost * (1 + item.enhanceLevel * 0.5));
}

// 强化属性成长系数
export const ENHANCE_GROWTH_RATE = {
    attack: 0.05,      // 每级增加基础攻击力的5%
    defense: 0.05,     // 每级增加基础防御力的5%
    critRate: 0.05,    // 每级增加基础暴击率的5%
    critDamage: 0.08,  // 每级增加基础暴击伤害的8%
} as const;