import { ConsumableItemId, Item, ItemRarity, ItemType } from "../../constants/item";

export const CONSUMABLES: Record<ConsumableItemId, Item> = {
    [ConsumableItemId.HEALTH_POTION]: {
        id: ConsumableItemId.HEALTH_POTION,
        name: '生命药水',
        description: '恢复50点生命值',
        type: ItemType.CONSUMABLE,
        rarity: ItemRarity.COMMON,
        stackable: true,
        maxStack: 99
    },
    [ConsumableItemId.MANA_POTION]: {
        id: ConsumableItemId.MANA_POTION,
        name: '魔法药水',
        description: '恢复30点魔法值',
        type: ItemType.CONSUMABLE,
        rarity: ItemRarity.COMMON,
        stackable: true,
        maxStack: 99
    }
}