import { ItemId } from './item';

/** 掉落物品类型 */
export enum DropItemType {
    /** 普通掉落 */
    NORMAL = 'normal',
    /** 稀有掉落 */
    RARE = 'rare',
    /** BOSS掉落 */
    BOSS = 'boss'
}

/** 掉落规则接口 */
export interface DropRule {
    /** 物品ID */
    itemId: ItemId;
    /** 掉落类型 */
    type: DropItemType;
    /** 基础掉落概率(0-1) 百分比，控制掉落概率 */
    baseChance: number;
    /** 最小掉落数量 */
    minQuantity: number;
    /** 最大掉落数量 */
    maxQuantity: number;
    /** 掉落条件 */
    condition?: {
        /** 玩家最低等级 */
        minLevel?: number;
        /** 玩家最高等级 */
        maxLevel?: number;
        /** 时间段限制 */
        timeRange?: {
            start: number; // 0-23
            end: number;   // 0-23
        };
    };
}

/** 场景修正接口 */
export interface SceneDropModifier {
    /** 掉落概率修正(乘法) */
    chanceMultiplier?: number;
    /** 数量修正(加法) */
    quantityBonus?: number;
    /** 特定物品修正 */
    itemModifiers?: Partial<Record<ItemId, {
        chanceMultiplier?: number;
        quantityBonus?: number;
    }>>;
} 