// battleSystem.ts
export enum BattleResult {
    VICTORY = 'VICTORY',
    DEFEAT = 'DEFEAT',
    ONGOING = 'ONGOING'
}

export interface BattleLog {
    round: number;
    action: string;
    damage: number;
    attacker: string;
    defender: string;
    attackerHp: number;
    defenderHp: number;
    isCrit: boolean;
    isDefeated: boolean;
}

export interface BattleReward {
    exp: number;
    gold?: number;
    items?: string[];
}