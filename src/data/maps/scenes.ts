import { Character } from '../../class/human';
import MONSTERS from '../character/monsters';

// 奖励类型定义
interface Reward {
    exp: number;
    gold?: number;
    items?: string[];  // 物品ID列表
}

// 战斗遭遇定义
interface BattleEncounter {
    monster: Character;
    reward: Reward;
}

// 场景定义
interface Scene {
    id: string;
    name: string;
    description: string;
    battles: BattleEncounter[];
}

// 场景配置
export const SCENES: Record<string, Scene> = {
    FOREST: {
        id: 'FOREST',
        name: '神秘森林',
        description: '一片充满未知的森林，传说有许多史莱姆出没。',
        battles: [
            {
                monster: MONSTERS.SLIME,
                reward: {
                    exp: 50,
                    gold: 10
                }
            },
            {
                monster: MONSTERS.PIGLET,
                reward: {
                    exp: 100,
                    gold: 20,
                    items: ['POTION_SMALL']
                }
            }
        ]
    },
    CAVE: {
        id: 'CAVE',
        name: '幽暗洞窟',
        description: '黑暗的洞窟中隐藏着危险的怪物。',
        battles: [
            {
                monster: MONSTERS.PIGLET,
                reward: {
                    exp: 80,
                    gold: 15
                }
            },
            // ... 更多战斗
        ]
    }
}; 