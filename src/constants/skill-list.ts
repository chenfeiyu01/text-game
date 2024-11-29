import { Character } from "../class/human";

// types.ts
export interface Skill {
    id: string;
    name: string;
    damage: number;
    manaCost: number;
    chargeCost: number;
    description: string;
    effect?: (character: Character) => void;
}


export const SKILL_LIST: Skill[] = [
    {
        id: 'fireball',
        name: '火球术',
        damage: 50,
        manaCost: 30,
        chargeCost: 100,
        description: '发射一个火球，造成范围伤害'
    },
    {
        id: 'heal',
        name: '治疗术',
        damage: 0,
        manaCost: 40,
        chargeCost: 100,
        description: '恢复生命值',
        effect: (character: Character) => {
            character.hp = Math.min(character.maxHp, character.hp + 50);
        }
    },
    // 可以添加更多技能
];