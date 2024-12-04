import { GearItem, GearItemId, GearSlot, ItemRarity, ItemType } from "../../../constants/item";
import { StatType } from "../../../constants/stats";

/** 普通品质护甲 */
export const COMMON_ARMORS: Record<string, GearItem> = {
    [GearItemId.APPRENTICE_CLOTH]: {
        id: GearItemId.APPRENTICE_CLOTH,
        name: '学徒布甲',
        description: '新手冒险者的基础装备，由粗麻布缝制。城镇裁缝铺的学徒们经常会制作这种护甲来练习基本工艺，这也使得它成为了价格低廉的入门装备。尽管防护性能一般，但其宽松的设计让穿戴者保持足够的活动自由度。',
        type: ItemType.GEAR,
        rarity: ItemRarity.COMMON,
        stackable: false,
        slot: GearSlot.ARMOR,
        requiredLevel: 1,
        stats: {
            [StatType.DEFENSE]: 3,
            [StatType.MAX_HP]: 30
        },
        isEnhanceable: true,
        price: 5,
        enhanceLevel: 0
    },
    [GearItemId.GUARD_ARMOR]: {
        id: GearItemId.GUARD_ARMOR,
        name: '守备队甲',
        description: '边境守备队的制式装备，采用皮革与轻型铁片的复合结构。这种护甲的设计源自多年边境巡逻的经验，在保证防护力的同时尽可能减轻重量。铁片的特殊排列方式让使用者即便在复杂地形中也能保持良好的机动性。',
        type: ItemType.GEAR,
        rarity: ItemRarity.COMMON,
        stackable: false,
        slot: GearSlot.ARMOR,
        requiredLevel: 10,
        stats: {
            [StatType.DEFENSE]: 12,
            [StatType.MAX_HP]: 100,
        },
        isEnhanceable: true,
        price: 50,
        enhanceLevel: 0
    },
    [GearItemId.BLACKSMITH_CHAINMAIL]: {
        id: GearItemId.BLACKSMITH_CHAINMAIL,
        name: '铁匠精制甲',
        description: '由城市铁匠精心打造的链甲，采用改良工艺。每个环扣都经过特殊的淬火处理，既保证了强度又减轻了重量。精湛的工艺使得这件护甲能够均匀地分散冲击力，是冒险者中层装备的标配。',
        type: ItemType.GEAR,
        rarity: ItemRarity.COMMON,
        stackable: false,
        slot: GearSlot.ARMOR,
        requiredLevel: 15,
        stats: {
            [StatType.DEFENSE]: 25,
            [StatType.MAX_HP]: 180,
        },
        isEnhanceable: true,
        price: 150,
        enhanceLevel: 0
    },
    [GearItemId.ROYAL_GUARD_ARMOR]: {
        id: GearItemId.ROYAL_GUARD_ARMOR,
        name: '王国卫甲',
        description: '王国军队的制式装备，采用精钢打造。这种护甲的设计图纸被严格保管在王国铁匠铺中，每一件都需要经过严格的品质检验。装甲的胸口处印有王国的徽记，象征着使用者的地位与责任。',
        type: ItemType.GEAR,
        rarity: ItemRarity.COMMON,
        stackable: false,
        slot: GearSlot.ARMOR,
        requiredLevel: 20,
        stats: {
            [StatType.DEFENSE]: 35,
            [StatType.MAX_HP]: 300,
        },
        isEnhanceable: true,
        price: 400,
        enhanceLevel: 0
    },
};

