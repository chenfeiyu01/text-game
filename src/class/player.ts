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
    private _money: number = 0;
    private _skills: Set<string> = new Set();

    get money(): number { return this._money; }
    set money(value: number) { this._money = Math.max(0, value); }
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
    }
}