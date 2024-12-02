import { Character } from '../../class/human';
import MONSTERS from '../character/monsters';
import { Scene } from '../../constants/scenes';

// 场景配置
export const SCENES: Record<string, Scene> = {
    LUOLAN: {
        id: 'LUOLAN',
        name: '洛兰',
        description: '洛兰是艾尔文防线后神秘的森林，有许多医用的史莱姆，但是传言有形似人类的哥布林出没。',
        battles: [
            {
                monster: new Character(MONSTERS.SLIME),
                reward: {
                    exp: 50,
                    gold: 10
                }
            },
            {
                monster: new Character(MONSTERS.SLIME),
                reward: {
                    exp: 100,
                    gold: 20,
                    items: ['POTION_SMALL']
                }
            }
        ],
        boss: {
            monster: new Character(MONSTERS.GOBLIN),  // 假设有个哥布林酋长作为boss
            reward: {
                exp: 300,
                gold: 100,
                items: ['WEAPON_RARE', 'ARMOR_RARE']
            }
        }
    },
}; 