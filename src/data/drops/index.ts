import { ItemId } from '../../constants/item';
import { DropItemType, DropRule, SceneDropModifier } from '../../constants/drop';
import { Monsters } from '../../constants/monsters';
import { ESCENES } from '../../constants/scenes';


/** 怪物掉落配置 */
export const MONSTER_DROPS: Record<Monsters, DropRule[]> = {
    [Monsters.SLIME]: [
        /** 
         * 生命药水掉落规则
         * - 基础掉落概率30%
         * - 每次掉落1-2个
         * - 仅限1-10级玩家获得
         */
        {
            itemId: ItemId.Consumable.HEALTH_POTION,
            type: DropItemType.NORMAL,
            baseChance: 0.5,
            minQuantity: 1,
            maxQuantity: 2,
            condition: {
                minLevel: 1,
                maxLevel: 10 // 高等级玩家不再掉落小型药水
            }
        },
        /**
         * 木剑掉落规则
         * - 基础掉落概率50%
         * - 每次掉落1-3个
         */
        {
            itemId: ItemId.Gear.WOODEN_SWORD,
            type: DropItemType.NORMAL,
            baseChance: 0.5,
            minQuantity: 1,
            maxQuantity: 1
        },
        /**
         * 史莱姆戒指掉落规则
         * - 稀有物品
         * - 基础掉落概率1%
         * - 每次掉落1个
         * - 仅在晚上18:00至次日6:00掉落
         */
        {
            itemId: ItemId.Gear.SLIME_RING,
            type: DropItemType.RARE,
            baseChance: 0.01,
            minQuantity: 1,
            maxQuantity: 1,
            condition: {
            }
        }
    ],
    [Monsters.PIGLET]: [
        // ... 其他掉落配置
    ],
    [Monsters.GOBLIN]: [
        // ... 其他掉落配置
    ]
};

/** 场景掉落修正配置 */
export const SCENE_DROP_MODIFIERS: Record<string, SceneDropModifier> = {
    /** 洛兰森林掉落修正 */
    [ESCENES.LUOLAN]: {
        chanceMultiplier: 1.2, // 整体掉落率提升20%
        itemModifiers: {
            [ItemId.Material.SLIME_ESSENCE]: {
                chanceMultiplier: 1.5, // 史莱姆精华掉落率额外提升50%
                quantityBonus: 1      // 数量+1
            }
        }
    },
    // ... 其他场景配置
}; 