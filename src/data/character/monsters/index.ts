import { LOW_LEVEL_MONSTERS } from "./lowLevel"
import { Monsters, Monster } from "../../../constants/monsters";

const MONSTERS: Record<Monsters, Monster> = {
    ...LOW_LEVEL_MONSTERS
}

export default MONSTERS;