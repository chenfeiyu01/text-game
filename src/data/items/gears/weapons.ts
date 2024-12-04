import { GearItem, GearItemId, GearSlot, ItemRarity, ItemType } from "../../../constants/item";

/** 普通品质武器 */
export const COMMON_WEAPONS: Record<string, GearItem> = {
    [GearItemId.WOODEN_SWORD]: {
        id: GearItemId.WOODEN_SWORD,
        name: '木剑',
        description: '一把普通的练习用木剑，适合初学者使用',
        type: ItemType.GEAR,
        rarity: ItemRarity.COMMON,
        stackable: false,
        slot: GearSlot.WEAPON,
        stats: {
            attack: 5,
            critRate: 0.05
        },
        isEnhanceable: true,
        price: 10,
        enhanceLevel: 0
    },
    [GearItemId.IRON_SWORD]: {
        id: GearItemId.IRON_SWORD,
        name: '铁剑',
        description: '一把铁匠铺随处可见的铁剑，出师必备',
        type: ItemType.GEAR,
        rarity: ItemRarity.COMMON,
        stackable: false,
        slot: GearSlot.WEAPON,
        enhanceLevel: 0,
        stats: {
            attack: 10,
            critRate: 0.08,
            critDamage: 0.2
        },
        isEnhanceable: true,
        price: 20,
        effects: []
    }
};

/** 稀有品质武器 */
export const RARE_WEAPONS: Record<string, GearItem> = {
    [GearItemId.THUNDER_BLADE]: {
        id: GearItemId.THUNDER_BLADE,
        name: '雷鸣剑',
        description: '蕴含雷电之力的魔剑，能够造成连锁伤害',
        type: ItemType.GEAR,
        rarity: ItemRarity.RARE,
        stackable: false,
        slot: GearSlot.WEAPON,
        enhanceLevel: 0,
        stats: {
            attack: 25,
            critRate: 0.1,
            critDamage: 0.3,
            chargeRate: 0.1
        },
        isEnhanceable: true,
        price: 200,
        effects: []
    }
};

/** 史诗品质武器 */
export const EPIC_WEAPONS: Record<string, GearItem> = {
    [GearItemId.FROST_BLADE]: {
        id: GearItemId.FROST_BLADE,
        name: '霜之哀伤',
        description: '寒冰铸就的魔剑，能够冻结敌人的灵魂',
        type: ItemType.GEAR,
        rarity: ItemRarity.EPIC,
        stackable: false,
        slot: GearSlot.WEAPON,
        enhanceLevel: 0,
        stats: {
            attack: 35,
            critRate: 0.12,
            critDamage: 0.4,
            maxMp: 100
        },
        isEnhanceable: true,
        price: 500,
        effects: []
    }
};

/** 传说品质武器 */
export const LEGENDARY_WEAPONS: Record<string, GearItem> = {
    [GearItemId.DRAGON_SWORD]: {
        id: GearItemId.DRAGON_SWORD,
        name: '屠龙宝刀',
        description: '传说中能够斩杀恶龙的神兵利器，蕴含着强大的力量',
        type: ItemType.GEAR,
        rarity: ItemRarity.LEGENDARY,
        stackable: false,
        slot: GearSlot.WEAPON,
        enhanceLevel: 0,
        stats: {
            attack: 50,
            critRate: 0.15,
            critDamage: 0.5,
            chargeRate: 0.2
        },
        isEnhanceable: true,
        price: 1000,
        effects: []
    }
};

/** 所有武器数据 */
export const WEAPONS: Partial<Record<GearItemId, GearItem>> = {
    ...COMMON_WEAPONS,
    ...RARE_WEAPONS,
    ...EPIC_WEAPONS,
    ...LEGENDARY_WEAPONS
}; 