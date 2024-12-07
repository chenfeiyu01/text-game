import { Character } from '../../class/character';
import MONSTERS from '../character/monsters';
import { Scene, ESCENES } from '../../constants/scenes';
import { Monsters } from '../../constants/monsters';
import { EventResultType } from '../../constants/scenes';
import { ItemId } from '../../constants/item';
import { StatType } from '../../constants/stats';
import { BATTLE_EVENTS } from '../battle-events';

// 场景配置
export const SCENES: Record<string, Scene> = {
    // 1-5级：枫叶林（入门区域）
    [ESCENES.MAPLE_FOREST]: {
        id: ESCENES.MAPLE_FOREST,
        name: '枫叶林',
        description: '终年被红色枫叶覆盖的森林，充满未知的机遇与挑战。',
        levelRange: { min: 1, max: 5 },
        monsterGroups: [
            {
                monsters: [
                    MONSTERS[Monsters.CORRUPTED_RABBIT],
                    MONSTERS[Monsters.CORRUPTED_VINE]
                ],
                minLevel: 1,
                maxLevel: 3,
                rewardMultiplier: 1
            },
            {
                monsters: [
                    MONSTERS[Monsters.SHADOW_WOLF],
                    MONSTERS[Monsters.CORRUPTED_VINE]
                ],
                minLevel: 3,
                maxLevel: 5,
                rewardMultiplier: 1.2
            }
        ],
        bosses: [
            MONSTERS[Monsters.MUSHROOM_WARRIOR]
        ],

        events: [
            BATTLE_EVENTS.ANCIENT_ALTAR
            // ... 更多事件
        ],

        baseRewards: {
            exp: 30,
            gold: 10,
            items: [
                { id: ItemId.Consumable.HEALTH_POTION_1, odds: 0.5 },
                { id: ItemId.Gear.WOODEN_SWORD, odds: 0.2 }
            ]
        },

        rules: {
            minBattles: 3,
            maxBattles: 5,
            minEvents: 1,
            maxEvents: 2,
            bossRequired: true
        }
    },

    // 6-10级：黑藤谷（过渡区域）
    [ESCENES.DARKVINE_VALLEY]: {
        id: ESCENES.DARKVINE_VALLEY,
        name: '黑藤谷',
        description: '被黑色藤蔓覆盖的幽深峡谷，这里的植物似乎受到了某种黑暗力量的侵蚀。',
        levelRange: { min: 6, max: 10 },

        monsterGroups: [
            {
                monsters: [MONSTERS[Monsters.SHADOW_WOLF], MONSTERS[Monsters.CORRUPTED_VINE]],
                minLevel: 6,
                maxLevel: 8,
                rewardMultiplier: 1
            }
        ],

        bosses: [MONSTERS[Monsters.ALPHA_SHADOW_WOLF]],

        events: [],  // 添加事件配置

        baseRewards: {
            exp: 60,
            gold: 20
        },

        rules: {
            minBattles: 3,
            maxBattles: 5,
            minEvents: 1,
            maxEvents: 2,
            bossRequired: true
        }
    },

    // 11-15级：幽暗沼泽（中级区域）
    [ESCENES.DARK_SWAMP]: {
        id: ESCENES.DARK_SWAMP,
        name: '幽暗沼泽',
        description: '弥漫着毒雾的沼泽地带，潜伏着各种危险的生物。沼泽深处传来令人不安的声响。',
        monsterGroups: [
            {
                monsters: [MONSTERS[Monsters.POISON_TOAD], MONSTERS[Monsters.SHADOW_CROCODILE]],
                minLevel: 11,
                maxLevel: 15,
                rewardMultiplier: 1
            }
        ],
        bosses: [MONSTERS[Monsters.SWAMP_HORROR]],
        events: [],
        baseRewards: {
            exp: 100,
            gold: 40
        },
        rules: {
            minBattles: 3,
            maxBattles: 5,
            minEvents: 1,
            maxEvents: 2,
            bossRequired: true
        },
        levelRange: { min: 11, max: 15 }
    },

    // 16-20级：古树遗迹（高级区域）
    [ESCENES.ANCIENT_RUINS]: {
        id: ESCENES.ANCIENT_RUINS,
        name: '古树遗迹',
        description: '传说中精灵族居住过的远古遗迹，巨大的古树上盘踞着强大的生物，遗迹中徘徊着堕落的守护者。',
        monsterGroups: [
            {
                monsters: [MONSTERS[Monsters.ANCIENT_TREANT], MONSTERS[Monsters.SHADOW_PRIEST]],
                minLevel: 16,
                maxLevel: 20,
                rewardMultiplier: 1
            }
        ],
        bosses: [MONSTERS[Monsters.CORRUPTED_ARCHDRUID]],
        events: [],
        baseRewards: {
            exp: 150,
            gold: 60
        },
        rules: {
            minBattles: 3,
            maxBattles: 5,
            minEvents: 1,
            maxEvents: 2,
            bossRequired: true
        },
        levelRange: { min: 16, max: 20 }
    }
}; 