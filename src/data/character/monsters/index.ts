import { LOW_LEVEL_MONSTERS } from "./lowLevel"
import { Monsters, Monster } from "../../../constants/monsters";
import { SPECIAL_MONSTERS } from "./special";

const MONSTERS: Record<Monsters, Monster> = {
    ...SPECIAL_MONSTERS,
    ...LOW_LEVEL_MONSTERS
} as Record<Monsters, Monster>;

export default MONSTERS;