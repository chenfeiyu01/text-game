import { Character } from "../class/character";
import { StatType } from './stats';

/**
 * 物品类型枚举
 * @enum {string}
 * @description 定义了游戏中所有物品的类型
 */
export enum ItemType {
    /** 装备类物品 */
    GEAR = 'GEAR',
    /** 消耗品 */
    CONSUMABLE = 'CONSUMABLE',
    /** 材料 */
    MATERIAL = 'MATERIAL'
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
    /** 1级生命药水 */
    HEALTH_POTION_1 = 'HEALTH_POTION_1',
    /** 1级魔法药水 */
    MANA_POTION_1 = 'MANA_POTION_1',
    /** 命运硬币 */
    FATE_COIN = 'FATE_COIN',
    /** 战士药剂 */
    WARRIORS_POTION = 'WARRIORS_POTION'
}

/**
 * 装备ID枚举
 * @enum {string}
 */
export enum GearItemId {
    /** 武器 */
    /** 木剑 */
    WOODEN_SWORD = 'WOODEN_SWORD',
    /** 铁剑 */
    IRON_SWORD = 'IRON_SWORD',
    /** 精铁剑 */
    STEEL_SWORD = 'STEEL_SWORD',
    /** 秘银剑 */
    RUNIC_SWORD = 'RUNIC_SWORD',
    /** 精钢剑 */
    FINE_STEEL_SWORD = 'FINE_STEEL_SWORD',
    /** 骑士剑 */
    KNIGHTS_SWORD = 'KNIGHTS_SWORD',
    /** 统帅之刃 */
    COMMANDER_BLADE = 'COMMANDER_BLADE',
    /** 屠龙剑 */
    DRAGON_SLAYER = 'DRAGON_SLAYER',


    /** 防具 */
    /** 学徒布甲 */
    APPRENTICE_CLOTH = 'APPRENTICE_CLOTH',
    /** 猎人皮甲 */
    HUNTERS_LEATHER = 'HUNTERS_LEATHER',
    /** 铁甲 */
    GUARD_ARMOR = 'GUARD_ARMOR',
    /** 秘银甲 */
    RUNIC_LEATHER = 'RUNIC_LEATHER',
    /** 月光守护甲 */
    MOONLIGHT_GUARD = 'MOONLIGHT_GUARD',
    /** 铁匠精制甲 */
    BLACKSMITH_CHAINMAIL = 'BLACKSMITH_CHAINMAIL',
    /** 异纹护甲 */
    OTHERWORLD_ARMOR = 'OTHERWORLD_ARMOR',
    /** 王国卫甲 */
    ROYAL_GUARD_ARMOR = 'ROYAL_GUARD_ARMOR',

    /** 饰品 */
    /** 铜戒指 */
    COPPER_RING = 'COPPER_RING',
    /** 学徒项链 */
    APPRENTICE_NECKLACE = 'APPRENTICE_NECKLACE',
    /** 魔力指环 */
    MANA_RING = 'MANA_RING',
    /** 战士臂环 */
    WARRIORS_BAND = 'WARRIORS_BAND',
    /** 龙心吊坠 */
    DRAGON_HEART_PENDANT = 'DRAGON_HEART_PENDANT',
    /** 天界皇冠 */
    CELESTIAL_CROWN = 'CELESTIAL_CROWN'
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
    COMMON = 'COMMON',
    /** 珍贵品质 */
    RARE = 'RARE',
    /** 传说品质 */
    LEGENDARY = 'LEGENDARY',
    /** 史诗品质 */
    EPIC = 'EPIC'
}

/** 装备基础属性 */
export interface GearStats {
    /** 攻击力 */
    [StatType.ATTACK]?: number;
    /** 防御力 */
    [StatType.DEFENSE]?: number;
    /** 最大生命值 */
    [StatType.MAX_HP]?: number;
    /** 最大魔法值 */
    [StatType.MAX_MP]?: number;
    /** 暴击率 */
    [StatType.CRIT_RATE]?: number;
    /** 暴击伤害 */
    [StatType.CRIT_DAMAGE]?: number;
    /** 充能速率 */
    [StatType.CHARGE_RATE]?: number;
    /** 伤害加成 */
    [StatType.BONUS_DAMAGE]?: number;
    /** 法术亲和 */
    [StatType.SPELL_AFFINITY]?: number;
    /** 最终减伤 */
    [StatType.DAMAGE_REDUCTION]?: number;
    /** 魔法抗性 */
    [StatType.MAGIC_RESISTANCE]?: number;
}

