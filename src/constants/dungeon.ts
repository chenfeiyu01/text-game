import { Character } from "../class/character";
import { EventConfig } from "./scenes";

export interface DungeonNode {
    type: 'BATTLE' | 'EVENT' | 'BOSS';
    content: {
        monster?: Character;
        event?: EventConfig;
    };
    next: DungeonNode[];
}