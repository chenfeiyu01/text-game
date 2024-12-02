import { Character } from './character';
import { Skill } from '../constants/skill-list';

interface PlayerConfig {
    name: string;
    maxHp: number;
    maxMp: number;
    attack: number;
    defense: number;
    critRate: number;
    critDamage: number;
    chargeRate: number;
    equippedSkill?: Skill;
}

export class Player extends Character {
    private static instance: Player;

    private constructor(config: PlayerConfig) {
        super(config);
    }

    public static getInstance(): Player {
        if (!Player.instance) {
            throw new Error('Player not initialized. Call initializePlayer first.');
        }
        return Player.instance;
    }

    public static initializePlayer(config: PlayerConfig): Player {
        Player.instance = new Player(config);
        return Player.instance;
    }
}