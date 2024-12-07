import { Monster, Monsters } from "../../../constants/monsters";

/** 特殊怪物 */
export const SPECIAL_MONSTERS: Partial<Record<Monsters, Monster>> = {
    [Monsters.TRAINING_DUMMY]: {
        id: Monsters.TRAINING_DUMMY,
        name: '训练假人',
        maxHp: 999999,
        maxMp: 0,
        attack: 0,
        defense: 0,
        critRate: 0,
        critDamage: 1,
        chargeRate: 1
    }
};
