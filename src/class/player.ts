import { Character } from './character';
import { CharacterState } from '../constants/character';

export class Player extends Character {
    private static instance: Player;

    private constructor(config: any) {
        super(config);
    }

    public static getInstance(): Player {
        if (!Player.instance) {
            Player.instance = new Player({
                name: "玩家",
                // ... 其他初始属性
            });
        }
        return Player.instance;
    }

    public static resetInstance(config: any): void {
        Player.instance = new Player(config);
    }
} 