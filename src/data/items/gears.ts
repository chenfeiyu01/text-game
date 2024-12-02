import { GearItemId, Item, ItemRarity, ItemType } from "../../constants/item";


export const GEARS: Record<GearItemId, Item> = {
    [GearItemId.WOODEN_SWORD]: {
        id: GearItemId.WOODEN_SWORD,
        name: '木剑',
        description: '一把普通的练习用木剑，适合初学者使用',
        type: ItemType.GEAR,
        rarity: ItemRarity.COMMON,
        stackable: false,
    },
    [GearItemId.IRON_SWORD]: {
        id: GearItemId.IRON_SWORD,
        name: '铁剑',
        description: '一把铁匠铺随处可见的铁剑，出师必备',
        type: ItemType.GEAR,
        rarity: ItemRarity.COMMON,
        stackable: false,
    }
};