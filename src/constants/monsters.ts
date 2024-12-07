import { Character, CharacterConfig } from "../class/character";

/** 怪物类型 */
export enum Monsters {
    /** 特殊怪物 */
    /** 训练木桩 */
    TRAINING_DUMMY = 'TRAINING_DUMMY',

    /** 异变兔 */
    CORRUPTED_RABBIT = 'CORRUPTED_RABBIT',
    /** 暗影狼 */
    SHADOW_WOLF = 'SHADOW_WOLF',
    /** 暗影藤蔓 */
    CORRUPTED_VINE = 'CORRUPTED_VINE',
    /** 蘑菇战士 */
    MUSHROOM_WARRIOR = 'MUSHROOM_WARRIOR',
    /** 暗影鳄 */
    SHADOW_CROCODILE = 'SHADOW_CROCODILE',
    /** 毒雾蟾蜍 */
    POISON_TOAD = 'POISON_TOAD',
    /** 远古树人 */
    ANCIENT_TREANT = 'ANCIENT_TREANT',
    /** 暗影祭司 */
    SHADOW_PRIEST = 'SHADOW_PRIEST',
    /** 暗影狼王 */
    ALPHA_SHADOW_WOLF = 'ALPHA_SHADOW_WOLF',
    /** 远古蘑菇领主 */
    ANCIENT_MUSHROOM_LORD = 'ANCIENT_MUSHROOM_LORD',
    /** 沼泽恐魔 */
    SWAMP_HORROR = 'SWAMP_HORROR',
    /** 堕落大德鲁伊 */
    CORRUPTED_ARCHDRUID = 'CORRUPTED_ARCHDRUID'
}

export interface Monster extends CharacterConfig {
    id: Monsters;
}