/** 稀有品质护甲 */
export const RARE_ARMORS: Record<string, GearItem> = {
    [GearItemId.HUNTERS_LEATHER]: {
        id: GearItemId.HUNTERS_LEATHER,
        name: '猎人短甲',
        description: '经验丰富的猎人设计的轻便护甲，采用特殊的缝制工艺。猎人协会的标志性装备，其独特的背部设计让射手能够自如地拉弓射箭。护甲的肩部和手肘处都经过特殊加固，既保护要害又不影响行动。',
        type: ItemType.GEAR,
        rarity: ItemRarity.RARE,
        stackable: false,
        slot: GearSlot.ARMOR,
        requiredLevel: 5,
        stats: {
            [StatType.DEFENSE]: 8,
            [StatType.MAX_HP]: 60,
            [StatType.CHARGE_RATE]: 0.01,
            [StatType.CRIT_DAMAGE]: 0.02
        },
        isEnhanceable: true,
        price: 25,
        enhanceLevel: 0
    },
    [GearItemId.RUNIC_LEATHER]: {
        id: GearItemId.RUNIC_LEATHER,
        name: '符文皮甲',
        description: '在普通皮甲上刻画了基础防护符文的改良护甲。魔法师协会的符文研究员在传统皮甲的基础上，添加了能够快速汲取魔力的符文回路。符文的光芒若隐若现，在黑暗中会散发出微弱的蓝光。',
        type: ItemType.GEAR,
        rarity: ItemRarity.RARE,
        stackable: false,
        slot: GearSlot.ARMOR,
        requiredLevel: 10,
        stats: {
            [StatType.DEFENSE]: 15,
            [StatType.MAX_HP]: 120,
            [StatType.MAX_MP]: 20,
            [StatType.CHARGE_RATE]: 0.1,
        },
        isEnhanceable: true,
        price: 100,
        enhanceLevel: 0
    },
    [GearItemId.OTHERWORLD_ARMOR]: {
        id: GearItemId.OTHERWORLD_ARMOR,
        name: '异纹护甲',
        description: '表面带有神秘纹路的护甲，这些纹路似乎能吸收部分伤害。护甲表面的纹路会随着使用者的动作而流动，仿佛有生命一般。研究者认为这种设计来自另一个世界，但究竟是敌是友仍无从得知。',
        type: ItemType.GEAR,
        rarity: ItemRarity.RARE,
        stackable: false,
        slot: GearSlot.ARMOR,
        requiredLevel: 15,
        stats: {
            [StatType.DEFENSE]: 30,
            [StatType.MAX_HP]: 250,
            [StatType.CRIT_RATE]: 0.02,
            [StatType.CRIT_DAMAGE]: 0.02
        },
        isEnhanceable: true,
        price: 300,
        enhanceLevel: 0
    },
};

/** 史诗品质护甲 */
export const EPIC_ARMORS: Record<string, GearItem> = {
    [GearItemId.MOONLIGHT_GUARD]: {
        id: GearItemId.MOONLIGHT_GUARD,
        name: '月光守护甲',
        description: '据说是月影族留下的遗物，穿戴者能感受到来自月光的祝福。护甲表面镶嵌着神秘的月光石，在夜晚会散发出柔和的银光。当穿戴者受到攻击时，月光石会产生共鸣，形成额外的防护屏障。这件护甲的存在暗示着某种未知的威胁正在接近。',
        type: ItemType.GEAR,
        rarity: ItemRarity.LEGENDARY,
        stackable: false,
        slot: GearSlot.ARMOR,
        requiredLevel: 15,
        stats: {
            [StatType.DEFENSE]: 30,
            [StatType.MAX_HP]: 250,
            [StatType.MAX_MP]: 30,
            [StatType.CRIT_RATE]: 0.04,
            [StatType.CRIT_DAMAGE]: 0.04,
            [StatType.CHARGE_RATE]: 0.1
        },
        isEnhanceable: true,
        price: 500,
        enhanceLevel: 0,
        effects: [
            // TODO: 添加buff 效果
        ]
    },
};

/** 传说品质护甲 */
export const LEGENDARY_ARMORS: Record<string, GearItem> = {
    /* [GearItemId.CELESTIAL_PLATE]: {
        id: GearItemId.CELESTIAL_PLATE,
        name: '天界战甲',
        description: '传说中天界战士所穿的铠甲，蕴含神圣之力',
        type: ItemType.GEAR,
        rarity: ItemRarity.LEGENDARY,
        stackable: false,
        slot: GearSlot.ARMOR,
        stats: {
            defense: 35,
            maxHp: 300,
            maxMp: 150,
            chargeRate: 0.2
        },
        isEnhanceable: true,
        price: 1000,
        enhanceLevel: 0
    } */
};

/** 所有护甲数据 */
export const ARMORS: Partial<Record<GearItemId, GearItem>> = {
    ...COMMON_ARMORS,
    ...RARE_ARMORS,
    ...EPIC_ARMORS,
    ...LEGENDARY_ARMORS
};
