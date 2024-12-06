import { Character } from '../../class/character';
import MONSTERS from '../character/monsters';
import { Scene, ESCENES } from '../../constants/scenes';
import { Monsters } from '../../constants/monsters';

// 场景配置
export const SCENES: Record<string, Scene> = {
    // 1-5级：枫叶林（入门区域）
    [ESCENES.MAPLE_FOREST]: {
        id: ESCENES.MAPLE_FOREST,
        name: '枫叶林',
        description: '终年被红色枫叶覆盖的森林，是冒险者们的入门试炼之地。这里的怪物相对温和，适合新手历练。',
        battles: [
            {
                monster: MONSTERS[Monsters.CORRUPTED_RABBIT],
                reward: {
                    exp: 30,
                    gold: 10
                }
            },
            {
                monster: MONSTERS[Monsters.CORRUPTED_VINE],
                reward: {
                    exp: 40,
                    gold: 15
                }
            }
        ],
        boss: {
            monster: MONSTERS[Monsters.MUSHROOM_WARRIOR],
            reward: {
                exp: 100,
                gold: 50
            }
        },
        levelRange: { min: 1, max: 5 }
    },

    // 6-10级：黑藤谷（过渡区域）
    [ESCENES.DARKVINE_VALLEY]: {
        id: ESCENES.DARKVINE_VALLEY,
        name: '黑藤谷',
        description: '被黑色藤蔓覆盖的幽深峡谷，这里的植物似乎受到了某种黑暗力量的侵蚀。',
        battles: [
            {
                monster: MONSTERS[Monsters.SHADOW_WOLF],
                reward: {
                    exp: 60,
                    gold: 20
                }
            },
            {
                monster: MONSTERS[Monsters.CORRUPTED_VINE],
                reward: {
                    exp: 70,
                    gold: 25
                }
            }
        ],
        boss: {
            monster: MONSTERS[Monsters.ALPHA_SHADOW_WOLF],
            reward: {
                exp: 200,
                gold: 100
            }
        },
        levelRange: { min: 6, max: 10 }
    },

    // 11-15级：幽暗沼泽（中级区域）
    [ESCENES.DARK_SWAMP]: {
        id: ESCENES.DARK_SWAMP,
        name: '幽暗沼泽',
        description: '弥漫着毒雾的沼泽地带，潜伏着各种危险的生物。沼泽深处传来令人不安的声响。',
        battles: [
            {
                monster: MONSTERS[Monsters.POISON_TOAD],
                reward: {
                    exp: 100,
                    gold: 35
                }
            },
            {
                monster: MONSTERS[Monsters.SHADOW_CROCODILE],
                reward: {
                    exp: 120,
                    gold: 45
                }
            }
        ],
        boss: {
            monster: MONSTERS[Monsters.SWAMP_HORROR],
            reward: {
                exp: 350,
                gold: 200
            }
        },
        levelRange: { min: 11, max: 15 }
    },

    // 16-20级：古树遗迹（高级区域）
    [ESCENES.ANCIENT_RUINS]: {
        id: ESCENES.ANCIENT_RUINS,
        name: '古树遗迹',
        description: '传说中精灵族居住过的远古遗迹，巨大的古树上盘踞着强大的生物，遗迹中徘徊着堕落的守护者。',
        battles: [
            {
                monster: MONSTERS[Monsters.ANCIENT_TREANT],
                reward: {
                    exp: 150,
                    gold: 60
                }
            },
            {
                monster: MONSTERS[Monsters.SHADOW_PRIEST],
                reward: {
                    exp: 180,
                    gold: 80
                }
            }
        ],
        boss: {
            monster: MONSTERS[Monsters.CORRUPTED_ARCHDRUID],
            reward: {
                exp: 500,
                gold: 300
            }
        },
        levelRange: { min: 16, max: 20 }
    }
}; 