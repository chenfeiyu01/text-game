import { GearItem, GearItemId, GearSlot, ItemRarity, ItemType } from "../../../constants/item";
import { StatType } from "../../../constants/stats";

/** 普通品质武器 */
export const COMMON_WEAPONS: Record<string, GearItem> = {
    [GearItemId.WOODEN_SWORD]: {
        id: GearItemId.WOODEN_SWORD,
        name: '木剑',
        description: '新手冒险者常用的训练武器。剑身由耐用的硬木精心打磨而成，握把处缠绕着粗麻布提供更好的握持感。虽然威力不大，但适合用来掌握基本剑术要领。',
        type: ItemType.GEAR,
        rarity: ItemRarity.COMMON,
        stackable: false,
        slot: GearSlot.WEAPON,
        requiredLevel: 1,
        stats: {
            [StatType.ATTACK]: 5,
            // [StatType.CRIT_RATE]: 0.01
        },
        isEnhanceable: true,
        price: 5,
        enhanceLevel: 0
    },
    [GearItemId.IRON_SWORD]: {
        id: GearItemId.IRON_SWORD,
        name: '铁剑',
        description: '冒险者公会推荐的标准制式武器。由普通铁矿锻造而成，剑身平整，重量适中。虽然做工粗糙，但胜在结实耐用，是很多冒险者的第一把实战武器。',
        type: ItemType.GEAR,
        rarity: ItemRarity.COMMON,
        stackable: false,
        slot: GearSlot.WEAPON,
        requiredLevel: 5,
        stats: {
            [StatType.ATTACK]: 10,
            // [StatType.CRIT_RATE]: 0.02
        },
        isEnhanceable: true,
        price: 50,
        enhanceLevel: 0
    },
    [GearItemId.STEEL_SWORD]: {
        id: GearItemId.STEEL_SWORD,
        name: '精铁剑',
        description: '经过反复锻打的精炼铁剑。相比普通铁剑，这把剑的韧性和锋利度都有明显提升。剑身上的简单花纹不仅美观，更能减少劈砍时的空气阻力。',
        type: ItemType.GEAR,
        rarity: ItemRarity.COMMON,
        stackable: false,
        slot: GearSlot.WEAPON,
        requiredLevel: 10,
        stats: {
            [StatType.ATTACK]: 20,
            // [StatType.CRIT_RATE]: 0.03
        },
        isEnhanceable: true,
        price: 100,
        enhanceLevel: 0
    }
};

/** 稀有品质武器 */
export const RARE_WEAPONS: Record<string, GearItem> = {
    [GearItemId.FINE_STEEL_SWORD]: {
        id: GearItemId.FINE_STEEL_SWORD,
        name: '精钢剑',
        description: '由资深铁匠使用上等精钢打造的利剑。采用秘传的淬火工艺，既保持了极高的硬度，又不失韧性。剑身上的暗纹既能导引劈砍时的气流，又能减轻武器重量。',
        type: ItemType.GEAR,
        rarity: ItemRarity.RARE,
        stackable: false,
        slot: GearSlot.WEAPON,
        requiredLevel: 5,
        stats: {
            [StatType.ATTACK]: 15,
            [StatType.CRIT_RATE]: 0.02,
            [StatType.CRIT_DAMAGE]: 0.03
        },
        isEnhanceable: true,
        price: 100,
        enhanceLevel: 0
    },
    [GearItemId.KNIGHTS_SWORD]: {
        id: GearItemId.KNIGHTS_SWORD,
        name: '骑士剑',
        description: '王国骑士团的制式配剑，由皇家铁匠精心打造。剑格采用独特的设计，可以有效防护持剑手，剑身的平衡性极佳。剑柄缠绕着上等皮革，即使长时间使用也不会感到疲惫。每一把都经过骑士团武器总管的严格检验。',
        type: ItemType.GEAR,
        rarity: ItemRarity.RARE,
        stackable: false,
        slot: GearSlot.WEAPON,
        requiredLevel: 15,
        stats: {
            [StatType.ATTACK]: 35,
            [StatType.CRIT_RATE]: 0.02,
            [StatType.CRIT_DAMAGE]: 0.04
        },
        isEnhanceable: true,
        price: 300,
        enhanceLevel: 0
    }
};

/** 史诗品质武器 */
export const EPIC_WEAPONS: Record<string, GearItem> = {
    [GearItemId.COMMANDER_BLADE]: {
        id: GearItemId.COMMANDER_BLADE,
        name: '统帅之刃',
        description: '专为王国军队高级指挥官打造的礼仪配剑，同时也是一把性能卓越的实战武器。剑身采用秘传工艺反复锻打百余次，剑脊处暗藏导气槽，可以在挥舞时发出令敌人胆寒的啸声。剑格上镶嵌着精美的宝石，象征着使用者的崇高地位。',
        type: ItemType.GEAR,
        rarity: ItemRarity.EPIC,
        stackable: false,
        slot: GearSlot.WEAPON,
        requiredLevel: 15,
        stats: {
            [StatType.ATTACK]: 45,
            [StatType.CRIT_RATE]: 0.06,
            [StatType.CRIT_DAMAGE]: 0.04,
            [StatType.BONUS_DAMAGE]: 0.05
        },
        isEnhanceable: true,
        price: 8000,
        enhanceLevel: 0
    }
};

/** 传说品质武器 */
export const LEGENDARY_WEAPONS: Record<string, GearItem> = {
    [GearItemId.DRAGON_SLAYER]: {
        id: GearItemId.DRAGON_SLAYER,
        name: '屠龙剑',
        description: '相传为远古屠龙者使用过的神剑，剑身中蕴含着远古巨龙的力量。剑刃上流转着神秘的纹路，据说是被龙血侵蚀后自然形成的。剑柄由龙骨打磨而成，握持时会感受到一股温热的力量流入体内。这把剑见证了无数传奇故事，现在正等待着新的主人续写传说。',
        type: ItemType.GEAR,
        rarity: ItemRarity.LEGENDARY,
        stackable: false,
        slot: GearSlot.WEAPON,
        requiredLevel: 20,
        stats: {
            [StatType.ATTACK]: 60,
            [StatType.CRIT_RATE]: 0.08,
            [StatType.CRIT_DAMAGE]: 0.08,
            [StatType.BONUS_DAMAGE]: 0.15
        },
        isEnhanceable: true,
        price: 30000,
        enhanceLevel: 0
    }
};

/** 所有武器数据 */
export const WEAPONS: Partial<Record<GearItemId, GearItem>> = {
    ...COMMON_WEAPONS,
    ...RARE_WEAPONS,
    ...EPIC_WEAPONS,
    ...LEGENDARY_WEAPONS
};