/** 装备特殊效果 */
export interface GearEffect {
    /** 效果描述 */
    description: string;
    /** 效果触发条件 */
    condition?: string;
    /** 效果类型 */
    type: EffectTriggerType;
    /** 效果实现函数 */
    effect: (character: Character, ...args: any[]) => void;
}

/** 装备槽位枚举 */
/** 装备槽位枚举 */
export enum GearSlot {
    /** 武器槽位 */
    WEAPON = 'WEAPON',
    /** 护甲槽位 */
    ARMOR = 'ARMOR',
    /** 饰品槽位 */
    ACCESSORY = 'ACCESSORY'
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
    /** 装备要求等级 */
    requiredLevel: number;
    /** 当前强化等级 */
    enhanceLevel: number;
}

/** 类型保护函数 */
export function isGearItem(item: Item): item is GearItem {
    return item.type === ItemType.GEAR;
}

// 强化等级区间的成功率配置
const ENHANCE_LEVEL_RANGES = [
    { min: 0, max: 3, rate: 1.00 },    // 0-3级：100%
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
/**
 * 强化装备函数
 * @param item 要强化的装备
 * @returns 强化结果对象,包含是否成功和新的属性值
 */
export function enhanceGear(item: GearItem): {
    /** 是否强化成功 */
    success: boolean;
    /** 强化后的新属性 */
    stats?: GearItem['stats'];
} {
    // 获取当前强化等级的成功率
    const successRate = getEnhanceSuccessRate(item.enhanceLevel);
    // 根据成功率判定是否强化成功
    const success = Math.random() <= successRate;

    // 强化失败直接返回
    if (!success) {
        return { success: false };
    }

    // 保存原始属性用于计算提升
    const baseStats = { ...item.stats };

    // 计算强化后的新属性
    const newStats: GearItem['stats'] = {};
    for (const [key, value] of Object.entries(baseStats)) {
        const statType = key as StatType;
        const growthRate = ENHANCE_GROWTH_RATE[statType] || 0;
        newStats[statType] = calculateEnhancedStat(statType, value, growthRate);
    }

    // 更新装备属性和等级
    item.stats = newStats;
    item.enhanceLevel += 1;

    return {
        success: true,
        stats: newStats
    };
}

/**
 * 计算装备强化费用
 * @param item 要强化的装备
 * @returns 强化所需金币数量
 */
export function calculateEnhanceCost(item: GearItem): number {
    const baseCost = item.price || 1000;
    return Math.floor(baseCost * (1 + item.enhanceLevel * 0.5));
}

/**
 * 可强化属性的成长率配置
 * @description 定义了每种可强化属性的成长系数
 */
export const ENHANCE_GROWTH_RATE: Partial<Record<StatType, number>> = {
    [StatType.ATTACK]: 0.05,
    [StatType.DEFENSE]: 0.05,
    [StatType.CRIT_RATE]: 0.05,
    [StatType.CRIT_DAMAGE]: 0.08,
    [StatType.MAX_HP]: 0.05,
    [StatType.MAX_MP]: 0.05,
    [StatType.BONUS_DAMAGE]: 0.03,    // 每级提升1%的追加伤害
    [StatType.SPELL_AFFINITY]: 0.03,  // 每级提升1%的法术亲和
    [StatType.DAMAGE_REDUCTION]: 0.03, // 每级提升1%的最终减伤
    [StatType.MAGIC_RESISTANCE]: 0.03, // 每级提升1%的魔法抗性
} as const;

/**
 * 判断属性是否可以强化
 * @param statType 属性类型
 * @returns 是否可以强化
 */
export function isEnhanceableStat(statType: StatType): boolean {
    return statType in ENHANCE_GROWTH_RATE;
}

/**
 * 获取物品稀有度对应的颜色
 * @description 不同稀有度对应的颜色值
 * common: 白色 - 普通
 * rare: 蓝色 - 稀有
 * epic: 紫色 - 史诗
 * legendary: 橙色 - 传说
 */
export const RARITY_COLORS = {
    [ItemRarity.COMMON]: '#FFFFFF',    // 白色
    [ItemRarity.RARE]: '#0088FF',      // 蓝色
    [ItemRarity.EPIC]: '#9932CC',      // 紫色
    [ItemRarity.LEGENDARY]: '#FF8C00', // 橙色
} as const;

/**
 * 物品稀有度对应的antd标签颜色
 * @description 不同稀有度对应的颜色值
 */
export const RARITY_TAG_COLORS = {
    [ItemRarity.COMMON]: 'default',    // 白色
    [ItemRarity.RARE]: 'blue',      // 蓝色
    [ItemRarity.EPIC]: 'purple',      // 紫色
    [ItemRarity.LEGENDARY]: 'warning', // 橙色
} as const;

/**
 * 获取物品稀有度对应的颜色
 * @param rarity 物品稀有度
 * @returns 对应的颜色代码
 */
export function getRarityColor(rarity: ItemRarity): string {
    return RARITY_COLORS[rarity] || RARITY_COLORS[ItemRarity.COMMON];
}

/**
 * 获取物品稀有度对应的antd标签颜色
 * @param rarity 物品稀有度
 * @returns 对应的颜色代码
 */
export function getRarityTagColor(rarity: ItemRarity): string {
    return RARITY_TAG_COLORS[rarity] || RARITY_TAG_COLORS[ItemRarity.COMMON];
}

/**
 * 特殊效果类型枚举
 * @enum {string}
 */
export enum EffectTriggerType {
    PASSIVE = 'passive',      // 被动效果
    ACTIVE = 'active',        // 主动效果
    ON_HIT = 'onHit',        // 攻击时触发
    ON_DAMAGED = 'onDamaged', // 受伤时触发
    ON_SPELL = 'onSpell'      // 施放法术时触发
}

/** 消耗品效果类型 */
export enum ConsumableEffectType {
    /** 恢复生命值 */
    HEAL_HP = 'HEAL_HP',
    /** 恢复魔法值 */
    HEAL_MP = 'HEAL_MP',
    /** 增加攻击力 */
    BUFF_ATTACK = 'BUFF_ATTACK',
    /** 增加防御力 */
    BUFF_DEFENSE = 'BUFF_DEFENSE',
    /** 增加暴击率 */
    BUFF_CRIT_RATE = 'BUFF_CRIT_RATE',
    /** 随机效果 */
    RANDOM_EFFECT = 'RANDOM_EFFECT'
}

/** 消耗品效果 */
export interface ConsumableEffect {
    /** 效果类型 */
    type: ConsumableEffectType;
    /** 效果数值 */
    value: number;
    /** 效果持续时间(回合数)，不填则为立即效果 */
    duration?: number;
    /** 是否为百分比加成 */
    isPercentage?: boolean;
}

/** 消耗品接口 */
export interface ConsumableItem extends Item {
    type: ItemType.CONSUMABLE;
    /** 使用效果 */
    effects: ConsumableEffect[];
    /** 使用冷却时间（回合） */
    cooldown?: number;
}

/**
 * 计算强化后的属性值
 * @param statType 属性类型
 * @param baseValue 基础属性值
 * @param growthRate 成长系数
 * @returns 强化后的属性值
 */
export function calculateEnhancedStat(
    statType: StatType,
    baseValue: number,
    growthRate: number
): number {
    if (!baseValue) return 0;

    const growth = baseValue * growthRate;
    const isPercentageStat = statType === StatType.CRIT_RATE ||
        statType === StatType.CRIT_DAMAGE ||
        statType === StatType.CHARGE_RATE ||
        statType === StatType.DAMAGE_REDUCTION ||
        statType === StatType.MAGIC_RESISTANCE ||
        statType === StatType.SPELL_AFFINITY ||
        statType === StatType.BONUS_DAMAGE;

    const minGrowth = isPercentageStat ? 0.001 : 1;

    return baseValue + Math.max(
        minGrowth,
        isPercentageStat
            ? Math.round(growth * 1000) / 1000  // 百分比属性保留3位小数
            : Math.ceil(growth)                 // 整数属性向上取整
    );
}