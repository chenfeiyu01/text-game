import { Character } from './character';
import { Skill } from '../constants/skill-list';
import { Inventory } from './inventory';

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
    /** 已学习的技能集合 */
    private _skills: Set<string> = new Set();

    get skills(): Set<string> { return this._skills; }

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

    learnSkill(skill: Skill): void {
        this._skills.add(skill.id);
        this.updateState();
    }
}