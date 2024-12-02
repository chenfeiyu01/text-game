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

/** 装备物品接口 */
export interface GearItem extends Item {
    type: ItemType.GEAR;
    /** 装备位置 */
    slot: 'weapon' | 'armor' | 'accessory';
    /** 基础属性加成 */
    stats: GearStats;
    /** 特殊效果 */
    effects?: GearEffect[];
    /** 装备等级需求 */
    levelReq?: number;
}

/** 类型保护函数 */
export function isGearItem(item: Item): item is GearItem {
    return item.type === ItemType.GEAR;
}