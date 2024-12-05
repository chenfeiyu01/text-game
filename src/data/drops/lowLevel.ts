import { DropItemType, DropRule, SceneDropModifier } from "../../constants/drop";
import { ItemId } from "../../constants/item";
import { Monsters } from "../../constants/monsters";
import { ESCENES } from "../../constants/scenes";

/** 怪物掉落配置 */
export const MONSTER_DROPS: Record<Monsters, DropRule[]> = {
    [Monsters.CORRUPTED_RABBIT]: [
        /** 
         * 生命药水掉落规则
         * - 基础掉落概率30%
         * - 每次掉落1-2个
         * - 仅限1-10级玩家获得
         */
        {
            itemId: ItemId.Consumable.HEALTH_POTION_1,
            type: DropItemType.NORMAL,
            baseChance: 0.3,
            minQuantity: 1,
            maxQuantity: 2,
            condition: {
                minLevel: 1,
                maxLevel: 10 // 高等级玩家不再掉落小型药水
            }
        },
        {
            itemId: ItemId.Gear.COPPER_RING,
            type: DropItemType.RARE,
            baseChance: 0.1,
            minQuantity: 1,
            maxQuantity: 1,
            condition: {
            }
        }
    ],
    [Monsters.SHADOW_WOLF]: [],
    [Monsters.CORRUPTED_VINE]: [],
    [Monsters.MUSHROOM_WARRIOR]: [],
    [Monsters.SHADOW_CROCODILE]: [],
    [Monsters.POISON_TOAD]: [],
    [Monsters.ANCIENT_TREANT]: [],
    [Monsters.SHADOW_PRIEST]: [],
    [Monsters.ALPHA_SHADOW_WOLF]: [],
    [Monsters.ANCIENT_MUSHROOM_LORD]: [],
    [Monsters.SWAMP_HORROR]: [],
    [Monsters.CORRUPTED_ARCHDRUID]: []
} as const;

/** 场景掉落修正配置 */
export const SCENE_DROP_MODIFIERS: Record<string, SceneDropModifier> = {
    /** 枫叶林掉落修正 */
    [ESCENES.MAPLE_FOREST]: {
        chanceMultiplier: 1.2, // 整体掉落率提升20%
        itemModifiers: {
            /* [ItemId.Material.]: {
                chanceMultiplier: 1.5, // 史莱姆精华掉落率额外提升50%
                quantityBonus: 1      // 数量+1
            } */
        }
    },
    // ... 其他场景配置
}; 