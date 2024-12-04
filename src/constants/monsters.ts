import { Character, CharacterConfig } from "../class/character";

export enum Monsters {
    SLIME = 'SLIME',
    PIGLET = 'PIGLET',
    GOBLIN = 'GOBLIN'
}

export interface Monster extends CharacterConfig {
    id: Monsters;
}