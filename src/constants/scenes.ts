import { Character } from "../class/human";

// 奖励类型定义
export interface Reward {
    exp: number;
    gold?: number;
    items?: string[];  // 物品ID列表
}

// 战斗遭遇定义
export interface BattleEncounter {
    monster: Character;
    reward: Reward;
}

// 场景定义
export interface Scene {
    id: string;
    name: string;
    description: string;
    battles: BattleEncounter[];  // 普通战斗
    boss: BattleEncounter;      // Boss战斗
}