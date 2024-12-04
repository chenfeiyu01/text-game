import { ConsumableItem, ConsumableItemId, ItemRarity, ItemType, ConsumableEffectType } from "../../constants/item";

/** 消耗品数据 */
export const CONSUMABLES: Record<ConsumableItemId, ConsumableItem> = {
    [ConsumableItemId.HEALTH_POTION_1]: {
        id: ConsumableItemId.HEALTH_POTION_1,
        name: "初级生命药水",
        description: "恢复100点生命值的基础药水。由常见的草药调制而成，略带苦涩的味道。",
        type: ItemType.CONSUMABLE,
        rarity: ItemRarity.COMMON,
        stackable: true,
        maxStack: 99,
        price: 50,
        effects: [{
            type: ConsumableEffectType.HEAL_HP,
            value: 100,
        }]
    },
    [ConsumableItemId.MANA_POTION_1]: {
        id: ConsumableItemId.MANA_POTION_1,
        name: "初级魔力药水",
        description: "恢复50点魔法值的基础药水。由蓝色魔力水晶粉末调制，散发着淡淡的魔力波动。",
        type: ItemType.CONSUMABLE,
        rarity: ItemRarity.COMMON,
        stackable: true,
        maxStack: 99,
        price: 50,
        effects: [{
            type: ConsumableEffectType.HEAL_MP,
            value: 50,
        }]
    },
    [ConsumableItemId.FATE_COIN]: {
        id: ConsumableItemId.FATE_COIN,
        name: "命运硬币",
        description: "一枚神秘的金币，正面能治愈伤势，反面则会带来诅咒。使用时会随机出现正反面效果。",
        type: ItemType.CONSUMABLE,
        rarity: ItemRarity.EPIC,
        stackable: true,
        maxStack: 5,
        price: 1000,
        effects: [{
            type: ConsumableEffectType.RANDOM_EFFECT,
            value: 200,
            isPercentage: false
        }],
        cooldown: 10
    },
    [ConsumableItemId.WARRIORS_POTION]: {
        id: ConsumableItemId.WARRIORS_POTION,
        name: "战士药剂",
        description: "临时提升20%攻击力的强化药剂。使用后会感到充满力量，持续3回合。",
        type: ItemType.CONSUMABLE,
        rarity: ItemRarity.RARE,
        stackable: true,
        maxStack: 20,
        price: 200,
        effects: [{
            type: ConsumableEffectType.BUFF_ATTACK,
            value: 0.2,
            duration: 3,
            isPercentage: true
        }],
        cooldown: 5
    }
};