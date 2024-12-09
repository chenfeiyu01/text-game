import { Monster, Monsters } from "../../../constants/monsters";

export const LOW_LEVEL_MONSTERS = {
    /**
     * 1-5级怪物配置
     */
    CORRUPTED_RABBIT: {
        name: "异变兔",
        maxHp: 50,
        maxMp: 0,
        attack: 5,
        defense: 2,
        critRate: 0.05,
        critDamage: 1.2,
        chargeRate: 1.0,
        id: Monsters.CORRUPTED_RABBIT
    } as const,

    SHADOW_WOLF: {
        name: "暗影狼",
        maxHp: 75,
        maxMp: 0,
        attack: 8,
        defense: 3,
        critRate: 0.08,
        critDamage: 1.3,
        chargeRate: 1.1,
        id: Monsters.SHADOW_WOLF
    } as const,

    /**
     * 6-10级怪物配置
     */
    CORRUPTED_VINE: {
        name: "暗影藤蔓",
        maxHp: 120,
        maxMp: 30,
        attack: 12,
        defense: 5,
        critRate: 0.08,
        critDamage: 1.3,
        chargeRate: 0.9,
        id: Monsters.CORRUPTED_VINE
    } as const,

    MUSHROOM_WARRIOR: {
        name: "蘑菇战士",
        maxHp: 150,
        maxMp: 40,
        attack: 15,
        defense: 8,
        critRate: 0.1,
        critDamage: 1.4,
        chargeRate: 1.0,
        id: Monsters.MUSHROOM_WARRIOR
    } as const,

    /**
     * 11-15级怪物配置
     */
    SHADOW_CROCODILE: {
        name: "暗影鳄",
        maxHp: 220,
        maxMp: 50,
        attack: 22,
        defense: 12,
        critRate: 0.12,
        critDamage: 1.5,
        chargeRate: 0.9,
        id: Monsters.SHADOW_CROCODILE
    } as const,

    POISON_TOAD: {
        name: "毒雾蟾蜍",
        maxHp: 180,
        maxMp: 80,
        attack: 25,
        defense: 9,
        critRate: 0.15,
        critDamage: 1.4,
        chargeRate: 1.0,
        id: Monsters.POISON_TOAD
    } as const,

    /**
     * 16-20级怪物配置
     */
    ANCIENT_TREANT: {
        name: "远古树人",
        maxHp: 300,
        maxMp: 100,
        attack: 30,
        defense: 18,
        critRate: 0.08,
        critDamage: 1.3,
        chargeRate: 0.8,
        id: Monsters.ANCIENT_TREANT
    } as const,

    SHADOW_PRIEST: {
        name: "暗影祭司",
        maxHp: 250,
        maxMp: 200,
        attack: 35,
        defense: 12,
        critRate: 0.18,
        critDamage: 1.6,
        chargeRate: 1.1,
        id: Monsters.SHADOW_PRIEST
    } as const,

    /**
     * Boss配置（比同等级普通怪物强约50%）
     */
    ALPHA_SHADOW_WOLF: {
        name: "暗影狼王",
        maxHp: 200,
        maxMp: 50,
        attack: 18,
        defense: 8,
        critRate: 0.15,
        critDamage: 1.5,
        chargeRate: 1.2,
        id: Monsters.ALPHA_SHADOW_WOLF
    } as const,

    ANCIENT_MUSHROOM_LORD: {
        name: "远古蘑菇领主",
        maxHp: 350,
        maxMp: 150,
        attack: 28,
        defense: 15,
        critRate: 0.18,
        critDamage: 1.6,
        chargeRate: 1.1,
        id: Monsters.ANCIENT_MUSHROOM_LORD
    } as const,

    SWAMP_HORROR: {
        name: "沼泽恐魔",
        maxHp: 500,
        maxMp: 200,
        attack: 40,
        defense: 20,
        critRate: 0.2,
        critDamage: 1.7,
        chargeRate: 1.2,
        id: Monsters.SWAMP_HORROR
    } as const,

    CORRUPTED_ARCHDRUID: {
        name: "堕落大德鲁伊",
        maxHp: 800,
        maxMp: 300,
        attack: 50,
        defense: 25,
        critRate: 0.25,
        critDamage: 1.8,
        chargeRate: 1.3,
        id: Monsters.CORRUPTED_ARCHDRUID
    } as const
} as const;
