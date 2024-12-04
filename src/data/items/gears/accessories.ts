import { GearItem, GearItemId, GearSlot, ItemRarity, ItemType } from "../../../constants/item";
import { StatType } from "../../../constants/stats";
import { GearStats } from "../../../constants/item";

/** 普通品质首饰 */
export const COMMON_ACCESSORIES: Record<string, GearItem> = {
    [GearItemId.COPPER_RING]: {
        id: GearItemId.COPPER_RING,
        name: '铜戒指',
        description: '普通的铜制戒指，上面刻有简单的祝福符文。这是初学者常用的法器，能够帮助使用者更好地引导魔力。戒指的内圈经过特殊打磨，佩戴舒适。',
        type: ItemType.GEAR,
        rarity: ItemRarity.COMMON,
        stackable: false,
        slot: GearSlot.ACCESSORY,
        requiredLevel: 1,
        stats: {
            [StatType.MAX_MP]: 20,
            [StatType.CHARGE_RATE]: 0.02
        },
        isEnhanceable: true,
        price: 10,
        enhanceLevel: 0
    },
    [GearItemId.APPRENTICE_NECKLACE]: {
        id: GearItemId.APPRENTICE_NECKLACE,
        name: '学徒项链',
        description: '魔法学院学徒佩戴的基础项链。由普通水晶打造，能够帮助佩戴者更好地感知魔力。项链的链条采用特殊工艺编织，不易断裂。',
        type: ItemType.GEAR,
        rarity: ItemRarity.COMMON,
        stackable: false,
        slot: GearSlot.ACCESSORY,
        requiredLevel: 5,
        stats: {
            [StatType.MAX_MP]: 50,
            [StatType.SPELL_AFFINITY]: 0.02
        },
        isEnhanceable: true,
        price: 50,
        enhanceLevel: 0
    }
};

/** 稀有品质首饰 */
export const RARE_ACCESSORIES: Record<string, GearItem> = {
    [GearItemId.MANA_RING]: {
        id: GearItemId.MANA_RING,
        name: '魔力指环',
        description: '由魔力水晶打造的戒指，能够增强佩戴者的法术威力。戒指上的水晶会随着佩戴者的魔力波动而发出微光。长期佩戴能够帮助使用者更好地掌控魔力。',
        type: ItemType.GEAR,
        rarity: ItemRarity.RARE,
        stackable: false,
        slot: GearSlot.ACCESSORY,
        requiredLevel: 10,
        stats: {
            [StatType.MAX_MP]: 100,
            [StatType.SPELL_AFFINITY]: 0.05,
            [StatType.CHARGE_RATE]: 0.05
        },
        isEnhanceable: true,
        price: 200,
        enhanceLevel: 0
    },
    [GearItemId.WARRIORS_BAND]: {
        id: GearItemId.WARRIORS_BAND,
        name: '战士臂环',
        description: '由精钢打造的臂环，能够增强佩戴者的战斗能力。臂环上雕刻着古老的战士图腾，据说能够激发佩戴者的战斗潜能。在战斗中会散发出淡淡的红光。',
        type: ItemType.GEAR,
        rarity: ItemRarity.RARE,
        stackable: false,
        slot: GearSlot.ACCESSORY,
        requiredLevel: 15,
        stats: {
            [StatType.MAX_HP]: 150,
            [StatType.CRIT_RATE]: 0.03,
            [StatType.BONUS_DAMAGE]: 0.03
        },
        isEnhanceable: true,
        price: 300,
        enhanceLevel: 0
    }
};

/** 史诗品质首饰 */
export const EPIC_ACCESSORIES: Record<string, GearItem> = {
    [GearItemId.DRAGON_HEART_PENDANT]: {
        id: GearItemId.DRAGON_HEART_PENDANT,
        name: '龙心吊坠',
        description: '以远古巨龙心脏碎片制成的吊坠，蕴含着强大的魔力。吊坠中心的晶体呈现出深邃的红色，如同跳动的心脏。佩戴者能够感受到来自巨龙的力量在体内流转，显著增强战斗能力。',
        type: ItemType.GEAR,
        rarity: ItemRarity.EPIC,
        stackable: false,
        slot: GearSlot.ACCESSORY,
        requiredLevel: 20,
        stats: {
            [StatType.MAX_HP]: 200,
            [StatType.MAX_MP]: 150,
            [StatType.SPELL_AFFINITY]: 0.08,
            [StatType.BONUS_DAMAGE]: 0.05
        },
        isEnhanceable: true,
        price: 1000,
        enhanceLevel: 0
    }
};

/** 传说品质首饰 */
export const LEGENDARY_ACCESSORIES: Record<string, GearItem> = {
    [GearItemId.CELESTIAL_CROWN]: {
        id: GearItemId.CELESTIAL_CROWN,
        name: '天界之冠',
        description: '相传是天界遗落的神器，蕴含着难以想象的力量。王冠由一种未知的金属打造，镶嵌着七颗神秘的宝石。每颗宝石都代表着不同的元素力量，能够全方位提升佩戴者的战斗能力。佩戴时会在头顶形成若隐若现的光环。',
        type: ItemType.GEAR,
        rarity: ItemRarity.LEGENDARY,
        stackable: false,
        slot: GearSlot.ACCESSORY,
        requiredLevel: 30,
        stats: {
            [StatType.MAX_HP]: 300,
            [StatType.MAX_MP]: 200,
            [StatType.SPELL_AFFINITY]: 0.10,
            [StatType.BONUS_DAMAGE]: 0.08,
            [StatType.DAMAGE_REDUCTION]: 0.05,
            [StatType.MAGIC_RESISTANCE]: 0.05
        },
        isEnhanceable: true,
        price: 50000,
        enhanceLevel: 0
    }
};

/** 所有首饰数据 */
export const ACCESSORIES: Partial<Record<GearItemId, GearItem>> = {
    ...COMMON_ACCESSORIES,
    ...RARE_ACCESSORIES,
    ...EPIC_ACCESSORIES,
    ...LEGENDARY_ACCESSORIES
};
